import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="space-y-6">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
          Portfolio and Blog
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          I build software, document growth, and share engineering lessons.
        </h1>
        <p className="max-w-2xl text-lg">
          This site is built for recruiters, hiring teams, and peers who want a
          clear view of my projects, writing, and how I approach problems.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
          >
            View Projects
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
          >
            Read Blog
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
          >
            Contact Me
          </Link>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        <article className="rounded-2xl border border-neutral-200 p-5">
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Focus
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight">Projects</h2>
          <p className="mt-2 text-sm">
            Product-minded engineering work with measurable outcomes.
          </p>
        </article>
        <article className="rounded-2xl border border-neutral-200 p-5">
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Writing
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight">Blog</h2>
          <p className="mt-2 text-sm">
            Notes on growth, career decisions, and technical challenges.
          </p>
        </article>
        <article className="rounded-2xl border border-neutral-200 p-5">
          <p className="text-xs uppercase tracking-wider text-neutral-500">
            Profile
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight">About</h2>
          <p className="mt-2 text-sm">
            Career direction, values, and what I am building toward.
          </p>
        </article>
      </section>

      <section className="space-y-4 rounded-2xl border border-neutral-200 p-6">
        <p className="text-xs uppercase tracking-wider text-neutral-500">
          Quick Intro
        </p>
        <p>
          I care about building reliable user-facing systems, writing clear
          documentation, and growing through deliberate practice. This site is
          where I keep the best evidence of that journey.
        </p>
      </section>
    </div>
  );
}
