import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MAGAZINES } from '../data/magazines';
import { POSTS } from '../data/posts';
import SEO from '../components/SEO';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MagazineDetail() {
  const { slug }   = useParams<{ slug: string }>();
  const navigate   = useNavigate();
  const magazine   = MAGAZINES.find(m => m.slug === slug);

  if (!magazine) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-gray-500 mb-4">Magazine not found.</p>
        <Link to="/magazine" className="text-black underline underline-offset-4 text-sm">
          ← Back to Magazine
        </Link>
      </div>
    );
  }

  const posts = magazine.postSlugs
    .map(s => POSTS.find(p => p.slug === s))
    .filter(Boolean) as typeof POSTS;

  return (
    <div className="bg-white">
      <SEO
        title={magazine.name}
        description={magazine.description}
        path={`/magazine/${magazine.slug}`}
        image={magazine.cover}
      />

      {/* ── Hero ── */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img
          src={magazine.cover}
          alt={magazine.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end max-w-4xl mx-auto px-6 pb-8">
          <Link
            to="/magazine"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white
                       transition-colors text-sm mb-5"
          >
            <ArrowLeft size={14} /> Magazine
          </Link>
          <p
            className="text-white/60 uppercase mb-2"
            style={{ fontSize: '0.65rem', letterSpacing: '0.14em' }}
          >
            {posts.length} {posts.length === 1 ? 'essay' : 'essays'}
          </p>
          <h1
            className="text-white"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 400, letterSpacing: '-0.02em' }}
          >
            {magazine.name}
          </h1>
        </div>
      </div>

      {/* ── Post list ── */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-gray-500 mb-10 max-w-lg leading-relaxed" style={{ fontSize: '0.95rem' }}>
          {magazine.description}
        </p>

        <div className="divide-y divide-gray-100">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group flex items-center gap-5 py-6 cursor-pointer"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              {/* Issue number */}
              <span
                className="text-gray-200 flex-shrink-0 tabular-nums"
                style={{ fontSize: '0.75rem', minWidth: '1.5rem' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Thumbnail */}
              {post.coverImage && (
                <div className="w-16 h-11 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-gray-900 group-hover:text-black transition-colors"
                  style={{ fontSize: '0.95rem', fontWeight: 400 }}
                >
                  {post.title}
                </p>
                <p className="text-gray-400 mt-0.5" style={{ fontSize: '0.8rem' }}>
                  {formatDate(post.date)} · {post.readTime}
                </p>
              </div>

              <ArrowRight
                size={14}
                className="text-gray-300 group-hover:text-black flex-shrink-0 transition-colors"
              />
            </motion.div>
          ))}
        </div>

        {/* ── Other magazines ── */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p
            className="text-gray-400 uppercase mb-6"
            style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}
          >
            Other series
          </p>
          <div className="flex flex-wrap gap-3">
            {MAGAZINES.filter(m => m.slug !== slug).map(m => (
              <Link
                key={m.slug}
                to={`/magazine/${m.slug}`}
                className="px-4 py-2 rounded-full border border-gray-200 text-sm
                           text-gray-600 hover:border-gray-900 hover:text-black transition-colors"
              >
                {m.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
