import { useParams, Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { POSTS, type Post } from '../data/posts';
import { getMagazineForPost, getPositionInMagazine } from '../data/magazines';
import { trackView, trackShare } from '../utils/viewTracker';
import { getDraftPosts } from '../utils/draftStore';
import SEO from '../components/SEO';
import webProductMarkdown from '../../imports/pasted_text/pasted-attachment.txt?raw';
import prototypeMarkdown from '../../imports/pasted_text/prototyping-startup-ideas.md?raw';

const SOURCE_MARKDOWN: Record<string, string> = {
  'webeing-product-development': webProductMarkdown,
  'prototyping-startup-ideas': prototypeMarkdown,
};

// "April 15, 2026" → "Apr 15, 2026"
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Anchor heading ───────────────────────────────────────────────────────────
function AnchorH2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} style={{ scrollMarginTop: '100px' }}>
      {children}
    </h2>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripMarkdownHeader(markdown: string) {
  const lines = markdown.split('\n');
  const dividerIndex = lines.findIndex(line => line.trim() === '---');
  return dividerIndex >= 0 ? lines.slice(dividerIndex + 1).join('\n').trim() : markdown.trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/\\_/g, '_')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function MarkdownImage({ src, alt, fileName }: { src: string; alt: string; fileName: string }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <figure className="missing-image">
        <div>
          <span>{fileName}</span>
          <small>Place this image in public/blog-images</small>
        </div>
      </figure>
    );
  }

  return (
    <figure>
      <img src={src} alt={alt} onError={() => setMissing(true)} />
    </figure>
  );
}

function CoverImage({ post }: { post: Post }) {
  const [missing, setMissing] = useState(false);
  const fileName = post.coverImage?.split('/').pop() || `${slugify(post.title)}_1.jpg`;

  if (!post.coverImage) return null;

  if (missing) {
    return (
      <div className="rounded-xl overflow-hidden mb-10">
        <div className="cover-missing-image">
          <span>{fileName}</span>
          <small>Place this image in public/blog-images</small>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden mb-10">
      <img
        src={post.coverImage}
        alt={post.title}
        className="w-full aspect-[16/9] object-cover"
        onError={() => setMissing(true)}
      />
    </div>
  );
}

function MarkdownContent({ markdown, post }: { markdown: string; post: Post }) {
  const content = stripMarkdownHeader(markdown);
  const blocks = content.split(/\n{2,}/).map(block => block.trim()).filter(Boolean);
  let imageIndex = 0;

  return (
    <div className="prose-content">
      {blocks.map((block, i) => {
        if (block === '---') return <hr key={i} />;

        const imageMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imageMatch) {
          imageIndex += 1;
          const fileName = `${slugify(post.title)}_${imageIndex}.jpg`;
          return (
            <MarkdownImage
              key={i}
              src={`/blog-images/${fileName}`}
              alt={imageMatch[1] || post.title}
              fileName={fileName}
            />
          );
        }

        if (block.startsWith('## ')) {
          const title = block.replace(/^##\s+/, '');
          return (
            <AnchorH2 key={i} id={slugify(title.replace(/\\</g, '').replace(/\\>/g, ''))}>
              <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(title) }} />
            </AnchorH2>
          );
        }

        if (block.startsWith('### ')) {
          return (
            <h3 key={i} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(block.replace(/^###\s+/, '')) }} />
          );
        }

        if (block.startsWith('>')) {
          const lines = block.split('\n').map(line => line.replace(/^>\s?/, '')).filter(Boolean);
          return (
            <blockquote key={i}>
              {lines.map((line, lineIndex) => (
                <p key={lineIndex} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(line) }} />
              ))}
            </blockquote>
          );
        }

        if (/^- /.test(block)) {
          return (
            <ul key={i}>
              {block.split('\n').map((line, lineIndex) => (
                <li
                  key={lineIndex}
                  dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(line.replace(/^- /, '')) }}
                />
              ))}
            </ul>
          );
        }

        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(block.replace(/\n/g, '<br />')) }} />
        );
      })}
    </div>
  );
}

