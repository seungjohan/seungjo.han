# PRD — Personal Blog & Portfolio Website
**Owner:** Seungjo Han (한승조)
**Version:** 4.1
**Updated:** May 25, 2026
**Status:** Actively Iterating

---

## 1. Purpose & Goals

A personal website serving three functions simultaneously:

1. **Identity** — First-impression page for recruiters, collaborators, and contacts. Name, role, keyword badges, bio bullets, and direct contact links.
2. **Portfolio** — Selected work presented as one-column project cards on the listing page (Impact / What I Did / Outcome), linking to full 6-section case studies on the detail page.
3. **Blog** — Long-form essays organized by tag and grouped into curated *Magazine* series. Writing-first, distraction-free reading experience.

### Explicit Non-Goals (v1)

| Out of scope | Reason |
|---|---|
| CMS or database backend | All content is static TypeScript data files |
| Authentication / gated content | Not needed for this phase |
| Real email capture | No backend |
| Analytics | Planned for v2 |
| Server-side rendering | Vite SPA is sufficient |
| Comment system | Removed in v2.1 |

---

## 2. Tech Stack

| Layer | Package | Notes |
|---|---|---|
| Build tool | `vite` | Dev server + production bundler. No SSR. |
| UI library | `react` 18 | StrictMode enabled in `main.tsx` |
| Language | `typescript` 5.x | Strict mode. No `any` in production code. |
| Routing | `react-router` 7.x | Data Mode. `createBrowserRouter`. **NOT** `react-router-dom`. |
| Styling | Tailwind CSS v4 | CSS-first config. No `tailwind.config.js`. Tokens in `/src/styles/theme.css`. |
| Animation | `motion` | Import from `motion/react` subpath: `import { motion } from 'motion/react'`. |
| Icons | `lucide-react` | 1px stroke, 24px base. Tree-shakeable. |
| Toast | `sonner` | `import { toast } from 'sonner'`. `<Toaster>` lives in `Layout.tsx`. |
| Fonts | CSS `@import` | Declared in `/src/styles/fonts.css` (top of file only). System stack fallback. |

---

## 3. File Structure

```
/
├── PRD.md
├── package.json
└── src/
    ├── main.tsx
    ├── app/
    │   ├── App.tsx                          ← Root; renders <RouterProvider router={router} />
    │   ├── routes.tsx                       ← createBrowserRouter config
    │   ├── components/
    │   │   ├── Layout.tsx                   ← Persistent shell: header + footer + toaster + search
    │   │   ├── SearchModal.tsx              ← Full-screen Cmd+K search overlay
    │   │   ├── AnchorNav.tsx                ← Sticky in-page section nav (blog + projects)
    │   │   └── figma/
    │   │       └── ImageWithFallback.tsx    ← PROTECTED — do not create or modify
    │   ├── pages/
    │   │   ├── Home.tsx                     ← /
    │   │   ├── About.tsx                    ← /about
    │   │   ├── Projects.tsx                 ← /projects
    │   │   ├── ProjectCase.tsx              ← /projects/:slug
    │   │   ├── Blog.tsx                     ← /blog
    │   │   ├── BlogPost.tsx                 ← /blog/:slug
    │   │   ├── Magazine.tsx                 ← /magazine
    │   │   └── MagazineDetail.tsx           ← /magazine/:slug
    │   └── data/
    │       ├── posts.ts                     ← Post[]
    │       ├── projects.ts                  ← Project[]
    │       └── magazines.ts                 ← Magazine[]
    └── styles/
        ├── theme.css                        ← CSS custom properties / design tokens
        └── fonts.css                        ← @import declarations (top of file only)
```

---

## 4. Routing

**Config file:** `src/app/routes.tsx`
**Pattern:** React Router v7 Data Mode — `createBrowserRouter`

```ts
createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true,              Component: Home },
      { path: 'about',            Component: About },
      { path: 'blog',             Component: Blog },
      { path: 'blog/:slug',       Component: BlogPost },
      { path: 'projects',         Component: Projects },
      { path: 'projects/:slug',   Component: ProjectCase },
      { path: 'magazine',         Component: Magazine },
      { path: 'magazine/:slug',   Component: MagazineDetail },
    ],
  },
]);
```

### URL Parameters

| Pattern | Param | Resolved against |
|---|---|---|
| `/blog/:slug` | `slug` | `POSTS[].slug` |
| `/projects/:slug` | `slug` | `PROJECTS[].slug` |
| `/magazine/:slug` | `slug` | `MAGAZINES[].slug` |
| `/blog?tag=X` | `tag` (search param) | Tag filter; reactive via `useSearchParams()` |

### Not-Found Handling

Each detail page checks if the entity was found; if not, renders an inline fallback with a "← Back" link. No catch-all `path: '*'` route yet — **known limitation** (see §11).

---

## 5. Data Models

### 5.1 `Post` — `src/app/data/posts.ts`

