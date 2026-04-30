export interface Project {
  slug: string;
  title: string;
  client: string;
  year: string;
  description: string;
  tags: string[];
  coverImage: string;
  color: string;
  role: string;
  team: string;
  timeline: string;
  duration: string;
  platform: string;
  techStack: string;
}

export const PROJECTS: Project[] = [
  {
    slug: 'brand-identity-system',
    title: 'Brand Identity System',
    client: 'Tech Startup',
    year: '2026',
    description: 'A cohesive visual language built from the ground up — logo, typography, color, and component library.',
    tags: ['Branding', 'Design System'],
    coverImage: 'https://images.unsplash.com/photo-1763705857736-2b4f16a33758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGlkZW50aXR5JTIwZGVzaWduJTIwc3lzdGVtJTIwdHlwb2dyYXBoeXxlbnwxfHx8fDE3NzcxMTI5MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#f4f4f5',
    role: 'Lead Designer',
    team: '3 designers, 1 PM, 2 engineers',
    timeline: 'Jan – Apr 2026',
    duration: '12 weeks',
    platform: 'Web, iOS, Android',
    techStack: 'Figma, React, TypeScript, Storybook',
  },
  {
    slug: 'ecommerce-platform',
    title: 'E-commerce Platform',
    client: 'Retail Brand',
    year: '2025',
    description: 'End-to-end redesign of a retail experience serving 200k+ monthly users across web and mobile.',
    tags: ['UI/UX', 'Development'],
    coverImage: 'https://images.unsplash.com/photo-1757301714935-c8127a21abc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBwcm9kdWN0JTIwZGVzaWduJTIwVUklMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzc3MTEyOTI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#fafaf0',
    role: 'Product Designer',
    team: '2 designers, 1 PM, 4 engineers',
    timeline: 'Mar – Aug 2025',
    duration: '6 months',
    platform: 'Web, Mobile Web',
    techStack: 'Figma, Next.js, Tailwind CSS',
  },
  {
    slug: 'mobile-app-design',
    title: 'Mobile App Design',
    client: 'Finance Company',
    year: '2025',
    description: 'Simplifying personal finance for a new generation — onboarding, dashboards, and transaction flows.',
    tags: ['Product Design', 'iOS'],
    coverImage: 'https://images.unsplash.com/photo-1642142784847-83b9b8a22910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBmaW5hbmNlJTIwZGFzaGJvYXJkJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc3NzExMjkyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#f0f4fa',
    role: 'Lead Product Designer',
    team: '1 designer, 1 PM, 3 iOS engineers',
    timeline: 'Sep – Dec 2025',
    duration: '4 months',
    platform: 'iOS, Android',
    techStack: 'Figma, Swift, Kotlin',
  },
  {
    slug: 'editorial-website',
    title: 'Editorial Website',
    client: 'Magazine',
    year: '2024',
    description: 'A typography-first reading experience for a long-form digital magazine with 50k+ subscribers.',
    tags: ['Web Design', 'Typography'],
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGl0b3JpYWwlMjB3ZWJzaXRlJTIwdHlwb2dyYXBoeXxlbnwxfHx8fDE3NzcxMTI5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    color: '#faf0f4',
    role: 'Design Lead',
    team: '2 designers, 1 developer',
    timeline: 'Jun – Oct 2024',
    duration: '4 months',
    platform: 'Web',
    techStack: 'Figma, WordPress, CSS',
  },
];
