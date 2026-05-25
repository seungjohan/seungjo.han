import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { MAGAZINES } from '../data/magazines';
import { POSTS } from '../data/posts';
import SEO from '../components/SEO';

export default function Magazine() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <SEO
        title="Magazine"
        description="Curated reading series by Seungjo Han, grouping essays by product thinking, technology, and creative life."
        path="/magazine"
      />
      <h1
        className="mb-2"
        style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400 }}
      >
        Magazine
      </h1>
      <p className="text-gray-500 mb-14" style={{ fontSize: '0.95rem' }}>
        Curated series of writing, grouped by theme.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MAGAZINES.map((mag, i) => {
          const posts = mag.postSlugs
            .map(s => POSTS.find(p => p.slug === s))
            .filter(Boolean) as typeof POSTS;

          return (
            <motion.div
              key={mag.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to={`/magazine/${mag.slug}`} className="group block">
                {/* Cover */}
                <div className="relative overflow-hidden rounded-xl mb-4 aspect-[4/3] bg-gray-100">
                  <img
                    src={mag.cover}
                    alt={mag.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                </div>

                {/* Info */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className="text-gray-900 group-hover:text-black transition-colors mb-1"
                      style={{ fontWeight: 400, fontSize: '1rem' }}
                    >
                      {mag.name}
                    </p>
                    <p className="text-gray-400" style={{ fontSize: '0.8rem' }}>
                      {posts.length} {posts.length === 1 ? 'essay' : 'essays'}
                    </p>
                  </div>
                  <ArrowRight
                    size={15}
                    className="text-gray-300 group-hover:text-black transition-colors mt-0.5 flex-shrink-0"
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