```ts
interface Post {
  slug: string;        // URL-safe kebab-case. Must be unique.
  title: string;
  subtitle: string;    // One-sentence hook. Shown under title on post page.
  date: string;        // Human-readable: "April 15, 2026". Parsed by formatDate().
  readTime: string;    // Present in data but NOT displayed (removed in v2.1).
  tags: string[];      // Used for /blog?tag= filter, tag links, related post scoring.
  excerpt: string;     // 1–2 sentences. Blog listing rows, PostCard previews, home feed.
  coverImage?: string; // Unsplash URL. Article header and PostCard thumbnail.
}
```

**Current dataset (9 posts):**

| slug | title | tags | date |
|---|---|---|---|
| `on-simplicity-in-design` | On simplicity in design | Design, Product | April 15, 2026 |
| `building-with-intention` | Building with intention | Creativity, Culture | March 28, 2026 |
| `the-art-of-constraints` | The art of constraints | Design, Creativity | March 12, 2026 |
| `lessons-from-korean-design` | Lessons from Korean design | Design, Culture | February 24, 2026 |
| `the-future-of-ai-in-creative-work` | The future of AI in creative work | Technology, Design | February 10, 2026 |
| `notes-on-productive-workflows` | Notes on productive workflows | Product, Technology | January 28, 2026 |
| `developing-a-web-product-for-a-startup` | Developing a Web Product for an Early-stage Startup from scratch | Startup, Technology, Product | September 26, 2024 |
| `designing-a-prototype-for-a-startup` | Designing a Prototype for a Startup to turn your Ideas into Reality | Startup, Design, Product | September 26, 2024 |
| `dokdo-security-police` | I'm a Proud Dokdo Security Police of Korea | Life, Korea, Identity | December 2, 2022 |

**Post body copy:** `on-simplicity-in-design`, `developing-a-web-product-for-a-startup`, `designing-a-prototype-for-a-startup`, and `dokdo-security-police` have full body (multiple `AnchorH2` sections). All other slugs use a 3-section generic fallback in `PostContent()`.

**Blog tag filter ALL_TAGS:** `['Design', 'Technology', 'Culture', 'Creativity', 'Product', 'Startup', 'Life', 'Korea']`

---

### 5.2 `Project` — `src/app/data/projects.ts`

```ts
interface Project {
  slug: string;
  title: string;
  client: string;
  year: string;
  description: string;   // 1–2 sentence summary. Used in home cards and ProjectCase header.
  tags: string[];        // Shown as dot-separated pill on listing + detail pages.
  coverImage: string;    // Unsplash URL. Required.
  color: string;         // Hex fallback bg (legacy, currently unused).
  role: string;          // Shown in ProjectCase meta row.
  team: string;
  timeline: string;
  duration: string;
  platform: string;
  techStack: string;
  // 3-part structured explanation — shown on Projects listing cards
  impact: string;              // Problem / why it mattered. ~2–3 sentences.
  whatIDid: string;            // Intro sentence for What I Did section.
  whatIDidBullets: string[];   // Arrow-bullet list items (→).
  outcome: string;             // Measurable results. Shown in highlighted box.
  images: string[];            // 3 images per project. Used in ProjectCard slideshow.
}
```

**Current dataset (6 projects — real portfolio):**

| slug | title | client | tags |
|---|---|---|---|
| `webeing` | Webeing (위빙) | Self-founded Startup | Entrepreneurship, Product Management, Full-Stack, ESG |
| `busking-town` | Busking Town | Side Project | Entrepreneurship, Prototyping, Market Research, Community |
| `liter` | LITER | Side Project | Product, Prototyping, Market Research, Fintech |
| `gif-hackathon` | Global Innovator Festa Hackathon | GIF Korea·Kazakhstan | Global, Entrepreneurship, Market Research, Leadership |
| `travel-cp` | Travel CP | Side Project | Global, Market Research, Entrepreneurship, Community |
| `north-america-strategy` | North American Market Strategy | Emong Games | Global, Market Research, Strategy, Leadership |

**All slugs use a 6-section generic fallback in `CaseContent()` — no custom case study copy yet.**

---

### 5.3 `Magazine` — `src/app/data/magazines.ts`

```ts
interface Magazine {
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  postSlugs: string[];   // ORDERED list — defines the series sequence.
}
```

**Helper functions:**

```ts
getMagazineForPost(postSlug: string): Magazine | undefined
getPositionInMagazine(postSlug: string): number | undefined  // 1-based index
```

**Current dataset (3 magazines):**

| slug | name | posts |
|---|---|---|
| `product-thinking` | Product Thinking | on-simplicity-in-design, the-art-of-constraints, lessons-from-korean-design |
| `tech-futures` | Tech Futures | building-with-intention, notes-on-productive-workflows |
| `creative-life` | Creative Life | the-future-of-ai-in-creative-work |

---

## 6. Components

### 6.1 `Layout.tsx` — Persistent Shell

Wraps all routes. Rendered as the root `Component`; children appear via `<Outlet />`.

#### Header

```
Position:      fixed top-0, full width, z-50
Background:    bg-white/80 backdrop-blur-md (default)
               → bg-white shadow-sm (scrollY > 8)
Scroll logic:  useEffect + addEventListener('scroll', { passive: true })
               Cleaned up on unmount.

Left:          Site name → Link to="/"
Right desktop: Nav links + search icon (onClick → setSearchOpen(true))
Right mobile:  Hamburger → fullscreen overlay (staggered nav links + social icons)
               Closes on route change via useEffect(dep: location.pathname)
```

