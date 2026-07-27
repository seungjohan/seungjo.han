#!/usr/bin/env node
/**
 * Post-deploy smoke test — asserts over HTTP what the build gates cannot.
 *
 * The build gates inspect files on disk. They cannot see status codes, routing,
 * or content types, which is where this site's worst bugs have lived: unmatched
 * URLs used to return 200 with the home page's markup, and a missing image
 * returned 200 with 22KB of HTML into an <img> tag, invisible to every log.
 *
 * Usage:
 *   node scripts/smoke.mjs                        # against production
 *   node scripts/smoke.mjs https://preview-url    # against a preview deploy
 *   npm run smoke
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const buildDir = path.join(root, 'build/client');

function siteUrl() {
  const seo = fs.readFileSync(path.join(root, 'src/app/components/SEO.tsx'), 'utf8');
  const m = seo.match(/const SITE_URL\s*=\s*['"]([^'"]+)['"]/);
  if (!m) throw new Error('Could not read SITE_URL from src/app/components/SEO.tsx');
  return m[1].replace(/\/$/, '');
}

const BASE = (process.argv[2] || siteUrl()).replace(/\/$/, '');
const failures = [];
const passes = [];

function record(ok, label, detail) {
  if (ok) passes.push(label);
  else failures.push(`${label}\n      ${detail}`);
}

async function head(url) {
  try {
    // Some hosts answer HEAD differently from GET; GET with an aborted body is
    // closer to what a browser and a crawler actually do.
    const res = await fetch(url, { redirect: 'manual' });
    const body = await res.text();
    return { status: res.status, type: res.headers.get('content-type') || '', body };
  } catch (err) {
    return { status: 0, type: '', body: '', error: err.message };
  }
}

// Routes to check come from the build output, so this never drifts from what
// was actually deployed.
function prerenderedRoutes() {
  const routes = [];
  (function walk(dir, prefix = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, `${prefix}/${entry.name}`);
      else if (entry.name === 'index.html') routes.push(prefix || '/');
    }
  })(buildDir);
  return routes.filter(r => r !== '/404').sort();
}

// Every local asset the built HTML references.
function referencedAssets() {
  const found = new Set();
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) {
        const html = fs.readFileSync(full, 'utf8');
        for (const m of html.matchAll(/(?:src|href)="(\/(?:blog-images|project-images|images)\/[^"]+)"/g)) {
          found.add(m[1]);
        }
      }
    }
  })(buildDir);
  return [...found];
}

console.log(`Smoke testing ${BASE}\n`);

if (!fs.existsSync(buildDir)) {
  console.error('No build output at build/client — run `npm run build` first.');
  process.exit(1);
}

// ─── 1. Every prerendered route returns 200 with its own content ──────────────
const routes = prerenderedRoutes();
for (const route of routes) {
  const r = await head(BASE + route);
  record(r.status === 200, `200 ${route}`, `got ${r.status || r.error}`);
  record(/<title>[^<]+<\/title>/.test(r.body), `${route} has a title`, 'no <title> in the response');
}

// ─── 2. Unmatched URLs are a real 404, not the home page ──────────────────────
const notFound = await head(`${BASE}/definitely-not-a-real-page-${Date.now()}`);
record(notFound.status === 404, 'unknown URL returns 404', `got ${notFound.status || notFound.error}`);
record(
  !notFound.body.includes('Product Manager, Republic of Korea'),
  'unknown URL does not serve the home page',
  'response body contains the home page markup — the catch-all rewrite is back',
);
record(
  /noindex/.test(notFound.body),
  'unknown URL is noindex',
  'the 404 page is missing its robots meta, so junk URLs become indexable',
);

// ─── 3. Assets return images, not HTML ────────────────────────────────────────
// A missing asset behind a catch-all rewrite returns 200 text/html, which no
// monitoring notices and which silently breaks every <img> pointing at it.
for (const asset of referencedAssets()) {
  const r = await head(BASE + asset);
  const ok = r.status === 200 && !r.type.includes('text/html');
  record(ok, `asset ${asset}`, `status ${r.status || r.error}, content-type "${r.type}"`);
}

// ─── 4. sitemap and robots ────────────────────────────────────────────────────
const sitemap = await head(`${BASE}/sitemap.xml`);
record(sitemap.status === 200 && sitemap.body.includes('<urlset'), 'sitemap.xml served', `status ${sitemap.status}`);
record(!sitemap.body.includes('/404'), 'sitemap excludes /404', 'the 404 route is listed in the sitemap');

const robots = await head(`${BASE}/robots.txt`);
record(robots.status === 200 && robots.body.includes('Sitemap:'), 'robots.txt served', `status ${robots.status}`);

// ─── Report ───────────────────────────────────────────────────────────────────
console.log(`  ${passes.length} passed`);
if (failures.length) {
  console.error(`\n✗ ${failures.length} failed\n`);
  for (const f of failures) console.error(`    ${f}\n`);
  process.exit(1);
}
console.log('\nSmoke test passed.');
