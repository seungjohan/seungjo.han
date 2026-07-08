import SEO from '../components/SEO';

const aboutSections = [
  {
    title: 'Getting to Know Myself, Getting to Know the World',
    body: "In the process of getting to know the world and the people in it, I've also been forced to confront a harder question: who am I, really. I keep asking myself what role I can play, and what positive impact I can leave behind. And because I want to share that process — the challenges and the energy behind them — with other people, I've come to love expressing myself in as many forms as I can.",
  },
  {
    title: 'Paying It Forward',
    body: "I always do believe in paying it forward. I try to live my life offering as much kindness as I can to the people around me. If a small act of kindness from me can make someone's day a little warmer, that gives me real joy — and I know, in the end, that same kindness ends up warming my own day too. I've learned that changing my own life for the better, and keeping it bright, ultimately comes down to extending kindness to others — so I try to meet the world and the people in it with an open, sincere, and bright outlook. I'm also a care-giver at heart, and one of the ways I like to show that to the people I love is through warm, home-cooked food. I enjoy cooking and taking on dishes from all kinds of cuisines — Korean, Italian, French, Chinese, Japanese, Spanish, Mexican, Vietnamese, and more.",
  },
  {
    title: 'Travel, Language, and Culture',
    body: "I understand the world through travel, language, and culture, and I've always been deeply curious about diversity and respect. Serving in the military as part of the Dokdo Defense Unit taught me something about Korea, and about pride. Studying Spanish, French, and English keeps me constantly exploring new frames for looking at the world from different angles. Traveling, both at home and abroad, talking with all kinds of people, and sharing my own life and values with them — that's how I keep learning just how wide and varied the world really is.",
  },
  {
    title: 'Building Ideas Into the World',
    body: "I studied software engineering to pull my ideas out into the world, and I've tried, through founding a startup, to use those ideas to make some kind of positive impact. I keep thinking, keep questioning, and keep trying to connect the thoughts and experiences I've gathered across different fields, using them to take on new challenges from new angles. Beyond AI, I'm drawn to a wide range of industries — metaverse, travel, advertising, dreams, inspiration, culture, sports, medicine, finance, film, music, food, housing, and more.",
  },
  {
    title: 'Music and Writing',
    body: "Music and writing are the two ways I express myself most actively. I try to put the episodes from my own challenges and experiences into words, and turn them into something that can inspire and energize other people. Sharing the times I struggled — the process, the specific moments — and passing that energy on, while also receiving energy back from others, is where I find real momentum: growing together through that kind of synergy. I listen to a wide spectrum of music, and I'm working on composing, trying to carry the messages I want to say through it. I can play piano, I love movie soundtracks, and someday I'd like to be part of an orchestra.",
  },
  {
    title: 'Sports',
    body: "Through sports, I like moving through nature and constantly testing my own limits. I love swimming in the ocean more than almost anything, and I once cycled the full length of the country. Cutting through the wind, feeling the aura of wide-open nature — that's genuinely one of the happiest moments of my life, and it's why I love exercising outdoors. I also enjoy snowboarding. Someday I want to travel the world by bicycle, swimming in the seas of different regions along the way.",
  },
  {
    title: 'Connecting the Dots',
    body: 'I believe in something like connecting the dots — that enough varied experience eventually resolves into a single story. Looking at the world through constant trial and error and endless curiosity, I try not to put limits on the dreams I carry. I\'d rather say "yes" than "no," and keep living a life of asking, challenging, and exploring.',
  },
];

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-8 md:px-12 py-20 md:py-28">
      <SEO
        title="About"
        description="About Seungjo Han, a product manager, multilingual learner, triathlete, composer, cook, thinker, and listener."
        path="/about"
      />

      {/* ── Portrait ── */}
      <div className="mb-12">
        <img
          src="/public/favicon.svg"
          alt="Seungjo Han"
          loading="eager"
          decoding="async"
          className="w-full object-contain"
          style={{ height: 'auto', display: 'block' }}
        />
      </div>

      {/* ── Text ── */}
      <div>
        <h1
          className="text-gray-900 mb-1"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Seungjo Han
        </h1>
        <p className="text-gray-400 mb-10" style={{ fontSize: '0.875rem' }}>
          Product manager, Writer, Multilingual learner, Triathlete, Composer, Cook, Thinker, and Listener
        </p>

        <div className="space-y-8 text-gray-700 leading-relaxed" style={{ fontSize: '1rem' }}>
          <p>
            I'm Seungjo Han. I try to live a life of curiosity — always asking questions, always exploring, staying open to challenge, and quietly practicing the idea of paying it forward.
          </p>
          {aboutSections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-gray-900" style={{ fontSize: '1.15rem', fontWeight: 400 }}>
                {section.title}
              </h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>

    </div>
  );
}
