import type { Config } from '@react-router/dev/config';
import fs from 'node:fs';

// Projects are still regex-extracted from the data file, so this config never
// has to import app modules. Blog posts no longer need that: each post is a
// directory under src/content/blog and the directory name is the slug, so a
// listing is both simpler and impossible to silently miss.
function slugsFrom(file: string): string[] {
  const content = fs.readFileSync(file, 'utf8');
  return [...content.matchAll(/^\s*slug:\s*['"]([^'"]+)['"]/gm)].map(m => m[1]);
}

function contentSlugs(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && fs.existsSync(`${dir}/${entry.name}/index.md`))
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
    ...contentSlugs('src/content/blog').map(slug => `/blog/${slug}`),
    ...slugsFrom('src/app/data/projects.ts').map(slug => `/projects/${slug}`),
  ],
} satisfies Config;
