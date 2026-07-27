/**
 * Projects, loaded from src/content/projects/<slug>/index.ts.
 *
 * The directory name IS the slug — the same rule as blog posts. That is the
 * point of this layout: it removes the last of the four regexes that used to
 * scrape `slug: '...'` out of a TypeScript file as raw text (in
 * react-router.config.ts, generate-sitemap.mjs, check-seo.mjs and
 * verify-assets.mjs). A slug written as a template literal, or computed, used to
 * break prerendering, the sitemap and SEO analysis at once with no diagnostic.
 * A directory listing cannot miss.
 *
 * Projects stay TypeScript rather than markdown-with-frontmatter, deliberately.
 * A project is 19 structured fields, not prose: `whatIDidBullets` entries
 * contain commas, so a simple frontmatter list cannot hold them, and a real YAML
 * parser would trade compile-time field checking for untyped strings. Posts are
 * long prose with few fields and go the other way. If case studies ever grow
 * real long-form narrative, add a body.md beside index.ts rather than moving
 * the structured data into frontmatter.
 */

/** Everything about a project except its slug, which comes from the folder name. */
export interface ProjectData {
  title: string;
  client: string;
  year: string;
  description: string;
  /** Gallery. Empty is valid — the detail page omits the gallery entirely. */
  images: string[];
  /** Listing card and social preview. Empty falls back to the site default OG image. */
  coverImage: string;
  role: string;
  team: string;
  duration: string;
  techStack: string;
  tags: string[];
  url?: string;
  /** Case-study body. Rendered by <ProjectNarrative> on both listing and detail. */
  impact: string;
  whatIDid: string;
  whatIDidBullets: string[];
  outcome: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
}

export interface Project extends ProjectData {
  slug: string;
}

/**
 * Display order for the listing page, so it does not depend on filesystem
 * iteration order. A slug missing here sorts to the front (indexOf returns -1),
 * which is loud enough to notice when adding a project.
 */
const ORDER = [
  'webeing',
  'busking-town',
  'liter',
  'gif-hackathon',
  'travel-cp',
  'north-america-strategy',
];

const FILES = import.meta.glob('../../content/projects/*/index.ts', {
  import: 'default',
  eager: true,
}) as Record<string, ProjectData>;

export const PROJECTS: Project[] = Object.entries(FILES)
  .map(([path, data]) => {
    const slug = path.match(/\/projects\/([^/]+)\/index\.ts$/)?.[1];
    if (!slug) throw new Error(`[content] unexpected project path: ${path}`);
    return { slug, ...data };
  })
  .sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));
