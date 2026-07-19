import type { Config } from '@react-router/dev/config';
import fs from 'node:fs';

// Slugs are regex-extracted (same approach as scripts/generate-sitemap.mjs)
// so this config never has to import app modules.
function slugsFrom(file: string): string[] {
  const content = fs.readFileSync(file, 'utf8');
  return [...content.matchAll(/^\s*slug:\s*['"]([^'"]+)['"]/gm)].map(m => m[1]);
}

export default {
  appDirectory: 'src/app',
  // No runtime server — every route below is rendered to static HTML at
  // build time, so social crawlers see real per-page meta tags.
  ssr: false,
  prerender: [
    '/',
    '/about',
    '/blog',
    '/projects',
    ...slugsFrom('src/app/data/posts.ts').map(slug => `/blog/${slug}`),
    ...slugsFrom('src/app/data/projects.ts').map(slug => `/projects/${slug}`),
  ],
} satisfies Config;
