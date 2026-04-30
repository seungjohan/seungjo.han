import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MessageCircle, Send, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { POSTS } from '../data/posts';

// "April 15, 2026" → "Apr 15, 2026"
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Mock comments ────────────────────────────────────────────────────────────
const MOCK_COMMENTS = [
  {
    id: 1,
    author: 'Minjee Park',
    avatar: 'MP',
    date: '2 days ago',
    body: "This resonated with me so much. The section on constraints especially — I've been thinking about this a lot lately in my own work.",
    likes: 8,
  },
  {
    id: 2,
    author: 'David Chen',
    avatar: 'DC',
    date: '3 days ago',
    body: "Great read. I'd love to hear more about how you approach the tension between aesthetic simplicity and functional complexity.",
    likes: 5,
  },
];

// ─── Anchor heading ───────────────────────────────────────────────────────────
function AnchorH2({ id, children }: { id: string; children: React.ReactNode }) {
  const handleCopy = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => toast.success('Link copied!')).catch(() => {});
  };
  return (
    <h2 id={id} className="group flex items-center gap-2" style={{ scrollMarginTop: '80px' }}>
      <span>{children}</span>
      <button
        onClick={handleCopy}
        aria-label="Copy link to section"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500"
        style={{ fontSize: '1rem', lineHeight: 1 }}
      >
        #
      </button>
    </h2>
  );
}

