import type { ProjectData } from '../../../app/content/projects';

const project: ProjectData = {
  title: 'Busking Town',
  client: 'Side Project',
  year: '2021–2022',
  description: 'A metaverse-based online busking platform built inside Gather Town to revive Hongdae\'s live music scene during COVID-19.',
  tags: ['Entrepreneurship', 'Prototyping', 'Market Research', 'Community'],
  coverImage: '/project-images/busking-town.png',
  images: [
    '/project-images/busking-town.png',
    '/project-images/busking-town_1.png',
  ],
  role: 'Project Leader · Prototype Developer',
  team: '5 team members',
  duration: '5 months',
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
  focusKeyword: 'online busking',
  secondaryKeywords: ['metaverse', 'Hongdae'],
};

export default project;
