import { useParams, Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Link2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { POSTS, type Post } from '../content/posts';
import { buildMeta, absoluteUrl } from '../components/SEO';
import { MarkdownContent, AnchorH2, slugify, copyAnchorLink } from '../components/markdown/Markdown';

export function meta({ params }: { params: { slug?: string } }) {
  const post = POSTS.find(p => p.slug === params.slug);
  if (!post) {
    return buildMeta({ title: 'Post Not Found', path: '/blog' });
  }
  const published = new Date(post.date);
  return buildMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: 'article',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        ...(isNaN(published.getTime())
          ? {}
          : { datePublished: published.toISOString().slice(0, 10) }),
        ...(post.coverImage ? { image: absoluteUrl(post.coverImage) } : {}),
        author: { '@type': 'Person', name: 'Seungjo Han' },
        mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
      },
    ],
  });
}

// "April 15, 2026" → "Apr 15, 2026"
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Post body content ────────────────────────────────────────────────────────
function PostContent({
  post,
  onOpenImage,
}: {
  post: Post;
  onOpenImage: (src: string, alt: string) => void;
}) {
  // Every post's body is its markdown file. There is deliberately no per-slug
  // dispatch: the previous version carried ~255 lines of hardcoded prose behind
  // slug branches that had become unreachable, which is the same failure the
  // project pages had.
  return <MarkdownContent markdown={post.markdown} post={post} onOpenImage={onOpenImage} />;
}

// ─── Post card (related) ──────────────────────────────────────────────────────
function PostCard({ post }: { post: (typeof POSTS)[0] }) {
  const navigate = useNavigate();
  return (
    <motion.div
      className="group cursor-pointer rounded-xl border border-gray-100 overflow-hidden
                 hover:border-gray-200 hover:shadow-md transition-all duration-300"
      whileHover={{ y: -3 }}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        navigate(`/blog/${post.slug}`);
      }}
    >
      {post.coverImage ? (
        <img src={post.coverImage} alt={post.title} className="w-full aspect-[16/9] object-cover" />
      ) : (
        <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center">
          <span className="text-xs text-gray-500 tracking-widest uppercase">{post.tags[0]}</span>
        </div>
      )}

      <div className="p-5">
        <h3
          className="font-serif text-gray-900 group-hover:text-plum mb-2 leading-snug transition-colors"
          style={{ fontSize: '0.95rem', fontWeight: 400 }}
        >
          {post.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main BlogPost component ──────────────────────────────────────────────────
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const allPosts = POSTS;
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string; index: number; total: number } | null>(null);

  const post = allPosts.find(p => p.slug === slug);

  // Related posts: sorted by shared tag count
  const related = post
    ? allPosts
        .filter(p => p.slug !== slug)
        .map(p => ({ post: p, score: p.tags.filter(t => post.tags.includes(t)).length }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({ post: p }) => p)
    : [];

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-gray-500 mb-4">Post not found.</p>
        <Link to="/blog" className="text-plum hover:text-plum-lt transition-colors underline underline-offset-4 text-sm">
          ← Back to Writing
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* ── Article ── */}
      <article className="max-w-[48rem] mx-auto px-6 pt-10 pb-16">

        {/* ← Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500
                     hover:text-plum transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Writing
        </Link>

        {/* Title */}
        <h1
          id={slugify(post.title)}
          className="article-title-heading font-serif text-gray-900 mb-4"
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 400,
            lineHeight: 1.18,
            letterSpacing: '-0.02em',
          }}
        >
          <span className="anchor-heading-row">
            <button
              type="button"
              className="anchor-link-chip anchor-link-chip-title"
              aria-label="Copy link to post"
              onClick={() => copyAnchorLink(slugify(post.title))}
            >
              <Link2 size={16} strokeWidth={2} />
            </button>
            <a
              className="article-title-anchor anchor-heading-text"
              href={`#${slugify(post.title)}`}
              onClick={e => {
                e.preventDefault();
                copyAnchorLink(slugify(post.title));
              }}
            >
              {post.title}
            </a>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mb-7 leading-relaxed" style={{ fontSize: '1.1rem' }}>
          {post.subtitle}
        </p>

        {/* Meta bar — tag left · date right */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {post.tags[0] && (
            <Link
              to={`/blog?tag=${encodeURIComponent(post.tags[0])}`}
              className="text-xs text-gray-500 hover:text-plum transition-colors"
              style={{ letterSpacing: '0.12em' }}
            >
              {post.tags[0]}
            </Link>
          )}
          {/* Right: date only */}
          <span className="text-xs text-gray-500 flex-shrink-0">
            {formatDate(post.date)}
          </span>
        </div>
        <div className="border-t border-gray-100 mb-8" />

        {/* Body */}
        <PostContent
          post={post}
          onOpenImage={(src, alt) => {
            const images = Array.from(document.querySelectorAll<HTMLImageElement>('article .cursor-zoom-in'));
            const index = Math.max(0, images.findIndex(img => img.src === src));
            setLightboxImage({ src, alt, index, total: images.length });
          }}
        />

        {/* ── End bar: tag left · share right ── */}
        <div className="flex items-center justify-between pt-10 mt-10 border-t border-gray-100">
          {post.tags[0] && (
            <Link
              to={`/blog?tag=${encodeURIComponent(post.tags[0])}`}
              className="text-xs text-gray-500 hover:text-plum transition-colors"
              style={{ letterSpacing: '0.12em' }}
            >
              {post.tags[0]}
            </Link>
          )}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
                .then(() => { toast.success('Link copied!'); })
                .catch(() => {});
            }}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-plum transition-colors"
          >
            <Link2 size={12} /> Share
          </button>
        </div>
      </article>

      {/* ── Related posts ── */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 py-16 bg-gray-50/50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 style={{ fontSize: '1rem', fontWeight: 500 }}>Related</h2>
              <Link
                to="/blog"
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-plum transition-colors"
              >
                All posts →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(p => <PostCard key={p.slug} post={p} />)}
            </div>
          </div>
        </section>
      )}

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-5 right-5 text-white/90 hover:text-white cursor-pointer"
            onClick={() => setLightboxImage(null)}
            aria-label="Close image"
          >
            <X size={24} />
          </button>
          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            className="max-w-full max-h-full object-contain rounded-md cursor-zoom-out"
            onClick={() => setLightboxImage(null)}
          />
          {lightboxImage.total > 1 && (
            <>
              <button
                className="absolute left-5 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
                aria-label="Previous image"
                onClick={e => {
                  e.stopPropagation();
                  const images = Array.from(document.querySelectorAll<HTMLImageElement>('article .cursor-zoom-in'));
                  const prev = (lightboxImage.index - 1 + images.length) % images.length;
                  setLightboxImage({
                    src: images[prev].src,
                    alt: images[prev].alt || post.title,
                    index: prev,
                    total: images.length,
                  });
                }}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
                aria-label="Next image"
                onClick={e => {
                  e.stopPropagation();
                  const images = Array.from(document.querySelectorAll<HTMLImageElement>('article .cursor-zoom-in'));
                  const next = (lightboxImage.index + 1) % images.length;
                  setLightboxImage({
                    src: images[next].src,
                    alt: images[next].alt || post.title,
                    index: next,
                    total: images.length,
                  });
                }}
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
