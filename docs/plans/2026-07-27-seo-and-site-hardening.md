<!-- /autoplan restore point: ~/.gstack/projects/seungjohan-seungjohan.com/master-autoplan-restore-20260727-112130.md -->

# Plan — Case-Study Credibility & Site Hardening

**Owner:** Seungjo Han
**Branch:** `master`
**Date:** 2026-07-27
**Status:** IN REVIEW — /autoplan pipeline
**Mode:** SELECTIVE EXPANSION
**Production domain:** `https://seungjohan.vercel.app` (confirmed — no custom domain attached)

---

## 0. Context

The site was rearchitected in `8aafb93` / `60479eb`: Vite SPA → React Router v7 framework
mode, `ssr: false` + build-time prerender, route-level `meta` via `SEO.tsx`, admin panel
removed, `check-seo.mjs` added as a postbuild gate.

This plan was originally drafted as an infrastructure-hygiene pass (favicon, 404, doc
drift). The CEO review rejected that framing. The site's actual defect is **content
credibility**, and it is live in production today.

---

## 1. Goals

1. Stop publishing fabricated achievement claims on the project case-study pages.
2. Render the real, already-written project narrative on the pages people actually land on.
3. Remove the one catastrophic performance defect (9.4 MB favicon) and gate against recurrence.
4. Make unmatched URLs stop serving the home page's markup.

## 2. Non-goals

| Out of scope | Reason |
|---|---|
| PRD.md / handoff-doc rewrite | Deferred to backlog by owner decision at the premise gate |
| Re-enabling Magazine | Removed deliberately in 3.8/4.2 |
| CMS / database backend | Static TypeScript data files remain the content model |
| Korean `/ko/*` variant | XL effort, needs the target-audience answer first |
| Custom domain move | Not attached today; branding decision, not an SEO one |
| Framework migration | RR7 framework mode is working. Not relitigating. |

---

## 3. Work items

### P0-0 — Delete the fabricated case-study copy

