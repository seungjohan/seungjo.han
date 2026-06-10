# Pre-Deploy Checklist

Run this checklist **every time** before deploying to production. Repeat the same steps after any content change (new post, new project, new images, route changes).

**Production URL:** `https://seungjohan.vercel.app`  
**Related docs:** [PRD.md](../PRD.md) · [blog_management_workflow.md](./blog_management_workflow.md) · [project_delivery_workflow.md](./project_delivery_workflow.md) · [analytics-seo-handoff.md](../docs/analytics-seo-handoff.md)

---

## 1. Build & scripts (automated)

From the repo root:

```bash
npm run verify:assets    # local image paths exist under public/
npm run generate:sitemap # rebuild public/sitemap.xml from posts + projects
npm run build            # production bundle
```

All three must pass with no errors before you deploy.

---

## 2. SEO & discoverability

### Sitemap (`public/sitemap.xml`)

- [ ] Run `npm run generate:sitemap` so URLs match current routes.
- [ ] Confirm **static pages**: `/`, `/about`, `/projects`, `/blog`.
- [ ] Confirm **every** `POSTS[].slug` → `/blog/{slug}`.
- [ ] Confirm **every** `PROJECTS[].slug` → `/projects/{slug}`.
- [ ] Remove dead URLs (old placeholder posts, disabled magazine routes unless re-enabled).
- [ ] After deploy, open `https://seungjohan.vercel.app/sitemap.xml` in a browser.

### Robots (`public/robots.txt`)

- [ ] `Allow: /` is present.
- [ ] `Sitemap:` points to `https://seungjohan.vercel.app/sitemap.xml`.

### Per-page metadata (`src/app/components/SEO.tsx`)

Each public page should render `<SEO title=… description=… path=… />`:

- [ ] `/` — Home
- [ ] `/about` — About
- [ ] `/blog` — Blog list
- [ ] `/blog/:slug` — each post (`type="article"`, `coverImage` when set)
- [ ] `/projects` — Projects list
- [ ] `/projects/:slug` — each project

Check in browser DevTools → Elements → `<head>`:

- [ ] `<title>` is specific per page
- [ ] `<meta name="description">` matches excerpt / page copy
- [ ] `<link rel="canonical">` uses production domain + correct path
- [ ] Open Graph: `og:title`, `og:description`, `og:image`, `og:url`
- [ ] Twitter card tags present

### Root HTML (`index.html`)

- [ ] Default title and description set (fallback before React hydrates)
- [ ] `og:image` → `/og-image.svg`
- [ ] JSON-LD `Person` schema present
- [ ] GA4 (`G-3F73D31SGZ`) and GTM (`GTM-W6QS7F94`) scripts still in `<head>`

### After deploy (manual, once per release)

- [ ] [Google Search Console](https://search.google.com/search-console): submit sitemap if URLs changed materially
- [ ] Share one blog URL in Slack/iMessage — confirm social preview image and title
- [ ] Request indexing for new posts if traffic matters

---

## 3. Blog content

### Metadata (`src/app/data/posts.ts`)

For each post:

- [ ] `slug` is kebab-case and stable (do not change after publish)
- [ ] `title`, `subtitle`, `date`, `tags`, `excerpt` filled
- [ ] `sourceMarkdown` key matches a file in `src/imports/pasted_text/*.md`
- [ ] `coverImage` path works (list cards + OG when used)

### Markdown source (`src/imports/pasted_text/`)

- [ ] Body lives in `.md`, not hardcoded in `BlogPost.tsx`
- [ ] Images use explicit `/blog-images/...` paths or ordered placeholders (see [blog_management_workflow.md](./blog_management_workflow.md))
- [ ] Index section: `### Index` + bullets matching `##` headings for inner links
- [ ] Inline emphasis: `**bold**`, `_italic_`, blockquotes `>`, pull quotes / callout syntax if used

### Images (`public/blog-images/`)

- [ ] Every referenced file exists (run `npm run verify:assets`)
- [ ] Use lowercase `.jpg` extensions for Linux/Vercel compatibility (not `.JPEG`, `.JPG`)
- [ ] Spot-check each post in dev: all body images load, lightbox open/close works

### Preview URLs (dev)

- [ ] `/blog`
- [ ] `/blog/i-want-my-life-to-be-colorful`
- [ ] `/blog/developing-a-web-product-for-a-startup`
- [ ] `/blog/designing-a-prototype-for-a-startup`
- [ ] `/blog/dokdo-security-police`

---

## 4. Project content & images

See [project_delivery_workflow.md §5](./project_delivery_workflow.md) for editing details.

### Metadata (`src/app/data/projects.ts`)

For each project:

- [ ] `slug`, `title`, `description`, `tags`, `role`, `team`, `duration`, `techStack`
- [ ] `impact`, `whatIDid`, `whatIDidBullets`, `outcome` (used on `/projects` expand panel)
- [ ] `coverImage` and `images[]` URLs resolve (local or remote)

### Local project images (`public/project-images/`)

Naming: `{project-slug}_{number}.jpg` (e.g. `webeing_1.jpg`)

- [ ] Files uploaded to `public/project-images/`
- [ ] `projects.ts` references `/project-images/...` paths
- [ ] Hero carousel cycles and lightbox works on `/projects/{slug}`

### Case study body (`src/app/pages/ProjectCase.tsx`)

- [ ] Custom `CaseContent` branch exists for projects that need real copy (default is placeholder)

---

## 5. Navigation & routes

- [ ] `src/app/routes.tsx` matches pages you intend to ship (magazine currently **disabled** in routes)
- [ ] Footer and header links point to live routes only
- [ ] Unknown URLs show `NotFound` (`path: "*"`)

---

## 6. Manual smoke test (5–10 min)

Desktop + mobile width:

- [ ] Home → Projects → one project detail → back
- [ ] Home → Writing → one post → anchor link copy → back
- [ ] Cmd+K search finds posts and projects
- [ ] No console errors on main pages
- [ ] Images not broken (network tab 404 check)

---

## 7. Deploy

```bash
git status          # review what ships
npm run build       # final build
# push / Vercel deploy
```

After deploy:

- [ ] Open production home, one blog post, one project
- [ ] Re-run sitemap URL in browser
- [ ] Note anything to add to this checklist (tell the agent or edit this file)

---

## Quick reference — files that must stay in sync

| What changed | Update |
|---|---|
| New blog post | `posts.ts`, `pasted_text/*.md`, `BlogPost.tsx` SOURCE_MARKDOWN import, `public/blog-images/`, run sitemap |
| New project | `projects.ts`, optional `ProjectCase.tsx`, `public/project-images/`, run sitemap |
| New public route | `routes.tsx`, `generate:sitemap`, `<SEO />` on page |
| Domain change | `SEO.tsx` SITE_URL, `robots.txt`, `index.html` og:image, regenerate sitemap with `SITE_URL=` |
