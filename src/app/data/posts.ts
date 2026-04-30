export interface Post {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
  sections?: PostSection[];
}

export interface PostSection {
  id: string;
  title: string;
  paragraphs: string[];
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
    sections: [
      {
        id: 'attention-as-material',
        title: 'Attention as material',
        paragraphs: [
          'The first material of creative work is not a tool, a canvas, or a blank document. It is attention. Where it goes, the work follows.',
          'That sounds obvious until you notice how often the shape of a day is decided by whatever is loudest. Intentional work begins by making a smaller room for the question that matters.',
        ],
      },
      {
        id: 'making-room',
        title: 'Making room',
        paragraphs: [
          'I have become less interested in heroic productivity and more interested in protected space. A few uninterrupted hours can carry more weight than a week of fragmented effort.',
          'The rituals are simple: write the problem down, remove the obvious distractions, and decide what good enough means before the work starts expanding on its own.',
        ],
      },
      {
        id: 'leaving-a-trace',
        title: 'Leaving a trace',
        paragraphs: [
          'The best projects leave behind more than an artifact. They leave behind clearer language, better instincts, and a record of choices that the next person can understand.',
          'That is the practical value of intention. It makes the work easier to inherit, easier to critique, and easier to improve.',
        ],
      },
    ],
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
    sections: [
      {
        id: 'the-shape-of-a-box',
        title: 'The shape of a box',
        paragraphs: [
          'A constraint is only frustrating when it is invisible. Once you can name it, it becomes a shape you can work with.',
          'Budget, time, platform, brand, team skill, accessibility, performance: every project arrives with edges. Design improves when those edges are treated as part of the brief instead of an obstacle to the brief.',
        ],
      },
      {
        id: 'fewer-decisions',
        title: 'Fewer decisions',
        paragraphs: [
          'Creative freedom is often confused with unlimited choice. In practice, too many open decisions slow the work down and make every direction feel arbitrary.',
          'Useful constraints remove low-value decisions. They let the team spend energy on the parts of the experience that users will actually feel.',
        ],
      },
      {
        id: 'pressure-and-clarity',
        title: 'Pressure and clarity',
        paragraphs: [
          'The point is not to romanticize scarcity. Bad constraints can damage a project. Good constraints make tradeoffs visible enough to discuss.',
          'When a team understands the pressure it is designing under, the work gets sharper. The solution may be smaller, but it is usually more coherent.',
        ],
      },
    ],
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
    sections: [
      {
        id: 'quiet-balance',
        title: 'Quiet balance',
        paragraphs: [
          'A lot of Korean design traditions carry a quiet confidence. The composition does not fight for attention; it creates a relationship between space, material, and use.',
          'That restraint feels especially relevant in digital products, where every surface is tempted to explain itself at full volume.',
        ],
      },
      {
        id: 'space-that-works',
        title: 'Space that works',
        paragraphs: [
          'Whitespace is often described as visual luxury, but it is also practical. It gives the eye a path, lets hierarchy breathe, and makes interaction feel less compressed.',
          'In product work, calm space can be an accessibility decision as much as an aesthetic one.',
        ],
      },
      {
        id: 'modern-continuity',
        title: 'Modern continuity',
        paragraphs: [
          'The lesson is not to copy traditional forms into contemporary interfaces. It is to notice the principles underneath them.',
          'Durability, balance, humility, and attention to context can move across mediums. A screen can learn from a room.',
        ],
      },
    ],
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
    sections: [
      {
        id: 'from-output-to-direction',
        title: 'From output to direction',
        paragraphs: [
          'AI changes the texture of creative work by making first drafts cheaper. That does not make judgment less important. It makes judgment the center of the job.',
          'When output becomes abundant, direction becomes scarce. The valuable question shifts from "can we make something?" to "is this the thing worth making?"',
        ],
      },
      {
        id: 'taste-as-infrastructure',
        title: 'Taste as infrastructure',
        paragraphs: [
          'Teams that treat AI as a shortcut often get faster sameness. Teams that pair it with strong taste, clear constraints, and a point of view can move faster without flattening the work.',
          'Taste is not decoration. It is infrastructure for deciding what to keep, what to revise, and what to throw away.',
        ],
      },
      {
        id: 'new-collaboration',
        title: 'New collaboration',
        paragraphs: [
          'The healthiest creative workflows will likely feel less like replacement and more like conversation. Tools propose, people decide, and the project improves through iteration.',
          'That puts responsibility back where it belongs: with the maker, the team, and the people affected by the work.',
        ],
      },
    ],
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
    sections: [
      {
        id: 'capture-before-clarity',
        title: 'Capture before clarity',
        paragraphs: [
          'Most useful workflow systems start messy. The goal at first is not perfect organization; it is reliable capture.',
          'If an idea has a trusted place to land, the mind stops trying to hold it in the background. That alone can return a surprising amount of focus.',
        ],
      },
      {
        id: 'weekly-reset',
        title: 'Weekly reset',
        paragraphs: [
          'A weekly reset is the smallest ritual that consistently helps me. I review open loops, choose the few outcomes that matter, and archive anything that has become noise.',
          'The point is not to control the week. It is to begin it with fewer invisible commitments.',
        ],
      },
      {
        id: 'tools-should-disappear',
        title: 'Tools should disappear',
        paragraphs: [
          'Good tools reduce the amount of self-management required to do the work. Bad tools become another project.',
          'The test I use is simple: after a month, does this system make the next good action easier to see? If not, it is probably too heavy.',
        ],
      },
    ],
  },
];