**Nav links (in order):** Home · About · Projects · Blog · Magazine

**Active link detection:**
```ts
const isActive = (to: string, exact?: boolean) =>
  exact ? location.pathname === to : location.pathname.startsWith(to);
// Home uses exact: true
```

#### Footer

```
border-t border-gray-100, py-12
Row 1 (centered): Home · About · Projects · Blog · Magazine
Row 2: copyright left | social icons right (LinkedIn, GitHub, Mail)
```

#### Global providers

- `<Toaster position="top-center" />` from sonner
- `<SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />`
- `<AnchorNav />` — visible on blog post and project case routes only

#### Keyboard shortcut

```ts
// Cmd+K / Ctrl+K toggles search modal
window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    setSearchOpen(prev => !prev);
  }
});
```

---

### 6.2 `SearchModal.tsx`

- Fullscreen dark overlay with centered search input
- Searches: `POSTS` (title + tags) + `PROJECTS` (title + tags + client)
- Results grouped: "Posts" | "Projects"
- Click result → navigate + close modal
- Dismiss: ESC key or click overlay background

---

### 6.3 `AnchorNav.tsx`

- Sticky left-side or top reading-progress navigation
- Visible on `/blog/:slug` and `/projects/:slug` only
- Links to in-page `id` anchors
- `scrollMarginTop: 80px` on all anchored headings (accounts for fixed header)

---

## 7. Pages — Detailed Spec

---

### 7.1 Home (`/`)

**File:** `src/app/pages/Home.tsx`
**Max content width:** `max-w-3xl`
**Horizontal padding:** `px-6`

#### Section structure

```
<div max-w-3xl>
  <section id="hero">       pt-20 md:pt-32 · pb-20 md:pb-28 · border-b border-gray-100
  <section id="stats">      py-16 md:py-20 · border-b border-gray-100
  <section id="projects">   py-16 md:py-20 · border-b border-gray-100
  <section id="blog">       py-16 md:py-20 · border-b border-gray-100
  <section id="connect">    py-20 md:py-28 · mb-8
</div>
```

#### Hero

```
[Product Manager · Seoul]        ← text-xs uppercase tracking-widest text-gray-400

Seungjo Han                      ← h1, clamp(2rem, 5vw, 3.4rem), fontWeight 400
한승조                             ← text-gray-500, 1.05rem

[Hashtag badge pills]            ← border border-gray-200 rounded-full px-3 py-1, text-xs text-gray-400
  #zero-to-one · #hands-on · #data-driven
  #customer-focused · #technical innovation · #trial & error

[Bio bullets]                    ← ul space-y-2; each li has "—" (text-gray-300) prefix
  — Passionate about solving problems and driving positive innovation...
  — Love to work in fast-paced environments...
  — Keen to listen to people's voices...

[View Projects]  [About me]
  ↑ bg-black text-white rounded-full
                 ↑ border border-gray-200 rounded-full
```

**Mount animation:** staggered delays (0.05 → 0.27s), `opacity: 0, y: 20 → 1, 0`

#### Stats

Three figures: `2+ Years of Experience` · `10+ Technical Projects` · `500+ Customers Interviewed`
Grid: `grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-gray-100`
Animation: `FadeIn` component (whileInView), stagger `i * 0.08`

#### Selected Projects

- Data: `PROJECTS.slice(0, 2)`
- Grid: `grid md:grid-cols-2 gap-5`
- Each card: `aspect-[16/9]` cover image + hover scale + title + `client · year` + description
- Links to `/projects/:slug`

#### Recent Writing

- Data: `POSTS.slice(0, 3)`
- Layout: `divide-y divide-gray-100`
- Each row: title → excerpt (2-line clamp) → `formatDate(post.date)` · tags
- Links to `/blog/:slug`

#### Get in Touch

Two action buttons (no subscribe form):
- **Email me** → `href="mailto:seungjohan.kr@gmail.com"` — `bg-black text-white` pill + `Mail` icon
- **LinkedIn** → `href="https://www.linkedin.com/in/seungjohan/"` — `border border-gray-200` pill + `Linkedin` icon

---

### 7.2 About (`/about`)

**File:** `src/app/pages/About.tsx`
**Max content width:** `max-w-2xl`
**Horizontal padding:** `px-8 md:px-12`
**Vertical padding:** `py-20 md:py-28`

Single column, no animation, no interactive elements, no tags or decorative lines.

```
Portrait image   ← aspect-ratio 3/2, object-cover, full width, mb-12
Seungjo Han      ← h1, clamp(1.6rem, 3vw, 2.2rem), fontWeight 400
Designer & Writer · Seoul, KR   ← text-gray-400, 0.875rem
Bio paragraphs   ← space-y-5, text-gray-700, 1rem
```

---

### 7.3 Projects (`/projects`)

**File:** `src/app/pages/Projects.tsx`
**Max content width:** `max-w-4xl`

#### Section structure

