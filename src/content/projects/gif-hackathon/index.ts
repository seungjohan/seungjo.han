import type { ProjectData } from '../../../app/content/projects';

const project: ProjectData = {
  title: 'Global Innovator Festa Hackathon',
  client: 'GIF — Korea · Kazakhstan',
  year: '2019',
  description: 'Led a Korean-Kazakh mixed team to win the Top Global Prize by solving digital information polarization in Kazakhstan\'s public transit system.',
  tags: ['Global', 'Entrepreneurship', 'Market Research', 'Leadership'],
  coverImage: '/project-images/gif.jpeg',
  images: [
    '/project-images/gif.jpeg',
  ],
  role: 'Project Leader',
  team: '9 team members (Korea + Kazakhstan)',
  duration: '1 month',
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
  focusKeyword: 'global hackathon',
  secondaryKeywords: ['Kazakhstan', 'cross-cultural leadership'],
};

export default project;