// ─── Post body content ────────────────────────────────────────────────────────
function PostContent({ post }: { post: Post }) {
  if (post.sourceMarkdown && SOURCE_MARKDOWN[post.sourceMarkdown]) {
    return <MarkdownContent markdown={SOURCE_MARKDOWN[post.sourceMarkdown]} post={post} />;
  }

  // Dashboard-created posts: render plain body as paragraphs
  if (post.body) {
    return (
      <div className="prose-content">
        {post.body.split('\n\n').filter(Boolean).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    );
  }

  const slug = post.slug;
  if (slug === 'developing-a-web-product-for-a-startup') {
    return (
      <div className="prose-content">
        <p>
          Although I didn't major in programming, my experience in running a startup led me to recognize the necessity of
          programming skills, prompting me to start learning software development. The process from starting at zero to the
          culmination of building a fully-functional product took a significant amount of time.
        </p>
        <p>
          While developing the website, I often found myself reflecting on the question, <em>"Why do you want to learn
          programming?"</em> Similarly, there may be some readers who are wondering:
        </p>
        <p>
          <em>Is software development truly necessary for running a startup? How do I even begin developing a product for a
          startup? What methods do other startups use to develop their products?</em>
        </p>
        <p>
          Given these common questions, I decided to document the entire process of developing a product in a startup setting.
        </p>

        <AnchorH2 id="the-startup">Webeing — the startup I founded</AnchorH2>
        <p>
          Founding and running <strong>Webeing</strong> — a startup focused on selling unsold inventory and products nearing
          their expiration dates from partnered restaurants — made me realize the necessity of software development. So, I
          decided to take action and learn.
        </p>
        <p>
          It is impossible to run a startup without knowledge of IT. However, without team members who possess advanced
          software development knowledge, navigating this terrain is incredibly challenging. Many questions arise: when to
          start development, how to design the architecture, how to budget for outsourcing, and what features are necessary.
          This motivated me to learn programming and take on the development role for myself.
        </p>
        <p>
          Fortunately, I had the help of my friends from 'LikeLion,' a student-run programming educational community, to
          develop this service together. We decided to revisit and strengthen our overall plan to enhance competitiveness and
          transition our ideas into development.
        </p>

        <AnchorH2 id="planning-design">Planning and Prototype Design</AnchorH2>
        <p>
          Just as a solid foundation is crucial for building a stable structure, my team dedicated a significant amount of
          time to <strong>planning and design</strong>.
        </p>
        <p>
          In collaborative environments, I prefer candid and critical discussions over unanimous decisions. Despite being
          close friends, my Webeing team and I approached our meetings with this mindset. This developed a comfortable
          environment that promoted honesty and quality feedback, without an atmosphere of defensiveness or judgement.
        </p>
        <p>
          During the planning phase, we focused on <strong>identifying ways to maximize our service's unique features</strong>{' '}
          and brainstormed additional functions that could differentiate our product. We decided to enhance our service by
          incorporating a map API for convenient pickups and creating "environmental points" that could be redeemed for
          goods — so users could feel the tangible impact of their purchases.
        </p>
        <p>
          We benchmarked websites from companies such as 'Too Good To Go', 'Delivery Hero', and Korean food-delivery
          services like 'Baemin', 'Yogiyo', and 'Last Order' to provide us with inspiration for user-friendly UI/UX.
        </p>

        <AnchorH2 id="development-github">Development and GitHub Collaboration</AnchorH2>
        <p>
          With the groundwork laid, we began the development phase in earnest. <strong>Collaboration in development
          necessitates the use of Git</strong>. However, Git can be quite challenging to understand initially, and adapting
          to it was a significant hurdle for me.
        </p>
        <p>
          With our team of five, we divided various tasks and roles. We split the work between front-end and back-end.
          Within the full stack, I primarily focused on the front-end. Originally, our goal was to utilize Vue.js and Django
          Rest Framework (DRF), but we ended up using only Django due to the volume of work and limited time.
        </p>
        <p>
          Creating the landing page alone took several weeks. Progress was slow initially, but after completing the first
          page, my understanding improved, allowing me to develop other pages more quickly.{' '}
          <strong>Spending ample time on prototyping greatly facilitated front-end development.</strong>
        </p>

        <AnchorH2 id="deployment">Deployment Using AWS and Domain Connection</AnchorH2>
        <p>
          After completing development, we used <strong>AWS to create an EC2 instance for deployment.</strong> This process
          was not without its own challenges. We encountered issues with image uploads (incorrectly configured
          static_root/media_root settings) and routing the domain to the Elastic Beanstalk URL took longer than expected.
        </p>
        <p>
          After approximately more than six months of hard work, we successfully launched the service and submitted it to
          the 'LikeLion Hackathon.' Out of around 70 participating teams, we proudly won a gold award by securing second
          place.
        </p>
        <p>
          Following deployment, we actively marketed the service to acquaintances and Webeing partners, resulting in some
          real transactions. We received feedback about the user interface being inconvenient, and the web version was
          largely unused by users after a few months.{' '}
          <strong>Initially, accepting this reality was difficult.</strong> After months of sleepless nights and hard work,
          I experienced a period of depression, questioning my motivation. However, I resolved to change my perspective.
        </p>

        <AnchorH2 id="feedback">Feedback and Learning</AnchorH2>
        <p>
          Refocusing my efforts, I sought feedback to improve future projects. I collected input from people interested in
          startups, general users, startup founders, UI/UX experts, and foreign friends. Some valuable insights:
        </p>
        <p>
          The utilization of the landing page and whether consumers understand the service at a glance. How to convince
          customers without strong branding. The fact that consumers are less patient and less interested than was expected.
        </p>
        <p>
          These insights proved invaluable for prioritizing and setting criteria for future startup projects.
        </p>

        <AnchorH2 id="bottom-line">The Bottom Line</AnchorH2>
        <p>
          Admittedly, we couldn't fully capitalize on our project. However,{' '}
          <strong>the fact that it was actually used by people, rather than just remaining as a side project, is immensely
          gratifying.</strong> We definitely learned valuable lessons.
        </p>
        <p>
          By focusing more on the consumer's perspective, we learned how product development and UI should be structured
          and executed. We now understand the importance of a solid preliminary process before development — including
          planning, design, and the overall workflow.
        </p>
        <p>
          Product development is a crucial process. However, rather than rushing results, it's important to solidify
          development at the necessary stages. In essence,{' '}
          <strong>planning and design must be solidified before development.</strong>
        </p>
        <p>
          Through studying, and actual real-life service development, I experienced the entire process of{' '}
          <em>'Planning — Design — Development — Test — Feedback'</em>. I understood the organic relationship between all
          stages, broadening my perspective and enabling me to see the big picture.{' '}
          <strong>It won't be easy, but I believe it's worth it.</strong>
        </p>
      </div>
    );
  }

  if (slug === 'designing-a-prototype-for-a-startup') {
    return (
      <div className="prose-content">
        <p>
          If you're curious about design and prototyping, you're likely already considering or working on product
          development for a project or startup. Before diving deeper, it's important to reflect on these questions:
        </p>
        <p>
          <em>How much do you know about prototypes? How critical do you think prototypes are?</em>
        </p>
        <p>
          As a writer and ex-founder of a startup, I initially underestimated the importance of prototypes when
          brainstorming ideas and creating pitch materials. However, I now realize that developing pitch materials
          without a prototype is almost ineffectual.
        </p>
        <p>
          Just as a building requires a blueprint before construction, or food needs a recipe before cooking,
          developing an app or website demands a specific and strategic plan — a prototype serves this exact purpose.
        </p>

        <AnchorH2 id="what-is-a-prototype">What is a Prototype?</AnchorH2>
        <p>
          A prototype is a simulation or sample version of the final product used for testing before launch. The
          primary purpose of creating a prototype is to test a product or idea before investing significant time and
          money into its final development.
        </p>
        <p>
          Prototyping is essential for identifying and resolving usability issues. Once the draft prototype is in your
          users' hands, you'll discover if they actually want to use it, and if the core features satisfy user needs.
          Based on their feedback, you can validate your hypotheses, analyze tests, and modify or improve your
          products. This allows you to adjust and refine, and facilitates smoother development.
        </p>

        <AnchorH2 id="role-of-prototyping">The Role of Prototyping</AnchorH2>
        <p>
          <strong>Visualization enhances persuasiveness and clarifies ideas.</strong> Simply having an idea doesn't
          immediately guarantee the realization of your vision. A prototype transforms ideas into tangible products —
          websites, apps, or other mediums — that connect with users. Which is more persuasive to you — a recipe for
          a hotdog or a picture of one?
        </p>
        <p>
          <strong>Prototyping enables rapid testing and decision-making.</strong> It's natural to encounter challenges
          when launching a service, but these experiences are valuable learning opportunities. The hypothesized image
          may not align with reality once the product reaches the market. Through prototyping, one can transform ideas
          into real features and create countless beta iterations — this process is called{' '}
          <strong>MVP (minimum viable product) testing</strong>. Through MVP tests, we can gather reactions and
          feedback, identifying weaknesses and new insights. This iterative process of refining and pivoting is
          crucial for finding <strong>product-market fit (PMF)</strong>.
        </p>
        <p>
          <strong>Prototyping encourages critical thinking.</strong> As we develop an idea into a product,
          unexpected challenges arise — prompting us to think critically about how to present solutions in the
          most simple and effective way. From personal experience, engaging in this hands-on process not only
          provides invaluable insights but also reinforces the importance of turning thoughts into real actions.
        </p>

        <AnchorH2 id="choosing-tools">Choosing the Right Prototyping Tool</AnchorH2>
        <p>
          There are numerous prototyping design tools, and new ones are being launched all the time. Your choice
          depends on your project's purpose and the level of complexity you wish to implement.
        </p>
        <p>
          <strong>Paper Prototyping</strong> is ideal for those unfamiliar with design tools who want to visualize
          ideas quickly. It can't replace sophisticated tools, but it's definitely better than nothing.
        </p>
        <p>
          <strong>Adobe XD</strong> is useful for creating basic structures. Beginner-friendly with tutorials
          readily available online. Excellent for simple functionalities like button clicks and transitions.
        </p>
        <p>
          <strong>Protopie</strong> allows for variable assignment, making it suitable for more detailed and
          interactive prototypes. If you've already used Adobe XD, adapting to Protopie will be straightforward.
        </p>
        <p>
          <strong>Figma</strong> is the most popular tool currently. Notable for its collaborative features, this
          web-based program allows online real-time work. All UX/UI design is available within a single tool. It's
          intuitive with low learning hurdles.
        </p>

        <AnchorH2 id="webeing-prototypes">Webeing — 5 Prototype Iterations</AnchorH2>
        <p>
          For our startup Webeing, we went through 5 complete prototype iterations before reaching a shipped product.
          Each iteration taught us something different.
        </p>
        <p>
          The first iteration was a basic Adobe XD prototype to complement the business plan. The second integrated
          our idea with the software development plan — significantly increasing complexity, including location
          tracking via Kakao API and a points deposit system.
        </p>
        <p>
          By the third iteration, the main page underwent significant revisions: we added an introductory landing
          page, restructured the restaurant list, and streamlined the payment flow. The fourth iteration transitioned
          to Protopie for variable assignment — bringing the prototype closer to the actual service with thematic
          colors and dynamic content.
        </p>
        <p>
          After receiving feedback from the beta, we made our fifth and final iteration: a hybrid web-app that
          removed the landing page (customers were less interested than we expected) and focused on the core
          experience. <strong>We persisted in trying to find the midpoint between our core values and what our
          customers wanted.</strong>
        </p>

        <AnchorH2 id="bottom-line">The Bottom Line</AnchorH2>
        <p>
          Proposing a solution to a social problem and persuading others of my vision proved far more challenging
          than I had imagined during the ideation stage. The more you take a deep dive into a specific topic, the
          more likely it is that the imagined scenarios will not hold up.
        </p>
        <p>
          Therefore, <strong>the prototype must continuously be revised and adapted based on user feedback and
          market change.</strong> Sometimes, it might need to be completely overhauled. This is why having a
          prototype to set the direction is so important.
        </p>
        <p>
          Developing a prototype is just the beginning. Now, you will need to engage with users continuously using
          this prototype, identify their needs, and find a definitive product market fit. Whether big or small,
          we deserve applause for our relentless efforts to solve the many problems in this world and deliver our
          visions. <strong>Let's just do it together!</strong>
        </p>
      </div>
    );
  }

  if (slug === 'dokdo-security-police') {
    return (
      <div className="prose-content">
        <p>
          "I served my Korean military service for twenty-one months as a{' '}
          <strong>Dokdo Security Police</strong>."
        </p>
        <p>
          If you are a Korean citizen, you know that the island 'Dokdo' is our precious territory which we need to
          protect. It is the symbol of patriotism. Thus, it is not an exaggeration to say that{' '}
          <strong>Dokdo is another persona of Korea.</strong>
        </p>
        <p>
          As the author, and a Korean, my heart also beats deeply when Dokdo comes to my mind. Before becoming a
          Dokdo Security Police, I had already visited the island twice — once when I was in middle school and once
          in high school. So, after turning 19, the thought of applying for the position of Dokdo Security Police
          for my military service naturally came to me.
        </p>
        <p>
          However, <em>patriotism</em> is not the only reason why I applied for that position.
        </p>

        <AnchorH2 id="hunger-for-growth">A Hunger for Growth</AnchorH2>
        <p>
          I had a <em>hunger</em>, to say the least, to experience something new, or make myself grow, so that I
          could reclaim my self-esteem.
        </p>
        <p>
          <em>I wanted to <strong>know the world</strong> rather than just <strong>studying with no specific
          goals in mind</strong>.</em>
        </p>
        <p>
          After moving from my small hometown to Seoul, I was somewhat taken aback that people were living their
          lives in such different ways from what I knew. In fact, as a person who had only been studying hard up
          to that point in my life, I found it fascinating to see people who had achieved success and expressed
          themselves through fashion, music, or in ways other than studying. They seemed as different to me as if
          they were people from a different planet.
        </p>
        <p>
          I wanted to have <strong>my own color</strong> and <strong>my own story</strong>.
        </p>

        <AnchorH2 id="self-honesty">Learning to Be Honest with Myself</AnchorH2>
        <p>
          Before I turned 19, I wasn't honest with myself. I was a leader to people, and I always tried to be
          subjective and proactive. On the other hand, I was often insincere, and I buried myself in studying
          instead of allowing myself to be curious about other things, and instead of chasing what I really wanted.
        </p>
        <p>
          After getting into university, I tried to talk to people from different backgrounds as much as possible,
          completed a cycling trip from one end of Korea to the other, and questioned myself every day.
        </p>
        <p>
          <em><strong>I got to learn about the world in my own way.</strong></em>
        </p>
        <p>
          The more I experienced, the smaller I felt myself become. I wondered why I wasn't more honest in the past.
          The more I got to know the world, the more I came to know about myself.
        </p>
        <p>
          So, in order to retake my self-esteem, find my own color, and figure out what I truly wanted, I applied
          to become a <strong>Dokdo Security Police.</strong>
        </p>

        <AnchorH2 id="looking-back">Looking Back</AnchorH2>
        <p>
          It has been a while since I finished my military service. The reason why I am writing this retrospective
          now about my life in Dokdo and Ulleung-do (the sister island to Dokdo) is to encourage myself in the
          future to have more confidence and self-esteem in myself. At the same time, I am writing to encourage
          people — not just those from Korea but people from all over the world — to have more interest in Dokdo.
        </p>
        <p>
          I became proud of myself and got to learn more about myself after that period of being a Dokdo Security
          Police. I experienced something that deeply moved my heart, and in the future, I will continue to fight
          for something that makes my heart beat.
        </p>
        <p>
          Today, I share my story of Dokdo — <strong>21 months that changed my life.</strong>
        </p>

        <AnchorH2 id="final-thought">A Final Thought</AnchorH2>
        <p>
          I am not just proud of protecting Dokdo as a piece of territory. I am proud of who I became during those
          21 months — someone who learned to be more honest, more curious, and more willing to take action.
        </p>
        <p>
          If you're at a crossroads, consider this: sometimes the most unconventional path is the one that leads
          you back to yourself. For me, it was standing guard on a remote island in the East Sea.
        </p>
      </div>
    );
  }

  return null;
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
          <span className="text-xs text-gray-400 tracking-widest uppercase">{post.tags[0]}</span>
        </div>
      )}

      <div className="p-5">
        <h3
          className="text-gray-900 group-hover:text-black mb-2 leading-snug transition-colors"
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
  const [allPosts, setAllPosts] = useState<Post[]>(POSTS);

  useEffect(() => {
    const drafts = getDraftPosts();
    const draftSlugs = new Set(drafts.map(p => p.slug));
    setAllPosts([...drafts, ...POSTS.filter(p => !draftSlugs.has(p.slug))]);
  }, []);

  const post = allPosts.find(p => p.slug === slug);
  const magazine = slug ? getMagazineForPost(slug) : undefined;
  const position = slug ? getPositionInMagazine(slug) : undefined;

  // Track view on mount
  useEffect(() => {
    if (slug) trackView(slug, 'post');
  }, [slug]);

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
        <Link to="/blog" className="text-black underline underline-offset-4 text-sm">
          ← Back to Writing
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        image={post.coverImage}
        type="article"
      />
      {/* ── Article ── */}
      <article className="max-w-[48rem] mx-auto px-6 pt-10 pb-16">

        {/* ← Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400
                     hover:text-black transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Writing
        </Link>

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
        <p className="text-gray-500 mb-7 leading-relaxed" style={{ fontSize: '1.1rem' }}>
          {post.subtitle}
        </p>

        {/* Meta bar — magazine label left · date right */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {/* Left: magazine name */}
          {magazine ? (
            <Link
              to={`/magazine/${magazine.slug}`}
              className="text-xs text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
              style={{ letterSpacing: '0.12em' }}
            >
              {magazine.name}
              {position && (
                <span className="ml-2 not-uppercase normal-case tracking-normal text-gray-300">
                  {position}/{magazine.postSlugs.length}
                </span>
              )}
            </Link>
          ) : (
            post.tags[0] && (
              <span
                className="text-xs text-gray-400 uppercase"
                style={{ letterSpacing: '0.12em' }}
              >
                {post.tags[0]}
              </span>
            )
          )}
          {/* Right: date only */}
          <span className="text-xs text-gray-400 flex-shrink-0">
            {formatDate(post.date)}
          </span>
        </div>

        {/* Cover image */}
        <CoverImage post={post} />

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
          .prose-content h3 {
            font-size: 1.05rem;
            font-weight: 500;
            color: #111827;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
          }
          .prose-content a {
            color: #111827;
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .prose-content blockquote {
            border-left: 2px solid #e5e7eb;
            padding-left: 1rem;
            margin: 1.75rem 0;
          }
          .prose-content blockquote p {
            color: #4b5563;
            margin-bottom: 0.75rem;
          }
          .prose-content ul {
            list-style: disc;
            padding-left: 1.25rem;
            margin: 1rem 0 1.5rem;
          }
          .prose-content li {
            color: #374151;
            line-height: 1.8;
            margin-bottom: 0.55rem;
            font-size: 1.05rem;
          }
          .prose-content figure {
            margin: 2rem 0;
          }
          .prose-content figure img {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid #f3f4f6;
          }
          .prose-content .missing-image {
            border: 1px dashed #d1d5db;
            border-radius: 0.75rem;
            background: #fafafa;
            aspect-ratio: 16 / 9;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 1rem;
          }
          .prose-content .missing-image span {
            display: block;
            color: #111827;
            font-size: 0.9rem;
            overflow-wrap: anywhere;
          }
          .prose-content .missing-image small {
            display: block;
            color: #9ca3af;
            font-size: 0.75rem;
            margin-top: 0.35rem;
          }
          .cover-missing-image {
            border: 1px dashed #d1d5db;
            background: #fafafa;
            aspect-ratio: 16 / 9;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 1rem;
          }
          .cover-missing-image span {
            display: block;
            color: #111827;
            font-size: 0.9rem;
            overflow-wrap: anywhere;
          }
          .cover-missing-image small {
            display: block;
            color: #9ca3af;
            font-size: 0.75rem;
            margin-top: 0.35rem;
          }
          .prose-content hr {
            border: 0;
            border-top: 1px solid #f3f4f6;
            margin: 2rem 0;
          }
          .prose-content code {
            background: #f3f4f6;
            border-radius: 0.25rem;
            padding: 0.1rem 0.25rem;
            font-size: 0.9em;
          }
          .prose-content em { font-style: italic; }
          .prose-content strong { font-weight: 600; color: #111827; }
        `}</style>
        <PostContent post={post} />

        {/* ── End bar: magazine label left · share right ── */}
        <div className="flex items-center justify-between pt-10 mt-10 border-t border-gray-100">
          {magazine ? (
            <Link
              to={`/magazine/${magazine.slug}`}
              className="text-xs text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
              style={{ letterSpacing: '0.12em' }}
            >
              {magazine.name}
            </Link>
          ) : (
            post.tags[0] && (
              <span
                className="text-xs text-gray-400 uppercase"
                style={{ letterSpacing: '0.12em' }}
              >
                {post.tags[0]}
              </span>
            )
          )}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
                .then(() => { toast.success('Link copied!'); if (slug) trackShare(slug); })
                .catch(() => {});
            }}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-black transition-colors"
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
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors"
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
    </div>
  );
}
