import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

interface Anchor {
  id: string;
  text: string;
  level: number;
}

export function AnchorNav() {
  const location = useLocation();
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Scan DOM for headings whenever route changes
  useEffect(() => {
    const scan = () => {
      const els = document.querySelectorAll('article h2[id], article h3[id], article h4[id]');
      const found: Anchor[] = Array.from(els).map(el => ({
        id: el.id,
        text: el.textContent?.trim() || '',
        level: parseInt(el.tagName[1]),
      }));
      setAnchors(found);
    };

    // Give the page a moment to render
    const t = setTimeout(scan, 120);
    return () => clearTimeout(t);
  }, [location.pathname]);

  // IntersectionObserver for active heading
  useEffect(() => {
    if (anchors.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one closest to the top
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(topmost.target.id);
        }
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    );

    anchors.forEach(a => {
      const el = document.getElementById(a.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [anchors]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Only show when there are 2+ anchors
  if (anchors.length < 2) return null;

  return (
    <AnimatePresence>
      <motion.nav
        className="fixed right-6 top-1/2 -translate-y-1/2 z-30
                   hidden xl:flex flex-col gap-2.5 max-w-[210px]"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />

        {anchors.map(anchor => {
          const isActive = activeId === anchor.id;
          return (
            <button
              key={anchor.id}
              onClick={() => scrollTo(anchor.id)}
              className={`relative text-left transition-colors duration-200 leading-snug
                ${anchor.level === 1 ? 'pl-4' : ''}
                ${anchor.level === 2 ? 'pl-6' : ''}
                ${anchor.level === 3 ? 'pl-9' : ''}
                ${anchor.level >= 4 ? 'pl-12' : ''}
                ${isActive ? 'text-black' : 'text-gray-400 hover:text-plum'}`}
              style={{ fontSize: anchor.level === 1 ? '0.76rem' : '0.72rem' }}
            >
              {/* Active dot */}
              <motion.span
                className="absolute left-[-3px] top-1/2 -translate-y-1/2
                           w-1.5 h-1.5 rounded-full bg-black"
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <span className="block max-w-[180px] truncate">
                {anchor.text}
              </span>
            </button>
          );
        })}
      </motion.nav>
    </AnimatePresence>
  );
}
