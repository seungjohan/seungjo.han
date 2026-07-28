# PRD — seungjohan.com

**Owner:** Seungjo Han (한승조)
**Version:** 5.0
**Updated:** July 28, 2026
**Status:** Live at https://seungjohan.vercel.app

---

## 0. What this document is

Product intent: what the site is for, what it must do, what it deliberately
does not do, and the bar any change has to clear.

**It is not an implementation spec.** Versions 1.0–4.2 of this file were —
they carried DOM trees, Tailwind class names, animation easing constants and
verbatim page copy. That is why the whole document rotted into a wrong-in-every-
section historical artifact the moment the architecture changed, and had to
carry a DO-NOT-FOLLOW banner for two months. Anything a reader can get by
opening the file is not repeated here.

| Question | Read instead |
|---|---|
| How does the site work? | `CLAUDE.md` |
| How do I run/build it? | `README.md` |
| What routes exist? | `src/app/routes.ts`, `react-router.config.ts` |
| What are the design tokens? | `src/styles/theme.css` |
| What's the current task list? | `docs/plans/next-checklist.md` |

If this file disagrees with the code, the code is right and this file is a bug.

---

## 1. Purpose & audience

A personal site doing three jobs for one person with no marketing budget and no
team.

**Primary reader:** a recruiter, hiring manager, or potential collaborator who
arrived from a LinkedIn profile, a search result, or a shared link, and who will
decide in under a minute whether to keep reading.

That reader shapes every requirement below. They are skeptical, time-poor, and
able to verify claims. They may arrive on any page, not the home page — which is
why per-page metadata and a real 404 matter more than they would on a site
people enter through the front door.

**Secondary reader:** the owner, who writes here, and future agents working on
the repo.

---

## 2. Surfaces

### 2.1 Identity — `/`, `/about`

First impression. Name, role, location, a short bio, and direct contact paths
(email, LinkedIn). No form, because there is no backend to receive one.

**Must:** load fast, read as a person rather than a template, and give a
one-click way to make contact.

### 2.2 Portfolio — `/projects`, `/projects/:slug`

Six case studies. The listing shows each project's outcome; the detail page
shows outcome, context, and what the owner personally did.

**Must:** make the owner's individual contribution legible — a case study that
describes what a *team* achieved is worthless to someone deciding whether to
hire one person. Hence `whatIDid` and `whatIDidBullets` being required fields
rather than optional flourish.

**Must:** every claim survives a follow-up question in an interview. See §5.

### 2.3 Blog — `/blog`, `/blog/:slug`

Long-form writing, filterable by tag. Four posts today. Writing-first: no
sidebar, no share widgets, no reading-time estimate, no comments.

**Must:** adding a post is one folder and no code change. This is the single
most important requirement on the blog, because the failure mode for a personal
blog is not bad design — it is the owner not posting. Any friction added to
publishing is a regression.

---

## 3. Content model

Two content types, one rule shared between them: **one directory per item, and
the directory name is the slug.**

```
src/content/blog/<slug>/index.md      ← frontmatter + markdown body
src/content/projects/<slug>/index.ts  ← typed structured data
```

The slug is never written down anywhere else. Before this, four separate build
scripts regex-scraped `slug: '...'` out of TypeScript as raw text; a slug
written as a template literal broke prerendering, the sitemap, and SEO analysis
simultaneously, with no error message. A directory listing cannot miss.

### Why the two types differ

Posts are prose with few fields → markdown with YAML frontmatter.
Projects are 18 structured fields plus the slug, several containing commas →
TypeScript, so the compiler checks them.

If case studies ever grow real long-form narrative, add `body.md` beside
`index.ts` rather than moving structured data into frontmatter.

### Required fields

Required means the build fails, not that a default is substituted.

| Type | Required | Rationale |
|---|---|---|
| Post | `title`, `subtitle`, `date`, `tags`, `excerpt` | `excerpt` feeds the listing and the social card; absent, both degrade silently |
| Project | `outcome`, `impact`, `whatIDid`, `whatIDidBullets` | these four *are* the case study; an empty one renders a heading over nothing |

Optional-but-checked: `coverImage` (verified to exist, case-exactly, and to sit
inside its size budget), `focusKeyword`, `secondaryKeywords`.

---

## 4. Non-goals

