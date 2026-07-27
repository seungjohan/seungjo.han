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
const SITE_URL = process.env.SITE_URL || 'https://seungjohan.vercel.app';

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

const today = new Date().toISOString().slice(0, 10);
const body = urls
  .map(
    loc =>
      `  <url><loc>${SITE_URL}${loc === '/' ? '' : loc}</loc><lastmod>${today}</lastmod></url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

const outPath = path.join(root, 'public/sitemap.xml');
fs.writeFileSync(outPath, xml);
console.log(`Wrote ${urls.length} URLs to public/sitemap.xml`);
