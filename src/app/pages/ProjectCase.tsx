import { useParams, Link } from 'react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { motion } from 'motion/react';
import { PROJECTS } from '../data/projects';
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
    image: project.coverImage,
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

  useEffect(() => {
    setImgIndex(0);
  }, [slug]);

  useEffect(() => {
    const imageCount = project?.images?.length ?? 0;
    if (imageCount <= 1) return;
    const id = setInterval(() => {
      setImgIndex(i => (i + 1) % imageCount);
    }, 2000);
    return () => clearInterval(id);
  }, [project?.images]);

  // Single source for the gallery. `images` is typed non-optional but nothing
  // validates it is non-empty, so fall back to the cover and then to nothing.
  const images = project?.images?.length
    ? project.images
    : project?.coverImage
      ? [project.coverImage]
      : [];

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
          className="inline-flex items-center gap-1.5 text-sm text-gray-400
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
              <span key={t} className="text-xs text-gray-400 uppercase tracking-wider">{t}</span>
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
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Role</p>
              <p className="text-sm text-gray-900">{project.role}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[7rem_1fr]">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Team</p>
              <p className="text-sm text-gray-900">{project.team}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[7rem_1fr]">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Duration</p>
              <p className="text-sm text-gray-900">{project.duration}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[7rem_1fr]">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Tools</p>
              <p className="text-sm text-gray-900">{project.techStack}</p>
            </div>
            {project.url && (
              <div className="grid gap-2 sm:grid-cols-[7rem_1fr]">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">URL</p>
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
          <div className="rounded-2xl overflow-hidden relative" style={{ aspectRatio: '16/7' }}>
            {images.map((src, i) => (
              <img
                key={`${src}-${i}`}
                src={src}
                alt={i === imgIndex ? `${project.title} — image ${i + 1} of ${images.length}` : ''}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 cursor-zoom-in"
                style={{ opacity: i === imgIndex ? 1 : 0 }}
                onClick={() => setLightboxIndex(i)}
              />
            ))}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-200"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setImgIndex(i => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-200"
                  aria-label="Next image"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <span
                      key={i}
                      className="block rounded-full transition-all duration-300"
                      style={{
                        width: i === imgIndex ? 18 : 6,
                        height: 6,
                        backgroundColor: i === imgIndex ? 'white' : 'rgba(255,255,255,0.45)',
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Case study body ── data-driven, shared with the listing page ── */}
      <div className="max-w-4xl mx-auto px-6 pt-4 pb-16">
        <ProjectNarrative project={project} variant="detail" />
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-5 right-5 text-white/90 hover:text-white cursor-pointer"
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
          <img
            src={images[lightboxIndex]}
            alt={project.title}
            className="max-w-full max-h-full object-contain rounded-md cursor-zoom-out"
            onClick={() => setLightboxIndex(null)}
          />
        </div>
      )}
    </div>
  );
}
