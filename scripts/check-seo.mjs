#!/usr/bin/env node
/**
 * SEO gate — validates the *prerendered HTML* that crawlers actually receive.
 *
 * Runs after `build` (see the `postbuild` script in package.json), so it
 * inspects build/client/**\/*.html — the ground truth a search engine or a
 * social crawler sees before any JavaScript runs.
 *
 * Structured around the Kimchi Hill 4-stage SEO framework:
 *   1. Basic settings   — this script is the "SEO plugin"; GSC tag lives in root.tsx
 *   2. Keyword research  — focusKeyword placement (choosing them stays manual)
 *   3. On-site attributes — title, description, headings, keyword in first 200
 *                           chars, internal/external links, URL, sitemap, robots
 *   4. SEO audit         — mobile viewport, duplicate content, authority (sameAs)
 *
 * Errors (exit 1) block the deploy. Warnings are advisory and never block.
 * Run standalone with: npm run check:seo   (requires a prior `npm run build`)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const buildDir = path.join(root, 'build/client');
const publicDir = path.join(root, 'public');

// Length thresholds Google uses in practice (soft — these are warnings).
const TITLE_MAX = 60;
const DESC_MIN = 50;
const DESC_MAX = 160;

const errors = [];
const warnings = [];

// SITE_URL is single-sourced in SEO.tsx — read it so this check can never
// drift from what the app actually renders.
function readSiteUrl() {
  const seo = fs.readFileSync(path.join(root, 'src/app/components/SEO.tsx'), 'utf8');
  const m = seo.match(/const SITE_URL\s*=\s*['"]([^'"]+)['"]/);
  if (!m) {
    errors.push('Could not find SITE_URL in src/app/components/SEO.tsx');
    return 'https://seungjohan.vercel.app';
  }
  return m[1].replace(/\/$/, '');
}
const SITE_URL = readSiteUrl();

// ─── HTML helpers ─────────────────────────────────────────────────────────────
function decodeEntities(s) {
  return s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/** Parse `key="value"` pairs out of a single tag string. */
function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) out[m[1]] = decodeEntities(m[2]);
  return out;
}

/** Extract the SEO-relevant head data from one HTML document. */
function parseHead(html) {
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const meta = {}; // name/property -> content
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const a = attrs(m[0]);
    const key = a.name || a.property;
    if (key && a.content !== undefined) meta[key] = a.content;
  }
  let canonical = null;
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const a = attrs(m[0]);
    if (a.rel === 'canonical') canonical = a.href;
  }
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  return { title: titleMatch ? decodeEntities(titleMatch[1]).trim() : '', meta, canonical, h1Count };
}

// ─── Collect prerendered pages ────────────────────────────────────────────────
function htmlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...htmlFiles(full));
    else if (entry.name.endsWith('.html') && entry.name !== '__spa-fallback.html') files.push(full);
  }
  return files;
}

/** build/client/blog/x/index.html -> "/blog/x" ; build/client/index.html -> "/" */
function routeOf(file) {
  const rel = path.relative(buildDir, file).replace(/\\/g, '/').replace(/\/?index\.html$/, '');
  return '/' + rel;
}

if (!fs.existsSync(buildDir)) {
  console.error('No build output found at build/client — run `npm run build` first.');
  process.exit(1);
}

const files = htmlFiles(buildDir);
const pages = files.map(file => {
  const html = fs.readFileSync(file, 'utf8');
  return { route: routeOf(file), html, ...parseHead(html) };
});

// ─── Per-page checks ──────────────────────────────────────────────────────────
for (const p of pages) {
  const at = `  [${p.route}]`;

  if (!p.title) errors.push(`${at} missing <title>`);
  else if (p.title.length > TITLE_MAX)
    warnings.push(`${at} title is ${p.title.length} chars (>${TITLE_MAX}, Google truncates)`);

  const desc = p.meta.description;
  if (!desc) errors.push(`${at} missing <meta name="description">`);
  else if (desc.length < DESC_MIN || desc.length > DESC_MAX)
    warnings.push(`${at} description is ${desc.length} chars (aim ${DESC_MIN}–${DESC_MAX})`);

  if (!p.canonical) warnings.push(`${at} missing canonical link`);
  else if (!p.canonical.startsWith(SITE_URL))
    errors.push(`${at} canonical "${p.canonical}" does not match SITE_URL ${SITE_URL}`);

  for (const tag of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) {
    if (!p.meta[tag]) warnings.push(`${at} missing ${tag}`);
  }
  if (!p.meta['twitter:card']) warnings.push(`${at} missing twitter:card`);

  if (p.h1Count === 0) warnings.push(`${at} has no <h1>`);
  else if (p.h1Count > 1) warnings.push(`${at} has ${p.h1Count} <h1> tags (prefer exactly one)`);

  // Stage 4 — mobile usability: a responsive viewport meta must be present.
  if (!/<meta[^>]*name="viewport"/i.test(p.html)) warnings.push(`${at} missing viewport meta (mobile usability)`);
}

