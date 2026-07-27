# Blog Management Workflow

This is the operating workflow for writing, publishing, maintaining, and analyzing blog posts. There is no MDX, CMS, backend storage, or database. Each post is one folder: `src/content/blog/<slug>/index.md`.

## 1. Write the Post

Draft outside the codebase first, then move it into the site when the structure is clear.

Recommended draft checklist:

- One clear topic and audience.
- Working title.
- Short subtitle.
- 1-2 sentence excerpt.
- 3-6 section headings.
- Cover image or no cover image decision.
- Tags from the existing tag vocabulary where possible.
- Internal links to related posts or projects.
- External links only when they add evidence or useful context.

## 2. Prepare Metadata

Every post starts with a frontmatter block at the top of its `index.md`:

```markdown
---
title: Your Post Title
subtitle: A short summary for the post page.
date: May 2, 2026
tags: [Design, Technology]
excerpt: One or two sentences for the blog listing and search.
coverImage: /blog-images/your-image.jpg
focusKeyword: your keyword
secondaryKeywords: [supporting, terms]
---

Body markdown starts here.
```

Rules:

- The **folder name is the slug and the URL**. Lowercase kebab-case, and never
  change it after publishing.
- `title`, `subtitle`, `date`, `tags`, `excerpt` are required. The build fails
  loudly if one is missing or empty, rather than publishing a blank page.
- `date` should be human-readable and accurate.
- `tags` should be reused consistently because they power filtering, related posts, and search.
- `excerpt` should describe the actual article, not act like marketing copy.
- Headings in the body get anchor links automatically; keep heading text stable
  because it becomes a copyable anchor.

## 3. Add the Post Today

Current workflow:

1. Create `src/content/blog/<your-slug>/index.md` with the frontmatter above.
2. Ordering is automatic — posts sort by `date`, newest first.
3. Put local blog images in `public/blog-images`.
4. Run `npm run dev`.
5. Check `/blog`.
6. Open `/blog/your-url-safe-slug`.
7. Check tag filtering from the blog list.
8. Check related posts on the post page.
9. Check global search.
10. Copy the current page link and test it in a new tab.
11. Run `npm run build` before publishing.

For now, do not create `src/content/blog` or MDX files unless the project has been upgraded to an MDX pipeline.

### Imported posts (Substack, Brunch, etc.)

When a post is copied from an external source, paste the full article text as the
body of its `index.md`, below the frontmatter:

```text
src/content/blog/dokdo-security-police/index.md
```

There is nothing to register — `import.meta.glob` discovers the folder. Match the
original structure: body paragraphs, image placeholders, and captions.

Never hardcode post bodies in `BlogPost.tsx`. That file previously carried ~255
lines of unreachable prose behind slug branches, which is exactly the failure this
structure removes.

## 4. How to Change Project Pictures and Content

Project content lives in `src/app/data/projects.ts`.

To change project text:

1. Find the project object by `slug`.
2. Edit fields such as `title`, `client`, `year`, `role`, `description`, `overview`, `challenge`, `solution`, `outcome`, `tags`, and `metrics`.
3. Keep the `slug` stable after publishing because it controls the URL.
4. Run `npm run dev` and check `/projects` plus `/projects/project-slug`.
5. Run `npm run build` before publishing.

To change project pictures:

1. Update the project `coverImage` for the listing card and hero image.
2. Update the `images` array for the rotating project-card images.
3. Use reliable image URLs or place local images in `public/` and reference them with `/image-name.jpg`.
4. Keep image aspect ratios consistent where possible, preferably landscape for project cards.
5. Confirm the card slideshow, project detail page, and mobile layout still look correct.

## 5. Image Sizing

Body images are stored in `public/blog-images` and referenced by title slug plus order, for example:

```text
public/blog-images/i-want-my-life-to-be-colorful_1.jpg
public/blog-images/i-want-my-life-to-be-colorful_2.jpg
```

The image order follows the order of image markers in the post text. Size is controlled inside the post text.

Markdown image syntax:

```md
![Cycling route | size=wide](https://example.com/original-image.jpg)
```

Plain pasted image placeholder syntax:

```text
📷 [Image: cycling / national bike route | size=wide]
```

Supported sizes:

- `size=small`: compact centered image for portrait, low-resolution, or supporting images.
- `size=medium`: article-column width. This is the default and should be used for most images.
- `size=wide`: wider than the text column on desktop, similar to the Brunch article image treatment; use it for landscapes, screenshots, maps, and visual moments that need emphasis.

If no size is written, the post uses `size=medium`.

### Inline emphasis in markdown

The blog renderer supports inline formatting inside paragraphs and headings:

