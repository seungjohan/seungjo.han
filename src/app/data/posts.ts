export interface Post {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
}

export const POSTS: Post[] = [
  {
    slug: 'on-simplicity-in-design',
    title: 'On simplicity in design',
    subtitle: 'Exploring the delicate balance between minimalism and functionality in modern digital products.',
    date: 'April 15, 2026',
    readTime: '5 min read',
    tags: ['Design', 'Product'],
    excerpt: 'Exploring the delicate balance between minimalism and functionality in modern digital products.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  },
  {
    slug: 'building-with-intention',
    title: 'Building with intention',
    subtitle: 'Thoughts on creating meaningful work in an age of infinite digital noise.',
    date: 'March 28, 2026',
    readTime: '7 min read',
    tags: ['Creativity', 'Culture'],
    excerpt: 'Thoughts on creating meaningful work in an age of infinite digital noise and constant disruption.',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  },
  {
    slug: 'the-art-of-constraints',
    title: 'The art of constraints',
    subtitle: 'How limitations can become the greatest catalyst for creative breakthrough.',
    date: 'March 12, 2026',
    readTime: '6 min read',
    tags: ['Design', 'Creativity'],
    excerpt: 'How limitations can become the greatest catalyst for creative breakthrough and innovation.',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  },
  {
    slug: 'lessons-from-korean-design',
    title: 'Lessons from Korean design',
    subtitle: 'What traditional Korean aesthetics teach us about modern product design.',
    date: 'February 24, 2026',
    readTime: '8 min read',
    tags: ['Design', 'Culture'],
    excerpt: 'What traditional Korean aesthetics teach us about modern product design and user experience.',
    coverImage: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  },
  {
    slug: 'the-future-of-ai-in-creative-work',
    title: 'The future of AI in creative work',
    subtitle: 'How artificial intelligence is reshaping the creative industry.',
    date: 'February 10, 2026',
    readTime: '9 min read',
    tags: ['Technology', 'Design'],
    excerpt: 'Exploring how artificial intelligence is reshaping the creative industry and what it means for designers.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  },
  {
    slug: 'notes-on-productive-workflows',
    title: 'Notes on productive workflows',
    subtitle: 'Personal systems and tools that help maintain focus and creative momentum.',
    date: 'January 28, 2026',
    readTime: '4 min read',
    tags: ['Product', 'Technology'],
    excerpt: 'Personal systems and tools that help maintain focus and creative momentum in daily work.',
    coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  },
  {
    slug: 'developing-a-web-product-for-a-startup',
    title: 'Developing a Web Product for an Early-stage Startup from scratch',
    subtitle: 'You need to know software development to build your ideas into products.',
    date: 'September 26, 2024',
    readTime: '10 min read',
    tags: ['Startup', 'Technology', 'Product'],
    excerpt: 'How I went from zero programming knowledge to shipping a full-stack web product — and what that process taught me about building startups.',
    coverImage: 'https://images.unsplash.com/photo-1603031682537-ea6729c9d1bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  },
  {
    slug: 'designing-a-prototype-for-a-startup',
    title: 'Designing a Prototype for a Startup to turn your Ideas into Reality',
    subtitle: 'Prototyping: to transform abstract ideas into tangible, realizable concepts.',
    date: 'September 26, 2024',
    readTime: '12 min read',
    tags: ['Startup', 'Design', 'Product'],
    excerpt: 'What I learned from iterating through 5 prototype versions of a real startup — and why prototyping is the blueprint for everything you build.',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  },
  {
    slug: 'dokdo-security-police',
    title: "I'm a Proud Dokdo Security Police of Korea",
    subtitle: "Another way to protect our territory, 'Dokdo', and a way to love myself.",
    date: 'December 2, 2022',
    readTime: '8 min read',
    tags: ['Life', 'Korea', 'Identity'],
    excerpt: "I served 21 months as a Dokdo Security Police. This is the story of why I applied, what I found, and how it changed me.",
    coverImage: 'https://images.unsplash.com/photo-1583833008338-31a6657917ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80',
  },
];