// ─── Cross-page checks: duplicate titles / descriptions ───────────────────────
function reportDuplicates(field, label) {
  const seen = new Map();
  for (const p of pages) {
    const val = field(p);
    if (!val) continue;
    (seen.get(val) || seen.set(val, []).get(val)).push(p.route);
  }
  for (const [val, routes] of seen) {
    if (routes.length > 1)
      warnings.push(`  duplicate ${label} on ${routes.join(', ')}: "${val.slice(0, 50)}…"`);
  }
}
reportDuplicates(p => p.title, 'title');
reportDuplicates(p => p.meta.description, 'description');

// ─── Sitemap sync: every prerendered route must be listed ─────────────────────
const sitemapPath = path.join(publicDir, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  errors.push('public/sitemap.xml is missing (run npm run generate:sitemap)');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(/\/$/, '')));
  for (const p of pages) {
    const expected = SITE_URL + (p.route === '/' ? '' : p.route);
    if (!listed.has(expected)) errors.push(`  ${p.route} is prerendered but missing from sitemap.xml`);
  }
}

// ─── robots.txt ───────────────────────────────────────────────────────────────
const robotsPath = path.join(publicDir, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  errors.push('public/robots.txt is missing');
} else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (/^\s*Disallow:\s*\/\s*$/im.test(robots)) errors.push('robots.txt blocks all crawlers (Disallow: /)');
  if (!/Sitemap:/i.test(robots)) warnings.push('robots.txt has no Sitemap: line');
}

// ─── Default OG image ─────────────────────────────────────────────────────────
if (!fs.existsSync(path.join(publicDir, 'og-image.png')))
  errors.push('public/og-image.png (default share image) is missing');

// ─── Stage 4 — off-page authority: PERSON_JSON_LD.sameAs profile links ─────────
const seoSrc = fs.readFileSync(path.join(root, 'src/app/components/SEO.tsx'), 'utf8');
const sameAs = seoSrc.match(/sameAs:\s*\[([^\]]*)\]/);
if (!sameAs || !/https?:\/\//.test(sameAs[1]))
  warnings.push('PERSON_JSON_LD.sameAs has no profile links (off-page authority signal)');

// ─── Focus-keyword analysis (AIOSEO/Yoast-style, advisory) ────────────────────
// Reads focusKeyword/secondaryKeywords from the content data, then grades each
// item against the built HTML: is the keyword in the title, description, slug,
// a subheading, the intro, an image alt — and how often does it appear?
const keywordLines = [];

function parseItems(relFile, urlPrefix) {
  const src = fs.readFileSync(path.join(root, relFile), 'utf8');
  const slugMatches = [...src.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
  return slugMatches.map((m, i) => {
    const block = src.slice(m.index, slugMatches[i + 1]?.index ?? src.length);
    const kw = block.match(/focusKeyword:\s*['"]([^'"]+)['"]/);
    const sec = block.match(/secondaryKeywords:\s*\[([^\]]*)\]/);
    return {
      route: `${urlPrefix}/${m[1]}`,
      slug: m[1],
      focusKeyword: kw ? kw[1] : null,
      secondaryKeywords: sec ? [...sec[1].matchAll(/['"]([^'"]+)['"]/g)].map(x => x[1]) : [],
    };
  });
}

// Blog posts live one-per-directory with YAML frontmatter, so keywords come from
// the frontmatter block rather than a data file.
function parseContentItems(relDir, urlPrefix) {
  const dir = path.join(root, relDir);
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && fs.existsSync(path.join(dir, entry.name, 'index.md')))
    .map(entry => {
      const raw = fs.readFileSync(path.join(dir, entry.name, 'index.md'), 'utf8');
      const front = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      const kw = front.match(/^focusKeyword:\s*(.+)$/m);
      const sec = front.match(/^secondaryKeywords:\s*\[(.*)\]$/m);
      return {
        route: `${urlPrefix}/${entry.name}`,
        slug: entry.name,
        focusKeyword: kw ? kw[1].trim() : null,
        secondaryKeywords: sec ? sec[1].split(',').map(s => s.trim()).filter(Boolean) : [],
      };
    });
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  ).replace(/\s+/g, ' ').trim();
}

