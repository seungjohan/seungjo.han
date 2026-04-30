import { Link, useSearchParams } from 'react-router';
import { POSTS } from '../data/posts';
import { motion } from 'motion/react';

const ALL_TAGS = ['Design', 'Technology', 'Culture', 'Creativity', 'Product'];

// "April 15, 2026" → "Apr 15, 2026"
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag');

  const setTag = (tag: string | null) => {
    if (tag) setSearchParams({ tag });
    else setSearchParams({});
  };

  const filtered = selectedTag
    ? POSTS.filter(p => p.tags.includes(selectedTag))
    : POSTS;

  return (
    <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="mb-2" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400 }}>
        Writing
      </h1>
      <p className="text-gray-500 mb-10" style={{ fontSize: '0.95rem' }}>
        Thoughts on design, technology, and creative life.
      </p>

      {/* Tag filter */}
      <div className="mb-12 flex flex-wrap gap-2">
        <button
          onClick={() => setTag(null)}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
            !selectedTag
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
          }`}
        >
          All
        </button>
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setTag(tag)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
              selectedTag === tag
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Post list */}
      <div className="divide-y divide-gray-100">
        {filtered.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              to={`/blog/${post.slug}`}
              className="group block py-8"
            >
              <h2
                className="text-gray-900 group-hover:text-black mb-2 transition-colors"
                style={{ fontSize: '1.1rem', fontWeight: 400 }}
              >
                {post.title}
              </h2>
              <p className="text-gray-500 mb-4 leading-relaxed" style={{ fontSize: '0.9rem' }}>
                {post.excerpt}
              </p>
              {/* Meta: date first, then tags (no hashtag) */}
              <div className="flex items-center gap-3 flex-wrap">
                <time className="text-xs text-gray-400">{formatDate(post.date)}</time>
                <span className="text-gray-200 text-xs">·</span>
                <div className="flex gap-3">
                  {post.tags.slice(0, 3).map(tag => (
                    <button
                      key={tag}
                      onClick={e => { e.preventDefault(); setTag(tag); }}
                      className="text-xs text-gray-400 hover:text-black transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}