```
Page heading + subtitle
↓
Intro Dimensions (2×2 grid)
↓
Project list (single column, divide-y)
↓
Skills (3-column grid)
```

#### What I Bring

Four tiles in `grid grid-cols-2 gap-10 md:gap-12` (always 2×2 — no responsive breakpoint change):
- Entrepreneur
- Technologist
- Global Builder
- Hands-on Mindset

Each: `h3` (fontWeight 500) + `p` body (text-gray-500)
Animation: staggered `opacity: 0, y: 16 → 1, 0`

#### Project List Cards (single column)

Each project is wrapped in a **bordered card** (`border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300`) to visually separate projects. Cards use `flex flex-col gap-6` (no `divide-y`).

Card structure:
```
[Cover image — full width, aspect-[16/8], Link to detail, hover scale]

[Card body — p-8]
  [Keyword tag badges — flex flex-wrap gap-2]
    Tag1  Tag2  ...   ← px-3 py-1 rounded-full text-xs border; NO # prefix
                        active (selectedTag): bg-black text-white border-black
                        inactive: bg-white text-gray-500 border-gray-200 hover:border-gray-400
                        onClick: setTag(tag === selectedTag ? null : tag)  ← toggle

  [Title]                                          [View case study →]
  [client · year]   ← text-xs text-gray-400

  📝 IMPACT          ← text-gray-400 uppercase 0.68rem; NO border-t above
  [paragraph]

  🔧 WHAT I DID      ← NO border-t above; no dividers between sections
  [intro sentence]
  → bullet 1
  → bullet 2 ...

  ✅ OUTCOME         ← NO border-t above
  [bg-gray-50 rounded-xl p-5]
    [result text]
```

**No `#` character prefix on keyword badges.** There are **no `border-t` dividers between Impact / What I Did / Outcome** sections. Sections are separated only by `mb-7` vertical margin.

#### Tag filter

There is **no separate filter bar** at the top of the page. Filtering is driven exclusively by clicking keyword badges on individual cards. When a tag is active, a minimal `"Filtering by X · Clear"` indicator appears above the card list. The URL updates to `/projects?tag=X`.

```
No filter active:    → no indicator shown; all projects visible
Click card badge:    → setSearchParams({ tag }) → /projects?tag=Branding
Click same badge:    → setSearchParams({}) → clears filter (toggle)
Click "Clear" link:  → setSearchParams({}) → /projects
```

Empty state: "No projects tagged X." + "Clear filter" link.

#### Skills

Categories: Software · Product Management · Language · Analytics · Design
Grid: `grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10`
Each: category label (text-xs uppercase text-gray-400) + `ul` of items (text-sm text-gray-700)
Animation: `whileInView` stagger

---

### 7.4 Project Case Study (`/projects/:slug`)

**File:** `src/app/pages/ProjectCase.tsx`
**Max content width:** `max-w-4xl`

#### Route resolution

```ts
const { slug } = useParams<{ slug: string }>();
const project = PROJECTS.find(p => p.slug === slug);
if (!project) → "Project not found" + "← Back to Projects"
```

#### DOM structure

```
[← Back to Projects]     ← ArrowLeft + Link to="/projects"

[Cover image]            ← max-w-4xl, aspect-[16/7], rounded-2xl, fade-in on mount

[Header]
  [tag labels]           ← flex gap-3; each span: text-xs uppercase tracking-wider text-gray-400
  [h1 title]             ← clamp(1.8rem, 4vw, 2.8rem), fontWeight 400
  [description]          ← text-gray-500, 1.05rem

  [Meta row]             ← flex-wrap gap-x-8 gap-y-4; NO border lines
    Role | Team | Duration | Tools
    (each: label text-xs uppercase text-gray-400 + value text-sm text-gray-900)

[divide-y divide-gray-100]
  <CaseContent slug={slug!} />
```

#### `Section` component

```tsx
function Section({ title, id, children }: { title: string; id: string; children: ReactNode }) {
  // motion.div: id={id}, py-10, whileInView fade-in, once: true, margin: '-60px'
  // h2: title string ONLY — no numeric prefix
}
```

**No `border-b` between sections — only `py-10` vertical padding + `divide-y` on parent.**

#### `CaseContent` — slug dispatch

`brand-identity-system`: Problem · TL;DR · Solution · Process · Takeaway · Conclusion (full written copy)
All other slugs: same 6-section generic fallback

---

### 7.5 Blog Listing (`/blog`)

**File:** `src/app/pages/Blog.tsx`
**Max content width:** `max-w-3xl`

#### Date formatting helper (local, duplicated in BlogPost.tsx)

```ts
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  // "April 15, 2026" → "Apr 15, 2026"
}
```

#### Tag filter

```
ALL_TAGS: ['Design', 'Technology', 'Culture', 'Creativity', 'Product']
Active pill:   bg-black text-white border-black
Inactive pill: bg-white text-gray-600 border-gray-200 hover:border-gray-400
Selecting tag:   setSearchParams({ tag })   → /blog?tag=Design
Selecting "All": setSearchParams({})        → /blog
```

#### Post list — IMPORTANT: nested link fix

