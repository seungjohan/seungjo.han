export interface Post {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
  body?: string;        // plain text body for dashboard-created posts (paragraphs separated by \n\n)
  sourceMarkdown?: string;
}

export const POSTS: Post[] = [
  {
    slug: 'developing-a-web-product-for-a-startup',
    title: 'Developing a Web Product for an Early-stage Startup from scratch',
    subtitle: 'You need to know software development to build your ideas into products.',
    date: 'September 26, 2024',
    readTime: '10 min read',
    tags: ['Startup', 'Technology', 'Product'],
    excerpt: 'How I went from zero programming knowledge to shipping a full-stack web product — and what that process taught me about building startups.',
    coverImage: '/blog-images/developing-a-web-product-for-an-early-stage-startup-from-scratch_1.jpg',
    sourceMarkdown: 'webeing-product-development',
  },
  {
    slug: 'designing-a-prototype-for-a-startup',
    title: 'Designing a Prototype for a Startup to turn your Ideas into Reality',
    subtitle: 'Prototyping: to transform abstract ideas into tangible, realizable concepts.',
    date: 'September 26, 2024',
    readTime: '12 min read',
    tags: ['Startup', 'Design', 'Product'],
    excerpt: 'What I learned from iterating through 5 prototype versions of a real startup — and why prototyping is the blueprint for everything you build.',
    coverImage: '/blog-images/designing-a-prototype-for-a-startup-to-turn-your-ideas-into-reality_1.jpg',
    sourceMarkdown: 'prototyping-startup-ideas',
  },
  {
    slug: 'dokdo-security-police',
    title: "I'm a Proud Dokdo Security Police of Korea",
    subtitle: "Another way to protect our territory, 'Dokdo', and a way to love myself. 'Dokdo Security Police'",
    date: 'December 2, 2022',
    readTime: '8 min read',
    tags: ['Life', 'Korea', 'Identity'],
    excerpt: "I served 21 months as a Dokdo Security Police. This is the story of why I applied, what I found, and how it changed me.",
    coverImage: '/blog-images/im-a-proud-dokdo-security-police-of-korea_1.jpg',
  },
];
