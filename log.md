# Agent Interaction Log

This file records actions taken for the current project.

| Date | Agent | Steps / Actions taken | PRD Version |
| :--- | :--- | :--- | :--- |
| 2026-07-19 | Claude Code (Opus 4.8) | Removed the admin panel entirely (pages, `AdminLayout`, `/api` auth functions, `draftStore`/`viewTracker`/`analytics`, localStorage GA-injection) and the unused Magazine section. Migrated from client-only SPA to React Router v7 framework mode with `ssr:false` + `prerender`, so every route now builds to static HTML with per-page `<title>`, OpenGraph, and JSON-LD (`Person` on Home, `BlogPosting` on posts) — fixing SEO for social crawlers. Replaced the `<SEO>` runtime component with route `meta` exports; moved the document shell (GA4/GTM/GSC) into `root.tsx`. Trimmed dependencies from ~60 to 8 (dropped MUI, emotion, all Radix/shadcn `ui/`, recharts, react-dnd, etc.), fixed `package.json` (name, React as real dep). Extracted the markdown renderer out of `BlogPost.tsx` (1342→912 lines) into `components/markdown/`. Added `tsconfig.json`, a `typecheck` script, and GitHub Actions CI (typecheck + build). | 6.0 |
| 2026-07-11 | Claude Code (Sonnet 5) | Found admin panel files missing, breaking the build; traced root cause to a prior Codex history rewrite (see 2026-07-08 entry). Discovered the leaked admin password was still publicly fetchable from GitHub via its blob SHA despite that rewrite. Restored the admin pages, replaced the client-side `localStorage` password check with real server-side auth (Vercel functions in `/api` + httpOnly signed session cookie, password read from a server-only env var), deleted the leaked blob from local git objects, and pushed the fix. | 5.1 |
| 2026-07-11 | opencode | Updated `log.md` and `prompt.md` with historical context from `personal-website-prompts.json`. | v4.2 |
| 2026-07-08 | Codex | Rewrote git history to scrub a hardcoded admin password that had been committed and pushed to GitHub in `AdminLogin.tsx`; added `src/app/pages/admin/` to `.gitignore` going forward. Rewrite was incomplete (the file itself was also deleted locally, and the password blob remained fetchable from GitHub and from local Codex checkpoint refs) — fully remediated 2026-07-11. | 5.0 |
| 2026-06-08 | Codex | Added Pre-deploy checklist, Sitemap generator, and Asset verifier. | 4.2 |
| 2026-05-25 | Codex | Replaced project data with real portfolio projects; added 3 blog posts; expanded tags; redesigned "What I Bring" section. | 4.1 |
| 2026-05-07 | Codex | Restored Magazine functionality; redesigned footer; redesigned Home page. | 3.8 |
| 2026-05-02 | Codex | Added Admin dashboard; added project image cycling slideshow; added sortable tables; added monthly views/posts charts. | 3.4 |
| 2026-05-01 | Codex | Redesigned Home page (YC-inspired); redesigned Projects page; updated footer and nav. | 3.6 |
| 2026-05-01 | Codex | Fixed nested link error in Blog listing; added scroll-to-top on route change; removed anchor `#` buttons in BlogPost. | 3.3 |
| 2026-05-01 | Codex | Redesigned Projects listing (1-column cards); added keyword tag filtering via card badges. | 3.2 |
| 2026-05-01 | Codex | Fixed nested link error in Blog listing; added scroll-to-top on route change; removed anchor `#` buttons in BlogPost. | 3.1 |
| 2026-04-29 | Codex | Added Magazine functionality; updated Blog metadata; updated Projects section. | 2.0 |
| 2026-04-15 | Codex | Initial version of the site. | 1.0 |
