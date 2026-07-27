import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { POSTS } from '../content/posts';
import { PROJECTS } from '../data/projects';
import { buildMeta, PERSON_JSON_LD } from '../components/SEO';

export const meta = () =>
  buildMeta({
    title: 'Seungjo Han - Product Manager, Republic of Korea',
    description:
      'Product manager and builder in Korea with selected work across startups, product strategy, software, and global market research.',
    path: '/',
    jsonLd: [PERSON_JSON_LD],
  });

// ─── Pillars — three powerful "why" blocks ────────────────────────────────────
const PILLARS = [
  {
    label: 'Entrepreneur',
    headline: 'I build to solve real problems.',
    body: 'Founded a B2B2C startup from scratch. Validated, shipped, and iterated with real customers — not just mockups.',
  },
  {
    label: 'Technologist',
    headline: 'I speak the language of code.',
    body: 'Software background in CS + entrepreneurship. I sit at the table with engineers and move at the speed of the team.',
  },
  {
    label: 'Global Builder',
    headline: "I've shipped across three continents.",
    body: 'Built products with teams in the US, Kazakhstan, and Europe. Comfortable in ambiguity, fast in alignment.',
  },
  {
    label: 'Hands-on Mindset',
    headline: 'I act, not just advise.',
    body: 'I am curious about business opportunities, and solve problems through projects, meeting customers, and taking action.',
  },
];

const STATS = [
  { number: '10M+', label: 'Users Impacted' },
  { number: '12+',  label: 'Products Shipped' },
  { number: '6',    label: 'Years Building' },
  { number: '500+', label: 'Customer Interviews' },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Home() {
  const navigate       = useNavigate();
  const projects       = PROJECTS.slice(0, 3);
  const posts          = POSTS.slice(0, 3);

  return (
    <div>
      {/* ══════════════════════════════════════════════════════════════════
          HERO — bold, declarative, YC-style
      ══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 pt-24 md:pt-36 pb-20 md:pb-28">

        <motion.p
          className="text-gray-400 mb-6 uppercase"
          style={{ fontSize: '0.68rem', letterSpacing: '0.14em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Product Manager · Republic of Korea
        </motion.p>

        {/* Primary statement — the largest text on the page */}
        <motion.h1
          className="text-gray-900 mb-6"
          style={{
            fontSize: 'clamp(2.4rem, 6.5vw, 4.8rem)',
            fontWeight: 500,
            lineHeight: 1.04,
            letterSpacing: '-0.035em',
          }}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          I build products<br />
          from&nbsp;0&nbsp;to&nbsp;1.
        </motion.h1>

        <motion.p
          className="text-gray-500 max-w-lg mb-10 leading-relaxed"
          style={{ fontSize: '1.05rem' }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          Product Manager obsessed with shipping things that actually matter —
          across mobile, payments, and platforms, with 10M+ users impacted.
        </motion.p>

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white
                       rounded-full text-sm hover:bg-gray-800 transition-colors"
          >
            See my work <ArrowRight size={13} />
          </Link>
          <Link
            to="/about"
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            About me →
          </Link>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════════════════════════ */}
      <div className="border-y border-gray-100 bg-gray-50/40">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="text-center md:text-left"
              >
                <p
                  className="text-gray-900 mb-0.5"
                  style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 500, letterSpacing: '-0.03em' }}
                >
                  {s.number}
                </p>
                <p className="text-gray-500 uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          THREE PILLARS — the "why me" section
      ══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-28 border-b border-gray-100">
        <motion.p
          className="text-gray-500 uppercase mb-12"
          style={{ fontSize: '0.68rem', letterSpacing: '0.14em' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          What I bring
        </motion.p>

        <div className="grid grid-cols-2 gap-10 md:gap-12">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className="text-gray-500 uppercase mb-3"
                style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
              >
                {p.label}
              </p>
              <p
                className="text-gray-900 mb-3 leading-snug"
                style={{ fontSize: '1.1rem', fontWeight: 500, letterSpacing: '-0.01em' }}
              >
                {p.headline}
              </p>
              <p className="text-gray-500 leading-relaxed" style={{ fontSize: '0.9rem' }}>
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PROJECTS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-20 border-b border-gray-100">
        <div className="flex items-baseline justify-between mb-10">
          <motion.p
            className="text-gray-500 uppercase"
            style={{ fontSize: '0.68rem', letterSpacing: '0.14em' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Projects
          </motion.p>
          <Link
            to="/projects"
            className="text-xs text-gray-500 hover:text-black transition-colors"
          >
            All projects →
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={`/projects/${project.slug}`}
                className="group flex items-start justify-between py-5 gap-6"
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="text-gray-900 group-hover:text-black transition-colors mb-1"
                    style={{ fontSize: '0.95rem', fontWeight: 400 }}
                  >
                    {project.title}
                  </p>
                  <p className="text-gray-400 line-clamp-1" style={{ fontSize: '0.8rem' }}>
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center gap-5 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-300">{project.year}</p>
                    <p className="text-xs text-gray-300 mt-0.5">{project.client}</p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-gray-300 group-hover:text-black transition-colors"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          WRITING
      ══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-20 border-b border-gray-100">
        <div className="flex items-baseline justify-between mb-10">
          <motion.p
            className="text-gray-500 uppercase"
            style={{ fontSize: '0.68rem', letterSpacing: '0.14em' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Writing
          </motion.p>
          <Link
            to="/blog"
            className="text-xs text-gray-500 hover:text-black transition-colors"
          >
            All posts →
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group flex items-baseline justify-between py-5 gap-6 cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                navigate(`/blog/${post.slug}`);
              }}
            >
              <div className="min-w-0 flex-1">
                <p
                  className="text-gray-900 group-hover:text-black transition-colors mb-1"
                  style={{ fontSize: '0.95rem', fontWeight: 400 }}
                >
                  {post.title}
                </p>
                <p className="text-gray-400 line-clamp-1" style={{ fontSize: '0.8rem' }}>
                  {post.excerpt}
                </p>
              </div>
              <time className="text-xs text-gray-300 flex-shrink-0">{formatDate(post.date)}</time>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CONTACT — bold closer, YC-style
      ══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65 }}
        >
          <h2
            className="text-gray-900 mb-5"
            style={{
              fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            Let's build something<br className="hidden md:block" /> worth making.
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm leading-relaxed" style={{ fontSize: '0.95rem' }}>
            Open to PM roles, advisory work, and interesting conversations.
            I respond to every email.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:seungjohan.kr@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white
                         rounded-full text-sm hover:bg-gray-800 transition-colors"
            >
              Email me
            </a>
            <a
              href="https://www.linkedin.com/in/seungjohan/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200
                         text-gray-700 rounded-full text-sm hover:border-gray-400 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
