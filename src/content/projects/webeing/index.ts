import type { ProjectData } from '../../../app/content/projects';

const project: ProjectData = {
  title: 'Webeing (위빙)',
  client: 'Self-founded Startup',
  year: '2020–2021',
  description: 'A B2B2C food e-commerce platform reducing restaurant food waste in Korea — built from 0 to 1 as co-founder, product owner, and engineer.',
  tags: ['Entrepreneurship', 'Product Management', 'Full-Stack', 'ESG'],
  coverImage: '/project-images/webeing-hybrid-app.svg',
  images: [
    '/project-images/webeing-hybrid-app.svg',
    '/project-images/webeing-flyer.PNG',
  ],
  // 1075x992 and 845x1200 portrait. Under the default cover crop they lost their
  // top and bottom to the wide frame, so they scale down to fit it instead.
  imageFit: 'contain',
  role: 'Co-founder · Product Owner · Software Engineer',
  team: '2 co-founders, 1 designer, 5 software engineers',
  duration: '18 months',
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
  focusKeyword: 'restaurant food waste',
  secondaryKeywords: ['food e-commerce', 'startup'],
};

export default project;
