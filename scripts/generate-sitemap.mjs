#!/usr/bin/env node
/**
 * Regenerate public/sitemap.xml from static routes + posts.ts + projects.ts slugs.
 * Run before deploy: npm run generate:sitemap
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
// Single-sourced from SEO.tsx so the sitemap can never claim a different origin
// than the canonical tags the app renders. The env override still wins, for
// generating a sitemap for a preview deploy.
function readSiteUrl() {
  const seo = fs.readFileSync(path.join(root, 'src/app/components/SEO.tsx'), 'utf8');
  const m = seo.match(/const SITE_URL\s*=\s*['"]([^'"]+)['"]/);
  if (!m) {
    console.error('\n✗ Could not read SITE_URL from src/app/components/SEO.tsx\n');
    process.exit(1);
  }
  return m[1].replace(/\/$/, '');
}
const SITE_URL = (process.env.SITE_URL || readSiteUrl()).replace(/\/$/, '');

// Both content types are one directory per item and the directory name is the
// slug. No parsing, so an item can never be silently omitted from the sitemap.
function contentSlugs(relativeDir, entryFile) {
  const dir = path.join(root, relativeDir);
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && fs.existsSync(path.join(dir, entry.name, entryFile)))
    .map(entry => entry.name);
}

const staticPaths = ['/', '/about', '/projects', '/blog'];
const projectSlugs = contentSlugs('src/content/projects', 'index.ts');
const postSlugs = contentSlugs('src/content/blog', 'index.md');

const urls = [
  ...staticPaths,
  ...projectSlugs.map(slug => `/projects/${slug}`),
  ...postSlugs.map(slug => `/blog/${slug}`),
];

// No <lastmod>. It is optional, and the previous version stamped *today* on
// every URL on every build — so a page untouched for two years claimed to have
// changed this morning. Search engines discount an always-fresh lastmod, which
// makes it worse than absent. Restore it only with a real per-item date.
const body = urls
  .map(loc => `  <url><loc>${SITE_URL}${loc === '/' ? '' : loc}</loc></url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

const outPath = path.join(root, 'public/sitemap.xml');
fs.writeFileSync(outPath, xml);
console.log(`Wrote ${urls.length} URLs to public/sitemap.xml`);
