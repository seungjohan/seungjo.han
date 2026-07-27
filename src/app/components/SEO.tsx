import type { MetaDescriptor } from 'react-router';

const SITE_NAME = 'Seungjo Han';
const SITE_URL = 'https://seungjohan.vercel.app';
const DEFAULT_DESCRIPTION =
  'Product manager and builder in Seoul, sharing selected work, startup lessons, and writing on product, design, and technology.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

type SEOArgs = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  /**
   * Robots directive, e.g. 'noindex, follow'. Set on pages that are prerendered
   * but must not be indexed — the 404 page is served for every unmatched URL, so
   * without this Google would index an unbounded set of junk URLs.
   */
  robots?: string;
  /** Extra JSON-LD blocks appended after the standard tags. */
  jsonLd?: object[];
};

function absoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  return `${SITE_URL}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

/**
 * Build a route `meta` export. Because every route is prerendered to static
 * HTML at build time, these tags are present in the served HTML — social
 * crawlers that never run JavaScript still see the right title/OG data.
 */
export function buildMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  robots,
  jsonLd = [],
}: SEOArgs): MetaDescriptor[] {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} - ${SITE_NAME}`;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return [
    { title: fullTitle },
    { name: 'description', content: description },
    ...(robots ? [{ name: 'robots', content: robots }] : []),
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:image', content: imageUrl },
    { property: 'og:url', content: url },
    { property: 'og:type', content: type },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
    ...jsonLd.map(block => ({ 'script:ld+json': block })),
  ];
}

export const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Seungjo Han',
  jobTitle: 'Product Manager',
  url: SITE_URL,
  sameAs: ['https://www.linkedin.com/in/seungjohan/', 'https://github.com/seungjohan'],
};

export { SITE_URL, absoluteUrl };
