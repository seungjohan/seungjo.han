# Analytics and SEO Handoff

Use this file when replacing the current Figma Make design files. Preserve or re-apply these integration points after the new design is copied in.

## Current Tracking IDs

- Google Analytics 4: `G-3F73D31SGZ`
- Google Tag Manager: `GTM-W6QS7F94`
- Production site URL used by SEO files: `https://seungjohan.vercel.app`

## Files to Preserve or Re-Apply

- `index.html`
  - Keep the GA4 `gtag.js` script in `<head>`.
  - Keep the GTM script in `<head>`.
  - Keep the GTM `<noscript>` iframe in `<body>`.
  - Keep the title, description, favicon, Open Graph image, and JSON-LD unless intentionally changed.
- `src/main.tsx`
  - Keep `HelmetProvider` from `react-helmet-async` wrapping `<App />`.
- `src/app/components/SEO.tsx`
  - Keep this component or port its behavior into the new page structure.
- Page components under `src/app/pages/`
  - Keep route-level `<SEO />` usage when moving page UI into new files.
- `public/robots.txt`
  - Keep the sitemap reference: `https://seungjohan.vercel.app/sitemap.xml`.
- `public/sitemap.xml`
  - Update route URLs if the new design changes routes.
- `public/favicon.svg` and `public/og-image.svg`
  - Keep unless replacing the brand assets intentionally.
- `package.json`
  - Keep `react-helmet-async` if `SEO.tsx` is still used.

## Design Replacement Guidance

Safe to replace from a new Figma Make export:

- Visual page files in `src/app/pages/`, after preserving their routing and `<SEO />` calls.
- Presentational components in `src/app/components/`, except `SEO.tsx`, `Layout.tsx`, `SearchModal.tsx`, and route/navigation components you still need.
- Figma-generated utility components in `src/app/components/figma/`.
- Shadcn/UI generated components in `src/app/components/ui/`, if the new export includes its own compatible set.
- Styles in `src/styles/`, after checking that `src/styles/index.css` still imports the new global CSS correctly.
- Image/import assets under `src/imports/`, if the new export ships replacement assets.

Do not delete without checking first:

- `src/app/data/analytics.ts`
- `src/app/data/projects.ts`
- `src/app/data/posts.ts`
- `src/app/data/magazines.ts`
- `src/app/routes.tsx`
- `src/main.tsx`
- `src/app/App.tsx`
- `src/app/components/SEO.tsx`
- `public/robots.txt`
- `public/sitemap.xml`
- `index.html`
- `vite.config.ts`
- `package.json`
- `package-lock.json`
- `.env` and `.env.example`

## Re-Apply Checklist After Design Swap

1. Confirm `index.html` still includes GA4 and GTM.
2. Confirm `src/main.tsx` still wraps the app with `HelmetProvider`.
3. Confirm each public route renders an `<SEO />` entry or equivalent metadata.
4. Update `public/sitemap.xml` if routes changed.
5. Run `npm run build`.
6. Inspect the built `dist/index.html` for `G-3F73D31SGZ` and `GTM-W6QS7F94`.