**Problem — verified in the shipped build.** [ProjectCase.tsx:48-179](../../src/app/pages/ProjectCase.tsx#L48-L179)
defines `CaseContent`, which branches on exactly one slug, `'brand-identity-system'`
([:49](../../src/app/pages/ProjectCase.tsx#L49)). That slug **does not exist** in
`projects.ts`. The real slugs are `webeing`, `busking-town`, `liter`, `gif-hackathon`,
`travel-cp`, `north-america-strategy`.

So all six real projects fall through to the generic fallback at
[:139-178](../../src/app/pages/ProjectCase.tsx#L139-L178), which asserts in the first person:

> "A focused redesign that **reduced drop-off by 40%**, improved user satisfaction scores,
> and established a foundation for future iteration — delivered on time and within scope."

Confirmed present once in each of the six prerendered artifacts under `build/client/projects/*/index.html`.
All six are listed in `public/sitemap.xml`. The site carries a `google-site-verification`
token at [root.tsx:47](../../src/app/root.tsx#L47).

Secondary defect: six pages ship byte-identical body copy — textbook duplicate content.

Tertiary defect: lines 49-136 are ~88 lines of dead JSX for a project that does not exist,
including the dangling phrase "The client, a Series A fintech startup".

**Fix:** Delete the `brand-identity-system` branch and the generic fallback outright.
Ship nothing rather than ship invented metrics.

**Acceptance:** `grep -r "drop-off by 40%\|Series A fintech" src/ build/` returns zero hits.

---

### P0-1 — Render the real project narrative

**Problem:** `projects.ts` already holds true, specific copy for all six projects —
`impact`, `whatIDid`, `whatIDidBullets[]`, `outcome`. Webeing's actual `outcome`:

> "Partnered with 5 restaurants and helped increase their sales by 30%. Won 2nd Prize at
> the Lotte & Likelion Hackathon (out of ~70 teams). Received government investment from
> the Prospective Founders Package program."

`grep` confirms those fields render **only** in [Projects.tsx:185, 193, 207](../../src/app/pages/Projects.tsx#L185)
— the listing page. `ProjectCase.tsx` renders none of them.
`grep "Lotte\|Prospective Founders" build/client/projects/webeing/index.html` → 0 matches.

Truth on the index. Fiction on the deep-linked, indexed pages.

**Fix:** Replace `<CaseContent slug={slug!} />` at
[:347](../../src/app/pages/ProjectCase.tsx#L347) with a render of the project's own fields.
Section structure is a design decision — see Phase 2.

**Acceptance:** all six project pages render their own distinct `impact` / `whatIDidBullets`
/ `outcome`; no two project pages share a body paragraph; `check-seo.mjs` duplicate-title
and duplicate-description checks stay green.

---

### P0-2 — Shrink the favicon and gate asset weight

**Problem:** `public/favicon.svg` is **9,854,060 bytes (9.4 MB)**, referenced from
[root.tsx:46](../../src/app/root.tsx#L46) on every route. Almost certainly an SVG wrapper
around an embedded raster. `scripts/verify-assets.mjs` validates that referenced assets
*exist* and that filename case matches — it has no size assertion, which is why this shipped.

Also flagged: `public/og-image.png` at 199 KB.

**Fix:** Replace with a real vector favicon or a 32×32 / 180×180 PNG pair, target < 15 KB.
Add a size cap to `verify-assets.mjs` (fail over ~100 KB in `public/`, with an explicit
allowlist for legitimately large assets).

**Acceptance:** favicon < 15 KB; `npm run verify:assets` fails on an oversized public asset;
tab icon renders in light and dark browser chrome.

---

### P0-3 — Stop serving the home page for unmatched URLs

**Problem:** `vercel.json` rewrites every unmatched path to `/index.html`:

```json
{ "source": "/((?!sitemap.xml|robots.txt|assets/.*).*)", "destination": "/index.html" }
```

`/index.html` is the prerendered **home page**, not an empty shell. Vercel `rewrites` run
after the filesystem check, so the 14 prerendered routes are unaffected — but an unmatched
URL returns HTTP **200** carrying Home's markup, then the client router resolves `NotFound`.
That is a hydration mismatch plus a soft 404.

React Router already emits `build/client/__spa-fallback.html` for exactly this case.

Knock-on: the `if (!project)` branch at
[ProjectCase.tsx:201](../../src/app/pages/ProjectCase.tsx#L201) is near-unreachable in
production — an unknown project slug never reaches the route, it gets rewritten to Home.
The branch only fires on client-side navigation.

**Fix:** Point the rewrite at `__spa-fallback.html`. Timebox the true-404-status question
to 30 minutes; if `ssr: false` cannot set a status code, prerender a `/404.html` and accept it.

**Acceptance:** unknown URL no longer serves Home's markup; no hydration warning in console;
the 14 prerendered routes still serve their own static HTML.

---

### P1-1 — Duplicate-body-text check in `check-seo.mjs`

**Problem:** `check-seo.mjs` is a thorough gate — titles, descriptions, canonical, h1 count,
duplicate titles/descriptions, sitemap sync, robots.txt, OG image, JSON-LD `sameAs`, and
focus-keyword grading. It passed a build in which 6 of 14 indexed URLs shared byte-identical
body copy, because it checks head metadata, not body content.

**Fix:** Add a cross-page duplicate-body-text assertion over prerendered HTML. Reuse the
existing `contentLinks()` chrome-stripping helper so shared nav/footer does not trigger it.

**Acceptance:** the gate fails on today's build (pre-P0-1) and passes after P0-1 lands.
This is the regression test for P0-0/P0-1.

---

## 4. Accepted expansions (cherry-picked, SELECTIVE EXPANSION)

| # | Item | Effort | Rationale |
|---|---|---|---|
| E1 | Duplicate-body-text check (→ P1-1) | S | Would have caught P0-0 automatically |
| E2 | Asset size cap (→ P0-2) | S | Closes the gap that let 9.4 MB ship |
| E3 | Single-source `SITE_URL` | S | `generate-sitemap.mjs:12` hardcodes its own copy; `check-seo.mjs` reads it from `SEO.tsx`. A domain change silently desyncs the sitemap. |
| E4 | Fix `lastmod` | S | `generate-sitemap.mjs:35` stamps *today* on every URL every build. Always-fresh `lastmod` gets discounted by Google. |
| E5 | `NotFound` canonical | XS | [NotFound.tsx:10](../../src/app/pages/NotFound.tsx#L10) sets `path: '/404'`, canonicalising to a URL that is not a route and is not prerendered. |

## 5. Deferred

| Item | Why deferred |
|---|---|
| PRD.md v5.0 rewrite | Owner decision at premise gate. Note: two PRDs exist (`PRD.md` 40 KB, `scripts/PRD.md` 24 KB) plus ~8 other context docs. Rewriting with the same process that let it drift twice invites a third drift. |
| `docs/analytics-seo-handoff.md` | Same. Currently references `src/main.tsx`, `HelmetProvider`, `react-helmet-async` — none exist. Following it today breaks the build. |
| Analytics measurement-gap writeup | Unmeasured. If it matters, measure it (GA4 sessions vs Vercel Analytics, one week) rather than write a paragraph. |
| Korean `/ko/*` variant | Needs the target-audience answer: Korean or international employers? |
| Custom domain | Not attached. Branding call, not SEO. |
| Content cadence | Product decision. 4 posts, last one Feb 2026. |
| `formatDate` dedup, related-post scoring, dark mode, MDX, RSS | PRD §11/§12 backlog, unchanged |

---

## 6. CEO review — sections 1-11

### Section 1 — Architecture

```
  BEFORE (current)                      AFTER (P0-1)

  projects.ts                           projects.ts
    impact, whatIDid,                     impact, whatIDid,
    whatIDidBullets[], outcome            whatIDidBullets[], outcome
        │                                     │
        └──▶ Projects.tsx (listing) ✓         ├──▶ Projects.tsx (listing) ✓
                                              └──▶ ProjectCase.tsx (detail) ✓
  ProjectCase.tsx
    └──▶ CaseContent(slug)                ProjectCase.tsx
          ├─ 'brand-identity-system'        └──▶ renders project.* directly
          │   └─ DEAD (slug not in data)         (no slug dispatch, no hardcoded JSX)
          └─ generic fallback
              └─ FABRICATED ✗
```

**Finding 1.1 — CRITICAL.** Content lives in a component's control flow instead of the data
layer. `CaseContent` is a slug switch containing hardcoded JSX. Adding a project requires
editing a component. This is the structural cause of P0-0: the data and the rendering
drifted apart silently. Auto-decided: make it data-driven (P5 explicit over clever, P4 DRY).

**Finding 1.2 — MEDIUM.** `PROJECTS.find` runs twice per page —
[:9](../../src/app/pages/ProjectCase.tsx#L9) in `meta` and
[:184](../../src/app/pages/ProjectCase.tsx#L184) in the component. Harmless at 6 records,
but it is the seam where meta and body can disagree. Auto-decided: leave as-is (P3 pragmatic).

**Rollback posture:** git revert. Static site, no migrations, no runtime server. Reversibility 5/5.

**Scaling:** 6 projects, 4 posts, 14 prerendered routes. Nothing here breaks at 10x or 100x.
Prerender time grows linearly with content; at 1000 routes the build would need attention.
Not a concern now.

### Section 2 — Error & rescue map

```
  CODEPATH                        | WHAT CAN GO WRONG            | HANDLED?
  --------------------------------|------------------------------|----------
  ProjectCase PROJECTS.find       | slug not in data → undefined | Y (:201 fallback)
                                  |  ...but unreachable in prod  | ← GAP (P0-3)
  ProjectCase project.images.map  | images[] empty               | N ← GAP (blank 16:7 box)
  ProjectCase images[lightboxIdx] | index out of range           | N (guarded by construction)
  generate-sitemap extractSlugs   | posts.ts unparseable         | N (throws, fails build) OK
  verify-assets readFileSync      | missing file                 | Y (explicit exit 1)
  check-seo parseHead             | malformed prerendered HTML   | N (regex, silent miss)
  root.tsx injectScript           | GTM/GA blocked by adblock    | Y (async, no-op)
```

**Finding 2.1 — MEDIUM.** Empty `project.images[]` renders an empty rounded 16:7 box with no
alt text and no fallback. All six projects currently have 3 images, so this is latent.
Auto-decided: add a guard (P1 completeness — this is a shadow path with zero cost to cover).

**Finding 2.2 — LOW.** `check-seo.mjs` parses HTML with regex; malformed markup silently
fails to match rather than erroring. Acceptable for a build-time advisory gate.
Auto-decided: no change (P3 pragmatic).

No catch-all handlers found. No `catch (e) {}` swallowing. Clean on that axis.

### Section 3 — Security & threat model

Examined: new attack surface, input validation, authorization, secrets, dependency risk,
injection vectors, audit logging.

**No issues found in the plan's blast radius.** This is a static prerendered site with no
runtime server, no auth, no user input, no database, no API routes. `target="_blank"` links
carry `rel="noopener noreferrer"` ([:333](../../src/app/pages/ProjectCase.tsx#L333)). All
rendered content originates from committed TypeScript data files, not user input, so there
is no injection vector in the P0-1 rewire.

**One observation outside the plan's scope:** `.env` contains `VITE_ADMIN_AUTH_KEY` and
`VITE_ADMIN_AUTH_VALUE` left over from the removed admin panel. `VITE_`-prefixed vars are
inlined into the client bundle by Vite. They are dead now that the admin panel is gone,
but they should be deleted rather than left in `.env`. Flagged, not fixed — outside blast radius.

### Section 4 — Data flow & interaction edge cases

```
  INTERACTION           | EDGE CASE                    | HANDLED? | NOTE
  ----------------------|------------------------------|----------|------------------
  Image carousel        | auto-cycles every 2000ms     | —        | no pause on hover
                        | user hovers to read          | N ← GAP  | WCAG 2.2.2
                        | prefers-reduced-motion       | N ← GAP  | interval ignores it
  Lightbox open         | ESC key to close             | N ← GAP  | no keydown handler
                        | focus trap                   | N ← GAP  | aria-modal, no trap
                        | focus restore on close       | N ← GAP  |
                        | body scroll lock             | N ← GAP  | page scrolls behind
                        | carousel keeps advancing     | Y        | separate state, benign
  Unknown project URL   | direct load                  | N ← GAP  | → Home markup (P0-3)
                        | client-side nav              | Y        | :201 fallback
  Prev/next arrows      | rapid double-click           | Y        | modulo arithmetic safe
```

**Finding 4.1 — HIGH.** The lightbox declares `role="dialog" aria-modal="true"`
([:355](../../src/app/pages/ProjectCase.tsx#L355)) but implements none of the contract:
no ESC handler, no focus trap, no focus restore, no scroll lock. A keyboard user who opens
it is stuck. Auto-decided: fix (P1 completeness — announcing a dialog role without the
behaviour is worse than not announcing it).

**Finding 4.2 — MEDIUM.** The 2-second auto-cycle at
[:195](../../src/app/pages/ProjectCase.tsx#L195) has no hover pause and ignores
`prefers-reduced-motion`. Content moves while the reader is trying to look at it.
Auto-decided: pause on hover/focus + respect reduced-motion (P1, and it is in blast radius
since P0-1 touches this file). Deferred to Phase 2 for the interaction design call.

### Section 5 — Code quality

**Finding 5.1 — CRITICAL.** ~130 lines of hardcoded prose JSX in a component
([:48-179](../../src/app/pages/ProjectCase.tsx#L48-L179)), 88 of which are dead. Resolved by P0-0/P0-1.

**Finding 5.2 — MEDIUM.** `slug!` non-null assertion at
[:347](../../src/app/pages/ProjectCase.tsx#L347). Safe today because the `!project` guard
returns above it, but the assertion hides that reasoning. Auto-decided: drop the assertion
by passing `project` instead of `slug` during the P0-1 rewire (P5 explicit).

**Finding 5.3 — MEDIUM (DRY).** `SITE_URL` exists twice:
[SEO.tsx:4](../../src/app/components/SEO.tsx#L4) and
[generate-sitemap.mjs:12](../../scripts/generate-sitemap.mjs#L12). `check-seo.mjs` deliberately
reads it from `SEO.tsx` with the comment "so this check can never drift from what the app
actually renders" — `generate-sitemap.mjs` does not. Resolved by E3.

**Finding 5.4 — LOW.** `formatDate` duplicated in `Blog.tsx` and `BlogPost.tsx` (PRD §11).
Outside blast radius. Auto-decided: defer (P3).

### Section 6 — Test review

```
  NEW / CHANGED CODEPATHS          | TEST TYPE   | EXISTS? | GAP
  ---------------------------------|-------------|---------|--------------------------
  ProjectCase renders real fields  | build gate  | N       | → P1-1 duplicate-text check
  All 6 pages distinct body copy   | build gate  | N       | → P1-1
  favicon size                     | build gate  | N       | → P0-2 size cap
  unmatched URL → not Home markup  | none        | N       | manual, or a curl smoke test
  lightbox ESC / focus trap        | none        | N       | no test infra exists
  empty images[] guard             | none        | N       | no test infra exists
```

**Finding 6.1 — HIGH.** The repo has **no test runner**. `package.json` has no `test`
script, no Vitest, no Playwright. `STRATEGY.md` lists "Install and configure Vitest for the
TDD mandate" as an open roadmap item. The build gates (`verify-assets`, `check-seo`) are the
only automated verification, which is why they matter so much here.

Auto-decided: do **not** introduce a test runner in this plan (P3 pragmatic, P6 bias toward
action — it is a separate infrastructure bet and would triple this cycle). Instead, put the
regression coverage where infrastructure already exists: the build gates. P1-1 and the
P0-2 size cap *are* the tests for this change. That is the deliberate tradeoff.

**The test that would make me confident shipping at 2am:** `check-seo.mjs` failing the build
when any two prerendered pages share a body paragraph. That single assertion covers the
entire class of defect that P0-0 belongs to.

**Hostile-QA test:** add a 7th project with no `impact` field and confirm the build fails
loudly rather than rendering an empty section.

### Section 7 — Performance

**Finding 7.1 — CRITICAL.** 9.4 MB favicon on every route. Resolved by P0-2. This dwarfs
every other performance consideration on the site.

**Finding 7.2 — MEDIUM.** All `project.images` render simultaneously as stacked `<img>` with
opacity toggling ([:233-242](../../src/app/pages/ProjectCase.tsx#L233-L242)). Three images
load eagerly per project page; only one is visible. No `loading="lazy"` on the off-screen
ones. Auto-decided: add `loading="lazy"` to non-active slides (P2 blast radius, one attribute).

**Finding 7.3 — LOW.** A `setInterval` runs for the life of every project page. Negligible.
Auto-decided: no change beyond the hover-pause from 4.2.

No N+1 queries, no database, no connection pools, no background jobs. Static site.

### Section 8 — Observability

**Finding 8.1 — MEDIUM.** There is no error reporting. If a React error boundary fires in
production, nobody learns. GA4/GTM track pageviews only.

Auto-decided: **defer** (P3 pragmatic). For a personal site with 14 routes and no runtime
server, the build gates are the right observability investment, and this plan strengthens
them. Adding Sentry here would be over-engineering. Recorded as a backlog item, not a gap.

The meaningful observability for this change is the postbuild gate: `check-seo.mjs` output
is the dashboard. P1-1 makes it catch the class of bug that motivated this plan.

### Section 9 — Deployment & rollout

```
  DEPLOY SEQUENCE                        ROLLBACK
  ───────────────                        ────────
  1. prebuild: generate:sitemap          git revert <sha>
  2. prebuild: verify:assets  ← size cap git push
  3. build: react-router build           Vercel auto-redeploys previous
     (prerenders 14 routes)              ≈ 90 seconds, no data loss
  4. postbuild: check:seo     ← dup-text
  5. Vercel serves build/client
```

No migrations, no feature flags needed, no partial-state risk — a static deploy is atomic
per deployment. Old and new code never run simultaneously.

**Finding 9.1 — MEDIUM.** P1-1 will fail the build on the *current* content until P0-1 lands.
Ordering matters: land P0-0 + P0-1 first, then add the gate. Landing the gate first blocks
your own deploys. Auto-decided: enforce that order in the task list.

**Post-deploy verification (first 5 minutes):**
1. `curl -s https://seungjohan.vercel.app/projects/webeing | grep -c "drop-off by 40%"` → expect 0
2. Same URL, `grep -c "Lotte"` → expect ≥ 1
3. `curl -sI https://seungjohan.vercel.app/favicon.svg | grep content-length` → expect < 15000
4. `curl -s https://seungjohan.vercel.app/nonexistent-url | grep -c "Seungjo Han - Product Manager"` → expect 0
5. Open a project page, tab to the cover image, press ESC in the lightbox

### Section 10 — Long-term trajectory

**Reversibility: 5/5.** Every item is a git revert on a static site.

**Technical debt removed:** ~130 lines of dead and false content; a data/render split that
had silently diverged.

**Technical debt retained (deliberately):** documentation drift, no test runner, ~10
overlapping context docs. All recorded above with rationale.

**Path dependency:** making `ProjectCase` data-driven means adding a project becomes a pure
`projects.ts` edit. That is strictly better for the next 12 months and removes the failure
mode that produced this bug.

**The 1-year question:** a new reader of `ProjectCase.tsx` after this change sees a component
that renders its props. Today they see a 130-line switch with a dead branch. Clear improvement.

### Section 11 — Design & UX

UI scope **detected**. Deferred in full to Phase 2 (design review). The open design question:
`projects.ts` gives four fields (`impact`, `whatIDid`, `whatIDidBullets[]`, `outcome`) but
`ProjectCase` currently presents a six-section structure (Problem / TL;DR / Solution /
Process / Takeaway / Conclusion). Those do not map 1:1. The section structure for the rewired
page is a design decision, not an engineering one.

---

## 7. Failure modes registry

```
  CODEPATH                  | FAILURE MODE          | RESCUED? | TEST? | USER SEES        | LOGGED?
  --------------------------|-----------------------|----------|-------|------------------|--------
  CaseContent fallback      | fabricated claims     | N        | N     | false metrics    | N   ← CRITICAL GAP
  6 pages identical body    | duplicate content     | N        | N     | same text x6     | N   ← CRITICAL GAP
  favicon.svg 9.4MB         | slow load             | N        | N     | slow page        | N   ← CRITICAL GAP
  unmatched URL             | soft 404 + hydration  | N        | N     | Home markup      | N   ← GAP
  project.images empty      | blank cover box       | N        | N     | empty box        | N   ← GAP
  lightbox keyboard trap    | cannot close via kbd  | N        | N     | stuck overlay    | N   ← GAP
  sitemap lastmod           | always today          | N        | N     | nothing (crawler)| N   ← GAP
  NotFound canonical /404   | canonical to non-route| N        | N     | nothing (crawler)| N   ← GAP
```

3 CRITICAL GAPS, 5 GAPS. All addressed by P0-0 through P1-1 plus E1-E5.

---

## 8. Corrections to this plan from Phases 2-3.5

Later phases invalidated four items written in §3. Recorded rather than silently edited.

| Item | As drafted | Corrected by | Correction |
|---|---|---|---|
| **P0-3** | Repoint `vercel.json` rewrite to `__spa-fallback.html` | Eng F3/F4 | **Wrong.** `__spa-fallback.html` has zero `<title>` tags and ships a `console.log("Hey developer")` nag — it trades Home-markup-at-200 for titleless-empty-at-200. Correct fix: prerender `/404`, postbuild-copy `404/index.html` → `404.html`, and **delete** the rewrite entirely. Task E3, supersedes task T5. |
| **P1-1** | "Reuse the existing `contentLinks()` chrome-stripping helper" | Eng F10 | **Not possible.** `contentLinks()` returns link *counts*, discarding the stripped region. A `contentRegion()` helper must be extracted first. Re-sized S → M. Task E5. |
| **P1-1 scoping** | "cross-page duplicate-body assertion" | Eng F1 / Design D2.1 | Measured on commit `60479eb`: a naive check fires on **7 legitimate** duplicate groups today (index/detail `description` + `excerpt` overlap) versus 6 true positives, and ~31 after P0-1 because `/projects` already renders every detail page's body. Requires like-for-like route scoping plus a data-field exclusion set, and the listing card must be trimmed first (task D2). |
| **P0-2 rationale** | "the favicon dwarfs every other performance consideration" | Eng F8 | **False.** `/blog/i-want-my-life-to-be-colorful` pulls ~20 MB of images — 2× the favicon — with `loading="lazy"` count of **0** across every built blog page. Task E8. |

### Additional defects found after §3 was written

- **`verify-assets.mjs` is a non-functional gate.** Verified `exit=0` on a real broken reference: `i-want-my-life-to-be-colorful.md:221` points at `_7.jpg`, disk holds `_7.JPG`. `existsSync` is case-insensitive on APFS so the mismatch branch is unreachable locally, and on Linux it only `console.warn`s. Every new assertion added to this file depends on fixing it first (E1).
- **`BlogPost.tsx` carries the same defect as `CaseContent`, at 2× the size.** ~255 lines of hardcoded prose JSX behind slug branches at [:81](../../src/app/pages/BlogPost.tsx#L81) and [:215](../../src/app/pages/BlogPost.tsx#L215), unreachable because `SOURCE_MARKDOWN` wins at [:65](../../src/app/pages/BlogPost.tsx#L65). Confirmed 0 matches in the built HTML (X1).
- **Four independent regexes parse `projects.ts` as raw text** — `react-router.config.ts:8`, `check-seo.mjs:198`, `generate-sitemap.mjs:16`, `verify-assets.mjs:74`. A slug written as a template literal silently breaks prerender, sitemap, and SEO analysis with zero diagnostics (X3).
- **A second cache of unsourced numbers.** `HERO_STATS` / `BOTTOM_STATS` at [Projects.tsx:17-28](../../src/app/pages/Projects.tsx#L17-L28) ship six figures traceable to nothing in `projects.ts`. Owner elected to audit them (D1). The §P0-0 acceptance criterion has been widened from a two-string grep accordingly.
- **The doc deferral becomes a regression vector once P0-0 lands.** `guidelines/pre_deploy_checklist.md:130` and `guidelines/project_delivery_workflow.md:198` both instruct adding a `CaseContent` branch. After P0-0 deletes `CaseContent`, those files tell the next reader to rebuild the exact defect this plan exists to remove (X2).

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | issues_open | premise rejected and reframed; 11 tasks, 3 critical gaps |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | unavailable | binary installed, vendored executable missing (ENOENT) |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | issues_open | 19 findings, 6 critical; 18 tasks |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | issues_open | 24 findings, 4 critical; 16 tasks |
| DX Review | `/plan-devex-review` | Developer experience gaps | 1 | issues_open | 24 findings, 4 critical; 16 tasks; DX 3/10 |

- **CODEX:** unavailable across all four phases. `~/.nvm/.../@openai/codex-darwin-x64/vendor/x86_64-apple-darwin/codex/codex` does not exist. Fix: `npm i -g @openai/codex`. All dual voices ran `[subagent-only]`.
- **CROSS-MODEL:** not available. Every consensus table is single-voice; critical findings were accepted on verification, not on agreement. Each was independently confirmed against the working tree and the built artifacts before being recorded.
- **VERDICT:** CEO + DESIGN + ENG + DX all ran. None CLEAR — 61 tasks open (25 P1, 27 P2, 9 P3). Plan is reviewed but not yet approved for implementation; awaiting the final gate.

**UNRESOLVED DECISIONS:**
- Doc deferral vs deletion — owner deferred docs at the premise gate; design and DX phases both argue the deferral becomes an active regression vector once P0-0 lands (task X2 mitigates the worst case)
- Whether to widen this cycle to include `BlogPost.tsx` dead-JSX removal (X1) and slug single-sourcing (X3), both found after the scope was set
- Korean `/ko/*` variant — still blocked on whether target employers are Korean or international

