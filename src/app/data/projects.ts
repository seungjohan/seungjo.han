export interface Project {
  slug: string;
  title: string;
  client: string;
  year: string;
  description: string;
  tags: string[];
  coverImage: string;
  images: string[];   // ← all images for cycling slideshow
  color: string;
  role: string;
  team: string;
  timeline: string;
  duration: string;
  platform: string;
  techStack: string;
  url?: string;
  // 3-part structured explanation
  impact: string;
  whatIDid: string;                // intro sentence for What I Did
  whatIDidBullets: string[];       // arrow-bullet list items
  outcome: string;                 // shown in highlighted box
}

export const PROJECTS: Project[] = [
  {
    slug: 'webeing',
    title: 'Webeing (위빙)',
    client: 'Self-founded Startup',
    year: '2020–2021',
    description: 'A B2B2C food e-commerce platform reducing restaurant food waste in Korea — built from 0 to 1 as co-founder, product owner, and engineer.',
    tags: ['Entrepreneurship', 'Product Management', 'Full-Stack', 'ESG'],
    coverImage: 'https://images.unsplash.com/photo-1628532429788-c35922b5e6c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwd2FzdGUlMjByZXN0YXVyYW50JTIwc3VzdGFpbmFiaWxpdHklMjBLb3JlYXxlbnwxfHx8fDE3Nzk2NzY5NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      '/project-images/webeing-hybrid-app.svg',
      '/project-images/webeing-flyer.PNG',
      '/project-images/webeing-hybrid-app.svg',
    ],
    color: '#f4f4f5',
    role: 'Co-founder · Product Owner · Software Engineer',
    team: '2 co-founders, 1 designer, 5 software engineers',
    timeline: 'Jan 2020 – Jun 2021',
    duration: '18 months',
    platform: 'Web, Hybrid App',
    techStack: 'Django · HTML · CSS · JavaScript · Bootstrap · AWS · Adobe XD · Protopie',
    impact: 'South Korea generates over 5.5 million tons of food waste annually — an economic loss exceeding ₩22 trillion — driven largely by group dining and drinking culture. Restaurants had no efficient channel to monetize near-expiry stock, while customers bore high delivery fees with no access to affordable nearby food. COVID-19 accelerated online food delivery reliance and made the problem more visible.',
    whatIDid: 'Co-founded and led Webeing end-to-end: from idea validation through customer development, product design, engineering, and go-to-market — all in a specific geographic area to maximize learning speed.',
    whatIDidBullets: [
      'Compiled a list of 50+ restaurant owners and conducted deep qualitative and quantitative interviews in Wirye New Town, Seongnam',
      'Interviewed 300+ local citizens to validate demand and identify UX pain points around delivery fees and food quality',
      'Designed 5 iterations of prototypes across Adobe XD and Protopie, from basic wireframes to fully interactive hybrid app flows',
      'Learned Django and led front-end development from scratch — built the landing page, inventory pages, cart, and payment flows',
      'Deployed on AWS EC2 with Elastic Beanstalk and integrated a Korean payment gateway (Port One / iamport)',
      'Ran the beta with partner restaurants and gathered structured feedback from users, founders, and UI/UX experts to inform pivots',
    ],
    outcome: 'Partnered with 5 restaurants and helped increase their sales by 30%. Won 2nd Prize at the Lotte & Likelion Hackathon (out of ~70 teams). Received government investment from the Prospective Founders Package program. Won 3rd Prize at Chung-Ang University Davinci Startup Contest. Shipped a live product used by real customers.',
  },
  {
    slug: 'busking-town',
    title: 'Busking Town',
    client: 'Side Project',
    year: '2021–2022',
    description: 'A metaverse-based online busking platform built inside Gather Town to revive Hongdae\'s live music scene during COVID-19.',
    tags: ['Entrepreneurship', 'Prototyping', 'Market Research', 'Community'],
    coverImage: 'https://images.unsplash.com/photo-1588671815815-b0cd3b2a9189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNraW5nJTIwbGl2ZSUyMG11c2ljJTIwc3RyZWV0JTIwcGVyZm9ybWFuY2V8ZW58MXx8fHwxNzc5Njc2OTU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      '/project-images/busking-town.png',
      '/project-images/busking-town_1.png',
    ],
    color: '#fafaf0',
    role: 'Project Leader · Prototype Developer',
    team: '5 team members',
    timeline: 'Sep 2021 – Jan 2022',
    duration: '5 months',
    platform: 'Web (Gather Town)',
    techStack: 'Gather Town · Market Research · Event Production',
    impact: 'COVID-19 devastated offline live music. The Hongdae area — Seoul\'s indie music hub — lost its busking culture almost entirely, with no accessible digital alternative for artists or fans. The barrier between performer and audience was physical, geographic, and economic. Indie artists had no new revenue channel, and fans had no way to discover or interact with them remotely.',
    whatIDid: 'Led concept development, market research, and the build of a virtual busking space inside Gather Town — modeled after real Hongdae landmarks to preserve the neighborhood\'s energy in digital form.',
    whatIDidBullets: [
      'Researched the Hongdae music ecosystem and conducted interviews with around 100 people involved in or passionate about music',
      'Validated the hypothesis through both quantitative surveys and qualitative research with artists and fans',
      'Built and designed a Gather Town metaverse space replicating real Hongdae locations: cafes, clubs, stages, and clothing stores',
      'Implemented artist features: dedicated stages, song requests, avatar movement, donation flows, and playlist creation',
      'Organized and successfully ran one online concert event inside the metaverse space',
    ],
    outcome: 'Successfully launched the metaverse busking venue and ran a live concert event. Validated the product hypothesis with 100+ research participants. Created a replicable model for digital live performance with low barriers for indie artists and genuine audience interaction.',
  },
  {
    slug: 'liter',
    title: 'LITER',
    client: 'Side Project',
    year: '2020',
    description: 'An integrated loyalty and rewards platform unifying fragmented stamp cards across independent cafes into one seamless digital experience.',
    tags: ['Product', 'Prototyping', 'Market Research', 'Fintech'],
    coverImage: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwbG95YWx0eSUyMGFwcCUyMGNhZmV8ZW58MXx8fHwxNzc5Njc2OTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwbG95YWx0eSUyMGFwcCUyMGNhZmV8ZW58MXx8fHwxNzc5Njc2OTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb2ZmZWUlMjBzaG9wJTIwbG95YWx0eSUyMGFwcCUyMGNhZmV8ZW58MXx8fHwxNzc5Njc2OTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb2ZmZWUlMjBzaG9wJTIwbG95YWx0eSUyMGFwcCUyMGNhZmV8ZW58MXx8fHwxNzc5Njc2OTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    color: '#fafaf0',
    role: 'Project Leader · Prototype Designer',
    team: '4 team members',
    timeline: 'Jul 2020 – Sep 2020',
    duration: '3 months',
    platform: 'Mobile App',
    techStack: 'Adobe XD · Protopie · Market Research',
    impact: 'Small, non-franchise cafes were stuck with outdated customer acquisition: paper stamp cards, disconnected coupons, no digital presence. Customers juggled cluttered wallets and had no way to track collective rewards across their favorite independent spots. Meanwhile, franchise giants like Starbucks offered polished digital loyalty ecosystems that small cafes simply couldn\'t compete with, creating a widening gap in customer retention.',
    whatIDid: 'Led concept development and designed a unified loyalty platform that collapsed fragmented paper-based systems into a single app — giving both cafe owners and customers a better experience.',
    whatIDidBullets: [
      'Identified the loyalty gap between franchise and independent cafes through market analysis and customer observation',
      'Designed the core UX: QR-based payment and rewards collection, mobile gifting, announcements, and remote ordering',
      'Architected the unified points system — earn at Cafe A, redeem at Cafe B — to break down loyalty silos',
      'Created an engaging reward visualization: a coffee cup that fills up as points accumulate, making progress tangible',
      'Built interactive prototypes in Adobe XD and Protopie to test core flows before development',
    ],
    outcome: 'Reached the final stage of the \'Try Everything 2020 Idea Contest\'. Validated the concept through structured user testing. Delivered a prototype that demonstrated how small cafes could compete with franchise loyalty ecosystems without heavy infrastructure investment.',
  },
  {
    slug: 'gif-hackathon',
    title: 'Global Innovator Festa Hackathon',
    client: 'GIF — Korea · Kazakhstan',
    year: '2019',
    description: 'Led a Korean-Kazakh mixed team to win the Top Global Prize by solving digital information polarization in Kazakhstan\'s public transit system.',
    tags: ['Global', 'Entrepreneurship', 'Market Research', 'Leadership'],
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWNrYXRob24lMjBnbG9iYWwlMjB0ZWFtJTIwY29sbGFib3JhdGlvbiUyMGlubm92YXRpb258ZW58MXx8fHwxNzc5Njc2OTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      '/project-images/gif.jpeg',
    ],
    color: '#f0f4fa',
    role: 'Project Leader',
    team: '9 team members (Korea + Kazakhstan)',
    timeline: 'Oct 2019 – Nov 2019',
    duration: '1 month',
    platform: 'Concept · Proposal',
    techStack: 'Market Research · Cross-Cultural Leadership · English',
    impact: 'Public transportation in Kazakhstan was systemically unsafe: frequent incidents of kidnapping, sexual harassment, and pickpocketing. Many people resorted to hitchhiking due to unreliable alternatives. Children regularly went missing in transit. The system lacked digital infrastructure and basic safety mechanisms — a problem invisible to those outside the country.',
    whatIDid: 'Led a 9-person cross-cultural team — mixing Korean and Kazakh members — through research, ideation, and pitching to solve a real safety crisis using existing transit card infrastructure.',
    whatIDidBullets: [
      'Conducted market research on Kazakhstan\'s public transit system and safety statistics to ground the solution in real data',
      'Facilitated a cross-cultural team process, navigating tension when framing caused friction between Korean and Kazakh members',
      'Designed a lightweight transit safety solution: tracking users\' last known location via tap-in card data',
      'Presented the proposal in English to an international judging panel',
      'Turned a conflict about framing — how we described Kazakhstan\'s infrastructure — into a lesson about respectful cross-cultural collaboration',
    ],
    outcome: 'Won the Top Global Prize as an international team. The experience taught me that how you frame a problem matters as much as the solution — especially in cross-cultural settings.',
  },
  {
    slug: 'travel-cp',
    title: 'Travel CP',
    client: 'Side Project',
    year: '2019–2022',
    description: 'A platform connecting foreign visitors with Korean locals through interest-based travel experiences and curated content.',
    tags: ['Global', 'Market Research', 'Entrepreneurship', 'Community'],
    coverImage: 'https://images.unsplash.com/photo-1602479185195-32f5cd203559?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBLb3JlYSUyMGN1bHR1cmFsJTIwZXhwZXJpZW5jZSUyMHRvdXJpc218ZW58MXx8fHwxNzc5Njc2OTU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      '/project-images/travel-cp.jpeg',
      '/project-images/travel-cp_1.jpeg',
      '/project-images/travel-cp_2.png',
      '/project-images/travel-cp_3.jpeg',
      '/project-images/travel-cp_4.jpeg',
      '/project-images/travel-cp_5.jpg',
      '/project-images/travel-cp_6.png',
      '/project-images/travel-cp_7.gif',
    ],
    color: '#f4f4f5',
    role: 'Project Leader',
    team: '2 team members',
    timeline: 'Apr 2019 – Dec 2022',
    duration: '3.5 years (part-time)',
    platform: 'Web · Events',
    techStack: 'MVP Testing · Customer Development · Community Building · English',
    impact: 'Korea\'s tourism market was saturated with generic content. Foreigners living in Korea universally found Koreans friendly but hard to befriend authentically — on subway rides, some Koreans visibly avoided sitting next to foreigners; in university group projects, foreign students were frequently excluded from Korean teams. The gap between surface-level politeness and genuine connection was real and persistent.',
    whatIDid: 'Developed and tested a platform for interest-based travel experiences in Korea, connecting foreigners with locals through shared passions — sports, music, food, regional travel.',
    whatIDidBullets: [
      'Interviewed foreigners from the US, Singapore, Vietnam, Mongolia, Bulgaria, Kazakhstan, Ireland, Australia, and more to understand their needs',
      'Segmented the foreign resident market into three groups: exchange students, short-term visitors, and long-term employees',
      'Discovered key insight: foreigners wanted genuine Korean friendships but felt interactions were often transactional (especially around English practice)',
      'Organized and ran interest-based MVP events: BBQ trips, regional tours, sports (climbing, football, CrossFit), K-pop and music-themed activities',
      'Ran 20+ MVP tests with real customers across multiple nationalities',
    ],
    outcome: 'Validated the hypothesis through 20+ real-world MVP tests across multiple customer segments. Customer satisfaction spiked when experiences were built around personal interests and genuine connection — not transactional exchanges. Learned how to communicate meaningfully across multiple cultures.',
  },
  {
    slug: 'north-america-strategy',
    title: 'North American Market Strategy',
    client: 'Emong Games',
    year: '2019',
    description: 'An intensive field consulting project developing a go-to-market strategy for a Korean HTML5 game startup to break into the North American market.',
    tags: ['Global', 'Market Research', 'Strategy', 'Leadership'],
    coverImage: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHN0cmF0ZWd5JTIwaW50ZXJuYXRpb25hbCUyMG1hcmtldCUyMGV4cGFuc2lvbnxlbnwxfHx8fDE3Nzk2NzY5NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      '/project-images/northeastern.jpeg',
      '/project-images/northeastern_1.jpg',
      '/project-images/northeastern_2.jpeg',
      '/project-images/northeastern_3.jpeg',
    ],
    color: '#faf0f4',
    role: 'Project Leader · Tour Guide',
    team: '5 team members',
    timeline: 'Apr 2019 – Jun 2019',
    duration: '3 months',
    platform: 'Consulting · Presentation',
    techStack: 'Market Research · Competitive Analysis · English · Google Slides',
    impact: 'Emong Games had developed a competitive HTML5 browser game (no download required) but the Korean market was too small to sustain growth. They needed to understand whether North America represented a real opportunity — and if so, what product and positioning changes would be required. The U.S. gaming market follows very different trends from Korea\'s e-sports-heavy culture.',
    whatIDid: 'Led a 5-person team through competitive analysis, field research, and strategic positioning to produce a North American go-to-market recommendation, then pitched directly to Emong Games executives.',
    whatIDidBullets: [
      'Researched and compared the e-sports markets in Korea and the U.S. to identify structural differences in consumer behavior',
      'Analyzed Emong\'s HTML5 format for unique positioning advantages in the North American context',
      'Identified the edtech and gamified learning segment as a high-opportunity angle uniquely suited to U.S. market trends',
      'Developed a full market entry strategy: target segment, value proposition, positioning, and competitive differentiation',
      'Presented the strategy directly to Emong Games executives in English',
    ],
    outcome: 'Emong Games responded positively and indicated they would seriously consider the U.S. market expansion based on our findings. Gained deep exposure to international business strategy and the IT and gaming industry from a global perspective.',
  },
];
