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
  /**
   * How this project's images sit inside their frame. Omit for `'cover'`.
   * The frame size never changes either way — this only affects the image.
   *
   * `'cover'`   — default. Image fills the frame and whatever overflows is
   *               cropped. Right for landscape photos and screenshots.
   * `'contain'` — image is scaled down until all of it fits, so nothing is
   *               cropped. For portrait or square assets that would otherwise
   *               lose their top and bottom.
   *
   * A field rather than a `slug === 'webeing'` branch in the component, because
   * this repo has been bitten twice by per-slug branches in components.
   */
  imageFit?: 'cover' | 'contain';
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

/**
 * The images to show for a project, in order.
 *
 * One helper so the listing card and the detail page cannot disagree about what
 * "this project's images" means — they previously had two different fallbacks,
 * one of which was dead code and the other unguarded. An empty result is valid
 * and means "render no gallery at all", not "render an empty box".
 */
export function galleryFor(project: Project): string[] {
  if (project.images?.length) return project.images;
  return project.coverImage ? [project.coverImage] : [];
}

/** Alt text for one gallery slide. Duplicate alt across a page is an SEO negative. */
export function imageAlt(project: Project, index: number, total: number): string {
  return total > 1 ? `${project.title} — image ${index + 1} of ${total}` : project.title;
}

/** Previous and next project in display order, for detail-page navigation. */
export function siblingsOf(slug: string): { prev?: Project; next?: Project } {
  const i = PROJECTS.findIndex(p => p.slug === slug);
  if (i === -1) return {};
  return { prev: PROJECTS[i - 1], next: PROJECTS[i + 1] };
}
