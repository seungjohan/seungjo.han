# User Prompt History

This file maintains a chronological log of all prompts written by the user for building the project.

## prompt v1.0
**Date:** 2026-04-15 (Approximate)

[Initial project setup prompts]

## prompt v2.0
**Date:** 2026-05-01 (Approximate)

- fixed nested link error in Blog listing
- added scroll-to-top on route change
- removed anchor `#` buttons in BlogPost

## prompt v3.0
**Date:** 2026-05-02 (Approximate)

- added Admin dashboard
- added project image cycling slideshow
- added sortable tables
- added monthly views/posts charts

## prompt v3.7
**Date:** 2026-05-06 (Approximate)

- Home reverted to clean initial/v14 style
- Projects page fully redesigned
- Footer redesigned

## prompt v4.0
**Date:** 2026-05-07 (Approximate)

- Magazine fully restored
- Updated Blog metadata

## prompt v4.1
**Date:** 2026-05-25 (Approximate)

- Replaced project data with 6 real portfolio projects
- Added 3 blog posts
- Expanded blog tags
- Redesigned "What I Bring" section

## prompt v4.2
**Date:** 2026-06-08 (Approximate)

- Added Pre-deploy checklist
- Sitemap generator
- Asset verifier

## prompt v4.9
**Date:** 2026-07-08 (Codex session — reconstructed from git history, not an original prompt log entry)

- Scrub a hardcoded admin password, accidentally committed and pushed in `AdminLogin.tsx`, out of git history
- (Rewrite removed the file from tracked history but left it gitignored and missing locally, and did not fully purge the leaked blob — see v5.1)

## prompt v5.0
**Date:** 2026-07-11

- Convert key to environment variable
- Update log.md and prompt.md with historical context
- Replace Agent with specific agent names in log.md

## prompt v5.1
**Date:** 2026-07-11 (Claude Code session)

- Build was broken: "Could not resolve ./pages/admin/AdminLogin" — investigate and recover
- Check for exposed keys/secrets visible in the deployed HTML/bundle; review overall implementation quality
- Confirmed the admin password from the v4.9 incident was still publicly fetchable from GitHub by blob SHA; rotate the password and fully remove it (local Codex checkpoint refs + advise on GitHub-side purge)
- Rebuild the admin panel with real server-side authentication instead of client-side `localStorage` checks
- Keep `log.md`/`prompt.md` tracked and pushed as before (no change to their tracking)
