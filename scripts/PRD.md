# PRD — Personal Blog & Portfolio
**Owner:** Seungjo Han  
**Version:** 2.0  
**Updated:** Apr 29, 2026  
**Status:** Shipped (v1.0) / Iterating

---

## 1. Purpose & Goals

A personal website that serves two functions simultaneously:

1. **Portfolio** — Selected design case studies presented with enough depth that a potential client or collaborator understands the thinking, not just the output.
2. **Blog** — Long-form essays on design, technology, and culture. Writing-first, no-distraction reading experience.

**Non-goals (explicitly out of scope for v1):**
- CMS or database backend (all content is static TypeScript data files)
- Authentication / gated content
- Real email subscription processing
- Analytics

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Build | Vite | Dev server + production bundler |
| UI | React 18, TypeScript | Strict mode enabled |
| Routing | `react-router` (Data Mode) | `createBrowserRouter`, **not** `react-router-dom` |
| Styling | Tailwind CSS v4 | No `tailwind.config.js` — uses v4 CSS-first config |
| Animation | `motion/react` (from `motion` package) | Formerly Framer Motion |
| Icons | `lucide-react` | Consistent 1px stroke, 24px base |
| Toast | `sonner` | Import `toast` from `"sonner"` |
| Fonts | Defined in `/src/styles/fonts.css` | Imported once, system stack fallback |

---

## 3. File Structure

```
/
├── PRD.md
├── package.json
└── src/
    ├── app/
    │   ├── App.tsx                      # Root — renders <RouterProvider router={router} />
    │   ├── routes.tsx                   # createBrowserRouter config
    │   ├── components/
    │   │   ├── Layout.tsx               # Persistent shell: header + footer + toast + search
    │   │   ├── SearchModal.tsx          # Full-screen search overlay
    │   │   ├── AnchorNav.tsx            # Sticky in-page section navigation
    │   │   └── figma/
    │   │       └── ImageWithFallback.tsx  # Protected — do not modify
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── About.tsx
    │   │   ├── Projects.tsx
    │   │   ├── ProjectCase.tsx
    │   │   ├── Blog.tsx
    │   │   └── BlogPost.tsx
    │   └── data/
    │       ├── posts.ts                 # Post[] — all blog post metadata
    │       └── projects.ts              # Project[] — all project metadata
    └── styles/
        ├── theme.css                    # CSS custom properties / design tokens
        └── fonts.css                    # @import font declarations (top of file only)
```

---

## 4. Routing

**Config file:** `src/app/routes.tsx`  
**Pattern:** React Router Data Mode via `createBrowserRouter`

```ts
createBrowserRouter([
  {
    path: '/',
    Component: Layout,      // persistent shell
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'blog', Component: Blog },
      { path: 'blog/:slug', Component: BlogPost },
      { path: 'projects', Component: Projects },
      { path: 'projects/:slug', Component: ProjectCase },
    ],
  },
]);
```

**URL params in use:**
- `blog/:slug` — matched against `POSTS[].slug`
- `projects/:slug` — matched against `PROJECTS[].slug`
- `?tag=X` — Blog listing filter; set via `useSearchParams`, populated from BlogPost tag links

---

## 5. Data Models

### 5.1 `Post` (`src/app/data/posts.ts`)

```ts
interface Post {
  slug: string;       // URL-safe, kebab-case. Used in /blog/:slug
  title: string;
  subtitle: string;   // One-sentence description; shown under title on post page
  date: string;       // Human-readable, e.g. "April 15, 2026". Formatted via formatDate()
  readTime: string;   // e.g. "5 min read". Shown in author bar on post page
  tags: string[];     // Used for filtering, tag links, related post scoring
  excerpt: string;    // 1–2 sentences. Shown in blog listing rows and PostCard previews
  coverImage?: string; // Unsplash URL. Used in article header and PostCard thumbnail
}
```

**Current dataset (6 posts):**

