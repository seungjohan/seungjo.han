import { Link } from 'react-router';
import { ArrowLeft, SearchX } from 'lucide-react';
import { buildMeta } from '../components/SEO';

export const meta = () =>
  buildMeta({
    title: 'Page Not Found - Seungjo Han',
    description: 'The page you are looking for does not exist.',
    path: '/404',
    // This page is served for every unmatched URL. Without noindex, each of those
    // URLs becomes an indexable page; 'follow' still lets crawlers use the links
    // back into the real site.
    robots: 'noindex, follow',
  });

export default function NotFound() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-24 md:py-32 text-center">
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <SearchX size={22} strokeWidth={1.5} />
      </div>
      <p className="mb-3 text-xs uppercase tracking-[0.14em] text-gray-400">404</p>
      <h1 className="mb-4 text-gray-900" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 400 }}>
        Page not found
      </h1>
      <p className="mx-auto mb-8 max-w-md leading-relaxed text-gray-500" style={{ fontSize: '0.95rem' }}>
        This URL does not match an existing page. Start again from the portfolio or writing index.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm text-white transition-colors hover:bg-gray-800"
      >
        <ArrowLeft size={15} strokeWidth={1.5} />
        Back home
      </Link>
    </section>
  );
}
