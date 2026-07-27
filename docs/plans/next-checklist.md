# Next Checklist

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

## 1. Content architecture — decision pending

You raised this and it is the right question. See the recommendation write-up before
picking an option. Current state, for reference:

- One post needs **four different identifiers**: `slug`, `sourceMarkdown` key, the actual
  `.md` filename, and the import variable name. None of them match.
- `src/imports/pasted_text/` is named for how the content arrived, not what it is.
- `src/imports/pasted_text/webeing-project-portfolio.md` (16 KB) is an orphan — referenced
  nowhere.
- `PostContent` has three body mechanisms: markdown, a plain-text `post.body` left over
  from the deleted admin dashboard, and ~255 lines of dead JSX.

- [ ] Decide: restructure content into `src/content/<type>/<slug>/index.md` with frontmatter
- [ ] Decide: markdown-with-frontmatter vs MDX vs stored HTML

---

## 2. P1 — correctness and credibility

- [ ] **X1** — Delete ~255 lines of dead hardcoded prose JSX in `BlogPost.tsx:81-380`.
      Same defect class as the `CaseContent` fallback just removed, twice the size.
      Unreachable because `SOURCE_MARKDOWN` wins at `:65`. Verified 0 matches in built HTML.
      *Do this as part of the content restructure if you take that on.*
- [ ] **E3** — Prerender `/404`, postbuild-copy `404/index.html` → `404.html`, then **delete**
      the `vercel.json` rewrite entirely. Do not repoint it at `__spa-fallback.html` — that
      file has zero `<title>` tags and ships a dev console nag.
- [ ] **E4** — Add `EXCLUDED_ROUTES` for `/404` to `check-seo.mjs` **before** E3, or the
      sitemap-sync check fails the build.
- [ ] **E10** — Add a `robots` field to `SEOArgs`; `NotFound` passes `noindex, follow`.
      Without this, once `404.html` serves every bad URL, they all canonicalise to `/`.
- [ ] **E5** — Extract `contentRegion()` from `check-seo.mjs`; scope the duplicate-body check
      to like-for-like routes and exclude `description`/`excerpt` literals. Measured
      baseline: a naive check fires on 7 legitimate duplicates.
- [ ] **E6** — Push the duplicate-body finding to `errors` + `exit 1`, not `warnings`.
- [ ] **X3** — Single-source slugs. Four independent regexes parse `projects.ts` as raw text
      (`react-router.config.ts:8`, `check-seo.mjs:198`, `generate-sitemap.mjs:16`,
      `verify-assets.mjs:74`). A slug written as a template literal silently breaks
      prerender, sitemap, and SEO analysis at once, with no diagnostics.
- [ ] **E8** — `loading="lazy"` + `decoding="async"` + dimensions on markdown images.
      Currently **zero** lazy attributes across every built blog page.
- [ ] **D5** — `<MotionConfig reducedMotion="user">` in `root.tsx` + a CSS reduced-motion
      block. There is currently no `prefers-reduced-motion` handling anywhere in `src/`.
- [ ] **D6** — Make the lightbox reachable and closable: button trigger (currently an
      `<img onClick>`, not keyboard-reachable), then native `<dialog>` or ESC + focus trap
      + scroll lock. It declares `aria-modal="true"` today with none of the behaviour.
- [ ] **X4** — Create `CLAUDE.md` as the single entrypoint for agents and future-you.
- [ ] **X5** — `git rm` the dead docs: `scripts/PRD.md`, `task-master.md`,
      `guidelines/Guidelines.md` (unedited Figma boilerplate),
      `docs/analytics-seo-handoff.md`, `docs/compound/*`, `default_shadcn_theme.css`.

## 3. P2 — quality and hygiene

- [ ] **D7** — Raise `text-gray-400` → `gray-500` for meaning-bearing text (~2.8:1 contrast).
- [ ] **D8** — Carousel: 2000 ms → 5000 ms, pause on hover/focus/`document.hidden`, and
      remove auto-cycling from the listing entirely (six run at once there today).
- [ ] **D12** — Dots as `<button aria-current>`; 44 px touch targets on arrows, pills, dots.
- [ ] **D16** — Add a `focus-visible` outline utility. No focus styling exists anywhere.
- [ ] **D10** — Remove Unsplash stock from portfolio images. LITER's three "portfolio
      images" are stock coffee-shop photos; nine `unsplash` refs across six projects, and
      `coverImage` is also the OG image source.
- [ ] **E11** — Add `npm run typecheck` to `prebuild`. Vercel never runs the CI workflow.
- [ ] **E12** — Data-shape assertion in `verify-assets.mjs`: fail on empty
      `impact`/`whatIDid`/`outcome` or zero bullets. Empty strings typecheck fine.
- [ ] **E13** — `scripts/smoke.mjs`: post-deploy curls + 404 status + assert every
      referenced asset returns `image/*` rather than `text/html`.
- [ ] **E14** — `lastmod`: add an explicit `updated` field or drop the element. Ten of
      fourteen URLs have no date source.
- [ ] **E15** — Guard `coverImage` in `ProjectCase.meta()`; an empty string yields an
      `og:image` pointing at the home page.
- [ ] **X8** — Untrack `public/sitemap.xml`. Every build rewrites it, which defeats the
      repo's own "review what ships" step.
- [ ] **X9/X10/X11** — `verify-assets.mjs` error messages: add provenance (which file
      references the asset); stop silently skipping unmatched `sourceMarkdown` keys.
- [ ] **X12** — Split advisory from actionable in `check-seo.mjs`; delete the
      focus-keyword-in-slug check. It is 8 of 22 warnings and unactionable by the repo's
      own policy that slugs never change after publish.
- [ ] **X13** — `platform`, `timeline`, `color` are required in the `Project` interface and
      referenced nowhere. Delete or surface them.
- [ ] **D9** — `galleryFor()` helper so listing and detail share one image fallback.
- [ ] **D13** — Per-image alt text instead of `project.title` on every image.

## 4. P3 — nice to have

- [ ] **D14** — Prev/next project navigation. The detail page currently dead-ends.
- [ ] **D15** — Surface `timeline`/`platform`/`year`/`client` in the meta row.
- [ ] **X14** — `rm -rf dist/` — stale pre-rearchitecture Vite output. Two stale docs point
      readers at `dist/index.html`.
- [ ] **X15** — Declare `serve` as a devDependency; `preview` uses bare `npx`.
- [ ] **E16** — Stop deploying `.DS_Store`; remove unreferenced `og-image.svg`.
- [ ] **E18** — Preserve the `process.env.SITE_URL` override when single-sourcing.
- [ ] **T10** — `NotFound` canonical currently points at `/404`, not a real route.

## 5. Known debt, tracked deliberately

Three assets are exempted from the size budget in `verify-assets.mjs` because `sips`
cannot compress them without damage. They need real tooling:

- [ ] `project-images/travel-cp_7.gif` (1.1 MB) — needs `gifsicle`
- [ ] `project-images/busking-town_1.png` (891 KB) — needs `pngquant`
- [ ] `project-images/webeing-hybrid-app.svg` (630 KB) — needs `svgo`

Keep that exemption list short. A fourth entry means the budget is wrong or the habit
has slipped.

## 6. Environment

- [ ] Codex CLI is installed but its vendored binary is missing
      (`@openai/codex-darwin-x64/vendor/x86_64-apple-darwin/codex/codex`, ENOENT), so all
      four review phases ran single-voice. Fix: `npm i -g @openai/codex`.
