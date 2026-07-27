import type { Config } from '@react-router/dev/config';
import fs from 'node:fs';

// Both content types are one directory per item and the directory name is the
// slug, so this config never has to import app modules *or* parse them as text.
// The previous version regex-scraped `slug: '...'` out of TypeScript, which
// silently produced no route at all for a slug written any other way.
function contentSlugs(dir: string, entryFile: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && fs.existsSync(`${dir}/${entry.name}/${entryFile}`))
    .map(entry => entry.name);
}

export default {
  appDirectory: 'src/app',
  // No runtime server — every route below is rendered to static HTML at
  // build time, so social crawlers see real per-page meta tags.
  ssr: false,
  prerender: [
    '/',
    // Prerendered so Vercel can serve a real 404.html on filesystem miss. It is
    // excluded from the sitemap and marked noindex — see scripts/check-seo.mjs
    // EXCLUDED_ROUTES and pages/NotFound.tsx.
    '/404',
    '/about',
    '/blog',
    '/projects',
    ...contentSlugs('src/content/blog', 'index.md').map(slug => `/blog/${slug}`),
    ...contentSlugs('src/content/projects', 'index.ts').map(slug => `/projects/${slug}`),
  ],
} satisfies Config;
