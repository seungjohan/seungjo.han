# Personal Blog & Portfolio

React/Vite personal website for Seungjo Han, based on the Figma Make prototype and implemented from `scripts/PRD.md`.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Content

This version does not use a CMS or database. Blog posts and portfolio projects are static TypeScript data, which matches the v1 PRD scope.

Add or edit blog posts in `src/app/data/posts.ts`.

- `slug` becomes the URL: `/blog/my-post-slug`
- `tags` power blog filtering, related posts, and search
- `sections` render the post body with copyable heading links

Add or edit portfolio projects in `src/app/data/projects.ts`.

- `slug` becomes the URL: `/projects/my-project-slug`
- `tags`, `client`, and `description` power search
- each project automatically gets a case-study page

## Implemented Features

- Blog listing with URL-synced tag filters
- Blog post pages with copyable section anchors, comments, and related posts
- Portfolio grid and project case-study pages
- Global search across blog posts and projects
- Header copy-link action for sharing the current page
- In-app 404 page for unknown routes
