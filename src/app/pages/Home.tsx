import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { POSTS } from '../data/posts';
import { PROJECTS } from '../data/projects';

const STATS = [
  { number: '2+', label: 'Years of Experience' },
  { number: '10+', label: 'Technical Projects Completed' },
  { number: '500+', label: 'Customers Interviewed in Person' },
];

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [email, setEmail] = useState('');
  const featuredProjects = PROJECTS.slice(0, 2);
  const recentPosts = POSTS.slice(0, 3);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You're subscribed!");
    setEmail('');
  };

  return (
    <div className="max-w-4xl mx-auto px-6">

      {/* ── HERO INTRO ─────────────────────────────────────────────────── */}
      <section className="pt-20 md:pt-32 pb-20 md:pb-28 border-b border-gray-100">
        <motion.p
          className="text-gray-400 tracking-widest uppercase mb-5"
          style={{ fontSize: '0.7rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Designer &amp; Writer · Seoul
        </motion.p>
        <motion.h1
          className="text-gray-900 mb-6 max-w-2xl"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            fontWeight: 400,
            lineHeight: 1.14,
            letterSpacing: '-0.025em',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          I design products people<br />
          actually want to use,{' '}
          <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>and write</span>
          <br />about why that matters.
        </motion.h1>
        <motion.p
          className="text-gray-500 max-w-xl leading-relaxed mb-8"
          style={{ fontSize: '1rem' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          I work at the intersection of design, technology, and storytelling —
          building digital experiences from first principles and sharing what I learn along the way.
        </motion.p>
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
        >
          <Link
            to="/projects"
            className="px-5 py-2.5 bg-black text-white rounded-full text-sm
                       hover:bg-gray-800 transition-colors"
          >
            View Projects
          </Link>
          <Link
            to="/about"
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-full text-sm
                       hover:border-gray-400 transition-colors"
          >
            About me
          </Link>
        </motion.div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 border-b border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x sm:divide-gray-100">
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08} className="sm:px-8 first:pl-0 last:pr-0">
              <p
                className="text-gray-900 mb-1"
                style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 400, letterSpacing: '-0.03em' }}
              >
                {s.number}
              </p>
              <p className="text-gray-500" style={{ fontSize: '0.85rem' }}>{s.label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── FEATURED PROJECTS — 2 per row ────────────────────────────────── */}
      <section className="py-16 md:py-20 border-b border-gray-100">
        <FadeIn className="flex items-baseline justify-between mb-10">
          <h2 style={{ fontSize: '1rem', fontWeight: 500 }}>Selected Projects</h2>
          <Link
            to="/projects"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors"
          >
            All projects <ArrowRight size={14} />
          </Link>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-5">
          {featuredProjects.map((project, i) => (
            <FadeIn key={project.slug} delay={i * 0.08}>
              <Link
                to={`/projects/${project.slug}`}
                className="group block rounded-xl border border-gray-100 overflow-hidden
                           hover:border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03]
                               transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3
                    className="text-gray-900 group-hover:text-black transition-colors leading-snug mb-1"
                    style={{ fontSize: '1rem', fontWeight: 400 }}
                  >
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">{project.client} · {project.year}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── RECENT BLOG POSTS ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 border-b border-gray-100">
        <FadeIn className="flex items-baseline justify-between mb-10">
          <h2 style={{ fontSize: '1rem', fontWeight: 500 }}>Recent Writing</h2>
          <Link
            to="/blog"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors"
          >
            All posts <ArrowRight size={14} />
          </Link>
        </FadeIn>

        <div className="divide-y divide-gray-100">
          {recentPosts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.06}>
              <Link
                to={`/blog/${post.slug}`}
                className="group block py-6"
              >
                <h3
                  className="text-gray-900 group-hover:text-black transition-colors mb-2"
                  style={{ fontSize: '1rem', fontWeight: 400 }}
                >
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <time className="text-xs text-gray-400">{post.date}</time>
                  <span className="text-gray-200 text-xs">·</span>
                  <div className="flex gap-2">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs text-gray-400">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── LET'S CONNECT ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 mb-8">
        <FadeIn>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-5">Get in touch</p>
          <h2
            className="text-gray-900 mb-4 max-w-md"
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Let's build something worth making.
          </h2>
          <p className="text-gray-500 leading-relaxed mb-8 max-w-sm" style={{ fontSize: '0.95rem' }}>
            Whether you have a project in mind, want to collaborate, or just want to say hello —
            I'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:hello@seungjohan.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white
                         rounded-full text-sm hover:bg-gray-800 transition-colors"
            >
              hello@seungjohan.com
            </a>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Subscribe to my writing"
                className="px-5 py-2.5 border border-gray-200 rounded-full text-sm outline-none
                           focus:border-gray-400 transition-colors placeholder-gray-400 w-52"
              />
              <button
                type="submit"
                className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-full text-sm
                           hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}