- `**bold**` or `__bold__` (use `**` in practice)
- `_italic_` or `*italic*`
- `` `code` ``
- `[label](https://url)` for links

Example: `_I wanted to **know the world** rather than just **studying**._`

Full-line italic text should stay in the body as italic text. Do not use italic-only lines for image captions unless the line immediately follows an image.

### Index section inner links

Use a `### Index` heading, then a bullet list where each line matches a later `##` heading text exactly (punctuation and wording). Each bullet becomes a link to that section’s anchor, for example `#travel-the-way-to-discover-my-most-authentic-self`.

The visible index marker renders as a dot, not a dash.

### Quote styles

Use normal Markdown blockquotes for ordinary quoted context:

```md
> "I served my Korean military service for twenty-one months as a **Dokdo Security Police**."
```

Normal `>` quotes stay simple. They are not boxed and they are not automatically italic.

To decorate a quote, put one quote-style marker immediately before the `>` block:

```md
{quote=line}
> 나는 어떤 것에 가슴이 뛰는가?
> 숨이 막힐 정도로 좋아하는 것을 좇아본 적이 있는가?
```

```md
{quote=box}
> "I served my Korean military service for twenty-one months as a **Dokdo Security Police**."
```

```md
{quote=marks}
> 내가 가진 비전으로 직접 세상에 있는 문제를 해결하고 싶기 때문이다.
```

Supported quote styles:

- `{quote=normal}`: same as plain `>`.
- `{quote=line}`: quote content between top and bottom rules.
- `{quote=box}`: quote content in a subtle bordered box.
- `{quote=marks}`: quote content with large opening and closing quotation marks.

These quote styles support inline bold, italic, code, and links. For italic inside any quote, wrap the text with `_italic_` or `*italic*`.

## 6. Publishing Workflow

Use this release flow for each post:

1. Create or edit the post locally.
2. Preview the post locally.
3. Confirm links, images, mobile layout, and typos.
4. Run the [pre-deploy checklist](./pre_deploy_checklist.md) (`npm run verify:assets`, `npm run generate:sitemap`, `npm run build`).
5. Commit with a clear message, for example `Add blog post about design systems`.
6. Push to the deployment branch.
7. Wait for the hosting provider build to finish.
8. Open the live post URL.
9. Share only after the live page, social preview, and canonical URL are correct.

## 7. SEO Checklist Per Post

Before sharing a post:

- Title is specific and not too long.
- Excerpt can work as a meta description.
- Slug is readable.
- One main topic is obvious from the title and first section.
- Images have meaningful alt text if images are added in the post body.
- The post links to at least one relevant internal page when natural.
- Social preview image exists if the page supports Open Graph images.
- The post appears in sitemap/RSS if those features are implemented.

## 8. Dashboard Routine After Deployment

Weekly review:

- Google Analytics or privacy-focused analytics: page views, unique visitors, source/referrer, top pages, engagement.
- Google Search Console: search queries, impressions, clicks, average position, indexing issues.
- Hosting dashboard: failed builds, bandwidth, errors, redirects.
- If comments are added: pending comments, spam, abusive submissions, moderation queue.
- If newsletter signup is added: new subscribers, confirmation rate, unsubscribes, source page.

Monthly review:

- Identify top posts by traffic.
- Identify posts with impressions but low click-through rate.
- Refresh outdated posts.
- Add internal links from high-traffic posts to newer posts.
- Check broken links.
- Export/backup subscriber or comment data if those systems exist.

## 9. When to Upgrade the Blog System

Stay with static TypeScript if:

- You publish occasionally.
- You are comfortable editing code.
- You want the simplest, most secure setup.

Move to MDX if:

- Writing inside TypeScript becomes annoying.
- You want Markdown formatting and reusable React components.
- You still do not need browser-based editing.

Move to a CMS if:

- You want to write/edit/publish from a dashboard.
- You want drafts, previews, scheduling, or media management.
- You want non-developers to edit content.

Add a database if:

- Readers can submit comments.
- You collect subscribers or contact form messages.
- You need admin workflow, moderation state, or private data.


This version does not use a CMS or database. Blog posts and portfolio projects are static TypeScript data, which matches the v1 PRD scope.

Add or edit blog posts in `src/content/blog/<slug>/index.md`.

- `slug` becomes the URL: `/blog/my-post-slug`
- `tags` power blog filtering, related posts, and search
- `sections` render the post body with copyable heading links

Add or edit portfolio projects in `src/app/data/projects.ts`.

- `slug` becomes the URL: `/projects/my-project-slug`
- `tags`, `client`, and `description` power search
- each project automatically gets a case-study page
