import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { Menu, X, Search, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { SearchModal } from './SearchModal';
import { AnchorNav } from './AnchorNav';

const NAV_LINKS = [
  { to: '/',         label: 'Home',     exact: true },
  { to: '/about',    label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog',     label: 'Blog' },
];

const FOOTER_PAGES = [
  { to: '/',         label: 'Home' },
  { to: '/about',    label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog',     label: 'Blog' },
];

const FOOTER_CONNECT = [
  { href: 'https://www.linkedin.com/in/seungjohan/', label: 'LinkedIn', external: true },
  { href: 'mailto:seungjohan.kr@gmail.com',          label: 'Email',    external: false },
  { href: 'https://github.com/seungjohan',            label: 'GitHub',   external: true },
];

export default function Layout() {
  const location  = useLocation();
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  // ── Scroll to top on every route change ────────────────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Inject GA4 / GTM / GSC scripts from localStorage config
  useEffect(() => {
    const gaId  = localStorage.getItem('sj_ga_id');
    const gtmId = localStorage.getItem('sj_gtm_id');
    const gscMeta = localStorage.getItem('sj_gsc_meta');

    if (gaId && !document.getElementById('sj-ga-script')) {
      const s = document.createElement('script');
      s.id  = 'sj-ga-script';
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s);
      const init = document.createElement('script');
      init.id = 'sj-ga-init';
      init.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
      document.head.appendChild(init);
    }

    if (gtmId && !document.getElementById('sj-gtm-script')) {
      const s = document.createElement('script');
      s.id   = 'sj-gtm-script';
      s.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
      document.head.appendChild(s);
      const ns = document.createElement('noscript');
      ns.id = 'sj-gtm-noscript';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = '0'; iframe.width = '0';
      iframe.style.cssText = 'display:none;visibility:hidden';
      ns.appendChild(iframe);
      document.body.prepend(ns);
    }

    if (gscMeta && !document.querySelector('meta[name="google-site-verification"]')) {
      const m = document.createElement('meta');
      m.name    = 'google-site-verification';
      m.content = gscMeta;
      document.head.appendChild(m);
    }
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toaster position="top-center" richColors />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AnchorNav />

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 bg-white transition-shadow duration-300
          ${scrolled ? 'shadow-[0_1px_0_rgba(0,0,0,0.08)]' : 'border-b border-gray-100'}`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

          {/* Left: Name */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            className="text-black hover:opacity-60 transition-opacity flex-shrink-0"
            style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}
          >
            Seungjo Han
          </Link>

          {/* Right: Desktop nav + actions */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ to, label, exact }) => (
              <Link
                key={to}
                to={to}
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                className={`transition-colors text-sm ${
                  isActive(to, exact)
                    ? 'text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {label}
              </Link>
            ))}

            <span className="w-px h-4 bg-gray-200" />

            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-500 hover:text-black transition-colors p-1"
              aria-label="Search"
              title="Search (⌘K)"
            >
              <Search size={17} />
            </button>

            <button
              onClick={copyLink}
              className="text-gray-500 hover:text-black transition-colors p-1"
              aria-label="Copy link"
              title="Copy link"
            >
              <Link2 size={17} />
            </button>
          </nav>

          {/* Mobile: search + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-500 hover:text-black transition-colors p-1"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={copyLink}
              className="text-gray-500 hover:text-black transition-colors p-1"
              aria-label="Copy link"
            >
              <Link2 size={18} />
            </button>
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="text-gray-700 hover:text-black transition-colors p-1"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-4">
                {NAV_LINKS.map(({ to, label, exact }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                    className={`text-sm transition-colors ${
                      isActive(to, exact) ? 'text-black' : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-4xl mx-auto px-6 pt-12 pb-8">

          {/* Top row: identity left · page+connect right */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-10 mb-12">

            {/* Left — identity */}
            <div>
              <p
                className="text-gray-900 mb-1"
                style={{ fontSize: '0.95rem', fontWeight: 400, letterSpacing: '-0.01em' }}
              >
                Seungjo Han
              </p>
              <p className="text-gray-400" style={{ fontSize: '0.82rem' }}>
                Product Manager
              </p>
              <div className="flex flex-col mt-1" style={{ gap: '0.2rem' }}>
                {['Writer', 'Composer', 'Triathlete', 'Multilingual learner'].map(t => (
                  <p key={t} className="text-gray-400" style={{ fontSize: '0.82rem' }}>{t}</p>
                ))}
              </div>
            </div>

            {/* Right — two link columns */}
            <div className="flex gap-12 sm:gap-16">

              {/* Pages column */}
              <div>
                <p
                  className="text-gray-400 uppercase mb-4"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
                >
                  Pages
                </p>
                <nav className="flex flex-col gap-2.5">
                  {FOOTER_PAGES.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                      className="text-gray-500 hover:text-black transition-colors"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Connect column */}
              <div>
                <p
                  className="text-gray-400 uppercase mb-4"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
                >
                  Connect
                </p>
                <nav className="flex flex-col gap-2.5">
                  {FOOTER_CONNECT.map(({ href, label, external }) => (
                    <a
                      key={label}
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      className="text-gray-500 hover:text-black transition-colors"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Bottom — copyright centered */}
          <div className="border-t border-gray-100 pt-6 flex justify-center">
            <p className="text-xs text-gray-400">
              © 2026 Seungjo Han. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