const has = (haystack, needle) => haystack.toLowerCase().includes(needle.toLowerCase());
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Stage 3 — internal & external links, scoped to the article body (strip the
// site chrome so shared nav/footer links don't count as "content" links).
function contentLinks(html) {
  const mainStart = html.search(/<main\b[^>]*>/i);
  const mainEnd = html.search(/<\/main>/i);
  let region = mainStart >= 0 && mainEnd > mainStart ? html.slice(mainStart, mainEnd) : html;
  region = region.replace(/<(nav|footer|header)\b[\s\S]*?<\/\1>/gi, ' ');
  let internal = 0, external = 0;
  for (const m of region.matchAll(/<a\b[^>]*href="([^"]*)"/gi)) {
    const href = m[1];
    if (href.startsWith('#') || href.startsWith('mailto:')) continue;
    if (href.startsWith('http')) href.startsWith(SITE_URL) ? internal++ : external++;
    else if (href.startsWith('/')) internal++;
  }
  return { internal, external };
}

function analyzeKeyword(page) {
  const kw = page.item.focusKeyword;
  const html = page.html;
  const headings = [...html.matchAll(/<h([2-3])[^>]*>([\s\S]*?)<\/h\1>/gi)].map(m => stripTags(m[2]));
  const alts = [...html.matchAll(/<img\b[^>]*\balt="([^"]*)"/gi)].map(m => decodeEntities(m[1]));
  // Article body = text after the first </h1> (skips nav/header noise).
  const h1End = html.search(/<\/h1>/i);
  const body = stripTags(h1End >= 0 ? html.slice(h1End) : html);
  const intro = body.slice(0, 200); // slide: "keyword within the first 200 chars"
  const density = body.toLowerCase().split(kw.toLowerCase()).length - 1;

  const checks = [
    ['title', has(page.title, kw)],
    ['description', has(page.meta.description || '', kw)],
    ['slug', page.item.slug.includes(slugify(kw))],
    ['subheading (h2/h3)', headings.some(h => has(h, kw))],
    ['first 200 chars', has(intro, kw)],
    ['image alt', alts.some(a => has(a, kw))],
  ];

  const mark = ok => (ok ? '✅' : '⚠️ ');
  const line = checks.map(([label, ok]) => `${mark(ok)} ${label}`).join('   ');
  keywordLines.push(`  [${page.route}]  focus: "${kw}"`);
  keywordLines.push(`     ${line}`);
  keywordLines.push(`     mentions in body: ${density}${density === 0 ? '  ⚠️  keyword never appears' : density > 25 ? '  ⚠️  possible keyword stuffing' : ''}`);
  const links = contentLinks(html);
  keywordLines.push(`     links: ${links.internal} internal, ${links.external} external${links.external === 0 ? '  ⚠️  no external/source links' : ''}`);
  if (page.item.secondaryKeywords.length) {
    const sec = page.item.secondaryKeywords.map(k => `${mark(has(body, k))} ${k}`).join('   ');
    keywordLines.push(`     secondary: ${sec}`);
  }

  // Escalate only the highest-value gaps to warnings (still non-blocking).
  const critical = { title: checks[0][1], description: checks[1][1], slug: checks[2][1] };
  for (const [spot, ok] of Object.entries(critical))
    if (!ok) warnings.push(`  [${page.route}] focus keyword "${kw}" not in ${spot}`);
}

const items = [...parseContentItems('src/content/blog', '/blog'), ...parseItems('src/app/data/projects.ts', '/projects')];
const pageByRoute = new Map(pages.map(p => [p.route, p]));
let missingKeyword = 0;
for (const item of items) {
  const page = pageByRoute.get(item.route);
  if (!page) continue; // not prerendered (shouldn't happen)
  if (!item.focusKeyword) {
    missingKeyword++;
    keywordLines.push(`  [${item.route}]  ⚠️  no focusKeyword set — skipped`);
    continue;
  }
  analyzeKeyword({ ...page, item });
}

// ─── Report ───────────────────────────────────────────────────────────────────
if (keywordLines.length) {
  console.log(`\nFocus-keyword report (${items.length - missingKeyword}/${items.length} items have a keyword):`);
  for (const l of keywordLines) console.log(l);
}

if (warnings.length) {
  console.warn(`\nSEO warnings (${warnings.length}):`);
  for (const w of warnings) console.warn(w);
}
if (errors.length) {
  console.error(`\nSEO errors (${errors.length}):`);
  for (const e of errors) console.error(e);
  console.error('\nSEO check failed.');
  process.exit(1);
}

console.log(`\nSEO check passed — ${pages.length} page(s), ${warnings.length} warning(s).`);
