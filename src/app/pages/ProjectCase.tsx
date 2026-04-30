import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { PROJECTS } from '../data/projects';

// ─── Meta table row ────────────────────────────────────────────────────────────
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-4 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

// ─── Numbered section ─────────────────────────────────────────────────────────
function Section({
  title, id, children,
}: { title: string; id: string; children: React.ReactNode }) {
  return (
    <motion.div
      id={id}
      className="py-10"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2
        id={id}
        className="text-gray-900 mb-5"
        style={{ fontSize: '1.15rem', fontWeight: 500, letterSpacing: '-0.01em' }}
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
          <p><strong>Weeks 1–2 · Discovery & Audit</strong></p>
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

      {/* ── Cover image ── */}
      <motion.div
        className="max-w-4xl mx-auto px-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="rounded-2xl overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full aspect-[16/7] object-cover"
          />
        </div>
      </motion.div>

      {/* ── Header + meta ── */}
      <div className="max-w-4xl mx-auto px-6 mt-10 mb-2">
        <motion.div
          className="grid md:grid-cols-[1fr_280px] gap-12 items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Title block */}
          <div>
            <div className="flex gap-2 mb-4">
              {project.tags.map(t => (
                <span
                  key={t}
                  className="text-xs text-gray-400 uppercase tracking-wider"
                >
                  {t}
                </span>
              ))}
            </div>
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
            <p className="text-gray-500 leading-relaxed" style={{ fontSize: '1.05rem' }}>
              {project.description}
            </p>
          </div>

          {/* Meta card */}
          <div className="rounded-xl border border-gray-100 px-6 divide-y divide-gray-100 md:mt-8">
            <MetaRow label="Client" value={project.client} />
            <MetaRow label="Role" value={project.role} />
            <MetaRow label="Team" value={project.team} />
            <MetaRow label="Timeline" value={project.timeline} />
            <MetaRow label="Duration" value={project.duration} />
            <MetaRow label="Platform" value={project.platform} />
            <MetaRow label="Tech / Tools" value={project.techStack} />
          </div>
        </motion.div>
      </div>

      {/* ── Case study content ── */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <CaseContent slug={slug!} />
      </div>
    </div>
  );
}