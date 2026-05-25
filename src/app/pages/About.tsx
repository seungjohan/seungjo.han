import SEO from '../components/SEO';

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-8 md:px-12 py-20 md:py-28">
      <SEO
        title="About"
        description="About Seungjo Han, a Seoul-based product manager and builder working across design, technology, and entrepreneurship."
        path="/about"
      />

      {/* ── Portrait ── */}
      <div className="mb-12">
        <img
          src="https://images.unsplash.com/photo-1706195546853-a81b6a190daf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcmVhZGluZyUyMGJvb2tzJTIwY29mZmVlfGVufDF8fHx8MTc3NzAxMjAzN3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Seungjo Han"
          loading="eager"
          decoding="async"
          className="w-full object-cover"
          style={{ aspectRatio: '3/2', display: 'block' }}
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
          Designer &amp; Writer · Seoul, KR
        </p>

        <div className="space-y-5 text-gray-700 leading-relaxed" style={{ fontSize: '1rem' }}>
          <p>
            I'm a designer and writer based in Seoul, focused on creating
            thoughtful digital experiences that connect with people. My work
            sits at the intersection of design, technology, and storytelling.
          </p>
          <p>
            I started out building visual interfaces, then found myself drawn
            deeper into the question of <em>why things feel the way they
            feel</em> — why some products feel effortless and others feel
            like a chore.
          </p>
          <p>
            That curiosity has taken me across disciplines: product design,
            brand identity, editorial writing, and systems thinking. I believe
            the best work comes from staying uncomfortable long enough to find
            a real answer.
          </p>
          <p>
            My recent focus is on crafting cohesive, human-centered
            experiences — from the first word on a landing page to the
            micro-interaction on a button.
          </p>
          <p>
            Outside of work, you'll find me exploring new cafes, shooting on
            film, hiking trails with no signal, and reading anything I can get
            my hands on.
          </p>
        </div>
      </div>

    </div>
  );
}