| slug | title | tags | date |
|---|---|---|---|
| `on-simplicity-in-design` | On simplicity in design | Design, Product | April 15, 2026 |
| `building-with-intention` | Building with intention | Creativity, Culture | March 28, 2026 |
| `the-art-of-constraints` | The art of constraints | Design, Creativity | March 12, 2026 |
| `lessons-from-korean-design` | Lessons from Korean design | Design, Culture | February 24, 2026 |
| `the-future-of-ai-in-creative-work` | The future of AI in creative work | Technology, Design | February 10, 2026 |
| `notes-on-productive-workflows` | Notes on productive workflows | Product, Technology | January 28, 2026 |

**Full body copy exists for:** `on-simplicity-in-design` (5 named sections).  
All other slugs render a 3-section generic fallback in `PostContent`.

---

### 5.2 `Project` (`src/app/data/projects.ts`)

```ts
interface Project {
  slug: string;       // URL-safe, kebab-case. Used in /projects/:slug
  title: string;
  client: string;     // Shown in meta card and project listing
  year: string;       // Shown in project cards
  description: string; // 1–2 sentence summary. Shown in card and case study header
  tags: string[];     // Shown as uppercase label pills
  coverImage: string; // Unsplash URL. Required (not optional)
  color: string;      // Legacy hex accent — currently unused
  role: string;       // Shown in case study meta card
  team: string;       // Shown in case study meta card
  timeline: string;   // e.g. "Jan – Apr 2026"
  duration: string;   // e.g. "12 weeks"
  platform: string;   // e.g. "Web, iOS, Android"
  techStack: string;  // e.g. "Figma, React, TypeScript, Storybook"
}
```

**Current dataset (4 projects):**

| slug | title | client | tags |
|---|---|---|---|
| `brand-identity-system` | Brand Identity System | Tech Startup | Branding, Design System |
| `ecommerce-platform` | E-commerce Platform | Retail Brand | UI/UX, Development |
| `mobile-app-design` | Mobile App Design | Finance Company | Product Design, iOS |
| `editorial-website` | Editorial Website | Magazine | Web Design, Typography |

**Full case study copy exists for:** `brand-identity-system` (6 sections: Problem, TL;DR, Solution, Process, Takeaway, Conclusion).  
All other slugs render a 6-section generic fallback.

---

## 6. Shared Components

### 6.1 `Layout.tsx`

Wraps all routes via React Router's nested `<Outlet />`. Renders:

#### Header
- Position: `fixed` top-0, full width, z-50
- Background: `bg-white/80 backdrop-blur-md` by default; transitions to `bg-white shadow-sm` on scroll (`scrollY > 10` via `useEffect` + `useState`)
- Left: site name link → `/`
- Right (desktop): nav links (Home, About, Projects, Blog) + search icon button
- Right (mobile): hamburger icon → fullscreen overlay menu with staggered nav links + social icons (LinkedIn, GitHub, Mail)
- Active nav link: detected via `useLocation().pathname`; styled with `text-black` vs `text-gray-500`

#### Footer
- `border-t border-gray-100`, `py-12`
- Row 1 (centered): nav links — Home, About, Projects, Blog
- Row 2: copyright text left / social icon links right
- **No email subscribe section**

#### Global providers in Layout
- `<Toaster position="top-center" />` from sonner
- `<SearchModal />` — controlled by local `isSearchOpen` state; toggled from search icon in header
- `<AnchorNav />` — visible only on blog post and project case study routes

---

### 6.2 `SearchModal.tsx`

- Fullscreen dark overlay with centered search input
- Searches across `POSTS` (by title + tags) and `PROJECTS` (by title + tags + client)
- Results grouped into "Posts" and "Projects" sections
- Navigates to `/blog/:slug` or `/projects/:slug` on result click, and closes modal
- Dismissible via ESC key or clicking overlay background

---

### 6.3 `AnchorNav.tsx`

- Sticky left-side or top reading-progress navigation
- Visible on `/blog/:slug` and `/projects/:slug`
- Links to in-page section IDs

---

## 7. Pages — Detailed Spec

---

### 7.1 Home (`/`)

**File:** `src/app/pages/Home.tsx`  
**Max content width:** `max-w-4xl` (56rem)

#### Section order and DOM structure