Each row uses a `<div onClick={() => navigate(...)}>` (NOT a `<Link>`) as the outer wrapper to avoid `<a>` inside `<a>` DOM nesting errors. Inner interactive elements use `e.stopPropagation()`:

```tsx
// ✅ Correct pattern
const navigate = useNavigate();

<div
  className="group block py-8 cursor-pointer"
  onClick={() => navigate(`/blog/${post.slug}`)}
>
  <h2>...</h2>
  <p>...</p>
  <div> {/* meta row */}
    {/* Tag buttons: onClick uses e.stopPropagation() */}
    <button onClick={e => { e.stopPropagation(); setTag(tag); }}>...</button>

    {/* Magazine link: uses e.stopPropagation() */}
    <Link
      to={`/magazine/${magazine.slug}`}
      onClick={e => e.stopPropagation()}
    >...</Link>
  </div>
</div>

// ❌ NEVER do this (causes validateDOMNesting warning):
// <Link to="/blog/:slug">
//   ...
//   <Link to="/magazine/:slug">...</Link>  ← nested <a>
// </Link>
```

#### Post row structure

```
<div onClick → /blog/:slug>
  h2 title
  p excerpt
  [meta row flex justify-between]
    LEFT:  formatDate · [tag buttons (stopPropagation + setTag)]
    RIGHT: [magazine name italic] ← Link stopPropagation to /magazine/:slug
</div>
```

---

### 7.6 Blog Post (`/blog/:slug`)

**File:** `src/app/pages/BlogPost.tsx`
**Max content width (article):** `max-w-[48rem]` (~15% wider than max-w-2xl / 42rem)
**Max content width (related):** `max-w-4xl`

#### Route resolution

```ts
const { slug } = useParams<{ slug: string }>();
const post = POSTS.find(p => p.slug === slug);
if (!post) → "Post not found" + "← Back to Writing"
```

#### Article DOM structure

```
<article max-w-[48rem]>
  [← Writing]              ← ArrowLeft + Link to="/blog", mb-10

  [h1 title]               ← clamp(1.8rem, 4vw, 2.6rem), fontWeight 400
  [p subtitle]             ← text-gray-500, 1.1rem, mb-7

  [Author/meta bar]        ← flex justify-between, mb-8; NO border lines
    LEFT:  [tag links → /blog?tag=X] · [magazine link + "pos/total"]
    RIGHT: "Seungjo Han · Apr 15, 2026"  ← text-xs text-gray-400, flex-shrink-0

  [cover image]            ← optional; rounded-xl aspect-[16/9], mb-10

  [PostContent slug={slug!}]

  [End bar]                ← border-t border-gray-100, flex justify-between, mt-10 pt-10
    LEFT:  [tag links → /blog?tag=X]
    RIGHT: [magazine name italic] ← Link to /magazine/:slug
</article>
```

**No avatar. No share button. No reading time. No comments.**

#### `AnchorH2` component

```tsx
// On # click: clipboard.writeText(origin + pathname + '#' + id) → toast.success('Link copied!')
// h2: id={id}, scrollMarginTop: 80px
// # button: opacity-0 group-hover:opacity-100
```

#### `PostContent` — slug dispatch

- `on-simplicity-in-design`: full body, 5 `AnchorH2` sections
- All others: 3-section generic fallback

#### Prose CSS (inline `<style>` tag)

```css
.prose-content p      { color: #374151; line-height: 1.8; margin-bottom: 1.4rem; font-size: 1.05rem; }
.prose-content h2     { font-size: 1.25rem; font-weight: 500; color: #111827;
                        margin-top: 2.5rem; margin-bottom: 1rem; letter-spacing: -0.01em; }
.prose-content em     { font-style: italic; }
.prose-content strong { font-weight: 600; color: #111827; }
```

#### Related posts algorithm

```ts
const related = POSTS
  .filter(p => p.slug !== slug)
  .map(p => ({ post: p, score: p.tags.filter(t => post.tags.includes(t)).length }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 3)
  .map(({ post: p }) => p);
```

**`PostCard`** (related section): thumbnail → title → excerpt (2-line clamp) → magazine link (italic). **No hashtag tags in card.**
Section background: `bg-gray-50/50`. Hidden if `related.length === 0`.

#### Related post navigation

When a visitor clicks a `PostCard` in the related section:

```tsx
onClick={() => {
  window.scrollTo({ top: 0, behavior: 'instant' });  // scroll to top immediately
  navigate(`/blog/${post.slug}`);                     // then navigate
}}
```

`behavior: 'instant'` is used (not `'smooth'`) to avoid a jarring visible scroll before the new page renders.

---

### 7.7 Magazine Listing (`/magazine`)

**File:** `src/app/pages/Magazine.tsx`
**Max content width:** `max-w-3xl`

```
Page heading: "Magazine"
Subtitle: "Curated series of essays..."

divide-y divide-gray-100:
  Each magazine row (py-10):
    [Left]                               [Right]
    Magazine name (h2, linked)           Numbered post list:
    Description                            01. Post title → /blog/:slug
    "N posts" meta                         02. ...
                                         "Read series →" → /magazine/:slug
```

Layout: `flex flex-col sm:flex-row sm:justify-between gap-6`

