import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { POSTS } from '../data/posts';
import { PROJECTS } from '../data/projects';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const normalizedQuery = query.trim().toLowerCase();

  const postResults = normalizedQuery.length > 0
    ? POSTS.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const projectResults = normalizedQuery.length > 0
    ? PROJECTS.filter(p =>
        p.title.toLowerCase().includes(normalizedQuery) ||
        p.client.toLowerCase().includes(normalizedQuery) ||
        p.description.toLowerCase().includes(normalizedQuery) ||
        p.tags.some(t => t.toLowerCase().includes(normalizedQuery))
      )
    : [];

  const hasResults = postResults.length > 0 || projectResults.length > 0;

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle handled by parent
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-[18vh] left-1/2 -translate-x-1/2 z-50
                       w-full max-w-xl mx-auto px-4"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <Search size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search posts, projects, topics..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-900 placeholder-gray-400 bg-transparent"
                  style={{ fontSize: '1rem' }}
                />
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Results */}
              {hasResults && (
                <div className="max-h-96 overflow-y-auto">
                  {postResults.length > 0 && (
                    <section>
                      <p className="px-5 pt-4 pb-2 text-[0.68rem] uppercase tracking-wider text-gray-400">
                        Posts
                      </p>
                      <ul className="divide-y divide-gray-50">
                        {postResults.map(post => (
                          <li key={post.slug}>
                            <button
                              onClick={() => handleSelect(`/blog/${post.slug}`)}
                              className="w-full text-left px-5 py-4 hover:bg-gray-50
                                         flex items-start gap-4 transition-colors group"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-900 group-hover:text-black truncate">
                                  {post.title}
                                </p>
                                <p className="text-sm text-gray-500 truncate mt-0.5">
                                  {post.date} · {post.readTime}
                                </p>
                              </div>
                              <ArrowRight
                                size={16}
                                className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-1 transition-colors"
                              />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {projectResults.length > 0 && (
                    <section>
                      <p className="px-5 pt-4 pb-2 text-[0.68rem] uppercase tracking-wider text-gray-400">
                        Projects
                      </p>
                      <ul className="divide-y divide-gray-50">
                        {projectResults.map(project => (
                          <li key={project.slug}>
                            <button
                              onClick={() => handleSelect(`/projects/${project.slug}`)}
                              className="w-full text-left px-5 py-4 hover:bg-gray-50
                                         flex items-start gap-4 transition-colors group"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-900 group-hover:text-black truncate">
                                  {project.title}
                                </p>
                                <p className="text-sm text-gray-500 truncate mt-0.5">
                                  {project.client} · {project.year}
                                </p>
                              </div>
                              <ArrowRight
                                size={16}
                                className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-1 transition-colors"
                              />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              )}

              {normalizedQuery.length > 0 && !hasResults && (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                  No results for "{query}"
                </div>
              )}

              {normalizedQuery.length === 0 && (
                <div className="px-5 py-4 text-xs text-gray-400 flex items-center justify-between">
                  <span>Search posts and projects</span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">K</kbd>
                    <span className="ml-1">to toggle</span>
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
