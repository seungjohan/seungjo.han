import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { Menu, X, Search, Link2, Github, Mail, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { SearchModal } from './SearchModal';
import { AnchorNav } from './AnchorNav';

const NAV_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
];

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  // Header shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  // Cmd+K to open search
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

  const handleShare = async () => {
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
                className={`transition-colors text-sm ${
                  isActive(to, exact)
                    ? 'text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Divider */}
            <span className="w-px h-4 bg-gray-200" />

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-500 hover:text-black transition-colors p-1"
              aria-label="Search"
              title="Search (⌘K)"
            >
              <Search size={17} />
            </button>

            {/* Share current link */}
            <button
              onClick={handleShare}
              className="text-gray-500 hover:text-black transition-colors p-1"
              aria-label="Share current page"
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
                    className={`text-sm transition-colors ${
                      isActive(to, exact) ? 'text-black' : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-sm text-gray-500 text-left"
                >
                  <Link2 size={14} /> Copy page link
                </button>
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
        {/* Nav links — centered */}
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-6 flex justify-center">
          <nav className="flex items-center gap-6 flex-wrap justify-center">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright + Socials — same row, no divider */}
        <div className="max-w-6xl mx-auto px-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © 2026 Seungjo Han. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-black transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-black transition-colors"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="mailto:hello@seungjohan.com"
              className="text-gray-400 hover:text-black transition-colors"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}