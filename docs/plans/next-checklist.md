# Next Checklist

> **Updated 2026-07-27 after the implementation pass.** Six commits landed on
> `fix/case-study-credibility`. Ticked items are done; the rest are open.
> Section 0 is still yours.

Follow-up work from the `/autoplan` review of 2026-07-27. The credibility slice
shipped in `6bf46b7` on `fix/case-study-credibility`. Everything below is what
remains, in the order it should be tackled.

Full findings: [2026-07-27-seo-and-site-hardening.md](./2026-07-27-seo-and-site-hardening.md)
Test plan: `~/.gstack/projects/seungjohan-seungjohan.com/master-test-plan-20260727.md`

---

## 0. Owner task — verify or correct the portfolio stat numbers

**You said you'd handle this one.** These six numbers are hardcoded and ship on
`/projects`. None traces to anything in `projects.ts`. They are the same shape as the
fabricated case-study copy that was just deleted, but only you can tell which are real.

`src/app/pages/Projects.tsx:17-21` — `HERO_STATS`

- [ ] `6` — Years of Experience
- [ ] `10M+` — Users Impacted
- [ ] `12+` — Products Shipped

`src/app/pages/Projects.tsx:24-28` — `BOTTOM_STATS`

- [ ] `15+` — Partner Integrations Delivered
- [ ] `88%` — Engineering Team Retention Rate
- [ ] `5` — App Stores Shipped Simultaneously

For each: confirm it's accurate, correct the figure, or delete the line. If a number is
true but comes from work the site doesn't list, consider whether a recruiter could verify
it — an unverifiable round number next to five real ones discounts all six.

**Related, already fixed:** the "Three deep dives … plus two more projects below" line
miscounted six projects as five. Replaced in `6bf46b7`.

---

## 1. Content architecture — DONE (commit 4488777)

Blog posts now live at `src/content/blog/<slug>/index.md`, one folder per post, with
YAML frontmatter and `import.meta.glob` discovery. `posts.ts`, the `SOURCE_MARKDOWN`
map, the four `?raw` imports, `src/imports/pasted_text/` and the orphan file are all
gone. `BlogPost.tsx` went 592 -> 312 lines.

Projects were deliberately left in `projects.ts` — they are already single-source and
did not have the four-identifier problem. Moving them is still an option later.

The problem this solved, for reference:

- One post needs **four different identifiers**: `slug`, `sourceMarkdown` key, the actual
  `.md` filename, and the import variable name. None of them match.
- `src/imports/pasted_text/` is named for how the content arrived, not what it is.
- `src/imports/pasted_text/webeing-project-portfolio.md` (16 KB) is an orphan — referenced
  nowhere.
- `PostContent` has three body mechanisms: markdown, a plain-text `post.body` left over
  from the deleted admin dashboard, and ~255 lines of dead JSX.

- [x] Restructure blog content into `src/content/blog/<slug>/index.md` with frontmatter
- [x] Chose markdown-with-frontmatter over MDX and over stored HTML
- [x] Same treatment for projects — `src/content/projects/<slug>/index.ts`, kept as TypeScript. Finished X3.

---

## 2. P1 — correctness and credibility

- [x] **X1** — Delete ~255 lines of dead hardcoded prose JSX in `BlogPost.tsx:81-380`.
      Same defect class as the `CaseContent` fallback just removed, twice the size.
      Unreachable because `SOURCE_MARKDOWN` wins at `:65`. Verified 0 matches in built HTML.
      *Do this as part of the content restructure if you take that on.*
- [x] **E3** — Prerender `/404`, postbuild-copy `404/index.html` → `404.html`, then **delete**
      the `vercel.json` rewrite entirely. Do not repoint it at `__spa-fallback.html` — that
      file has zero `<title>` tags and ships a dev console nag.
- [x] **E4** — Add `EXCLUDED_ROUTES` for `/404` to `check-seo.mjs` **before** E3, or the
      sitemap-sync check fails the build.
- [x] **E10** — Add a `robots` field to `SEOArgs`; `NotFound` passes `noindex, follow`.
      Without this, once `404.html` serves every bad URL, they all canonicalise to `/`.
- [x] **E5** — Extract `contentRegion()` from `check-seo.mjs`; scope the duplicate-body check
      to like-for-like routes and exclude `description`/`excerpt` literals. Measured
      baseline: a naive check fires on 7 legitimate duplicates.
- [x] **E6** — Push the duplicate-body finding to `errors` + `exit 1`, not `warnings`.
- [x] **X3** — Single-source slugs. Four independent regexes parse `projects.ts` as raw text
      (`react-router.config.ts:8`, `check-seo.mjs:198`, `generate-sitemap.mjs:16`,
      `verify-assets.mjs:74`). A slug written as a template literal silently breaks
      prerender, sitemap, and SEO analysis at once, with no diagnostics.
- [x] **E8** — `loading="lazy"` + `decoding="async"` + dimensions on markdown images.
      Currently **zero** lazy attributes across every built blog page.