```
<main>
  <section id="hero">
  <section id="stats">        ← border-t + border-b
  <section id="projects">     ← border-b
  <section id="blog">         ← border-b
  <section id="connect">
</main>
```

#### Hero
- `clamp(2rem, 5vw, 3.4rem)` headline, `fontWeight: 400`, `letterSpacing: -0.03em`
- One-line role description (muted)
- Two CTA buttons: **View Projects** → `/projects`, **About me** → `/about`
- Animated on mount: `opacity: 0, y: 22` → `opacity: 1, y: 0`

#### Stats
- Three figures: `2+ Years`, `10+ Projects`, `500+ Customers`
- `grid grid-cols-3 divide-x divide-gray-100` on desktop
- Stagger animation: each stat delays by `index * 0.1s`

#### Selected Projects
- Heading: "Selected Work" + "All projects →" link right-aligned
- Grid: `grid md:grid-cols-2 gap-6`
- Data: `PROJECTS.slice(0, 2)`
- Each card: `aspect-[4/3]` cover image + overlay hover effect + title + `client · year` + description
- Card links to `/projects/:slug`

#### Recent Writing
- Heading: "Writing" + "All posts →" right-aligned
- `divide-y divide-gray-100` list
- Data: `POSTS.slice(0, 3)`
- Each row: title, 2-line-clamped excerpt, meta row (date · tags)
- Row links to `/blog/:slug`

#### Let's Connect
- Heading + short copy
- Email CTA button (`mailto:`)
- Email subscribe: `<input type="email">` + Submit button
  - On submit: `toast.success("You're subscribed!")`, input clears
  - No real backend — frontend only

---

### 7.2 About (`/about`)

**File:** `src/app/pages/About.tsx`  
**Max content width:** `max-w-2xl`  
**Horizontal padding:** `px-8 md:px-12`  
**Vertical padding:** `py-20 md:py-28`

#### Layout: Single column, no animation

```
┌─────────────────────────────────┐
│         Portrait image          │  ← aspect-ratio: 3/2, object-cover, full width
│         (mb-12)                 │
├─────────────────────────────────┤
│  Seungjo Han        ← h1        │
│  Designer & Writer · Seoul, KR  │  ← text-gray-400, 0.875rem
│                                 │
│  Bio paragraph 1                │
│  Bio paragraph 2                │
│  Bio paragraph 3                │
│  Bio paragraph 4                │
│  Bio paragraph 5                │
└─────────────────────────────────┘
```

**Rules:**
- No motion/animation
- No interactive elements
- No tags, pills, labels, or decorative lines
- Single column only — no grid

---

### 7.3 Projects (`/projects`)

**File:** `src/app/pages/Projects.tsx`  
**Max content width:** `max-w-4xl`

- Page heading + subtitle
- `grid md:grid-cols-2 gap-6` card grid
- Data: all `PROJECTS`
- Each card:
  - Cover image `aspect-[4/3]`, `object-cover`
  - Tag labels (uppercase, gray-400)
  - Title (fontWeight 400)
  - `client · year` meta
  - Description
- Card links to `/projects/:slug`
- No arrow decoration on cards

---

### 7.4 Project Case Study (`/projects/:slug`)

**File:** `src/app/pages/ProjectCase.tsx`  
**Max content width:** `max-w-4xl`

#### Route behavior
- Read `slug` from `useParams<{ slug: string }>()`
- Match against `PROJECTS.find(p => p.slug === slug)`
- If not found: render "Project not found" + "← Back to Projects" link

#### DOM structure

```
<div>
  <div>  ← Back link ("← Back to Projects")
  <div>  ← Cover image (aspect-[16/7], rounded-2xl, fade-in on mount)
  <div>  ← Header + meta grid
    <div>  ← Left: tag pills + h1 title + description
    <div>  ← Right: MetaRow card (Client, Role, Team, Timeline, Duration, Platform, Tech/Tools)
  <div>  ← CaseContent (Section components)
</div>
```

#### `MetaRow` component

```tsx
function MetaRow({ label, value }: { label: string; value: string }) {
  // Renders label (uppercase gray-400 0.75rem) + value (gray-900 0.875rem)
  // border-b border-gray-100 between rows; last:border-0
}
```

