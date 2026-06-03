import { useParams, Link } from 'react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion } from 'motion/react';
import { PROJECTS } from '../data/projects';
import { trackView } from '../utils/viewTracker';
import SEO from '../components/SEO';

// ─── Numbered section ─────────────────────────────────────────────────────────
function Section({
  title, id, children,
}: { title: string; id: string; children: React.ReactNode }) {
  return (
    <motion.div
      className="py-10"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2
        id={id}
        className="text-gray-900 mb-5"
        style={{ fontSize: '1.15rem', fontWeight: 500, letterSpacing: '-0.01em', scrollMarginTop: '100px' }}
      >
        {title}
      </h2>
      <div className="text-gray-600 leading-relaxed space-y-4" style={{ fontSize: '1rem' }}>
        {children}
      </div>
    </motion.div>
  );
}

// ─── Case study content per slug ──────────────────────────────────────────────
function CaseContent({ slug }: { slug: string }) {
  if (slug === 'brand-identity-system') {
    return (
      <>
        <Section title="Problem" id="problem">
          <p>
            The client, a Series A fintech startup, had grown quickly but without a unified visual language. Every
            team shipped design independently — marketing, product, and support each used different fonts, colors,
            and component patterns. The brand felt fragmented, and new team members had no single source of truth
            to work from.
          </p>
          <p>
            Users noticed. In research sessions, participants described the product as "a bit confusing" and "like
            it was made by different companies." Trust, especially critical in financial products, was being eroded
            by inconsistency alone.
          </p>
        </Section>

        <Section title="TL;DR" id="tldr">
          <p>
            We built a complete brand identity system in 12 weeks — logo, color, typography, iconography, and a
            React component library with 60+ documented components in Storybook. Adoption across all teams reached
            80% within the first month post-launch.
          </p>
        </Section>

        <Section title="Solution" id="solution">
          <p>
            Rather than starting with aesthetics, we started with principles. What should this brand feel like?
            We ran a one-week discovery sprint with stakeholders across product, marketing, and leadership to
            align on three brand pillars: <strong>clarity</strong>, <strong>trustworthiness</strong>, and
            <strong>forward motion</strong>.
          </p>
          <p>
            From those pillars, every design decision followed logically. The primary typeface (a geometric sans)
            was chosen for its legibility at small sizes and its inherent structure. The color palette was anchored
            by a deep navy (trust, stability) and an electric blue accent (energy, forward motion). The logo mark —
            an abstracted arrow contained within a circle — combined direction with containment.
          </p>
          <p>
            The component library was built in parallel with design tokens, so changing a color or spacing value
            propagated instantly across 60+ components. This was the first time the engineering team had a single
            source of truth they could actually use.
          </p>
        </Section>

        <Section title="Process" id="process">
          <p><strong>Weeks 1–2 · Discovery &amp; Audit</strong></p>
          <p>
            Full audit of existing brand assets. Stakeholder interviews. Competitive landscape mapping. Identification
            of 120+ inconsistencies across touchpoints. Alignment on brand pillars and design principles.
          </p>
          <p><strong>Weeks 3–6 · Identity Design</strong></p>
          <p>
            Logo development (3 concepts → 1 refined direction). Color system (primary, secondary, semantic, neutral
            palettes). Typography scale (7 text styles, 2 typefaces). Iconography guidelines. Motion principles.
          </p>
          <p><strong>Weeks 7–12 · Component Library</strong></p>
          <p>
            Design token architecture in Figma. 60+ components built and documented. Storybook integration.
            Handoff workshops with engineering. Adoption plan and internal documentation.
          </p>
        </Section>

        <Section title="Takeaway" id="takeaway">
          <p>
            The most underestimated part of a design system is the adoption plan. A perfectly crafted system
            that nobody uses is worth nothing. We spent the final two weeks running workshops with every team —
            not to pitch the system, but to listen to their constraints and adapt the documentation accordingly.
          </p>
          <p>
            That investment in people, not just artifacts, is what drove 80% adoption in month one.
          </p>
        </Section>

        <Section title="Conclusion" id="conclusion">
          <p>
            Twelve weeks in, the company had something it had never had before: a shared language for how the
            product should look and feel. Engineers shipped faster because decisions were already made. Designers
            spent more time on problems and less on pixel-pushing.
          </p>
          <p>
            The brand itself felt like a single company for the first time. And in a space where trust is
            everything, that coherence translated directly into user confidence.
          </p>
        </Section>
      </>
    );
  }

  // Generic fallback
  return (
    <>
      <Section title="Problem" id="problem">
        <p>
          The project began with a clear challenge: the existing experience was not meeting user needs. Research
          revealed significant friction points in the core flows, leading to drop-off and frustration.
        </p>
      </Section>
      <Section title="TL;DR" id="tldr">
        <p>
          A focused redesign that reduced drop-off by 40%, improved user satisfaction scores, and established
          a foundation for future iteration — delivered on time and within scope.
        </p>
      </Section>
      <Section title="Solution" id="solution">
        <p>
          We simplified the core flows, established a clear visual hierarchy, and built a scalable component
          system. Every decision was grounded in user research and validated through testing.
        </p>
      </Section>
      <Section title="Process" id="process">
        <p>
          Discovery, definition, design, and delivery — each phase tightly scoped and timeboxed. We ran
          weekly design reviews and shipped iteratively, incorporating feedback at each stage.
        </p>
      </Section>
      <Section title="Takeaway" id="takeaway">
        <p>
          The best insight from this project: constraints are clarifying. Working within tight timelines
          forced us to prioritize ruthlessly and focus on what actually moved the needle for users.
        </p>
      </Section>
      <Section title="Conclusion" id="conclusion">
        <p>
          The redesign shipped on schedule and exceeded success metrics. The patterns established here became
          the foundation for the next phase of product development.
        </p>
      </Section>
    </>
  );
}

