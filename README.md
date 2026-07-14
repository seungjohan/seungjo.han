# seungjo.han

Personal portfolio and blog site — built as both a professional showcase and a living
laboratory for agentic engineering workflows.

---

### What this is

A single-page React app covering:
- **Home / About** — profile and background
- **Projects** — case-study pages per project
- **Blog** — posts with individual post pages
- **Magazine** — a separate content section with its own detail pages
- **Admin panel** — password-protected content/dashboard tools, backed by serverless
  auth endpoints

### Tech stack

- **Frontend:** React 18 + TypeScript, [Vite](https://vitejs.dev/) as the build tool
- **Routing:** React Router v7
- **Styling/UI:** Tailwind CSS v4, [shadcn](https://ui.shadcn.com/)-style components on
  Radix UI primitives, MUI (being phased out in favor of Shadcn/Tailwind — see
  [STRATEGY.md](STRATEGY.md))
- **Animation:** Motion
- **Backend:** Vercel serverless functions (`/api`) for admin auth
- **Deployment/hosting:** Vercel

### Project structure

```
api/                  Vercel serverless functions (admin login/logout/session check)
src/
  app/
    App.tsx           Root component
    routes.tsx         Route definitions
    pages/            Route-level pages (Home, About, Blog, Projects, Magazine, admin/, ...)
    components/       Shared components (Layout, SEO, SearchModal, ui/, figma/)
    data/             Static/content data
    utils/            Helpers
  styles/             Global styles
  imports/            Imported/pasted content assets
public/               Static assets (images, favicon, robots.txt, sitemap.xml)
scripts/              Build-time scripts (sitemap generation, asset verification)
docs/                 Project docs and engineering notes
```


### Docs

- [STRATEGY.md](STRATEGY.md) — vision, technical principles, roadmap
- [PRD.md](PRD.md) — product requirements
- [docs/](docs/) — engineering notes and handoffs
