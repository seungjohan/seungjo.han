import { Link } from 'react-router';

export default function NotFound() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-24 text-center">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">404</p>
      <h1
        className="text-gray-900 mb-4"
        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 400 }}
      >
        Page not found
      </h1>
      <p className="text-gray-500 leading-relaxed mb-8">
        The page may have moved, or the link may be incomplete.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          to="/"
          className="px-5 py-2.5 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
        >
          Home
        </Link>
        <Link
          to="/blog"
          className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-full text-sm hover:border-gray-400 transition-colors"
        >
          Blog
        </Link>
        <Link
          to="/projects"
          className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-full text-sm hover:border-gray-400 transition-colors"
        >
          Projects
        </Link>
      </div>
    </section>
  );
}