// ─── Main ProjectCase ─────────────────────────────────────────────────────────
export default function ProjectCase() {
  const { slug } = useParams<{ slug: string }>();
  const project = PROJECTS.find(p => p.slug === slug);
  const [imgIndex, setImgIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (slug) trackView(slug, 'project');
  }, [slug]);

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
      <SEO
        title={project.title}
        description={project.description}
        path={`/projects/${project.slug}`}
        image={project.coverImage}
      />

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

      {/* ── Cover image ── */}
      <motion.div
        className="max-w-4xl mx-auto px-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-2xl overflow-hidden relative" style={{ aspectRatio: '16/7' }}>
          {project.images.map((src, i) => (
            <img
              key={`${src}-${i}`}
              src={src}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 cursor-zoom-in"
              style={{ opacity: i === imgIndex ? 1 : 0 }}
              onClick={() => setLightboxIndex(i)}
            />
          ))}
          {project.images.length > 1 && (
            <>
              <button
                onClick={() => setImgIndex(i => (i - 1 + project.images.length) % project.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setImgIndex(i => (i + 1) % project.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-200"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {project.images.map((_, i) => (
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

      {/* ── Header ── */}
      <div className="max-w-4xl mx-auto px-6 mt-10 mb-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
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
          </div>
        </motion.div>
      </div>

      {/* ── Case study content ── */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <CaseContent slug={slug!} />
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
          {project.images.length > 1 && (
            <>
              <button
                className="absolute left-5 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
                aria-label="Previous image"
                onClick={e => {
                  e.stopPropagation();
                  setLightboxIndex(i => i === null ? 0 : (i - 1 + project.images.length) % project.images.length);
                }}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
                aria-label="Next image"
                onClick={e => {
                  e.stopPropagation();
                  setLightboxIndex(i => i === null ? 0 : (i + 1) % project.images.length);
                }}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
          <img
            src={project.images[lightboxIndex]}
            alt={project.title}
            className="max-w-full max-h-full object-contain rounded-md cursor-zoom-out"
            onClick={() => setLightboxIndex(null)}
          />
        </div>
      )}
    </div>
  );
}