#### `Section` component

```tsx
function Section({ title, id, children }: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  // motion.div with id, py-10 padding, whileInView fade-in
  // <h2> — title only, NO number prefix
  // <div> — prose children
}
```

**Critical:** No `n` prop, no numeric prefix on any heading.  
**No `border-b`** between sections — only `py-10` vertical padding.

#### `CaseContent` — slug dispatch

```tsx
function CaseContent({ slug }: { slug: string }) {
  if (slug === 'brand-identity-system') { return <> 6 Sections </> }
  // fallback: generic 6 sections
}
```

**Sections for `brand-identity-system`:**
1. Problem
2. TL;DR
3. Solution
4. Process
5. Takeaway
6. Conclusion

---

### 7.5 Blog Listing (`/blog`)

**File:** `src/app/pages/Blog.tsx`  
**Max content width:** `max-w-3xl`

#### Date formatting

```ts
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  // "April 15, 2026" → "Apr 15, 2026"
}
```

This function is defined locally in both `Blog.tsx` and `BlogPost.tsx`.

#### Tag filter

- `useSearchParams()` — reads `?tag=X` from URL
- "All" pill + one pill per tag in `ALL_TAGS` constant: `['Design', 'Technology', 'Culture', 'Creativity', 'Product']`
- Active pill: `bg-black text-white border-black`
- Inactive pill: `bg-white text-gray-600 border-gray-200 hover:border-gray-400`
- Selecting a tag: `setSearchParams({ tag })` — URL becomes `/blog?tag=Design`
- Selecting "All": `setSearchParams({})` — URL becomes `/blog`
- **No "Clear filter" button**

#### Post list

- `divide-y divide-gray-100`
- Each post row (via `<Link to="/blog/:slug">` wrapping entire row):
  - `h2` — post title, fontWeight 400
  - `<p>` — excerpt (1–2 lines)
  - Meta row: `formatDate(post.date)` · tag buttons (clicking tag sets filter via `e.preventDefault()`)
- Tag labels: plain text, no `#` prefix
- Animation: `motion.article`, `opacity: 0, y: 16` → `opacity: 1, y: 0`, stagger `delay: i * 0.05`

---

### 7.6 Blog Post (`/blog/:slug`)

**File:** `src/app/pages/BlogPost.tsx`  
**Max content width (article):** `max-w-2xl`  
**Max content width (related):** `max-w-4xl`

#### Route behavior
- Read `slug` from `useParams<{ slug: string }>()`
- Match against `POSTS.find(p => p.slug === slug)`
- If not found: "Post not found" + "← Back to Blog" fallback

#### Date formatting — same helper as Blog.tsx

```ts
function formatDate(dateStr: string): string { ... }
// "April 15, 2026" → "Apr 15, 2026"
```

#### Article DOM structure

```
<article>
  [tag links]       ← Link to /blog?tag=X for each post.tags[]
  <h1>title</h1>
  <p>subtitle</p>
  [author bar]      ← border-y border-gray-100, flex justify-between
                       LEFT: "Seungjo Han" (text-sm, text-gray-900)
                       RIGHT: "Apr 15, 2026 · 5 min read" (text-xs, text-gray-400)
  [cover image]     ← optional; rounded-xl, aspect-[16/9]
  [prose body]      ← <PostContent slug={slug!} />
  [end bar]         ← border-t border-gray-100, flex justify-between
                       LEFT: "Seungjo Han" (text-sm)
                       RIGHT: formatDate(post.date) (text-xs, text-gray-400)
</article>
```

**No avatar/profile image anywhere in the article.**  
**No share button in the author bar or end bar.**

#### `AnchorH2` component

```tsx
function AnchorH2({ id, children }: { id: string; children: React.ReactNode }) {
  // On # button click: navigator.clipboard.writeText(origin + pathname + '#' + id)
  // toast.success('Link copied!')
  // h2 has: id={id}, scrollMarginTop: 80px (accounts for fixed header height)
  // # button: opacity-0 group-hover:opacity-100, text-gray-300 hover:text-gray-500
}
```

