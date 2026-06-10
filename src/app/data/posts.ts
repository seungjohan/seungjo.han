export interface Post {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
  body?: string;        // plain text body for dashboard-created posts (paragraphs separated by \n\n)
  sourceMarkdown?: string;
}

export const POSTS: Post[] = [
  {
    slug: 'i-want-my-life-to-be-colorful',
    title: 'I Want My Life to Be Colorful',
    subtitle: 'Breaking free from a fluctuating sense of self-worth, knocking on the doors of the world, and learning to be honest with myself.',
    date: 'February 6, 2026',
    tags: ['Life', 'Myself', 'Travel', 'Self-esteem', 'Challenge'],
    excerpt: 'A personal reflection on travel, Dokdo, cold emails, startups, languages, kindness, music, and choosing a colorful life.',
    coverImage: '/blog-images/i-want-my-life-to-be-colorful_6.jpg',
    sourceMarkdown: 'i-want-my-life-to-be-colorful',
  },
  {
    slug: 'developing-a-web-product-for-a-startup',
    title: 'Developing a Web Product for an Early-stage Startup from scratch',
    subtitle: 'You need to know software development to build your ideas into products.',
    date: 'September 26, 2024',
    tags: ['Startup', 'Technology', 'Product'],
    excerpt: 'How I went from zero programming knowledge to shipping a full-stack web product — and what that process taught me about building startups.',
    coverImage: '/blog-images/developing-a-web-product-for-an-early-stage-startup-from-scratch_1.JPEG',
    sourceMarkdown: 'webeing-product-development',
  },
  {
    slug: 'designing-a-prototype-for-a-startup',
    title: 'Designing a Prototype for a Startup to turn your Ideas into Reality',
    subtitle: 'Prototyping: to transform abstract ideas into tangible, realizable concepts.',
    date: 'September 26, 2024',
    tags: ['Startup', 'Design', 'Product', 'Prototype'],
    excerpt: 'What I learned from iterating through 5 prototype versions of a real startup — and why prototyping is the blueprint for everything you build.',
    coverImage: 'https://substackcdn.com/image/fetch/$s_!6p6g!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4b64ad48-2e39-4e52-8672-c1749fbaacae_1202x2014.png',
    sourceMarkdown: 'prototyping-startup-ideas',
  },
  {
    slug: 'dokdo-security-police',
    title: "I'm a Proud Dokdo Security Police of Korea",
    subtitle: "Another way to protect our territory, 'Dokdo', and a way to love myself. 'Dokdo Security Police'",
    date: 'December 2, 2022',
    tags: ['Life', 'Korea', 'Challenge'],
    excerpt: "I served 21 months as a Dokdo Security Police. This is the story of why I applied, what I found, and how it changed me.",
    coverImage: '/blog-images/im-a-proud-dokdo-security-police-of-korea_2.jpg',
    sourceMarkdown: 'im-a-proud-dokdo-security-police-of-korea',
  },
];