| Out of scope | Reason |
|---|---|
| CMS or database | Content is files in the repo. Version-controlled, diffable, no service to keep alive. |
| Authentication / admin panel | Existed; removed in `8aafb93`. A password-in-localStorage admin panel on a static site is a liability with no upside for a single author. |
| Comments, newsletter capture | No backend, and neither serves the primary reader. |
| Runtime SSR | Prerender gives crawlers real HTML with zero server to operate. The goal was never SSR — it was per-page metadata. |
| Test runner | Deliberate. See §5. |
| Custom domain | `seungjohan.vercel.app` is production. `SITE_URL` in `SEO.tsx` is correct as written. |
| i18n / Korean variant | Wanted, not scoped. See §7. |

**Shipped since these were non-goals:** analytics (GA4, in `root.tsx`) and
prerendering. The v1 table listed both as out of scope; that table is why this
document now records reasons rather than just verdicts.

---

## 5. The quality bar

### 5.1 The gates are the test suite

There is no test runner **on purpose**. For a 14-route static site the deploy
artifact is the thing under test, so the gates assert against prerendered HTML
and real files rather than against mocks. Treat them as tests: they must stay
honest, and a gate that cannot fail is worse than no gate — it reports success.

`npm run build` runs three stages, any of which fails the build:

| Stage | Gate | Enforces |
|---|---|---|
| prebuild | `tsc --noEmit` | types |
| | `generate-sitemap.mjs` | sitemap matches the prerender list |
| | `verify-assets.mjs` | every referenced asset exists **case-exactly**, no `/public/` prefixes, project fields non-empty, per-class size budgets |
| build | `react-router build` | every route prerenders |
| postbuild | `finalize-404.mjs` | `404.html` exists for Vercel's static handler |
| | `check-seo.mjs` | every page has `<title>`, description, correct canonical, is in the sitemap; **no two pages in a route family share a body paragraph** |

`npm run smoke` runs separately, *after* deploy, over HTTP. It asserts what the
build gates structurally cannot see: status codes, redirects, and content types.
Both of this site's worst production bugs were invisible to the build — an image
returning 200 `text/html` into an `<img>`, and unmatched URLs returning 200 with
the home page's markup. Run it against a preview URL before promoting.

### 5.2 Verify against the commit, not the working tree

A green gate run proves nothing if it ran against uncommitted files. This branch
shipped nine commits whose HEAD did not typecheck, because the fix lived in the
working tree the whole time. Before pushing: `git stash && npm run check`.

### 5.3 Every claim must be true

This is a portfolio. **A fabricated metric a recruiter cannot verify is worse
than no metric** — it converts the entire site into something they have to
discount.

This has been violated once, at scale: all six project pages published the line
*"reduced drop-off by 40%, improved user satisfaction scores…"* from a fallback
branch keyed on a slug that did not exist. Nobody wrote those numbers about any
real project; a placeholder became a claim by being rendered.

Two rules follow, and both are enforced:

1. **Never hardcode content prose in a component.** No `if (slug === '…')`
   branches returning JSX copy. Content lives in `projects.ts` or a markdown
   file, nowhere else. `check-seo.mjs` fails the build when two pages in a route
   family share a body paragraph, which is the signature of a fallback.
2. **Numbers get audited before they ship.** Currently outstanding:
   `HERO_STATS` and `BOTTOM_STATS` in `src/app/pages/Projects.tsx` — six figures
   inherited from a design pass, live and unverified. Owner-assigned.

### 5.4 Accessibility & weight

Baseline, not aspiration: keyboard-reachable interactive elements, focus
restored on dialog close, `prefers-reduced-motion` honoured, no auto-advancing
carousel without a pause control (WCAG 2.2.2), and no `<button>` inside `<a>`.

Asset budgets are enforced per class — favicon 15KB, apple-touch-icon 100KB,
og-image 300KB, content images 500KB. There is **no exemption list**; it was
deleted once the last three offenders were re-encoded, and it should not come
back. `public/` is 9MB, down from 38MB.

---

## 6. Constraints that bite

Written down because each has already caused a silent, shipped bug.

**Asset paths are case-sensitive in production.** macOS is not. Vercel serves
from Linux, where `/x.jpg` does not find `X.JPG`. `verify-assets.mjs` matches
case-exactly for this reason — `fs.existsSync()` cannot be used, it is
case-insensitive on APFS and made the check unreachable on the dev machine.

