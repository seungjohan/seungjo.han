// Mock analytics data — replace with Supabase or real backend for production

export interface PostAnalytics {
  views: number;
  createdAt: string;
  modifiedAt: string;
  status: 'published' | 'draft';
}

export interface ProjectAnalytics {
  views: number;
  createdAt: string;
  modifiedAt: string;
}

export const POST_ANALYTICS: Record<string, PostAnalytics> = {
  'on-simplicity-in-design':           { views: 1842, createdAt: 'Apr 15, 2026', modifiedAt: 'Apr 16, 2026', status: 'published' },
  'building-with-intention':           { views: 1203, createdAt: 'Mar 28, 2026', modifiedAt: 'Mar 28, 2026', status: 'published' },
  'the-art-of-constraints':            { views: 976,  createdAt: 'Mar 12, 2026', modifiedAt: 'Mar 14, 2026', status: 'published' },
  'lessons-from-korean-design':        { views: 742,  createdAt: 'Feb 24, 2026', modifiedAt: 'Feb 25, 2026', status: 'published' },
  'the-future-of-ai-in-creative-work': { views: 2156, createdAt: 'Feb 10, 2026', modifiedAt: 'Feb 11, 2026', status: 'published' },
  'notes-on-productive-workflows':     { views: 621,  createdAt: 'Jan 28, 2026', modifiedAt: 'Jan 29, 2026', status: 'published' },
};

export const PROJECT_ANALYTICS: Record<string, ProjectAnalytics> = {
  'brand-identity-system': { views: 923,  createdAt: 'Jan 15, 2026', modifiedAt: 'Apr 20, 2026' },
  'ecommerce-platform':    { views: 1284, createdAt: 'Aug 10, 2025', modifiedAt: 'Apr 18, 2026' },
  'mobile-app-design':     { views: 1567, createdAt: 'Dec 5,  2025', modifiedAt: 'Apr 22, 2026' },
  'editorial-website':     { views: 489,  createdAt: 'Oct 20, 2024', modifiedAt: 'Apr 15, 2026' },
};

// Monthly views trend (last 6 months)
export const MONTHLY_VIEWS = [
  { month: 'Nov', views: 1240 },
  { month: 'Dec', views: 1580 },
  { month: 'Jan', views: 2100 },
  { month: 'Feb', views: 2890 },
  { month: 'Mar', views: 3420 },
  { month: 'Apr', views: 4263 },
];
