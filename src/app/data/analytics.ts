// Analytics — total counts are now driven by real localStorage tracking (viewTracker.ts).
// These static entries provide fallback metadata (dates, status) for static posts/projects.

export interface PostAnalytics {
  views: number;
  shares: number;
  createdAt: string;
  modifiedAt: string;
  status: 'published' | 'draft';
}

export interface ProjectAnalytics {
  views: number;
  shares: number;
  createdAt: string;
  modifiedAt: string;
}

export const POST_ANALYTICS: Record<string, PostAnalytics> = {
  'developing-a-web-product-for-a-startup': {
    views: 0, shares: 0,
    createdAt: 'Sep 26, 2024', modifiedAt: 'May 25, 2026', status: 'published',
  },
  'designing-a-prototype-for-a-startup': {
    views: 0, shares: 0,
    createdAt: 'Sep 26, 2024', modifiedAt: 'May 25, 2026', status: 'published',
  },
  'dokdo-security-police': {
    views: 0, shares: 0,
    createdAt: 'Dec 2, 2022', modifiedAt: 'May 25, 2026', status: 'published',
  },
};

export const PROJECT_ANALYTICS: Record<string, ProjectAnalytics> = {
  'webeing':               { views: 0, shares: 0, createdAt: 'Jan 2020', modifiedAt: 'May 25, 2026' },
  'busking-town':          { views: 0, shares: 0, createdAt: 'Sep 2021', modifiedAt: 'May 25, 2026' },
  'liter':                 { views: 0, shares: 0, createdAt: 'Jul 2020', modifiedAt: 'May 25, 2026' },
  'gif-hackathon':         { views: 0, shares: 0, createdAt: 'Oct 2019', modifiedAt: 'May 25, 2026' },
  'travel-cp':             { views: 0, shares: 0, createdAt: 'Apr 2019', modifiedAt: 'May 25, 2026' },
  'north-america-strategy':{ views: 0, shares: 0, createdAt: 'Apr 2019', modifiedAt: 'May 25, 2026' },
};