#### `PostContent` — slug dispatch

```tsx
function PostContent({ slug }: { slug: string }) {
  if (slug === 'on-simplicity-in-design') {
    // Full content with 5 AnchorH2 headings:
    // #the-case-for-less
    // #the-paradox-of-choice
    // #constraints-as-freedom
    // #building-systems-not-solutions
    // #closing-thought
  }
  // Generic fallback — 3 AnchorH2 headings:
  // #section-one, #section-two, #section-three
}
```

#### Prose CSS (injected via `<style>` tag)

```css
.prose-content p        { color: #374151; line-height: 1.8; margin-bottom: 1.4rem; font-size: 1.05rem; }
.prose-content h2       { font-size: 1.25rem; font-weight: 500; color: #111827; margin-top: 2.5rem; margin-bottom: 1rem; letter-spacing: -0.01em; }
.prose-content em       { font-style: italic; }
.prose-content strong   { font-weight: 600; color: #111827; }
```

#### Comments section

- State: `useState(MOCK_COMMENTS)` — 2 seed comments (hardcoded constant)
- Comment type: `{ id: number, author: string, avatar: string, date: string, body: string, likes: number }`
- Submit handler: prepends new comment to state array, clears textarea, shows `toast.success('Comment posted')`
- Submit button disabled when `comment.trim()` is falsy
- New comments animated: `motion.div`, `opacity: 0, y: 10` → `opacity: 1, y: 0`
- No backend — state is ephemeral

#### Related posts section

**Algorithm (client-side, no backend):**

```ts
const related = POSTS
  .filter(p => p.slug !== slug)
  .map(p => ({
    post: p,
    score: p.tags.filter(t => post.tags.includes(t)).length,  // shared tag count
  }))
  .sort((a, b) => b.score - a.score)   // highest overlap first
  .slice(0, 3)
  .map(({ post: p }) => p);
```

- Section heading: **"Related"** (not "More to read")
- Right-aligned: "All posts →" link → `/blog`
- Grid: `grid sm:grid-cols-2 lg:grid-cols-3 gap-5`
- Each card (`PostCard` component): cover image thumbnail, tag labels, title, excerpt (2-line clamp), date
- Background: `bg-gray-50/50`
- Hidden if `related.length === 0`

---

## 8. Design Tokens

### Color

| Name | Hex | Tailwind class | Use |
|---|---|---|---|
| Black | #000000 | `text-black`, `bg-black` | CTA buttons, strong emphasis |
| Gray 900 | #111827 | `text-gray-900` | Headings, body strong |
| Gray 700 | #374151 | `text-gray-700` | Prose body text |
| Gray 600 | #4b5563 | `text-gray-600` | Case study body |
| Gray 500 | #6b7280 | `text-gray-500` | Secondary text, subtitles |
| Gray 400 | #9ca3af | `text-gray-400` | Muted: meta, labels, captions |
| Gray 300 | #d1d5db | `text-gray-300` | Decorative: section number (removed), anchor `#` |
| Gray 200 | #e5e7eb | `text-gray-200` | Dot separators |
| Gray 100 | #f3f4f6 | `border-gray-100`, `divide-gray-100` | Subtle borders and dividers |
| White | #ffffff | `bg-white` | Page background |

### Typography sizing

| Context | Value | Notes |
|---|---|---|
| Page heading (h1) | `clamp(1.6rem, 3–5vw, 2.2–3.4rem)` | Varies per page |
| Section heading (h2) | `1.15rem – 1.25rem` | Prose and case study |
| Body prose | `1.05rem` | In `.prose-content` |
| Post list title | `1.1rem` | Blog listing |
| Meta / label | `0.65rem – 0.9rem` | Uppercase tracking |
| Author / date | `0.75rem – 0.875rem` | Post byline |

### Spacing cadence

| Usage | Value |
|---|---|
| Page horizontal padding | `px-6` (24px) mobile, expanded on md+ |
| About page horizontal padding | `px-8 md:px-12` |
| Section vertical rhythm | `py-16 md:py-20` or `py-10` for case study sections |
| Max content width — article | `max-w-2xl` (42rem) |
| Max content width — general | `max-w-3xl` (48rem) or `max-w-4xl` (56rem) |

