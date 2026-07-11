import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, FileText, Briefcase, BarChart2, LogOut, ExternalLink } from 'lucide-react';

const NAV = [
  { to: '/nahojgnues/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/nahojgnues/posts',     label: 'Posts',     icon: FileText },
  { to: '/nahojgnues/projects',  label: 'Projects',  icon: Briefcase },
  { to: '/nahojgnues/analytics', label: 'Analytics', icon: BarChart2 },
];

export default function AdminLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [status, setStatus] = useState<'checking' | 'authorized' | 'denied'>('checking');

  // Auth guard for panel routes — verified server-side; the session lives in
  // an httpOnly cookie the browser can't read or forge.
  useEffect(() => {
    if (location.pathname === '/nahojgnues') return;

    let cancelled = false;
    setStatus('checking');
    fetch('/api/admin-check')
      .then(res => res.json())
      .then(data => { if (!cancelled) setStatus(data.authorized ? 'authorized' : 'denied'); })
      .catch(() => { if (!cancelled) setStatus('denied'); });

    return () => { cancelled = true; };
  }, [location.pathname]);

  // Login page renders without sidebar
  if (location.pathname === '/nahojgnues') {
    return <Outlet />;
  }

  if (status === 'checking') return null;

  if (status === 'denied') {
    navigate('/nahojgnues', { replace: true });
    return null;
  }

  const logout = () => {
    fetch('/api/admin-logout', { method: 'POST' }).finally(() => navigate('/nahojgnues'));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 bg-gray-950 flex flex-col">
        {/* Wordmark */}
        <div className="px-6 py-6 border-b border-gray-800">
          <p className="text-white" style={{ fontSize: '0.85rem', fontWeight: 500, letterSpacing: '-0.01em' }}>
            Seungjo Han
          </p>
          <p className="text-gray-500" style={{ fontSize: '0.7rem', marginTop: 2 }}>Admin panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-5 space-y-0.5 border-t border-gray-800 pt-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-colors"
          >
            <ExternalLink size={15} /> View site
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-red-400 transition-colors"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
