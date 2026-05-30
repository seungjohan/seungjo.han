# Blog Management Workflow

This is the operating workflow for writing, publishing, maintaining, and analyzing blog posts. The current site does not have MDX, CMS, backend storage, or a database yet. Posts currently live in `src/app/data/posts.ts`.

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

Every post needs these fields in `src/app/data/posts.ts`:

```ts
{
  slug: 'your-url-safe-slug',
  title: 'Your Post Title',
  subtitle: 'A short summary for the post page.',
  date: 'May 2, 2026',
  readTime: '5 min read',
  tags: ['Design', 'Technology'],
  excerpt: 'One or two sentences for the blog listing and search.',
  coverImage: 'https://...',
  sections: [
    { id: 'first-section', title: 'First section', body: '...' },
  ],
}
```

Rules:

- `slug` should be lowercase kebab-case and should not change after publishing.
- `date` should be human-readable and accurate.
- `tags` should be reused consistently because they power filtering, related posts, and search.
- `excerpt` should describe the actual article, not act like marketing copy.
- `sections[].id` should be stable because it can become a copied anchor link.

## 3. Add the Post Today

Current static workflow:

1. Add the new post object to `POSTS` in `src/app/data/posts.ts`.
2. Put the newest post first unless a different editorial order is intentional.
3. Run `npm run dev`.
4. Check `/blog`.
5. Open `/blog/your-url-safe-slug`.
6. Check tag filtering from the blog list.
7. Check related posts on the post page.
8. Check global search.
9. Copy the current page link and test it in a new tab.
10. Run `npm run build` before publishing.

For now, do not create `src/content/blog` or MDX files unless the project has been upgraded to an MDX pipeline.

## 4. Publishing Workflow

Use this release flow for each post:

1. Create or edit the post locally.
2. Preview the post locally.
3. Confirm links, images, mobile layout, and typos.
4. Commit with a clear message, for example `Add blog post about design systems`.
5. Push to the deployment branch.
6. Wait for the hosting provider build to finish.
7. Open the live post URL.
8. Share only after the live page, social preview, and canonical URL are correct.

## 5. SEO Checklist Per Post

Before sharing a post:

- Title is specific and not too long.
- Excerpt can work as a meta description.
- Slug is readable.
- One main topic is obvious from the title and first section.
- Images have meaningful alt text if images are added in the post body.
- The post links to at least one relevant internal page when natural.
- Social preview image exists if the page supports Open Graph images.
- The post appears in sitemap/RSS if those features are implemented.

## 6. Dashboard Routine After Deployment

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

## 7. When to Upgrade the Blog System

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

Add or edit blog posts in `src/app/data/posts.ts`.

- `slug` becomes the URL: `/blog/my-post-slug`
- `tags` power blog filtering, related posts, and search
- `sections` render the post body with copyable heading links

Add or edit portfolio projects in `src/app/data/projects.ts`.

- `slug` becomes the URL: `/projects/my-project-slug`
- `tags`, `client`, and `description` power search
- each project automatically gets a case-study page