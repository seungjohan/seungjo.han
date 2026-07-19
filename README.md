# seungjo.han

Personal portfolio and blog site — built as both a professional showcase and a living
laboratory for agentic engineering workflows.

---

### What this is

A prerendered React site covering:
- **Home / About** — profile and background
- **Projects** — case-study pages per project
- **Blog** — posts with individual post pages

Every route is rendered to static HTML at build time (see _Rendering_ below), so each
page ships with its own title, OpenGraph tags, and JSON-LD — which social crawlers and
search engines read without running JavaScript.

### Tech stack

- **Frontend:** React 18 + TypeScript, [Vite](https://vitejs.dev/) as the build tool
- **Framework/Routing:** [React Router v7](https://reactrouter.com/) in framework mode
- **Styling:** Tailwind CSS v4
- **Animation:** [Motion](https://motion.dev/)
- **Deployment/hosting:** Vercel

### Rendering

The site uses React Router's framework mode with `ssr: false` and a `prerender` list
(see [react-router.config.ts](react-router.config.ts)). At build time, every static
route and every blog/project slug is rendered to an `index.html` under `build/client/`.
There is no runtime server — the output is a static site with per-page `<head>` metadata.

Per-page metadata is declared with route `meta` exports built via
[src/app/components/SEO.tsx](src/app/components/SEO.tsx); the HTML document shell
(analytics, favicon, site verification) lives in [src/app/root.tsx](src/app/root.tsx).

### Project structure

```
src/
  app/
    root.tsx          HTML document shell (<html>/<head>/<body>, analytics)
    routes.ts         Route definitions
    pages/            Route-level pages (Home, About, Blog, Projects, ...)
    components/       Shared components (Layout, SEO, SearchModal, markdown/)
    data/             Static/content data (posts, projects)
  styles/             Global styles
  imports/            Imported/pasted markdown content sources
public/               Static assets (images, favicon, robots.txt, sitemap.xml)
scripts/              Build-time scripts (sitemap generation, asset verification)
docs/                 Project docs and engineering notes
```

### Commands

```
npm run dev         Start the dev server
npm run build       Prebuild (sitemap + asset verify) then prerender to build/client
npm run typecheck   tsc --noEmit
npm run preview     Serve the production build locally
```

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs typecheck + build on
every push and pull request.

### Docs

- [STRATEGY.md](STRATEGY.md) — vision, technical principles, roadmap
- [PRD.md](PRD.md) — product requirements
- [docs/](docs/) — engineering notes and handoffs
