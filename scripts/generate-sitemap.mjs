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

function extractSlugs(relativeFile) {
  const content = fs.readFileSync(path.join(root, relativeFile), 'utf8');
  return [...content.matchAll(/^\s*slug:\s*['"]([^'"]+)['"]/gm)].map(m => m[1]);
}

// Blog posts are directories under src/content/blog; the directory name is the
// slug. No parsing, so a post can never be silently omitted from the sitemap.
function contentSlugs(relativeDir) {
  const dir = path.join(root, relativeDir);
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && fs.existsSync(path.join(dir, entry.name, 'index.md')))
    .map(entry => entry.name);
}

const staticPaths = ['/', '/about', '/projects', '/blog'];
const projectSlugs = extractSlugs('src/app/data/projects.ts');
const postSlugs = contentSlugs('src/content/blog');

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
