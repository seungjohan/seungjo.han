import { Link, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Mail, Linkedin } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PROJECTS, galleryFor, imageAlt, type Project } from '../content/projects';
import { buildMeta } from '../components/SEO';
import ProjectNarrative from '../components/ProjectNarrative';

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
  const images = galleryFor(project);

  // Auto-advance on the same 5s cadence as the detail page, so a reader who sees
  // both does not meet two different behaviours. It pauses on hover and on
  // keyboard focus, honours prefers-reduced-motion, and stops when the tab is
  // hidden. Six cards do run at once here, which is why the pause matters.
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    if (paused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => {
      if (document.hidden) return;
      setImgIndex(i => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, [images.length, paused]);

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
      {/* Cover image — the Link wraps ONLY the image. The gallery controls are
          siblings, not children: a <button> inside an <a> is invalid HTML, the
          same nesting class this repo already fixed once for <a> inside <a>.
          One fixed frame for every card so the grid never reflows as images
          cycle, and cover so the image always fills it with no empty space. */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '16/8' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <Link to={`/projects/${project.slug}`} className="group block absolute inset-0">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={i === imgIndex ? imageAlt(project, i, images.length) : ''}
              loading={index === 0 && i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                project.imageFit === 'contain' ? 'object-contain' : 'object-cover'
              }`}
              style={{ opacity: i === imgIndex ? 1 : 0 }}
            />
          ))}
        </Link>

        {/* Left / Right arrows — vertically centered */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="on-media absolute left-1 top-1/2 -translate-y-1/2 z-10
                         flex items-center justify-center w-11 h-11 text-white"
              aria-label="Previous image"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 transition-all duration-200">
                <ChevronLeft size={15} />
              </span>
            </button>
            <button
              type="button"
              onClick={next}
              className="on-media absolute right-1 top-1/2 -translate-y-1/2 z-10
                         flex items-center justify-center w-11 h-11 text-white"
              aria-label="Next image"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 transition-all duration-200">
                <ChevronRight size={15} />
              </span>
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex z-10">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={e => { e.preventDefault(); setImgIndex(i); }}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === imgIndex}
                className="on-media flex items-center justify-center w-6 h-11"
              >
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: i === imgIndex ? 16 : 6,
                    height: 6,
                    backgroundColor: i === imgIndex ? 'white' : 'rgba(255,255,255,0.45)',
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

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
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-plum'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Title + link */}
        <div className="flex items-start justify-between gap-4 mb-1">
          <h2 className="font-serif text-gray-900" style={{ fontSize: '1.4rem', fontWeight: 400, letterSpacing: '-0.01em' }}>
            {project.title}
          </h2>
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-plum transition-colors flex-shrink-0 mt-1"
          >
            View project <ArrowRight size={13} />
          </Link>
        </div>
        <p className="text-xs text-gray-500 mb-8">{project.client} · {project.year}</p>

        {/* Outcome only. The full narrative (context, what I did) lives on the
            detail page — the listing sells, the case study proves. Rendering the
            whole body here duplicated every detail page's copy verbatim. */}
        <ProjectNarrative project={project} variant="card" />
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
                className="text-gray-500 uppercase"
                style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          projects & case studies intro
      ══════════════════════════════════════════════════════════════════ */}
      <div className="pt-14 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-serif text-gray-900 mb-3"
            style={{ fontSize: '1.35rem', fontWeight: 400, letterSpacing: '-0.01em' }}
          >
            Projects &amp; Case studies
          </h2>
          <p className="text-gray-500 max-w-lg leading-relaxed" style={{ fontSize: '0.95rem' }}>
            Products and ventures I've owned end-to-end, from validation through delivery.
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
              <span className="block text-ink group-hover:text-plum group-hover:underline underline-offset-4" style={{ fontSize: '0.92rem', fontWeight: 500 }}>
                {project.title}
              </span>
              <span className="block text-gray-500 leading-relaxed group-hover:text-plum transition-colors" style={{ fontSize: '0.82rem' }}>
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
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-plum'
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
              className="text-sm text-plum hover:text-plum-lt transition-colors underline underline-offset-4"
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
            className="font-serif text-gray-900 mb-3"
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
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">{cat.category}</p>
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
                className="text-gray-500 uppercase leading-tight"
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
            className="font-serif text-gray-900 mb-8"
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