// ─── Post body content ────────────────────────────────────────────────────────
function PostContent({ slug }: { slug: string }) {
  const post = POSTS.find(p => p.slug === slug);

  if (slug === 'on-simplicity-in-design') {
    return (
      <div className="prose-content">
        <p>
          There is a moment in almost every design project when you realize you've added too much. The interface is
          technically correct — every feature present, every edge case handled — and yet it feels wrong. Heavy.
          Crowded. Like a sentence with too many adjectives.
        </p>
        <p>
          Simplicity in design is not about removing things. It's about removing the <em>wrong</em> things. That
          distinction matters more than most designers let themselves believe.
        </p>

        <AnchorH2 id="the-case-for-less">The case for less</AnchorH2>
        <p>
          We live in a world that equates complexity with capability. A product with more features must be more
          powerful, right? A longer menu means more choice. More options mean more users served.
        </p>
        <p>
          But anyone who has sat with a novice user watching them navigate a "feature-rich" product knows this
          instinct is wrong. Complexity isn't power. It's debt — debt you charge to every person who touches
          the thing you've made.
        </p>
        <p>
          The best products I've used share a quality: they seem to know what they're for. They don't try to
          be everything. They make one promise and keep it, completely and beautifully. That clarity is not
          easy to achieve. In fact, it's much harder than adding more.
        </p>

        <AnchorH2 id="the-paradox-of-choice">The paradox of choice</AnchorH2>
        <p>
          Barry Schwartz's work on the paradox of choice is well-known in product circles, but its implications
          are routinely ignored in practice. We know, intellectually, that more options lead to decision
          paralysis, lower satisfaction, and regret. And yet we keep shipping more.
        </p>
        <p>
          I think the reason is that removal is psychologically harder than addition. When you add a feature,
          you are giving. When you remove one, you are taking away — and someone, somewhere, will miss it.
          The asymmetry of that emotional calculus pushes teams toward accumulation.
        </p>
        <p>
          The discipline of simplicity, then, is really a discipline of subtraction. And subtraction requires
          a kind of courage that most teams — under pressure from roadmaps and stakeholders — struggle to
          exercise consistently.
        </p>

        <AnchorH2 id="constraints-as-freedom">Constraints as freedom</AnchorH2>
        <p>
          The most creatively liberating experiences I've had in design have all come from severe constraints.
          When you have twelve font choices, picking one is paralyzing. When you have two, you focus on
          everything else that matters.
        </p>
        <p>
          This is why design systems work. Not because they standardize everything — that would kill the
          creativity that good design needs — but because they take certain decisions off the table permanently.
          Once you've decided that every button looks like <em>this</em>, you don't have to decide it again.
          That freed-up cognitive space is where the interesting work happens.
        </p>
        <p>
          Constraints, chosen carefully, are a gift. They give you something to push against, and the resistance
          is where the form emerges.
        </p>

        <AnchorH2 id="building-systems-not-solutions">Building systems, not solutions</AnchorH2>
        <p>
          One shift that changed how I design: thinking in systems rather than screens. A single screen, designed
          in isolation, can be made to look simple. But simplicity at the system level — where every component
          relates to every other, where the user's mental model must stretch across dozens of flows — is a
          fundamentally different challenge.
        </p>
        <p>
          The question isn't "does this screen look clean?" but "does the whole thing hold together?" And "holding
          together" isn't about visual consistency alone. It's about conceptual coherence. Does the product have
          a point of view? Does it have a sensibility you can feel even when you can't name it?
        </p>
        <p>
          When a product has that quality, simplicity tends to follow. Because clarity of purpose naturally sheds
          the unnecessary.
        </p>

        <AnchorH2 id="closing-thought">Closing thought</AnchorH2>
        <p>
          I don't think simplicity is a style. It's a result — the residue of a very particular kind of rigor,
          applied over time, by people who care more about the person using the thing than about the thing itself.
        </p>
        <p>
          That's a harder thing to teach than visual reduction. But it might be the most important design skill
          there is.
        </p>
      </div>
    );
  }

  if (post?.sections?.length) {
    return (
      <div className="prose-content">
        {post.sections.map(section => (
          <section key={section.id}>
            <AnchorH2 id={section.id}>{section.title}</AnchorH2>
            {section.paragraphs.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="prose-content">
      <p>
        This is the full content of the post. The ideas explored here are meant to provoke reflection
        and start conversations — not to provide definitive answers.
      </p>
      <AnchorH2 id="section-one">Opening thoughts</AnchorH2>
      <p>
        Every project begins with a question. Sometimes the question is clear from the start; more often,
        you have to do a lot of work before you even understand what you're really asking.
      </p>
      <AnchorH2 id="section-two">Going deeper</AnchorH2>
      <p>
        The interesting territory is usually found not in the obvious answer but in the unexpected
        relationship between ideas you thought were unrelated.
      </p>
      <AnchorH2 id="section-three">What I've taken away</AnchorH2>
      <p>
        Some conclusions are destinations. Others are invitations. This one, I hope, is the latter — a
        prompt to keep looking, keep questioning, keep building toward something worth making.
      </p>
    </div>
  );
}

// ─── Post card (recommendation) ───────────────────────────────────────────────
function PostCard({ post }: { post: (typeof POSTS)[0] }) {
  const navigate = useNavigate();
  return (
    <motion.div
      className="group cursor-pointer rounded-xl border border-gray-100 overflow-hidden
                 hover:border-gray-200 hover:shadow-md transition-all duration-300"
      whileHover={{ y: -3 }}
      onClick={() => navigate(`/blog/${post.slug}`)}
    >
      {/* Thumbnail */}
      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full aspect-[16/9] object-cover"
        />
      ) : (
        <div className="w-full aspect-[16/9] bg-gray-100 flex items-center justify-center">
          <span className="text-xs text-gray-400 tracking-widest uppercase">
            {post.tags[0]}
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Tags */}
        <div className="flex gap-2 mb-3">
          {post.tags.slice(0, 2).map(t => (
            <span
              key={t}
              className="text-xs text-gray-400 uppercase tracking-wider"
            >
              {t}
            </span>
          ))}
        </div>

        <h3
          className="text-gray-900 group-hover:text-black mb-2 leading-snug transition-colors"
          style={{ fontSize: '0.95rem', fontWeight: 400 }}
        >
          {post.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            {post.tags[0]}
          </span>
          <span className="text-xs text-gray-400">{post.date}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main BlogPost component ──────────────────────────────────────────────────
export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = POSTS.find(p => p.slug === slug);

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);

  // Score other posts by shared tag count, fallback to any post
  const related = post
    ? POSTS
        .filter(p => p.slug !== slug)
        .map(p => ({ post: p, score: p.tags.filter(t => post.tags.includes(t)).length }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({ post: p }) => p)
    : [];

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments(prev => [
      {
        id: Date.now(),
        author: 'You',
        avatar: 'YO',
        date: 'just now',
        body: comment.trim(),
        likes: 0,
      },
      ...prev,
    ]);
    setComment('');
    toast.success('Comment posted');
  };

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-gray-500 mb-4">Post not found.</p>
        <Link to="/blog" className="text-black underline underline-offset-4 text-sm">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* ── Article ── */}
      <article className="max-w-2xl mx-auto px-6 pt-10 pb-16">

        {/* Tags — linked to filtered blog */}
        <div className="flex gap-3 mb-5">
          {post.tags.map(t => (
            <Link
              key={t}
              to={`/blog?tag=${t}`}
              className="text-xs text-gray-400 uppercase tracking-wider hover:text-black transition-colors"
            >
              {t}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h1
          className="text-gray-900 mb-4"
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 400,
            lineHeight: 1.18,
            letterSpacing: '-0.02em',
          }}
        >
          {post.title}
        </h1>

        {/* Subtitle */}
        <p
          className="text-gray-500 mb-7 leading-relaxed"
          style={{ fontSize: '1.1rem' }}
        >
          {post.subtitle}
        </p>

        {/* Author bar — minimal: name left, date right */}
        <div className="flex items-center justify-between gap-4 py-4 border-y border-gray-100 mb-8">
          <span className="text-sm text-gray-900">Seungjo Han</span>
          <span className="text-xs text-gray-400">{formatDate(post.date)} · {post.readTime}</span>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="rounded-xl overflow-hidden mb-10">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full aspect-[16/9] object-cover"
            />
          </div>
        )}

        {/* Body */}
        <style>{`
          .prose-content p {
            color: #374151;
            line-height: 1.8;
            margin-bottom: 1.4rem;
            font-size: 1.05rem;
          }
          .prose-content h2 {
            font-size: 1.25rem;
            font-weight: 500;
            color: #111827;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            letter-spacing: -0.01em;
          }
          .prose-content em {
            font-style: italic;
          }
          .prose-content strong {
            font-weight: 600;
            color: #111827;
          }
        `}</style>
        <PostContent slug={slug!} />

        {/* ── End bar: just name + date ── */}
        <div className="flex items-center justify-between pt-10 mt-10 border-t border-gray-100">
          <span className="text-sm text-gray-900">Seungjo Han</span>
          <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
        </div>
      </article>

      {/* ── Comments ── */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="border-t border-gray-100 pt-10">
          <h2 className="flex items-center gap-2 mb-8" style={{ fontSize: '1rem', fontWeight: 500 }}>
            <MessageCircle size={18} className="text-gray-500" />
            {comments.length} Comment{comments.length !== 1 ? 's' : ''}
          </h2>

          {/* Comment form */}
          <form onSubmit={handleComment} className="mb-10">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs text-gray-500">
                Y
              </div>
              <div className="flex-1">
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Write a comment…"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                             text-gray-900 placeholder-gray-400 resize-none outline-none
                             focus:border-gray-400 transition-colors"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!comment.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white
                               rounded-full text-sm disabled:opacity-40 disabled:cursor-not-allowed
                               hover:bg-gray-800 transition-colors"
                  >
                    <Send size={13} /> Post
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comment list */}
          <div className="space-y-6">
            {comments.map(c => (
              <motion.div
                key={c.id}
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex
                             items-center justify-center text-xs text-gray-600"
                >
                  {c.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm text-gray-900">{c.author}</span>
                    <span className="text-xs text-gray-400">{c.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related posts ── */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 py-16 bg-gray-50/50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 style={{ fontSize: '1rem', fontWeight: 500 }}>Related</h2>
              <Link
                to="/blog"
                className="flex items-center gap-1 text-sm text-gray-500
                           hover:text-black transition-colors"
              >
                All posts <Link2 size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(p => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
