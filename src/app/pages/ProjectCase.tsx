import { useParams, Link } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { motion } from 'motion/react';
import { PROJECTS, galleryFor, imageAlt, siblingsOf } from '../content/projects';
import { buildMeta } from '../components/SEO';
import ProjectNarrative from '../components/ProjectNarrative';

export function meta({ params }: { params: { slug?: string } }) {
  const project = PROJECTS.find(p => p.slug === params.slug);
  if (!project) {
    return buildMeta({ title: 'Project Not Found', path: '/projects' });
  }
  return buildMeta({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    // Omit when empty so buildMeta falls back to the site default. Passing ''
    // resolves to SITE_URL + '/', i.e. an og:image pointing at the home page.
    ...(project.coverImage ? { image: project.coverImage } : {}),
  });
}

// The case-study body lives in <ProjectNarrative>, rendered from projects.ts.
// There is deliberately no per-slug dispatch here: a slug switch holding JSX
// prose is what caused every project page to publish the same invented metrics.

// ─── Main ProjectCase ─────────────────────────────────────────────────────────
export default function ProjectCase() {
  const { slug } = useParams<{ slug: string }>();
  const project = PROJECTS.find(p => p.slug === slug);
  const [imgIndex, setImgIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Shared with the listing card so the two pages cannot disagree about which
  // images belong to a project. Declared before the effects below so the
  // carousel and lightbox reason about the same list that actually renders.
  const images = project ? galleryFor(project) : [];
  const { prev, next } = siblingsOf(slug ?? '');

  useEffect(() => {
    setImgIndex(0);
  }, [slug]);

  const [paused, setPaused] = useState(false);

  // Auto-advance, but only when it is not fighting the reader. Previously this
  // ran every 2s with no pause of any kind, which is below any readable
  // threshold and has no WCAG 2.2.2 stop mechanism.
  useEffect(() => {
    if (images.length <= 1) return;
    if (paused || lightboxIndex !== null) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => {
      if (document.hidden) return;
      setImgIndex(i => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, [images.length, paused, lightboxIndex]);

  // Lightbox: ESC to close, arrows to move, scroll locked, focus restored to the
  // trigger. The markup declared role="dialog" aria-modal="true" while
  // implementing none of it, and the trigger was a bare <img onClick> that no
  // keyboard user could reach in the first place.
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const count = images.length;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (count > 1 && e.key === 'ArrowLeft') setLightboxIndex(i => (i === null ? 0 : (i - 1 + count) % count));
      if (count > 1 && e.key === 'ArrowRight') setLightboxIndex(i => (i === null ? 0 : (i + 1) % count));
    };
    window.addEventListener('keydown', onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [lightboxIndex, images.length]);

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-gray-500 mb-4">Project not found.</p>
        <Link to="/projects" className="text-black underline underline-offset-4 text-sm">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* ── Back ── */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500
                     hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> Back to Projects
        </Link>
      </div>

      {/* ── Header ── identity and meta lead, so the click through from the
           listing pays off before any imagery loads. ── */}
      <div className="max-w-4xl mx-auto px-6 mt-8 mb-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Tags */}
          <div className="flex gap-3 mb-4">
            {project.tags.map(t => (
              <span key={t} className="text-xs text-gray-500 uppercase tracking-wider">{t}</span>
            ))}
          </div>

          {/* Title */}
          <h1
            className="text-gray-900 mb-4"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            {project.title}
          </h1>

          {/* Description */}
          <p className="text-gray-500 leading-relaxed mb-8" style={{ fontSize: '1.05rem' }}>
            {project.description}
          </p>

          {/* Meta */}
          <div className="grid gap-4 max-w-2xl">
            <div className="grid gap-2 sm:grid-cols-[7rem_1fr]">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Client</p>
              <p className="text-sm text-gray-900">{project.client}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[7rem_1fr]">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Year</p>
              <p className="text-sm text-gray-900">{project.year}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[7rem_1fr]">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Role</p>
              <p className="text-sm text-gray-900">{project.role}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[7rem_1fr]">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Team</p>
              <p className="text-sm text-gray-900">{project.team}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[7rem_1fr]">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Duration</p>
              <p className="text-sm text-gray-900">{project.duration}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[7rem_1fr]">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Tools</p>
              <p className="text-sm text-gray-900">{project.techStack}</p>
            </div>
            {project.url && (
              <div className="grid gap-2 sm:grid-cols-[7rem_1fr]">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">URL</p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-900 underline underline-offset-4 hover:text-gray-500 transition-colors"
                >
                  {project.url}
                  <ExternalLink size={13} />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Cover / gallery ── omitted entirely when there is no imagery, so a
           project without assets starts at its narrative instead of an empty box. ── */}
      {images.length > 0 && (
        <motion.div
          className="max-w-4xl mx-auto px-6 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{ aspectRatio: '16/7' }}
            role="group"
            aria-roledescription="carousel"
            aria-label={`${project.title} images`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {/* A button, not a bare <img onClick> — otherwise the lightbox is
                unreachable by keyboard and fixing its focus trap is pointless. */}
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setLightboxIndex(imgIndex)}
              className="on-media absolute inset-0 w-full h-full cursor-zoom-in"
              aria-label={`View image ${imgIndex + 1} of ${images.length} full size`}
            >
              {images.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={i === imgIndex ? imageAlt(project, i, images.length) : ''}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  {...(i === 0 ? { fetchPriority: 'high' as const } : {})}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                  style={{ opacity: i === imgIndex ? 1 : 0 }}
                />
              ))}
            </button>
            <span className="sr-only" aria-live="polite">
              Image {imgIndex + 1} of {images.length}
            </span>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                  className="on-media absolute left-1 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full text-white transition-all duration-200"
                  aria-label="Previous image"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 hover:bg-black/40">
                    <ChevronLeft size={16} />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setImgIndex(i => (i + 1) % images.length)}
                  className="on-media absolute right-1 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full text-white transition-all duration-200"
                  aria-label="Next image"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 hover:bg-black/40">
                    <ChevronRight size={16} />
                  </span>
                </button>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex z-10">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImgIndex(i)}
                      aria-label={`Go to image ${i + 1}`}
                      aria-current={i === imgIndex}
                      className="on-media flex items-center justify-center w-6 h-11"
                    >
                      <span
                        className="block rounded-full transition-all duration-300"
                        style={{
                          width: i === imgIndex ? 18 : 6,
                          height: 6,
                          backgroundColor: i === imgIndex ? 'white' : 'rgba(255,255,255,0.45)',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Case study body ── data-driven, shared with the listing page ── */}
      <div className="max-w-4xl mx-auto px-6 pt-4 pb-10">
        <ProjectNarrative project={project} variant="detail" />
      </div>

      {/* ── Prev / next ── the page previously dead-ended, with the only exit a
           back link at the top of a long scroll. ── */}
      {(prev || next) && (
        <nav className="max-w-4xl mx-auto px-6 pb-20" aria-label="More projects">
          <div className="border-t border-gray-100 pt-8 flex justify-between gap-6">
            {prev ? (
              <Link to={`/projects/${prev.slug}`} className="group max-w-[45%]">
                <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Previous</span>
                <span className="block text-gray-900 group-hover:underline underline-offset-4" style={{ fontSize: '0.95rem' }}>
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link to={`/projects/${next.slug}`} className="group max-w-[45%] text-right">
                <span className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Next</span>
                <span className="block text-gray-900 group-hover:underline underline-offset-4" style={{ fontSize: '0.95rem' }}>
                  {next.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — image ${lightboxIndex + 1} of ${images.length}`}
        >
          <button
            ref={closeRef}
            type="button"
            className="on-media absolute top-5 right-5 flex items-center justify-center w-11 h-11 text-white/90 hover:text-white cursor-pointer"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close image"
          >
            <X size={24} />
          </button>
          {images.length > 1 && (
            <>
              <button
                className="absolute left-5 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
                aria-label="Previous image"
                onClick={e => {
                  e.stopPropagation();
                  setLightboxIndex(i => i === null ? 0 : (i - 1 + images.length) % images.length);
                }}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
                aria-label="Next image"
                onClick={e => {
                  e.stopPropagation();
                  setLightboxIndex(i => i === null ? 0 : (i + 1) % images.length);
                }}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
          {/* No onClick: the reader opened this to look closely, so a click on
              the image itself should not dismiss it. Backdrop, X and ESC all close. */}
          <img
            src={images[lightboxIndex]}
            alt={imageAlt(project, lightboxIndex, images.length)}
            className="max-w-full max-h-full object-contain rounded-md cursor-default"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
