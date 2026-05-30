export interface Magazine {
  slug: string;
  name: string;
  description: string;
  cover: string;
  postSlugs: string[];
}

export const MAGAZINES: Magazine[] = [
  {
    slug: 'startup-stories',
    name: 'Startup Stories',
    description: 'On building from zero — prototyping, shipping, and learning from real customers.',
    cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    postSlugs: [
      'designing-a-prototype-for-a-startup',
      'developing-a-web-product-for-a-startup',
    ],
  },
  {
    slug: 'life-and-identity',
    name: 'Life & Identity',
    description: 'Personal stories about growth, self-discovery, and what it means to find your own color.',
    cover: 'https://images.unsplash.com/photo-1583833008338-31a6657917ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    postSlugs: [
      'dokdo-security-police',
    ],
  },
];

export function getMagazineForPost(postSlug: string): Magazine | undefined {
  return MAGAZINES.find(m => m.postSlugs.includes(postSlug));
}

export function getPositionInMagazine(postSlug: string): number | undefined {
  const magazine = getMagazineForPost(postSlug);
  if (!magazine) return undefined;
  const idx = magazine.postSlugs.indexOf(postSlug);
  return idx === -1 ? undefined : idx + 1;
}