### Animation

| Property | Value |
|---|---|
| Entry translate | `y: 24` → `y: 0` |
| Entry opacity | `0` → `1` |
| Duration | `0.6s – 0.8s` for page elements; `0.3s` for interactions |
| Easing | `[0.22, 1, 0.36, 1]` (custom ease-out cubic) |
| Trigger | `whileInView`, `viewport: { once: true, margin: '-60px' }` |
| Stagger | `delay: index * 0.05s` for list items |

---

## 9. Key Behaviors — Implementation Notes

### 9.1 Tag filter URL sync (Blog)

```
User lands on /blog                → selectedTag = null, show all posts
User clicks "Design" pill          → URL becomes /blog?tag=Design
User navigates to blog post page   → clicks tag link "Design"
                                   → Link to="/blog?tag=Design"
                                   → Blog page re-mounts with selectedTag = "Design"
```

`setSearchParams` mutates the URL without full navigation. `useSearchParams` is reactive.

### 9.2 Anchor copy link (BlogPost)

```
User hovers AnchorH2 heading    → # button fades in (opacity-0 → opacity-100)
User clicks # button            → navigator.clipboard.writeText(
                                     window.location.origin +
                                     window.location.pathname +
                                     '#' + id
                                   )
                                → toast.success('Link copied!')
User pastes link elsewhere      → lands on /blog/on-simplicity-in-design#the-case-for-less
Browser scrolls to              → <h2 id="the-case-for-less" style="scrollMarginTop: 80px">
                                   (80px offset accounts for fixed header)
```

### 9.3 Related posts scoring (BlogPost)

```ts
// For a post tagged ["Design", "Product"]:
// "the-art-of-constraints"       tags: ["Design", "Creativity"]   → score: 1
// "building-with-intention"      tags: ["Creativity", "Culture"]   → score: 0
// "lessons-from-korean-design"   tags: ["Design", "Culture"]       → score: 1
// "notes-on-productive-workflows" tags: ["Product", "Technology"]  → score: 1

// After sort (all score=1 tied), order is stable — whichever comes first in POSTS array
// .slice(0, 3) → top 3 candidates displayed
```

### 9.4 Header scroll state

```ts
useEffect(() => {
  const handler = () => setScrolled(window.scrollY > 10);
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, []);
```

Header classes: `scrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur-md'`

---

## 10. Known Limitations (v1.0)

| Limitation | Impact | Planned fix |
|---|---|---|
| Blog post body is hardcoded JSX | Adding a new post requires a code deploy | Replace with MDX or CMS-sourced content |
| Comments are ephemeral (state only) | Refresh wipes all comments | Connect to Supabase table |
| Email subscribe is fake | No emails are captured | Integrate Substack embed or ConvertKit API |
| Related post scoring is by shared tags only | May surface loosely related posts | Add keyword/title similarity scoring |
| No 404 fallback route | Unmatched paths throw React Router error | Add `path: '*'` catch-all child route |
| No OG/meta tags | Poor social preview when sharing | Add `react-helmet-async` or Vite SSR |
| `formatDate` is duplicated | DRY violation | Extract to `src/app/utils/formatDate.ts` |

---

## 11. Future Enhancements (Backlog)

| Feature | Complexity | Value |
|---|---|---|
| MDX-based blog posts | Medium | Eliminates hardcoded `PostContent` JSX |
| Supabase comments | Medium | Persistent, real-time comments |
| Email subscribe (ConvertKit) | Low | Actual subscriber capture |
| Dark mode | Medium | `prefers-color-scheme` + manual toggle |
| RSS feed generation | Low | Auto-generated from `POSTS` data |
| OG image generation | Medium | Per-post social share card |
| Korean language variant (`/ko/*`) | High | Reach Korean-speaking audience |
| Project image gallery | Low | Real screenshots instead of Unsplash cover |
| Analytics (Fathom or Plausible) | Low | Privacy-respecting page views |
| Reading progress bar | Low | Visual indicator in header |

---

*End of PRD v2.0*
