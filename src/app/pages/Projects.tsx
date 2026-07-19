import { Link, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Mail, Linkedin } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PROJECTS, type Project } from '../data/projects';
import { buildMeta } from '../components/SEO';

export const meta = () =>
  buildMeta({
    title: 'Projects',
    description: 'Selected product, startup, software, and market research work by Seungjo Han.',
    path: '/projects',
  });

// ─── Top stats (hero) ─────────────────────────────────────────────────────────
const HERO_STATS = [
  { number: '6',    label: 'Years of Experience' },
  { number: '10M+', label: 'Users Impacted' },
  { number: '12+',  label: 'Products Shipped' },
];

// ─── Bottom stats ─────────────────────────────────────────────────────────────
const BOTTOM_STATS = [
  { number: '15+', label: 'Partner Integrations Delivered' },
  { number: '88%', label: 'Engineering Team Retention Rate' },
  { number: '5',   label: 'App Stores Shipped Simultaneously' },
];

// ─── Skill set ────────────────────────────────────────────────────────────────
const SKILLS: { category: string; items: string[] }[] = [
  {
    category: 'Software',
    items: ['JavaScript', 'TypeScript', 'React', 'Python', 'Node.js', 'SQL', 'REST APIs', 'Git'],
  },
  {
    category: 'Product Management',
    items: ['User Research', 'Roadmapping', 'OKRs', 'Sprint Planning', 'A/B Testing', 'Stakeholder Management'],
  },
  {
    category: 'Language',
    items: ['Korean (Native)', 'English (Fluent)', 'Spanish (Conversational)', 'French (Beginner)'],
  },
  {
    category: 'Analytics',
    items: ['Google Analytics', 'Mixpanel', 'SQL', 'Funnel Analysis', 'Data Visualization'],
  },
  {
    category: 'Design',
    items: ['Figma', 'Design Systems', 'Wireframing', 'Prototyping', 'User Flows', 'Typography'],
  },
];

