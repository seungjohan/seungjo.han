# User Prompt History

This file maintains a chronological, human-readable summary of prompts written by the user for building the project. Each version section below corresponds to the matching PRD version in `log.md`.

**Full machine-readable source:** [`docs/personal-website-prompts.json`](docs/personal-website-prompts.json) — every entry below was reconstructed directly from local Codex session transcripts (`~/.codex/sessions/**/*.jsonl`), not hand-copied. That file is a flat, queryable dataset (56 records) with `date_kst`, `agent`, `tags`, `prd_version_context`, and full prompt `text`, designed to be filtered like a table, e.g.:

```bash
# every prompt tagged admin-security
jq -r '.records[] | select(.tags | index("admin-security")) | "\(.date_kst) — \(.text[:80])"' docs/personal-website-prompts.json

# every prompt from Codex only
jq '[.records[] | select(.agent=="codex")] | length' docs/personal-website-prompts.json
```

Going forward, new sessions (Claude Code, opencode, etc.) should append records to that JSON with the same field names (`agent` set accordingly) so this stays a single unified source instead of drifting back into disconnected exports.

## prompt v1.0
**Date:** 2026-04-23 – 2026-04-28

- Referenced [alessandrakrick.com/about](https://www.alessandrakrick.com/about) and [sehyunjeon.com/expertise](https://www.sehyunjeon.com/expertise) as design inspiration; asked to build with Next.js + Vercel
- Early local setup: install npm/Next.js, preview, run locally
- Separately: had a Korean personal-growth blog draft translated to English
- Restated the core ask directly: "personal blog and portfolio website," open to Next.js/TypeScript, agent's choice

## prompt v2.0
**Date:** 2026-04-29

- Asked the agent to read the README/PRD and build the site from a Figma Make prototype

## prompt v3.4 – v3.6
**Date:** 2026-05-01 – 2026-05-02

- Delivered a renewed PRD + Figma Make design code, asked to design/build/implement from it
- Had two parallel template variants (English "global" + Korean) that needed merging into one combined project, keeping the "global" version's code as the base and porting over Korean content
- Iterated on output directory structure (`_site`), asked for a clean/minimal file layout matching the original template
- Asked the agent to act like a project manager/task-master and confirm each step before proceeding

## prompt v3.8
**Date:** 2026-05-07

- (No directly-attributable Codex prompts found in local session logs for this exact date — see `log.md` for the action summary: Magazine feature restored, footer/Home redesign.)

## prompt v4.1
**Date:** 2026-05-25 – 2026-06-07

- Delivered another round of updated Figma Make design files; asked to proceed per `design.md`/PRD
- Asked how to wire up Google Analytics, Google Tag Manager, and general SEO — requested a guideline to follow
- Asked about GitHub Pages vs. Vercel for deployment; corrected the canonical URL from `seungjohan.github.io` to `seungjohan.vercel.app` across files
- Multiple rounds of swapping in newer Figma Make exports and asking which files to delete/replace
- Blog content fidelity: asked posts to exactly copy/paste original source structure (not summarized), fixed a stray `id="toucan"` artifact showing on every page, asked where uploaded pictures should go, added additional posts
- Picture sizing: asked for 3 selectable image sizes on blog posts (referencing brunch.co.kr as a model), then to follow the *structure* (not literal content) of a specific original Brunch post
- Anchor-link/heading-link system: convert all h-tags to anchor links, remove `/` and title clutter from the generated anchor, adjust italic markdown rendering, use a dot instead of `-` in the index, reposition the "heading link chip" hover
- Projects page: removed a leftover "Filtering by Strategy · Clear" label, made keyword filters multi-select
- Requested full listing of all prompts given so far, in JSON/CSV — the seed of `docs/personal-website-prompts.json` and `docs/personal-website-prompts.json`'s v2/v3 predecessor exports
- Added a `url` field under tools on the project detail page; moved the admin route from `/admin` to a non-obvious path and changed the default password

## prompt v4.2
**Date:** 2026-06-08

- (No directly-attributable Codex prompts found in local session logs for this exact date — see `log.md`: Pre-deploy checklist, sitemap generator, asset verifier added.)

## prompt v4.9
**Date:** 2026-07-08 – 2026-07-10 (Codex session — admin-panel incident)

- Asked for a prompt log to be kept alongside the existing action log (this is the direct origin of `prompt.md`/`docs/personal-website-prompts.json` as a maintained pair); asked to gitignore the local admin directory
- Rewrote the "Writing" section label to "Blog" and updated the About-page bio copy
- Reported missing images on the deployed `/about` page and asked for a full pass checking that all images render after deploy
- Reported that a previously-committed directory (the admin panel, containing the hardcoded password) was still present in git history and asked for it to be fully excluded from the repo and its history — Codex's rewrite here was **incomplete**: it removed the file going forward but left the password blob fetchable via its old GitHub blob SHA, and deleted the admin panel locally without restoring it. Full remediation happened in the following session (see v5.1 below).
- Followed up asking for a general security check of the project for any exposed keys/credentials

## prompt v5.0
**Date:** 2026-07-11 (opencode session)

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

## prompt v5.2
**Date:** 2026-07-11 (Claude Code session — this session)

- Provided several historical prompt/log exports from other AI agent tools and asked to update `log.md`/`prompt.md` from them
- Asked whether Codex's local chat history is accessible — confirmed yes, at `~/.codex/sessions/**/*.jsonl`; discovered the pasted exports were themselves reconstructions of the same underlying Codex sessions (the "Cursor" naming in some of them referred to a folder name, `~/CursorProject`, not the Cursor IDE — verified via each session's `originator` field)
- Asked to combine all sources into one clean, easily filterable format ("like SQL") rather than several overlapping hand-copied exports — resulted in the redesigned `docs/personal-website-prompts.json` (schema v3.0) and this rewritten `prompt.md`

## prompt v5.3
**Date:** 2026-07-11 (Claude Code session — this session, continued)

- Ran `/vercel:vercel-connect`; asked to set up a Slack connector — walked through CLI install, login, connector creation, and repeated re-authorization ("try once more", "callback is expired, try once more", "done", "I'm ready. try a test") after Slack consent links expired or scopes were insufficient
- Asked what a "token" was and whether it meant paying money — clarified it's a credential, not a charge
- Asked for pros/cons of Slack vs. GitHub vs. Linear connectors and which fits this project best
- Asked what currently happens with the admin password and the address to access the admin page
- Asked whether an outside observer could discover that admin address just by looking at the code
- Asked what `ADMIN_SESSION_SECRET` specifically is/does
- Asked to update `log.md`/`prompt.md` with this conversation before proceeding to actually set `ADMIN_PASSWORD`/`ADMIN_SESSION_SECRET` on Vercel