---

### 7.8 Magazine Detail (`/magazine/:slug`)

**File:** `src/app/pages/MagazineDetail.tsx`
**Max content width:** `max-w-2xl`

#### Route resolution

```ts
const { slug } = useParams<{ slug: string }>();
const magazine = MAGAZINES.find(m => m.slug === slug);
if (!magazine) → "Magazine not found" + "← All magazines"
```

#### DOM structure

```
[← All magazines]

"Magazine"              ← text-xs uppercase tracking-wider text-gray-400
[h1 magazine.name]      ← clamp(1.8rem, 4vw, 2.6rem)
[description]
"N posts in this series"

[Post list divide-y divide-gray-100]
  Each post (py-8, Link to /blog/:slug):
    [index "01"]  [content: tags · h2 title · excerpt · date]  [thumbnail 80×56px]
```

---

## 8. Design System

### 8.1 Color Palette

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| Black | `#000000` | `bg-black / text-black` | CTA buttons, strong emphasis |
| Gray 900 | `#111827` | `text-gray-900` | Headings, outcome box text |
| Gray 700 | `#374151` | `text-gray-700` | Prose body, impact/whatIDid text |
| Gray 600 | `#4b5563` | `text-gray-600` | Case study body, bullet text |
| Gray 500 | `#6b7280` | `text-gray-500` | Subtitles, descriptions |
| Gray 400 | `#9ca3af` | `text-gray-400` | Meta labels, section labels, arrows |
| Gray 300 | `#d1d5db` | `text-gray-300` | Em dashes, anchor `#` button |
| Gray 200 | `#e5e7eb` | `text-gray-200` | Separator dots |
| Gray 100 | `#f3f4f6` | `border-gray-100 / divide-gray-100` | Borders, dividers, bg-gray-50 |
| White | `#ffffff` | `bg-white` | Page background |

### 8.2 Typography

| Context | Size | Weight | Notes |
|---|---|---|---|
| Hero h1 (Home) | `clamp(2rem, 5vw, 3.4rem)` | 400 | `letterSpacing: -0.025em` |
| Post h1 | `clamp(1.8rem, 4vw, 2.6rem)` | 400 | `letterSpacing: -0.02em, lineHeight: 1.18` |
| Project h1 (detail) | `clamp(1.8rem, 4vw, 2.8rem)` | 400 | `letterSpacing: -0.02em` |
| Project title (listing) | `1.4rem` | 400 | `letterSpacing: -0.01em` |
| Section h2 | `1.15rem – 1.25rem` | 500 | Prose and case study |
| Body prose | `1.05rem` | 400 | `.prose-content` |
| Section labels (Impact etc.) | `0.68rem` | 400 | Uppercase, tracking-wider |
| Meta / label | `0.65rem – 0.9rem` | 400 | Uppercase, tracking-wider |
| Author / date | `0.75rem` | 400 | Post byline |

**Rule:** Do not use Tailwind text-size classes (`text-xl` etc.). Use inline `style={{ fontSize: '...' }}`.

### 8.3 Spacing

| Context | Value |
|---|---|
| Page horizontal padding | `px-6` (all pages) |
| About page padding | `px-8 md:px-12` |
| Section vertical rhythm | `py-16 md:py-20` (home), `py-10` (case study) |
| Project listing card padding | `py-16` |
| Max width — article | `max-w-[48rem]` |
| Max width — blog | `max-w-3xl` |
| Max width — general | `max-w-4xl` |

### 8.4 Animation Conventions

| Property | Value |
|---|---|
| Entry translate | `y: 22` → `y: 0` (mount) or `y: 16–24` (in-view) |
| Entry opacity | `0` → `1` |
| Duration | `0.55s – 0.8s` elements; `0.3s` interactions |
| Easing | `[0.22, 1, 0.36, 1]` |
| Trigger (mount) | `initial` + `animate` props |
| Trigger (scroll) | `whileInView`, `viewport: { once: true, margin: '-50px' to '-60px' }` |
| Stagger | `delay: index * 0.05s` (lists) or `index * 0.08s` (cards) |
| Hover | `whileHover={{ y: -3 }}` on PostCards |

### 8.5 Border & Divider Conventions

- Section borders: `border-b border-gray-100` (home sections)
- Content dividers: `divide-y divide-gray-100` (post lists, magazine, case study sections)
- Card borders: `border border-gray-100 hover:border-gray-200`
- Tags pill: `border border-gray-200 rounded-full` (project listing + detail)
- **No border lines in author bars or meta rows**
- End bar (blog post): `border-t border-gray-100` only

---

## 9. Key Behaviors — Implementation Notes

### 9.1 Tag filter URL sync (Blog)

```
/blog                   → selectedTag = null → all posts
click "Design" pill     → setSearchParams({ tag: 'Design' }) → /blog?tag=Design
click post tag link     → Link to="/blog?tag=Design"
click "All"             → setSearchParams({}) → /blog
```

### 9.2 Nested link prevention (Blog listing)

**Problem:** `<Link>` wrapping entire row + inner `<Link>` for magazine = `<a>` inside `<a>` = React DOM warning.

