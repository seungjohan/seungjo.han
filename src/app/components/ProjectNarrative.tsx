import { motion } from 'motion/react';
import type { Project } from '../content/projects';

/**
 * The case-study body, rendered from project data.
 *
 * Both `/projects` (variant="card") and `/projects/:slug` (variant="detail")
 * render from here so the two pages can never drift apart. Do not add per-slug
 * branches or hardcoded prose — a slug switch containing JSX copy is how every
 * project page ended up publishing the same invented metrics.
 *
 * variant="card"   → outcome only. The listing sells; it must not duplicate the
 *                    detail body, or the pages compete and check-seo's
 *                    duplicate-body assertion fires on legitimate content.
 * variant="detail" → outcome, then context, then what I did.
 */

type Variant = 'card' | 'detail';

function hasText(value: string | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function Heading({ children }: { children: string }) {
  return (
    <h2
      className="text-gray-900 mb-4"
      style={{ fontSize: '1.15rem', fontWeight: 500, letterSpacing: '-0.01em', scrollMarginTop: '100px' }}
      id={children.toLowerCase().replace(/\s+/g, '-')}
    >
      {children}
    </h2>
  );
}

export default function ProjectNarrative({
  project,
  variant = 'detail',
}: {
  project: Project;
  variant?: Variant;
}) {
  const bullets = project.whatIDidBullets?.filter(hasText) ?? [];

  // Listing card: the payoff line only. Everything else lives on the detail page.
  if (variant === 'card') {
    if (!hasText(project.outcome)) return null;
    return (
      <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-gray-900 leading-relaxed" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
          {project.outcome}
        </p>
      </div>
    );
  }

  const sections = [
    hasText(project.outcome) && (
      <section key="outcome" className="py-8">
        <Heading>Outcome</Heading>
        <div className="bg-gray-50 rounded-xl p-6">
          <p className="text-gray-900 leading-relaxed" style={{ fontSize: '1rem', fontWeight: 500 }}>
            {project.outcome}
          </p>
        </div>
      </section>
    ),
    hasText(project.impact) && (
      <section key="context" className="py-8">
        <Heading>Context</Heading>
        <p className="text-gray-600 leading-relaxed" style={{ fontSize: '1rem' }}>
          {project.impact}
        </p>
      </section>
    ),
    (hasText(project.whatIDid) || bullets.length > 0) && (
      <section key="what-i-did" className="py-8">
        <Heading>What I did</Heading>
        {hasText(project.whatIDid) && (
          <p className="text-gray-600 leading-relaxed mb-5" style={{ fontSize: '1rem' }}>
            {project.whatIDid}
          </p>
        )}
        {bullets.length > 0 && (
          <ul className="space-y-3">
            {bullets.map(bullet => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="text-gray-400 flex-shrink-0 mt-1" style={{ fontSize: '0.85rem' }}>
                  &rarr;
                </span>
                <span className="text-gray-600 leading-relaxed" style={{ fontSize: '0.95rem' }}>
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    ),
  ].filter(Boolean);

  if (sections.length === 0) return null;

  return (
    <motion.div
      className="divide-y divide-gray-100"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {sections}
    </motion.div>
  );
}