- [x] **D5** — `<MotionConfig reducedMotion="user">` in `root.tsx` + a CSS reduced-motion
      block. There is currently no `prefers-reduced-motion` handling anywhere in `src/`.
- [x] **D6** — Make the lightbox reachable and closable: button trigger (currently an
      `<img onClick>`, not keyboard-reachable), then native `<dialog>` or ESC + focus trap
      + scroll lock. It declares `aria-modal="true"` today with none of the behaviour.
- [x] **X4** — Create `CLAUDE.md` as the single entrypoint for agents and future-you.
- [x] **X5** — `git rm` the dead docs: `scripts/PRD.md`, `task-master.md`,
      `guidelines/Guidelines.md` (unedited Figma boilerplate),
      `docs/analytics-seo-handoff.md`, `docs/compound/*`, `default_shadcn_theme.css`.

## 3. P2 — quality and hygiene

- [x] **D7** — Raise `text-gray-400` → `gray-500` for meaning-bearing text (~2.8:1 contrast).
- [x] **D8** — Carousel: 2000 ms → 5000 ms, pause on hover/focus/`document.hidden`, and
      remove auto-cycling from the listing entirely (six run at once there today).
- [x] **D12** — Dots and arrows are buttons with `aria-current` and 44 px hit areas on both
      pages. Also fixed the invalid `<button>` inside `<a>` nesting found while doing it.
- [x] **D16** — Add a `focus-visible` outline utility. No focus styling exists anywhere.
- [x] **D10** — Remove Unsplash stock from portfolio images. LITER's three "portfolio
      images" are stock coffee-shop photos; nine `unsplash` refs across six projects, and
      `coverImage` is also the OG image source.
- [x] **E11** — Add `npm run typecheck` to `prebuild`. Vercel never runs the CI workflow.
- [x] **E12** — Data-shape assertion in `verify-assets.mjs`: fail on empty
      `impact`/`whatIDid`/`outcome` or zero bullets. Empty strings typecheck fine.
- [x] **E13** — `scripts/smoke.mjs`: post-deploy curls + 404 status + assert every
      referenced asset returns `image/*` rather than `text/html`.
- [x] **E14** — `lastmod`: add an explicit `updated` field or drop the element. Ten of
      fourteen URLs have no date source.
- [x] **E15** — Guard `coverImage` in `ProjectCase.meta()`; an empty string yields an
      `og:image` pointing at the home page.
- [x] **X8** — Untrack `public/sitemap.xml`. Every build rewrites it, which defeats the
      repo's own "review what ships" step.
- [x] **X9/X10/X11** — `verify-assets.mjs` error messages: add provenance (which file
      references the asset); stop silently skipping unmatched `sourceMarkdown` keys.
- [x] **X12** — Split advisory from actionable in `check-seo.mjs`; delete the
      focus-keyword-in-slug check. It is 8 of 22 warnings and unactionable by the repo's
      own policy that slugs never change after publish.
- [x] **X13** — `platform`, `timeline`, `color` are required in the `Project` interface and
      referenced nowhere. Delete or surface them.
- [x] **D9** — `galleryFor()` helper so listing and detail share one image fallback.
- [x] **D13** — Per-image alt text instead of `project.title` on every image.

## 4. P3 — nice to have

- [x] **D14** — Prev/next project navigation. The detail page currently dead-ends.
- [x] **D15** — Surface `timeline`/`platform`/`year`/`client` in the meta row.
- [x] **X14** — `rm -rf dist/` — stale pre-rearchitecture Vite output. Two stale docs point
      readers at `dist/index.html`.
- [x] **X15** — Declare `serve` as a devDependency; `preview` uses bare `npx`.
- [x] **E16** — `.DS_Store` was already gitignored so it never reached Vercel; local copies
      deleted. Unreferenced `public/og-image.svg` removed.
- [x] **E18** — Single-source `SITE_URL` into `generate-sitemap.mjs` (still its own copy),
      preserving the `process.env.SITE_URL` override.
- [x] **T10** — Resolved by E3: `/404` is now a genuinely prerendered route, so its canonical is valid.

## 5. Known debt — CLEARED

All three formerly-exempt assets now meet their budgets on merit, so the
`KNOWN_OVERSIZED` exemption list has been deleted from `verify-assets.mjs` rather
than carried:

- [x] `travel-cp_7.gif` 1.1 MB → 468 KB (`gifsicle -O3 --lossy=120 --colors 64`, full resolution kept)
- [x] `busking-town_1.png` 891 KB → 243 KB (`pngquant`)
- [x] `webeing-hybrid-app.svg` 630 KB → 185 KB — it was two base64 PNGs inside an SVG
      wrapper, so `svgo` achieved 0%. Compressed the embedded rasters and re-embedded
      them, leaving the SVG's structure and positioning untouched.

## 6. Environment

- [ ] Codex CLI is installed but its vendored binary is missing
      (`@openai/codex-darwin-x64/vendor/x86_64-apple-darwin/codex/codex`, ENOENT), so all
      four review phases ran single-voice. Fix: `npm i -g @openai/codex`.
