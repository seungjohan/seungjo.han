import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { POSTS, type Post } from '../data/posts';
import { motion } from 'motion/react';
import { getDraftPosts } from '../utils/draftStore';
import SEO from '../components/SEO';

const ALL_TAGS = ['Startup', 'Technology', 'Product', 'Design', 'Life', 'Korea', 'Identity', 'Travel'];

// "April 15, 2026" → "Apr 15, 2026"
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTags = searchParams.getAll('tag');
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState<Post[]>(POSTS);

  useEffect(() => {
    const drafts = getDraftPosts();
    const draftSlugs = new Set(drafts.map(d => d.slug));
    setAllPosts([...POSTS.filter(p => !draftSlugs.has(p.slug)), ...drafts]);
  }, []);

  const toggleTag = (tag: string) => {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter(selected => selected !== tag)
      : [...selectedTags, tag];

    const nextParams = new URLSearchParams();
    nextTags.forEach(selected => nextParams.append('tag', selected));
    setSearchParams(nextParams);
  };

  const filtered = selectedTags.length > 0
    ? allPosts.filter(p => selectedTags.every(tag => p.tags.includes(tag)))
    : allPosts;

  return (
    <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <SEO
        title="Blog"
        description="A man who hasn't figured out how to live his life yet, but is trying to make it as colorful and diverse as possible."
        path="/blog"
      />
      <h1 className="mb-2" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400 }}>
        Blog
      </h1>
      <div className="text-gray-500 mb-10 space-y-4" style={{ fontSize: '0.95rem' }}>
        <p>
          A man who hasn't figured out how to live his life yet, but is trying to make it as colorful and diverse as possible.
        </p>
        <p>
          My Personas: <br />Writer, Ex-founder, Dokdo security guard, Product manager, Software engineer, Multilingual learner (Korean, English, Español, and Français), Triathlete, Pianist, Composer, Gardener, Cook, Son, and Brother
        </p>
      </div>

      {/* Tag filter */}
      <div className="mb-12 flex flex-wrap gap-2">
        <button
          onClick={() => setSearchParams({})}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
            selectedTags.length === 0
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
          }`}
        >
          All
        </button>
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
              selectedTags.includes(tag)
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
        {filtered.map((post: Post, i: number) => {
          return (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div
                className="group block py-8 cursor-pointer"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  navigate(`/blog/${post.slug}`);
                }}
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

                {/* Meta row: date · tags                     magazine → */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 flex-wrap">
                    <time className="text-xs text-gray-400">{formatDate(post.date)}</time>
                    <span className="text-gray-200 text-xs">·</span>
                    <div className="flex gap-3">
                      {post.tags.slice(0, 3).map(tag => (
                        <button
                          key={tag}
                          onClick={e => { e.stopPropagation(); toggleTag(tag); }}
                          className="text-xs text-gray-400 hover:text-black transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
