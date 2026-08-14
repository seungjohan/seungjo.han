import { Link } from 'react-router';
import { POSTS } from '../content/posts';
import { PROJECTS } from '../content/projects';
import { buildMeta, PERSON_JSON_LD } from '../components/SEO';

export const meta = () =>
  buildMeta({
    title: 'Seungjo Han - Product Manager, Republic of Korea',
    description:
      'Product manager and builder in Korea with selected work across startups, product strategy, software, and global market research.',
    path: '/',
    jsonLd: [PERSON_JSON_LD],
  });

/**
 * Homepage.
 *
 * Three things about this file that are deliberate, because each replaces
 * something that was here before and should not come back:
 *
 * 1. No PILLARS array, no STATS array. Both were content prose living in a
 *    component, which CLAUDE.md forbids. The four stat figures also duplicated
 *    three of the six on /projects, and the unverifiable ones ("88% engineering
 *    team retention rate") cost more credibility than they bought. Real,
 *    checkable numbers now live inside each project's `outcome` field, attached
 *    to the story that makes them mean something.
 *
 * 2. Projects render `outcome` and `role`, not `description`. A recruiter
 *    deciding in under a minute needs to know what this person did and what
 *    happened, not what the company was. `role` is required on every project and
 *    was previously not shown anywhere on this page.
 *
 * 3. No `initial={{ opacity: 0 }}` reveals. Those shipped into the prerendered
 *    HTML as inline style="opacity:0" on 37 elements, so with JS off or slow the
 *    page was blank, and the ~900px of layout growth they caused after first
 *    paint is what broke every heading deep-link on the blog.
 */

/** Blog covers can be remote (one post still points at Substack's CDN). Only
 *  local paths are shown here, so the homepage never depends on someone else's
 *  server staying up. */
function isLocalImage(src: string | undefined): src is string {
  return typeof src === 'string' && src.startsWith('/');
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Home() {
  const projects = PROJECTS.slice(0, 3);
  const posts = POSTS.filter(p => isLocalImage(p.coverImage)).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-8">

      {/* ── Hero ──────────────────────────────────────────────────────────
          The portrait is the highlight. It was buried on /about, and it is the
          only object on the site with real personality. The entire palette is
          sampled from it. */}
      <section className="pt-20 pb-20 md:pt-24 md:pb-24">
        <div className="grid md:grid-cols-[1fr_20rem] gap-10 md:gap-14 items-start">
          <div>
            <p className="flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-2 mb-6">
              Product Manager · Seoul, Korea
              <span aria-hidden className="flex-1 max-w-32 h-px bg-rule" />
            </p>

            <h1
              className="font-serif font-normal text-ink mb-6 text-balance"
              style={{
                fontSize: 'clamp(2.6rem, 5.4vw, 4rem)',
                lineHeight: 1.06,
                letterSpacing: '-0.022em',
              }}
            >
              I build products from&nbsp;0 to&nbsp;1, and I write about{' '}
              <em className="italic text-plum">what it costs</em>.
            </h1>

            <p className="font-serif text-ink-2 mb-9 max-w-xl text-[1.3125rem] leading-[1.55]">
              Six years turning ambiguous problems into shipped products, across a
              B2B2C startup I co-founded, a metaverse music venue, and teams in the
              US, Kazakhstan and Europe.
            </p>

            <div className="flex items-center gap-7 text-[0.9375rem]">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-ink text-paper font-medium
                           px-5 py-3 rounded-sm hover:bg-plum transition-colors"
              >
                My work →
              </Link>
              <Link to="/about" className="text-ink-2 hover:text-plum transition-colors">
                About me →
              </Link>
            </div>
          </div>

          <div className="max-w-[17rem] md:max-w-none">
            <img
              src="/images/seungjo-han-portrait.jpg"
              alt="Painted portrait of Seungjo Han"
              width={640}
              height={640}
              className="w-full rounded-sm block"
            />
          </div>
        </div>
      </section>

      {/* ── Selected work — no thumbnails, on purpose ─────────────────────
          The six project covers are five different kinds of image (photo,
          screenshot, an SVG mockup) and one is an empty string. In a row they
          read as an accident, and a 300px screenshot of a B2B2C app teaches a
          reader nothing that the sentence does not. */}
      <section className="py-16 border-t border-rule">
        <div className="flex items-baseline justify-between gap-8 mb-10">
          <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-2">
            Projects
          </h2>
          <Link to="/projects" className="text-[0.8125rem] text-ink-2 hover:text-plum transition-colors">
            All projects →
          </Link>
        </div>

        {projects.map(project => (
          <Link
            key={project.slug}
            to={`/projects/${project.slug}`}
            className="group block py-7 border-b border-rule first:border-t"
          >
            <div className="flex items-baseline justify-between gap-6">
              <h3 className="font-serif text-2xl font-medium tracking-[-0.012em] text-ink group-hover:text-plum transition-colors">
                {project.title}
              </h3>
              <span className="text-xs text-ink-2 whitespace-nowrap tracking-wide">
                {project.year}
              </span>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.05em] text-ink-2 mt-2 mb-2.5">
              {project.role}
            </p>
            <p className="font-serif text-[1.0625rem] leading-relaxed text-ink-2 max-w-2xl">
              {project.outcome}
            </p>
          </Link>
        ))}
      </section>

      {/* ── Writing — images live here and only here ──────────────────────
          The page had no images at all, which is why every section looked like
          every other one. These covers are real photographs, consistent in kind,
          and the only colour on the site. Text-dense work then a visual writing
          block is what gives the page a change of rhythm. */}
      <section className="py-16 border-t border-rule">
        <div className="flex items-baseline justify-between gap-8 mb-10">
          <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-2">
            Writing
          </h2>
          <Link to="/blog" className="text-[0.8125rem] text-ink-2 hover:text-plum transition-colors">
            All posts →
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden rounded-sm bg-paper-2 mb-4">
                <img
                  src={post.coverImage}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover block
                             transition-transform duration-500 ease-out group-hover:scale-[1.035]"
                />
              </div>
              <p className="text-[0.6875rem] uppercase tracking-[0.1em] text-ink-2 mb-2">
                {formatDate(post.date)}
                {post.tags[0] ? ` · ${post.tags[0]}` : ''}
              </p>
              <h3 className="font-serif text-[1.1875rem] font-medium leading-snug tracking-[-0.01em] text-ink mb-1.5 group-hover:text-plum transition-colors">
                {post.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-2">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-rule">
        <h2
          className="font-serif font-normal text-ink mb-7 max-w-lg"
          style={{
            fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          Building something where ambiguity is the hard part? I&rsquo;d like to hear about it.
        </h2>
        <div className="flex flex-wrap gap-6 text-[0.9375rem]">
          <a
            href="mailto:seungjohan.kr@gmail.com"
            className="text-ink border-b border-rule pb-0.5 hover:text-plum hover:border-plum transition-colors"
          >
            seungjohan.kr@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/seungjohan/"
            target="_blank"
            rel="noreferrer"
            className="text-ink border-b border-rule pb-0.5 hover:text-plum hover:border-plum transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/seungjohan"
            target="_blank"
            rel="noreferrer"
            className="text-ink border-b border-rule pb-0.5 hover:text-plum hover:border-plum transition-colors"
          >
            GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
