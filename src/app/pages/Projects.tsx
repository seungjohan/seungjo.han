import { Link } from 'react-router';
import { motion } from 'motion/react';
import { PROJECTS } from '../data/projects';

export default function Projects() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <h1 className="mb-2" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400 }}>
        Projects
      </h1>
      <p className="text-gray-500 mb-14" style={{ fontSize: '0.95rem' }}>
        Selected work across product design, branding, and digital experiences.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3 }}
          >
            <Link
              to={`/projects/${project.slug}`}
              className="group block rounded-xl overflow-hidden border border-gray-100
                         hover:border-gray-200 hover:shadow-md transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="aspect-[16/9] overflow-hidden relative">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03]
                               transition-transform duration-500"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: project.color }}
                  >
                    <span className="text-gray-300 text-xs tracking-widest uppercase">
                      {project.tags[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2
                    className="text-gray-900 group-hover:text-black transition-colors"
                    style={{ fontSize: '1.05rem', fontWeight: 400 }}
                  >
                    {project.title}
                  </h2>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  {project.client} · {project.year}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs text-gray-500 bg-gray-50 border border-gray-100
                                 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}