**Solution:** Outer wrapper is `<div onClick={() => navigate(...)}>` with `cursor-pointer`. Inner `<Link>` for magazine uses `e.stopPropagation()`. Tag buttons use `e.stopPropagation()` + `setTag()`. This pattern must be maintained whenever a clickable row contains inner links.

### 9.3 Magazine → post linkage

```
Magazine listing:     postSlugs resolved to Post objects; displayed in sequence order
Blog listing row:     getMagazineForPost(slug) → italic magazine name (right-aligned, Link)
Blog post detail:     getMagazineForPost(slug) → magazine name + "pos/total" in author bar
                      getPositionInMagazine(slug) → 1-based index
```

### 9.4 Anchor copy link / scroll position

```
scrollMarginTop: '100px'  ← applied to both AnchorH2 (BlogPost) and Section h2 (ProjectCase)
// Accounts for fixed header (~64px) + comfortable reading gap
// Increased from 80px → 100px to ensure heading is fully visible above header
Hover AnchorH2  → # button fades in
Click #         → clipboard.writeText(origin + pathname + '#' + id)
                → toast.success('Link copied!')
```

### 9.5 Related post scoring

```ts
// Shared tag count; ties resolved by original POSTS array order
score = p.tags.filter(t => post.tags.includes(t)).length
// Top 3 displayed
```

### 9.6 Header scroll state

```ts
scrolled = window.scrollY > 8
scrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur-md'
```

---

## 10. Content Guidelines

### Adding a blog post

1. Add entry to `POSTS` in `posts.ts`
2. Add `if (slug === 'your-slug')` branch in `PostContent` in `BlogPost.tsx`
3. (Optional) Add slug to a `magazine.postSlugs` array in `magazines.ts`

### Adding a project

1. Add entry to `PROJECTS` in `projects.ts` — all fields required including `impact`, `whatIDid`, `whatIDidBullets`, `outcome`
2. (Optional) Add `if (slug === 'your-slug')` branch in `CaseContent` in `ProjectCase.tsx`

### Adding a magazine

1. Add entry to `MAGAZINES` in `magazines.ts`
2. `postSlugs` must reference existing `POSTS[].slug` values in the desired reading order
3. No other code changes needed

---

## 11. Known Limitations

| Limitation | Impact | Planned fix |
|---|---|---|
| Post body is hardcoded JSX | Adding a post requires code deploy | MDX files or CMS |
| No catch-all `path: '*'` route | Unmatched URLs throw React Router error | Add `{ path: '*', Component: NotFound }` |
| `formatDate()` duplicated in `Blog.tsx` and `BlogPost.tsx` | DRY violation | Extract to `src/app/utils/formatDate.ts` |
| Related post scoring is tag-overlap only | May surface loosely related posts | Add title keyword similarity |
| No OG/meta tags | Poor social preview | `react-helmet-async` or Vite meta plugin |
| Magazine postSlugs not validated at runtime | Typo silently renders nothing | Dev-time assertion in `magazines.ts` |

---

## 12. Backlog (Prioritized)

| # | Feature | Complexity | Value |
|---|---|---|---|
| 1 | 404 / NotFound catch-all route | Low | High |
| 2 | Extract `formatDate` to utils | Low | Low |
| 3 | MDX-based blog posts | Medium | High |
| 4 | OG meta tags per page/post | Medium | High |
| 5 | Dark mode | Medium | Medium |
| 6 | Korean language variant (`/ko/*`) | High | High |
| 7 | RSS feed from `POSTS` | Low | Medium |
| 8 | Reading progress bar | Low | Low |
| 9 | Analytics (Fathom/Plausible) | Low | Medium |
| 10 | Project image gallery in case studies | Low | Medium |

---

