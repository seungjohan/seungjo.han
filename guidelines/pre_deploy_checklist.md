# Pre-Deploy Checklist

Run this checklist **every time** before deploying to production. Repeat the same steps after any content change (new post, new project, new images, route changes).

**Production URL:** `https://seungjohan.vercel.app`  
**Related docs:** [CLAUDE.md](../CLAUDE.md) · [blog_management_workflow.md](./blog_management_workflow.md) · [project_delivery_workflow.md](./project_delivery_workflow.md)

---

## 1. Build & scripts (automated)

From the repo root:

```bash
npm run check   # typecheck + prebuild gates + prerender + postbuild gates
```

That is the whole automated pass — `prebuild` runs typecheck, sitemap generation
and asset verification; `postbuild` promotes the 404 page and runs the SEO gate.
It must exit 0 before you deploy.

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

Each route exports a `meta` function built with `buildMeta({ … })` — there is no
`<SEO />` component to render:

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

### Document shell (`src/app/root.tsx`)

There is no source `index.html`; the shell is `root.tsx`.

- [ ] `og:image` default → `/og-image.png` (set in `SEO.tsx`)
- [ ] JSON-LD `Person` schema present
- [ ] GA4 (`G-3F73D31SGZ`) and GTM (`GTM-W6QS7F94`) still injected — note these
      load *after* hydration by design, to avoid a JSON-LD hydration mismatch

### After deploy (manual, once per release)

- [ ] [Google Search Console](https://search.google.com/search-console): submit sitemap if URLs changed materially
- [ ] Share one blog URL in Slack/iMessage — confirm social preview image and title
- [ ] Request indexing for new posts if traffic matters

---

## 3. Blog content

### Post files (`src/content/blog/<slug>/index.md`)

One folder per post; the folder name is the slug and the URL.

- [ ] Folder name is kebab-case and stable (never change it after publish)
- [ ] Frontmatter has `title`, `subtitle`, `date`, `tags`, `excerpt` — the build
      fails if any is missing or empty
- [ ] `coverImage` path resolves (listing cards + social preview)

### Body

- [ ] Body lives in the same `index.md`, never hardcoded in `BlogPost.tsx`
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

### Case study body (`src/app/data/projects.ts`)

- [ ] Every project has non-empty `impact`, `whatIDid`, `outcome` and at least one `whatIDidBullets` entry
- [ ] Every claim in those fields is true and specific to that project — no placeholder or template copy
- [ ] No project prose is hardcoded in `ProjectCase.tsx` / `Projects.tsx`; the body is data-driven via `ProjectNarrative`

---

## 5. Navigation & routes

- [ ] `src/app/routes.ts` matches the pages you intend to ship, and `react-router.config.ts` prerenders them
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
npm run check       # final build + all gates
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
| New blog post | `src/content/blog/<slug>/index.md` + images in `public/blog-images/`. Nothing else. |
| New project | `projects.ts` + images in `public/project-images/` |
| New public route | `src/app/routes.ts` and the prerender list in `react-router.config.ts` |
| Domain change | `SEO.tsx` SITE_URL and `public/robots.txt` (the sitemap and SEO gate both read SITE_URL from `SEO.tsx`) |
