# CLAUDE.md

Entry point for anyone — person or agent — picking this repo up cold.
If something here disagrees with another document, this file wins.

## What this is

Seungjo Han's personal site: identity, portfolio, and blog. One contributor.
Production is **https://seungjohan.vercel.app** — there is no custom domain, so
`SITE_URL` in `src/app/components/SEO.tsx` is correct as written.

## Stack

| Layer | Choice | Note |
|---|---|---|
| Framework | React Router **v7 framework mode** | Not `react-router-dom`, not `createBrowserRouter` |
| Rendering | `ssr: false` + **build-time prerender** | Every route becomes static HTML. No runtime server. |
| Build | Vite 6 | `react-router build`, output to `build/client` |
| Styling | Tailwind v4 | CSS-first config, tokens in `src/styles/theme.css` |
| Animation | `motion` | Import from `motion/react` |
| Host | Vercel | Serves `build/client` statically |

Route config is `src/app/routes.ts`. The prerender list is `react-router.config.ts`.
Those two files are the truth about routing — prefer them over any prose.

## Commands

```bash
npm ci          # install (Node 22)
npm run dev     # dev server
npm run check   # typecheck + full build + all gates. Run before pushing.
npm run build   # prebuild -> build -> postbuild (see below)
npm run preview # serve the built output
```

`npm run build` runs three gate stages. Any of them can fail the build:

1. **prebuild** — `typecheck`, `generate-sitemap.mjs`, `verify-assets.mjs`
2. **build** — `react-router build`, prerenders every route in the prerender list
3. **postbuild** — `finalize-404.mjs`, then `check-seo.mjs`

There is **no test runner, deliberately.** For a 14-route static site the deploy
artifact is the thing under test, so the gates assert on the prerendered HTML
instead. That is the test strategy — treat the gates as tests and keep them
honest. See `docs/plans/2026-07-27-seo-and-site-hardening.md` §6.

## Adding content

### A blog post

One folder. That is the whole procedure.

```
src/content/blog/<slug>/index.md
```

The **directory name is the slug** and the URL. The file starts with frontmatter:

```markdown
---
title: Your Title
subtitle: One sentence under the title.
date: February 6, 2026
tags: [Life, Travel]
excerpt: One or two sentences for the listing and social cards.
coverImage: /blog-images/your-image.jpg
focusKeyword: your keyword
secondaryKeywords: [supporting, terms]
---

Body markdown starts here.
```

`title`, `subtitle`, `date`, `tags`, `excerpt` are required — the build fails
loudly if one is missing or empty. There is no registry to update, no import to
add. Images go in `public/blog-images/` and are referenced web-root-relative
(`/blog-images/x.jpg`, never `/public/...`).

Custom markdown syntax this repo supports: `{quote=normal|line|box|marks}`,
`![alt | size=small|medium|wide](/path.jpg)`, and an Index block above the first
`---` divider. Headings get anchor links automatically.

### A project

One folder, the same rule as a blog post:

```
src/content/projects/<slug>/index.ts
```

The **directory name is the slug** and the URL. The file default-exports a
`ProjectData` object; the type is in `src/app/content/projects.ts`. All fields
are required. Add the slug to `ORDER` in that same file to place it on the
listing — a slug missing from `ORDER` sorts to the front, which is loud enough
to notice.

The case-study body comes from four fields and renders through the shared
`ProjectNarrative` component on both the listing and the detail page:

| Field | Renders as |
|---|---|
| `outcome` | "Outcome" — first on the detail page; the only body shown on the listing card |
| `impact` | "Context" |
| `whatIDid` | "What I did" intro |
| `whatIDidBullets` | arrow list |

## Rules that are not obvious

**Never hardcode content prose in a component.** No `if (slug === '...')`
branches returning JSX copy. This has bitten the repo twice: six project pages
published invented metrics ("reduced drop-off by 40%") from a fallback branch,
and `BlogPost.tsx` carried ~255 lines of unreachable prose. Content lives in
`projects.ts` or a markdown file. Nowhere else.

**Every claim must be true.** This is a portfolio; a fabricated metric a
recruiter can't verify is worse than no metric. `check-seo.mjs` fails the build
if two pages in the same route family share a body paragraph, which is how the
last batch of placeholder copy is prevented from returning.

**Asset paths are case-sensitive in production.** macOS is not. `verify-assets.mjs`
matches case-exactly for this reason — Vercel serves from Linux, where
`/x.jpg` does not find `X.JPG`.

**Asset size budgets are enforced.** favicon 15KB, apple-touch-icon 100KB,
og-image 300KB, content images 500KB. There is **no exemption list** — the old
`KNOWN_OVERSIZED` array was deleted once the last three offenders were
re-encoded. Do not reintroduce it; re-encode the asset instead.

**Slugs come from directory names, for both content types.** `react-router.config.ts`,
`generate-sitemap.mjs` and `check-seo.mjs` all read the directory listing. They
used to regex-scrape `slug: '...'` out of TypeScript as raw text, where a
template literal or a computed slug silently broke prerendering, the sitemap and
SEO analysis at once with no error. Keep it that way — never reintroduce a slug
field that a build script has to parse.

**`public/sitemap.xml` is generated and untracked.** Do not edit it by hand.

## Other documents

`PRD.md` is current as of v5.0 and holds **product intent** — purpose, audience,
non-goals, the quality bar, backlog. It deliberately contains no implementation
detail, so it does not compete with this file. Read it for *why*; read this for
*how*.

`prompt.md` and `log.md` are session history, not instructions. The `guidelines/`
documents predate the current architecture and are only partly accurate; prefer
this file.

## Current work

`docs/plans/next-checklist.md` — remaining tasks, with the owner's own stat-audit
task at the top.
`docs/plans/2026-07-27-seo-and-site-hardening.md` — the review that produced them.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