// ─── Image cycling card ───────────────────────────────────────────────────────
function ProjectCard({ project, selectedTags, onTagClick, index }: {
  project: Project;
  selectedTags: string[];
  onTagClick: (tag: string) => void;
  index: number;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = project.images ?? [project.coverImage];

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setImgIndex(i => (i + 1) % images.length);
    }, 2000);
    return () => clearInterval(id);
  }, [images.length]);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex(i => (i - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex(i => (i + 1) % images.length);
  };

  return (
    <motion.div
      id={`project-${project.slug}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors"
      style={{ scrollMarginTop: '90px' }}
    >
      {/* Cover image — cycling */}
      <Link to={`/projects/${project.slug}`} className="group block">
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/8' }}>
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{ opacity: i === imgIndex ? 1 : 0 }}
            />
          ))}

          {/* Left / Right arrows — vertically centered */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10
                           flex items-center justify-center w-7 h-7 rounded-full
                           bg-black/20 hover:bg-black/40
                           text-white transition-all duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10
                           flex items-center justify-center w-7 h-7 rounded-full
                           bg-black/20 hover:bg-black/40
                           text-white transition-all duration-200"
                aria-label="Next image"
              >
                <ChevronRight size={15} />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: i === imgIndex ? 16 : 6,
                    height: 6,
                    backgroundColor: i === imgIndex ? 'white' : 'rgba(255,255,255,0.45)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Card body */}
      <div className="p-8">
        {/* Keyword tag badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                selectedTags.includes(tag)
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Title + link */}
        <div className="flex items-start justify-between gap-4 mb-1">
          <h2 className="text-gray-900" style={{ fontSize: '1.4rem', fontWeight: 400, letterSpacing: '-0.01em' }}>
            {project.title}
          </h2>
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-black transition-colors flex-shrink-0 mt-1"
          >
            View project <ArrowRight size={13} />
          </Link>
        </div>
        <p className="text-xs text-gray-400 mb-8">{project.client} · {project.year}</p>

        {/* Impact */}
        <div className="mb-7">
          <p className="text-gray-400 uppercase tracking-wider mb-2.5" style={{ fontSize: '0.68rem' }}>📝&nbsp; Impact</p>
          <p className="text-gray-700 leading-relaxed" style={{ fontSize: '0.95rem' }}>{project.impact}</p>
        </div>

        {/* What I Did */}
        <div className="mb-7">
          <p className="text-gray-400 uppercase tracking-wider mb-2.5" style={{ fontSize: '0.68rem' }}>🔧&nbsp; What I Did</p>
          <p className="text-gray-700 leading-relaxed mb-4" style={{ fontSize: '0.95rem' }}>{project.whatIDid}</p>
          <ul className="space-y-2.5">
            {project.whatIDidBullets.map((bullet, bi) => (
              <li key={bi} className="flex items-start gap-3">
                <span className="text-gray-400 flex-shrink-0 mt-0.5" style={{ fontSize: '0.85rem' }}>→</span>
                <span className="text-gray-600 leading-relaxed" style={{ fontSize: '0.9rem' }}>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Outcome */}
        <div>
          <p className="text-gray-400 uppercase tracking-wider mb-2.5" style={{ fontSize: '0.68rem' }}>✅&nbsp; Outcome</p>
          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-gray-900 leading-relaxed" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
              {project.outcome}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Projects page ───────────────────────────────────────────────────────
export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTags = searchParams.getAll('tag');
  const allProjects = PROJECTS;

  const setTag = (tag: string) => {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter(selected => selected !== tag)
      : [...selectedTags, tag];

    const nextParams = new URLSearchParams();
    nextTags.forEach(selected => nextParams.append('tag', selected));
    setSearchParams(nextParams);
  };

  const filtered = selectedTags.length > 0
    ? allProjects.filter(project => selectedTags.every(tag => project.tags.includes(tag)))
    : allProjects;
  const projectKeywords = useMemo(
    () => Array.from(new Set(allProjects.flatMap(project => project.tags))).sort((a, b) => a.localeCompare(b)),
    [allProjects]
  );

  return (
    <section className="max-w-4xl mx-auto px-6">
      {/* ══════════════════════════════════════════════════════════════════
          HERO — inspired by alessandrakrick.com/product-management
      ══════════════════════════════════════════════════════════════════ */}
      <div className="pt-16 md:pt-24 pb-14 md:pb-18 border-b border-gray-100">

        {/* Label */}
        <motion.p
          className="text-gray-400 mb-6"
          style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Product Manager Portfolio
        </motion.p>

        {/* Headline */}
        <motion.h1
          className="text-gray-900 mb-5"
          style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
            fontWeight: 300,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          I build products from 0 to 1.
        </motion.h1>

        {/* Tags inline */}
        <motion.p
          className="text-gray-400 mb-12"
          style={{ fontSize: '0.9rem' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        >
          10M+ users platforms&nbsp;&nbsp;·&nbsp;&nbsp;Payments&nbsp;&nbsp;·&nbsp;&nbsp;Mobile&nbsp;&nbsp;·&nbsp;&nbsp;Stakeholder Management&nbsp;&nbsp;·&nbsp;&nbsp;B2B + B2C
        </motion.p>

        {/* Hero stats */}
        <motion.div
          className="grid grid-cols-3 gap-0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`${i !== 0 ? 'border-l border-gray-100 pl-8' : ''} ${i !== HERO_STATS.length - 1 ? 'pr-8' : ''}`}
            >
              <p
                className="text-gray-900 mb-1"
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                  fontWeight: 300,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {s.number}
              </p>
              <p
                className="text-gray-400 uppercase"
                style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURED CASE STUDIES intro
      ══════════════════════════════════════════════════════════════════ */}
      <div className="pt-14 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-gray-900 mb-3"
            style={{ fontSize: '1.35rem', fontWeight: 400, letterSpacing: '-0.01em' }}
          >
            Featured case studies
          </h2>
          <p className="text-gray-500 max-w-lg leading-relaxed" style={{ fontSize: '0.95rem' }}>
            Three deep dives into products I've owned end-to-end — plus two more projects below.
          </p>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          PROJECT SUMMARY LINKS
      ══════════════════════════════════════════════════════════════════ */}
      <div className="pb-10">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.04 }}
        >
          {allProjects.map(project => (
            <a
              key={project.slug}
              href={`#project-${project.slug}`}
              className="group grid gap-1 sm:grid-cols-[12rem_1fr] sm:gap-6"
            >
              <span className="block text-gray-900 group-hover:underline underline-offset-4" style={{ fontSize: '0.92rem', fontWeight: 500 }}>
                {project.title}
              </span>
              <span className="block text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors" style={{ fontSize: '0.82rem' }}>
                {project.description}
              </span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          KEYWORD TAGS
      ══════════════════════════════════════════════════════════════════ */}
      <div className="pb-12">
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          {projectKeywords.map(kw => (
            <button
              key={kw}
              onClick={() => setTag(kw)}
              className={`px-4 py-1.5 rounded-full border transition-colors ${
                selectedTags.includes(kw)
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900'
              }`}
              style={{ fontSize: '0.8rem' }}
            >
              {kw}
            </button>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          PROJECT LIST
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-6 mb-24">
        {filtered.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            selectedTags={selectedTags}
            onTagClick={setTag}
            index={i}
          />
        ))}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 mb-3" style={{ fontSize: '0.95rem' }}>
              No projects match the selected keywords.
            </p>
            <button
              onClick={() => setSearchParams({})}
              className="text-sm text-black underline underline-offset-4"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SKILLS & TOOLS
      ══════════════════════════════════════════════════════════════════ */}
      <div className="border-t border-gray-100 pt-16 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2
            className="text-gray-900 mb-3"
            style={{ fontSize: '1.35rem', fontWeight: 400, letterSpacing: '-0.01em' }}
          >
            Skills &amp; Tools
          </h2>
          <p className="text-gray-500 max-w-md leading-relaxed" style={{ fontSize: '0.95rem' }}>
            The mix I use to take products from discovery, through delivery, to measurable impact.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {SKILLS.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">{cat.category}</p>
              <ul className="space-y-2">
                {cat.items.map(skill => (
                  <li key={skill} className="text-sm text-gray-700">{skill}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          BOTTOM STATS + CTA
      ══════════════════════════════════════════════════════════════════ */}
      <div className="border-t border-gray-100 pt-16 pb-24">

        {/* Bottom stats */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-0 mb-20"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
        >
          {BOTTOM_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`${i !== 0 ? 'sm:border-l sm:border-gray-100 sm:pl-8' : ''} ${i !== BOTTOM_STATS.length - 1 ? 'sm:pr-8' : ''}`}
            >
              <p
                className="text-gray-900 mb-2"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                  fontWeight: 300,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {s.number}
              </p>
              <p
                className="text-gray-400 uppercase leading-tight"
                style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2
            className="text-gray-900 mb-8"
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
              fontWeight: 300,
              letterSpacing: '-0.025em',
            }}
          >
            Let's build something impactful.
          </h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:seungjohan.kr@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white
                         rounded-full text-sm hover:bg-gray-800 transition-colors"
            >
              <Mail size={14} />
              Email Me
            </a>
            <a
              href="https://www.linkedin.com/in/seungjohan/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200
                         text-gray-700 rounded-full text-sm hover:border-gray-400 transition-colors"
            >
              <Linkedin size={14} />
              LinkedIn
            </a>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
