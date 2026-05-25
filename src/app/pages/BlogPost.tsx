import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { POSTS } from '../data/posts';
import { getMagazineForPost, getPositionInMagazine } from '../data/magazines';
import SEO from '../components/SEO';

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

// ─── Post body content ────────────────────────────────────────────────────────
function PostContent({ slug }: { slug: string }) {
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

  if (slug === 'building-with-intention') {
    return (
      <div className="prose-content">
        <p>
          Intentional work begins before the first task is written down. It starts with asking what kind of change
          the work is supposed to create, and who will feel that change when it is finished.
        </p>
        <p>
          In an age where it is easy to generate, ship, and share more than ever, the harder skill is choosing what
          deserves attention. Speed is useful only when it is pointed in the right direction.
        </p>
        <AnchorH2 id="choosing-the-problem">Choosing the problem</AnchorH2>
        <p>
          The most expensive mistake in product work is solving a problem that does not matter. A beautiful interface
          cannot rescue a weak premise. A clever technical architecture cannot create demand where there is none.
        </p>
        <p>
          Before building, I try to understand the pain in plain language: what is frustrating, repeated, expensive,
          embarrassing, or emotionally heavy for the person on the other side?
        </p>
        <AnchorH2 id="working-with-a-point-of-view">Working with a point of view</AnchorH2>
        <p>
          Intentional work needs a point of view. Not a rigid opinion, but a clear belief about what should be better.
          Without that belief, every feature request looks equally reasonable and every tradeoff feels political.
        </p>
        <p>
          A point of view lets a team say no with confidence. It protects the product from becoming an archive of every
          meeting, every anxiety, and every compromise.
        </p>
        <AnchorH2 id="craft-and-usefulness">Craft and usefulness</AnchorH2>
        <p>
          I care about craft, but craft is not decoration. It is the discipline of making something understandable,
          reliable, and respectful of a user's time. The best details often disappear because they remove friction
          before anyone notices it.
        </p>
        <p>
          That kind of craft is quiet. It shows up in loading states, empty states, labels, defaults, error messages,
          and the order in which information appears.
        </p>
        <AnchorH2 id="closing">Closing</AnchorH2>
        <p>
          Building with intention does not mean moving slowly. It means moving with memory: remembering the user,
          the problem, the constraints, and the reason the work mattered in the first place.
        </p>
      </div>
    );
  }

  if (slug === 'the-art-of-constraints') {
    return (
      <div className="prose-content">
        <p>
          Constraints are often treated as obstacles, but in creative work they can become the structure that makes
          progress possible. A blank page is not freedom when every direction is equally available.
        </p>
        <AnchorH2 id="why-limits-help">Why limits help</AnchorH2>
        <p>
          A clear limit reduces the number of decisions a team has to make. When the budget, timeline, platform, or
          audience is fixed, energy can move from abstract debate into concrete problem solving.
        </p>
        <p>
          This is why prototypes are powerful. They narrow the question from "what could this become?" to "does this
          specific thing work for this specific person?"
        </p>
        <AnchorH2 id="constraints-as-a-design-tool">Constraints as a design tool</AnchorH2>
        <p>
          In interface design, constraints create hierarchy. A limited type scale makes content easier to scan. A limited
          color system makes meaning clearer. A limited feature set makes the product easier to explain.
        </p>
        <p>
          The goal is not austerity. The goal is coherence. When every part of a product has a job, the product starts
          to feel calm.
        </p>
        <AnchorH2 id="learning-through-pressure">Learning through pressure</AnchorH2>
        <p>
          The most useful constraints are honest. A deadline reveals priority. A small team reveals dependency. A low
          budget reveals whether the idea can survive without ceremony.
        </p>
        <p>
          Pressure is uncomfortable, but it can clarify what matters. The trick is to treat it as information, not as
          an excuse to lower standards.
        </p>
        <AnchorH2 id="takeaway">Takeaway</AnchorH2>
        <p>
          Creativity rarely comes from having every option. It comes from finding a precise move inside a real boundary.
          Constraints do not limit the work as much as they give the work its shape.
        </p>
      </div>
    );
  }

  if (slug === 'lessons-from-korean-design') {
    return (
      <div className="prose-content">
        <p>
          Korean design has always interested me because it balances restraint and intensity. Traditional forms often
          look quiet at first, but the more time you spend with them, the more structure and feeling you notice.
        </p>
        <AnchorH2 id="space-and-breath">Space and breath</AnchorH2>
        <p>
          Hanok architecture taught me to think about space as an active material. The courtyard, the threshold, and
          the empty room are not leftovers. They create rhythm, rest, and transition.
        </p>
        <p>
          Digital products need the same kind of breathing room. Without it, every element competes for attention and
          the user loses the thread.
        </p>
        <AnchorH2 id="humility-in-materials">Humility in materials</AnchorH2>
        <p>
          Many Korean objects carry a respect for material honesty: paper, wood, clay, stone. They are not trying to
          disguise themselves. Their texture is part of their meaning.
        </p>
        <p>
          In product design, that translates into interfaces that are honest about what they are doing. Clear labels,
          predictable behavior, and visible structure can be more valuable than visual novelty.
        </p>
        <AnchorH2 id="emotion-without-noise">Emotion without noise</AnchorH2>
        <p>
          Restraint does not mean coldness. Some of the most emotional design work is quiet because it trusts the user
          to feel rather than forcing an effect.
        </p>
        <p>
          That lesson matters online, where products often confuse animation, color, and volume for personality.
        </p>
        <AnchorH2 id="modern-product-lessons">Modern product lessons</AnchorH2>
        <p>
          The practical lesson is simple: design should create a relationship between people, context, and purpose.
          When a product understands its place in someone's life, it does not need to shout.
        </p>
      </div>
    );
  }

  if (slug === 'the-future-of-ai-in-creative-work') {
    return (
      <div className="prose-content">
        <p>
          AI is changing creative work, but not only by making production faster. The deeper change is that it shifts
          the value of judgment. When generating options becomes cheap, choosing well becomes more important.
        </p>
        <AnchorH2 id="from-output-to-direction">From output to direction</AnchorH2>
        <p>
          A creative worker used to spend much of their time producing first drafts. AI can now create many of those
          drafts quickly. But it cannot know which draft is right without context, taste, and intent.
        </p>
        <p>
          This moves the work upstream. The question becomes less "can I make something?" and more "what should exist,
          for whom, and why now?"
        </p>
        <AnchorH2 id="taste-as-an-operating-system">Taste as an operating system</AnchorH2>
        <p>
          Taste is not decoration. It is a system for making decisions under ambiguity. Good taste notices what feels
          false, excessive, lazy, or misaligned before those problems become expensive.
        </p>
        <p>
          AI makes taste more visible because it produces plausible work so easily. Plausible is not the same as true.
        </p>
        <AnchorH2 id="collaboration-with-machines">Collaboration with machines</AnchorH2>
        <p>
          The best use of AI in my workflow is not replacement. It is acceleration of exploration: more angles, faster
          comparison, quicker synthesis, and a lower cost of testing weak ideas.
        </p>
        <p>
          The human role remains responsibility. Someone has to decide what is accurate, ethical, useful, and worth
          shipping.
        </p>
        <AnchorH2 id="what-stays-human">What stays human</AnchorH2>
        <p>
          Creative work is ultimately about meaning. Tools can help us make, but they do not care. The future belongs
          to people who can combine technical fluency with taste, empathy, and a clear sense of consequence.
        </p>
      </div>
    );
  }

  if (slug === 'notes-on-productive-workflows') {
    return (
      <div className="prose-content">
        <p>
          My best workflows are not the most complicated ones. They are the ones that make the next action obvious and
          reduce the number of times I have to restart from memory.
        </p>
        <AnchorH2 id="capture-before-organization">Capture before organization</AnchorH2>
        <p>
          I try to capture ideas quickly before judging them. Organization can happen later, but the first job is to
          prevent useful observations from disappearing during a busy day.
        </p>
        <p>
          A rough note is better than a perfect system that I avoid using.
        </p>
        <AnchorH2 id="make-context-visible">Make context visible</AnchorH2>
        <p>
          A workflow improves when context is visible: the goal, the current state, the open question, and the next
          action. This is especially true when working with other people or with AI tools.
        </p>
        <p>
          Clear context prevents repeated explanation and helps the work continue after interruptions.
        </p>
        <AnchorH2 id="protect-deep-work">Protect deep work</AnchorH2>
        <p>
          Productivity is not just throughput. Some work needs uninterrupted time because the value comes from holding
          a complex problem in your head long enough to see its shape.
        </p>
        <p>
          I block time for writing, design review, and architectural thinking because those activities suffer when they
          are sliced into small fragments.
        </p>
        <AnchorH2 id="review-and-adjust">Review and adjust</AnchorH2>
        <p>
          A workflow should change when the work changes. The point is not to worship a system. The point is to keep
          learning where attention leaks and where decisions get stuck.
        </p>
      </div>
    );
  }

  // Generic fallback for other posts
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
  const post = POSTS.find(p => p.slug === slug);
  const magazine = slug ? getMagazineForPost(slug) : undefined;
  const position = slug ? getPositionInMagazine(slug) : undefined;

  // Related posts: sorted by shared tag count
  const related = post
    ? POSTS
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
          .prose-content em { font-style: italic; }
          .prose-content strong { font-weight: 600; color: #111827; }
        `}</style>
        <PostContent slug={slug!} />

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
                .then(() => toast.success('Link copied!'))
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
