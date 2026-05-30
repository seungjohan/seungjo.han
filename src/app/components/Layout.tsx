import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { Menu, X, Search, Share2, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { SearchModal } from './SearchModal';
import { AnchorNav } from './AnchorNav';

const NAV_LINKS = [
  { to: '/',         label: 'Home',     exact: true },
  { to: '/about',    label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog',     label: 'Blog' },
  { to: '/magazine', label: 'Magazine' },
];

const FOOTER_PAGES = [
  { to: '/',         label: 'Home' },
  { to: '/about',    label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog',     label: 'Blog' },
  { to: '/magazine', label: 'Magazine' },
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
  const [shareOpen,   setShareOpen]   = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

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

  // Close share popover on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
      setShareOpen(false);
    } catch {
      toast.error('Could not copy link');
    }
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(document.title || 'Seungjo Han');

  const SHARE_OPTIONS = [
    {
      label: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      label: 'Copy link',
      onClick: copyLink,
      icon: <Link2 size={14} />,
    },
  ];

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

            <div className="relative" ref={shareRef}>
              <button
                onClick={() => setShareOpen(v => !v)}
                className="text-gray-500 hover:text-black transition-colors p-1"
                aria-label="Share"
                title="Share"
              >
                <Share2 size={17} />
              </button>

              <AnimatePresence>
                {shareOpen && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
                    style={{ minWidth: 160 }}
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    {SHARE_OPTIONS.map(opt => (
                      opt.onClick ? (
                        <button
                          key={opt.label}
                          onClick={opt.onClick}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors text-left"
                        >
                          <span className="text-gray-400">{opt.icon}</span>
                          {opt.label}
                        </button>
                      ) : (
                        <a
                          key={opt.label}
                          href={opt.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShareOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                        >
                          <span className="text-gray-400">{opt.icon}</span>
                          {opt.label}
                        </a>
                      )
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                <div className="flex flex-col gap-1 pt-1 border-t border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Share</p>
                  {SHARE_OPTIONS.map(opt => (
                    opt.onClick ? (
                      <button
                        key={opt.label}
                        onClick={opt.onClick}
                        className="flex items-center gap-2 text-sm text-gray-500 text-left py-1"
                      >
                        <span className="text-gray-400">{opt.icon}</span>
                        {opt.label}
                      </button>
                    ) : (
                      <a
                        key={opt.label}
                        href={opt.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-500 py-1"
                      >
                        <span className="text-gray-400">{opt.icon}</span>
                        {opt.label}
                      </a>
                    )
                  ))}
                </div>
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
                {['Author', 'Composer', 'Triathlete', 'Polyglot'].map(t => (
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