**`vercel.json` rewrites run after the filesystem check.** A catch-all rewrite
turns every missing asset and every typo'd URL into a 200 serving the home page.
The file is now `{"outputDirectory": "build/client"}` and should stay that way.

**`public/sitemap.xml` is generated and untracked.** Never edit by hand.

**A `VITE_`-prefixed env var is inlined into the client bundle.** Leftovers from
the removed admin panel (`VITE_ADMIN_AUTH_*`) are still in `.env`. Deleting the
line does not rotate a secret that has already shipped in a bundle.

---

## 7. Known limitations

| Limitation | Impact | Fix |
|---|---|---|
| Six portfolio stats unverified | Live, unattributable numbers on `/projects` | Owner audit — verify, correct, or delete |
| Related-post scoring is tag-overlap only | Can surface loosely related posts | Add title-keyword similarity |
| 15 SEO warnings, mostly focus-keyword-not-in-title | Warnings, not errors; several are stylistic | Rewrite titles where it does not hurt readability |
| No i18n | Korean-speaking readers get English | `/ko/*` variant |
| `PRD.md` has no automated freshness check | Can drift from reality between rewrites | Keep it intent-only (§0) so there is less to drift |

---

## 8. Backlog

| # | Item | Complexity | Value |
|---|---|---|---|
| 1 | Audit the six portfolio stats | Low | **High** — credibility |
| 2 | RSS feed from posts | Low | Medium |
| 3 | Korean variant (`/ko/*`) | High | High |
| 4 | Dark mode | Medium | Medium |
| 5 | Per-post OG images | Medium | Medium |
| 6 | Reading progress on long posts | Low | Low |

---

## 9. Changelog

| Version | Date | Changes |
|---|---|---|
| 5.0 | Jul 28, 2026 | **Rewritten as a product document.** Removed ~750 lines of implementation mirror (file trees, DOM structure, Tailwind classes, animation constants, page copy) that had been wrong since the rearchitecture and were duplicating `CLAUDE.md`. Records the credibility slice shipped the same day: fabricated case-study copy removed from all six project pages; content moved to one-folder-per-item with the directory as the slug; real 404 replacing the catch-all rewrite; build gates made capable of failing; accessibility baseline; `public/` 38MB → 9MB; post-deploy smoke test added. |
| 4.2 | Jun 8, 2026 | Pre-deploy checklist; sitemap generator + asset verifier wired into `prebuild`; sitemap synced to 4 posts + 6 projects; blog markdown moved to `src/imports/pasted_text/`; magazine routes removed from nav; SEO via `react-helmet-async`. |
| 4.1 | May 25, 2026 | Six real portfolio projects replaced placeholder data; three Substack posts imported; blog tags expanded; "What I Bring" fourth pillar. |
| 4.0 | May 7, 2026 | Magazine restored (3 series); BlogPost meta bar shows magazine + position. |
| 3.9 | May 7, 2026 | Footer width aligned to body; scroll-to-top on route change; anchor `#` buttons removed. |
| 3.8 | May 6, 2026 | Magazine removed; footer and home redesigned. |
| 3.7 | May 4, 2026 | Home reverted to sparse editorial layout; Projects page redesigned with hero, stat grids, tag pills, Skills & Tools. *(The stat grids introduced here are the six unverified numbers in §5.3.)* |
| 3.4–3.6 | May 2, 2026 | Admin dashboard with localStorage auth; project image slideshow; arrow controls; nav scroll-to-top. *(Admin panel removed in `8aafb93`.)* |
| 3.0–3.3 | May 1, 2026 | Home hero with real identity data; Projects listing rebuilt as Impact/What I Did/Outcome cards; `<a>`-inside-`<a>` nesting fix; card-badge tag filtering. |
| 2.0–2.1 | Apr 29–30, 2026 | Magazine pages added; comments and reading time removed. |
| 1.0 | Apr 2026 | Initial ship: Home, About, Projects, Blog. |

> Entries 1.0–4.2 describe the pre-`8aafb93` Vite SPA — `createBrowserRouter`,
> `react-helmet-async`, `src/app/data/`, Magazine. None of that exists now. They
> are kept because they record *when* decisions were made, not how to rebuild.
