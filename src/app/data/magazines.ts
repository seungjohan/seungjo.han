export interface Magazine {
  slug: string;
  name: string;
  description: string;
  cover: string;
  postSlugs: string[];
}

export const MAGAZINES: Magazine[] = [
  {
    slug: 'product-thinking',
    name: 'Product Thinking',
    description: 'On building things that matter — from first principles to shipped features.',
    cover: 'https://images.unsplash.com/photo-1613759007428-9d918fe2d36f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    postSlugs: [
      'on-simplicity-in-design',
      'building-with-intention',
      'notes-on-productive-workflows',
    ],
  },
  {
    slug: 'tech-futures',
    name: 'Tech Futures',
    description: 'Exploring where technology is taking us, and what it means for the people who build it.',
    cover: 'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    postSlugs: [
      'the-future-of-ai-in-creative-work',
    ],
  },
  {
    slug: 'creative-life',
    name: 'Creative Life',
    description: 'Notes on craft, culture, and the everyday practice of making.',
    cover: 'https://images.unsplash.com/photo-1756211006426-41bc8b945c1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
    postSlugs: [
      'the-art-of-constraints',
      'lessons-from-korean-design',
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