## 13. Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0 | Apr 2026 | Initial ship: Home, About, Projects, Blog |
| 2.0 | Apr 29, 2026 | Added Magazine pages + data; BlogPost author bar updates; Projects intro dimensions + skills |
| 2.1 | Apr 30, 2026 | BlogPost: removed comments, reading time, nested link fix; Projects meta inline; Blog listing magazine column |
| 3.0 | May 1, 2026 | Home hero updated with real identity data (name, 한승조, hashtags, bio bullets); contact section replaced subscribe form with Email + LinkedIn buttons; Projects listing redesigned to 1-column with Impact/What I Did/Outcome cards; `whatIDidBullets[]` added to Project interface; ProjectCase reverted to 6-section format |
| 3.1 | May 1, 2026 | Blog listing: fixed `<a>` inside `<a>` nesting error — outer row wrapper changed from `<Link>` to `<div onClick={navigate}>` with `e.stopPropagation()` on inner interactive elements; PRD set to auto-update with every change |
| 3.2 | May 1, 2026 | Projects listing: removed border-t dividers between Impact/What I Did/Outcome sections; added `border border-gray-200 rounded-2xl` card outline per project; added hashtag keyword badges per card linking to `/projects?tag=X` filter; added tag filter bar at top (All + all unique tags); empty state for no results |
| 3.3 | May 1, 2026 | Projects listing: removed top filter bar (All/Branding/...) — filtering now via card badges only with inline "Filtering by X · Clear" indicator; removed `#` prefix from keyword badges; anchor scrollMarginTop increased from 80px → 100px for both BlogPost and ProjectCase; related PostCard onClick now calls `window.scrollTo({ top: 0, behavior: 'instant' })` before navigating |
| 3.4 | May 2, 2026 | Admin dashboard added (`/admin`, `/admin/dashboard`, `/admin/posts`, `/admin/projects`); localStorage-based password auth (demo, password: "admin"); AdminLayout with dark sidebar; Dashboard with monthly views LineChart + views-by-post/project BarCharts (recharts); Posts/Projects tables with sortable columns, edit modal (UI only), delete (requires Supabase); `images: string[]` added to Project interface — 3 images per project; ProjectCard component with 1s auto-cycling crossfade slideshow + dot indicators |
| 3.5 | May 2, 2026 | Projects page: image cycle interval doubled (1s → 2s); added ‹ › arrow buttons at top-left/top-right corners of image for manual prev/next; Blog listing: post card onClick now calls `window.scrollTo({ top:0, behavior:'instant' })` before navigating; ProjectCase.tsx anchor fix: removed duplicate `id` from outer `motion.div` — `id` now only on `h2` so `scrollMarginTop:100px` correctly applies and anchor links scroll to exact heading position |
| 3.6 | May 2, 2026 | Projects page arrows repositioned to vertically-centered left/right sides with `bg-black/20 hover:bg-black/40` transparent overlay (removed white background); All nav links (header desktop, header mobile drawer, footer) now call `window.scrollTo({ top:0, behavior:'instant' })` on click; Home page hero redesigned to two-column split layout (name left / bio+CTAs right) — removed hashtag badge pills, replaced bio bullet list with flowing paragraphs, CTAs changed from pill buttons to minimal text links with arrow; section headings changed to small uppercase label style; project meta row reordered (client·year above title); writing list updated to show date right-aligned; overall editorial/minimal aesthetic restored |
| 3.7 | May 4, 2026 | **Home** reverted to clean initial/v14 style: sparse typographic layout (max-w-3xl), large thin-weight display name, one-line bio, text-link CTAs with ArrowUpRight, numbered project list with client+year, writing list with excerpt+date, minimal contact section with email+LinkedIn inline; no stats, no cards, no badges. **Projects page** fully redesigned top-to-bottom: (1) Hero section inspired by alessandrakrick.com — "SENIOR PRODUCT MANAGER PORTFOLIO" label, "I build products from 0 to 1." headline (weight 300), inline tags row, 3-stat grid (6 YOE / 10M+ users / 12+ products); (2) "Featured case studies" heading + subtitle; (3) 4 keyword tag pills (Entrepreneurship, Technology, Hands-on, Global); (4) project cards unchanged; (5) Skills renamed to "Skills & Tools" with subtitle "The mix I use to take products from discovery, through delivery, to measurable impact."; (6) Bottom stats row (15+ partner integrations / 88% retention / 5 app stores) + "Let's build something impactful." CTA + Email Me / LinkedIn buttons |
| 3.8 | May 6, 2026 | Magazine removed. Footer redesigned (keeyonghan.com). Home redesigned (YC-inspired). |
| 3.9 | May 7, 2026 | **Footer margin**: changed footer container from `max-w-6xl` to `max-w-4xl` to align with page body content. **Scroll-to-top**: added `useEffect` on `location.pathname` in Layout.tsx so every route transition automatically scrolls to top (covers programmatic navigation, Link clicks, and browser history). **Anchor `#` buttons removed**: `AnchorH2` in BlogPost.tsx simplified to a plain `<h2 id>` — hover-copy `#` button eliminated. Personal info pending (user to provide). |
| 4.0 | May 7, 2026 | **Magazine fully restored**: recreated `magazines.ts` (3 series — Product Thinking, Tech Futures, Creative Life — each with slug, name, description, cover image, and ordered postSlugs); recreated `Magazine.tsx` (grid of magazine cards with cover, name, essay count); recreated `MagazineDetail.tsx` (hero cover image, ordered post list with issue numbers + thumbnails, "Other series" pills); routes `/magazine` and `/magazine/:slug` restored; Magazine added back to nav and footer Pages column. **BlogPost meta bar updated**: left side now shows the magazine name (linked to magazine page) with position indicator (e.g. "2/3"); falls back to first tag label if post has no magazine. |
| 4.1 | May 25, 2026 | **Projects data replaced** with 6 real portfolio projects from Seungjo's actual background (Webeing, Busking Town, LITER, GIF Hackathon, Travel CP, North America Strategy) — all fields filled with authentic content, real Unsplash imagery. **3 blog posts added** from Substack: "Developing a Web Product for an Early-stage Startup", "Designing a Prototype for a Startup", "I'm a Proud Dokdo Security Police of Korea" — all with full body content in BlogPost.tsx. **Blog tag filter expanded** to include Startup, Life, Korea. **"What I Bring" 4th pillar added** (Hands-on Mindset) and grid changed from `lg:grid-cols-4` to `grid-cols-2` (2×2 layout). **Home "Selected Work" label renamed** to "Projects". |