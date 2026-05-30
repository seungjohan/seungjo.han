const VIEWS_KEY  = 'sj_views';
const SHARES_KEY = 'sj_shares';
const EVENTS_KEY = 'sj_view_events';

interface ViewEvent { id: string; type: 'post' | 'project'; ts: number; }

function read(key: string): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}
function write(key: string, d: Record<string, number>) {
  localStorage.setItem(key, JSON.stringify(d));
}

export function trackView(id: string, type: 'post' | 'project' = 'post') {
  const counts = read(VIEWS_KEY);
  counts[id] = (counts[id] || 0) + 1;
  write(VIEWS_KEY, counts);

  try {
    const events: ViewEvent[] = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    events.push({ id, type, ts: Date.now() });
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-2000)));
  } catch { /* ignore */ }
}

export function trackShare(id: string) {
  const d = read(SHARES_KEY);
  d[id] = (d[id] || 0) + 1;
  write(SHARES_KEY, d);
}

export function getViews(id: string): number { return read(VIEWS_KEY)[id] || 0; }
export function getShares(id: string): number { return read(SHARES_KEY)[id] || 0; }
export function getAllViews(): Record<string, number> { return read(VIEWS_KEY); }
export function getAllShares(): Record<string, number> { return read(SHARES_KEY); }
export function getTotalViews(): number {
  return Object.values(read(VIEWS_KEY)).reduce((s, v) => s + v, 0);
}
export function getTotalShares(): number {
  return Object.values(read(SHARES_KEY)).reduce((s, v) => s + v, 0);
}

export function getMonthlyViews(): { month: string; views: number }[] {
  const now = new Date();
  const buckets: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets[d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })] = 0;
  }
  try {
    const events: ViewEvent[] = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]');
    events.forEach(e => {
      const d = new Date(e.ts);
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (key in buckets) buckets[key]++;
    });
  } catch { /* ignore */ }
  return Object.entries(buckets).map(([month, views]) => ({ month, views }));
}
