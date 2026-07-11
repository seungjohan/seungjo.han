import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Eye, FileText, Briefcase, TrendingUp, RefreshCw } from 'lucide-react';
import { POSTS } from '../../data/posts';
import { PROJECTS } from '../../data/projects';
import { POST_ANALYTICS, PROJECT_ANALYTICS } from '../../data/analytics';
import { getDraftPosts } from '../../utils/draftStore';
import { getDraftProjects } from '../../utils/draftStore';
import {
  getTotalViews,
  getAllViews,
  getMonthlyViews,
} from '../../utils/viewTracker';

const GA_PROPERTY_KEY = 'sj_ga_property_id';
const GOOGLE_ACCESS_TOKEN_KEY = 'sj_google_access_token';
const GTM_ACCOUNT_KEY = 'sj_gtm_account_id';
const GTM_CONTAINER_API_KEY = 'sj_gtm_container_api_id';
const GA_REPORT_KEY = 'sj_ga_report_rows';
const GTM_STATUS_KEY = 'sj_gtm_container_status';

type GaReportRow = {
  date: string;
  activeUsers: number;
  sessions: number;
  pageViews: number;
};

type GtmStatus = {
  name: string;
  publicId: string;
  fetchedAt: string;
};

function StatCard({ icon: Icon, label, value, sub }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        <Icon size={15} className="text-gray-300" />
      </div>
      <p className="text-gray-900" style={{ fontSize: '1.8rem', fontWeight: 400, letterSpacing: '-0.02em' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [totalViews, setTotalViews] = useState(0);
  const [monthlyViews, setMonthlyViews] = useState<{ month: string; views: number }[]>([]);
  const [postViewData, setPostViewData] = useState<{ name: string; views: number }[]>([]);
  const [projectViewData, setProjectViewData] = useState<{ name: string; views: number }[]>([]);
  const [allPostsCount, setAllPostsCount] = useState(POSTS.length);
  const [allProjectsCount, setAllProjectsCount] = useState(PROJECTS.length);
  const [gaReportRows, setGaReportRows] = useState<GaReportRow[]>([]);
  const [gtmStatus, setGtmStatus] = useState<GtmStatus | null>(null);
  const [googleSyncing, setGoogleSyncing] = useState(false);
  const [googleSyncMessage, setGoogleSyncMessage] = useState('');
  const [recentActivity, setRecentActivity] = useState<{
    type: 'post' | 'project'; title: string; slug: string; date: string; views: number;
  }[]>([]);

  useEffect(() => {
    const views = getAllViews();
    const draftPosts = getDraftPosts();
    const draftProjects = getDraftProjects();
    const savedGaReport = localStorage.getItem(GA_REPORT_KEY);
    const savedGtmStatus = localStorage.getItem(GTM_STATUS_KEY);
    const draftPostSlugs = new Set(draftPosts.map(d => d.slug));
    const draftProjectSlugs = new Set(draftProjects.map(d => d.slug));

    const allPosts = [...POSTS.filter(p => !draftPostSlugs.has(p.slug)), ...draftPosts];
    const allProjects = [...PROJECTS.filter(p => !draftProjectSlugs.has(p.slug)), ...draftProjects];

    setTotalViews(getTotalViews());
    setMonthlyViews(getMonthlyViews());
    setAllPostsCount(allPosts.length);
    setAllProjectsCount(allProjects.length);
    if (savedGaReport) setGaReportRows(JSON.parse(savedGaReport));
    if (savedGtmStatus) setGtmStatus(JSON.parse(savedGtmStatus));

    setPostViewData(
      allPosts.map(p => ({
        name: p.title.length > 22 ? p.title.slice(0, 22) + '…' : p.title,
        views: views[p.slug] ?? POST_ANALYTICS[p.slug]?.views ?? 0,
      })).sort((a, b) => b.views - a.views)
    );

    setProjectViewData(
      allProjects.map(p => ({
        name: p.title,
        views: views[p.slug] ?? PROJECT_ANALYTICS[p.slug]?.views ?? 0,
      })).sort((a, b) => b.views - a.views)
    );

    setRecentActivity([
      ...allPosts.map(p => ({
        type: 'post' as const,
        title: p.title,
        slug: p.slug,
        date: POST_ANALYTICS[p.slug]?.modifiedAt ?? p.date ?? '',
        views: views[p.slug] ?? 0,
      })),
      ...allProjects.map(p => ({
        type: 'project' as const,
        title: p.title,
        slug: p.slug,
        date: PROJECT_ANALYTICS[p.slug]?.modifiedAt ?? '',
        views: views[p.slug] ?? 0,
      })),
    ].slice(0, 8));
  }, []);

  const avgPostViews = allPostsCount > 0 ? Math.round(totalViews / allPostsCount) : 0;
  const gaTotals = gaReportRows.reduce(
    (acc, row) => ({
      activeUsers: acc.activeUsers + row.activeUsers,
      sessions: acc.sessions + row.sessions,
      pageViews: acc.pageViews + row.pageViews,
    }),
    { activeUsers: 0, sessions: 0, pageViews: 0 }
  );

  const syncGoogleData = async () => {
    const propertyId = localStorage.getItem(GA_PROPERTY_KEY)?.trim();
    const accessToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN_KEY)?.trim();
    const gtmAccountId = localStorage.getItem(GTM_ACCOUNT_KEY)?.trim();
    const gtmContainerId = localStorage.getItem(GTM_CONTAINER_API_KEY)?.trim();

    if (!propertyId || !accessToken) {
      setGoogleSyncMessage('Add a GA4 property ID and Google OAuth access token in Analytics first.');
      return;
    }

    setGoogleSyncing(true);
    setGoogleSyncMessage('');

    try {
      const gaResponse = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          dimensions: [{ name: 'date' }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
          ],
          orderBys: [{ dimension: { dimensionName: 'date' } }],
        }),
      });

      if (!gaResponse.ok) {
        throw new Error(`GA4 request failed with ${gaResponse.status}`);
      }

      const gaJson = await gaResponse.json();
      const rows: GaReportRow[] = (gaJson.rows ?? []).map((row: {
        dimensionValues?: { value?: string }[];
        metricValues?: { value?: string }[];
      }) => {
        const rawDate = row.dimensionValues?.[0]?.value ?? '';
        return {
          date: rawDate.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3'),
          activeUsers: Number(row.metricValues?.[0]?.value ?? 0),
          sessions: Number(row.metricValues?.[1]?.value ?? 0),
          pageViews: Number(row.metricValues?.[2]?.value ?? 0),
        };
      });

      localStorage.setItem(GA_REPORT_KEY, JSON.stringify(rows));
      setGaReportRows(rows);

      if (gtmAccountId && gtmContainerId) {
        const gtmResponse = await fetch(
          `https://tagmanager.googleapis.com/tagmanager/v2/accounts/${gtmAccountId}/containers/${gtmContainerId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (gtmResponse.ok) {
          const gtmJson = await gtmResponse.json();
          const status = {
            name: gtmJson.name ?? 'Container',
            publicId: gtmJson.publicId ?? '',
            fetchedAt: new Date().toISOString(),
          };
          localStorage.setItem(GTM_STATUS_KEY, JSON.stringify(status));
          setGtmStatus(status);
        }
      }

      setGoogleSyncMessage('Google data synced for the last 30 days.');
    } catch (error) {
      setGoogleSyncMessage(error instanceof Error ? error.message : 'Google data sync failed.');
    } finally {
      setGoogleSyncing(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.4rem', fontWeight: 400, letterSpacing: '-0.02em' }}>
          Dashboard
        </h1>
        <p className="text-gray-400" style={{ fontSize: '0.85rem' }}>
          Overview of your content and analytics.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Eye}        label="Total Views"    value={totalViews}       sub="Posts + Projects" />
        <StatCard icon={TrendingUp} label="Avg Post Views" value={avgPostViews}     sub="Per published post" />
        <StatCard icon={FileText}   label="Posts"          value={allPostsCount}    sub="All published" />
        <StatCard icon={Briefcase}  label="Projects"       value={allProjectsCount} sub="In portfolio" />
      </div>

      {/* Google data sync */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Google Analytics Data</p>
            <p className="text-sm text-gray-500">
              Syncs GA4 report data from the last 30 days using the credentials saved in Analytics.
            </p>
            {gtmStatus && (
              <p className="text-xs text-gray-400 mt-2">
                GTM connected: {gtmStatus.name}{gtmStatus.publicId ? ` (${gtmStatus.publicId})` : ''}
              </p>
            )}
          </div>
          <button
            onClick={syncGoogleData}
            disabled={googleSyncing}
            className="inline-flex items-center justify-center gap-2 bg-gray-950 text-white rounded-xl px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={googleSyncing ? 'animate-spin' : ''} />
            {googleSyncing ? 'Syncing' : 'Sync Google Data'}
          </button>
        </div>

        {googleSyncMessage && (
          <p className="text-xs text-gray-500 mb-4">{googleSyncMessage}</p>
        )}

        {gaReportRows.length > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Users</p>
                <p className="text-lg text-gray-900">{gaTotals.activeUsers.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Sessions</p>
                <p className="text-lg text-gray-900">{gaTotals.sessions.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-gray-50 px-4 py-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Page Views</p>
                <p className="text-lg text-gray-900">{gaTotals.pageViews.toLocaleString()}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart id="chart-google-analytics" data={gaReportRows} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} cursor={{ stroke: '#e5e7eb' }} />
                <Line type="monotone" dataKey="activeUsers" name="Users" stroke="#111827" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#6b7280" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pageViews" name="Page views" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </>
        ) : (
          <div className="rounded-lg bg-gray-50 px-4 py-5 text-sm text-gray-400">
            No Google report data yet. Add the GA4 property ID and OAuth token in Analytics, then sync.
          </div>
        )}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">

        {/* Monthly trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">Monthly Views</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart id="chart-monthly" data={monthlyViews} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                cursor={{ stroke: '#e5e7eb' }}
              />
              <Line type="monotone" dataKey="views" stroke="#111827" strokeWidth={2} dot={{ fill: '#111827', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Views by post */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">Views by Post</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart id="chart-posts" data={postViewData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} cursor={{ fill: '#f9fafb' }} />
              <Bar dataKey="views" fill="#111827" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects views */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">Views by Project</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart id="chart-projects" data={projectViewData} margin={{ left: -20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }} cursor={{ fill: '#f9fafb' }} />
            <Bar dataKey="views" fill="#374151" radius={[4, 4, 0, 0]} barSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Recent Activity</p>
        </div>
        <div className="divide-y divide-gray-50">
          {recentActivity.map(item => (
            <div key={item.slug} className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${
                  item.type === 'post'
                    ? 'text-blue-600 border-blue-100 bg-blue-50'
                    : 'text-emerald-600 border-emerald-100 bg-emerald-50'
                }`}>
                  {item.type}
                </span>
                <span className="text-sm text-gray-700">{item.title}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Eye size={11} /> {item.views.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 w-24 text-right">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
