# Project Delivery Workflow

This is the operating plan for moving the personal blog and portfolio from finished design to a reliable deployed product. The current implementation is a static Vite + React site with blog posts and projects stored in TypeScript data files. Backend, database, CMS, real comments, real subscriptions, analytics, and SEO automation are future implementation decisions.

## 1. Current Baseline

- Design: settled.
- Frontend: Vite, React, TypeScript, React Router, Tailwind CSS.
- Content today: `src/app/data/posts.ts` and `src/app/data/projects.ts`.
- Backend today: none.
- Database today: none.
- Real user-generated data today: none.
- Deployment target: static hosting is enough for the current app.

Decision: do not add a database just because the site has a blog. Add backend/database only when the feature needs server-side persistence, authentication, private workflows, moderation, or admin editing.

## 2. Project Phases

### Phase 1: Lock the Product Scope

Confirm what must work at launch:

- Blog list, tag filtering, post detail pages, related posts, search, and share links.
- Portfolio list and project case-study pages.
- Mobile, tablet, and desktop responsive behavior.
- 404 page.
- Basic SEO metadata and social preview metadata.
- Analytics and Search Console after deployment.

Hold these for after launch unless they are essential:

- Admin dashboard.
- CMS editing UI.
- User accounts.
- Public comments.
- Newsletter automation.
- Database search.
- Multilingual routes.

### Phase 2: Choose Content Architecture

Use this decision tree:

| Need | Recommended path |
|---|---|
| Fastest launch, personal posts only | Keep static TypeScript data for v1 |
| Easier writing without editing React/TypeScript | Move posts to Markdown or MDX |
| Edit posts from browser/admin UI | Use a headless CMS |
| Store comments, subscribers, drafts, moderation state | Add backend + database |

Recommended sequence:

1. Launch static v1.
2. Add SEO, sitemap, RSS, and analytics.
3. Move blog posts to MDX if writing friction becomes real.
4. Add CMS only if you want browser-based editing.
5. Add database only for comments, subscribers, admin workflow, or private data.

### Phase 3: Backend Feature Decisions

For each backend feature, decide owner, storage, moderation, abuse protection, and dashboard before coding.

| Feature | Backend needed? | Suggested implementation |
|---|---:|---|
| Static blog posts | No | TypeScript data now, MDX later |
| Blog drafts | Maybe | Local Markdown/MDX or CMS drafts |
| Comments | Yes | Supabase table with moderation status |
| Newsletter signup | Usually yes | ConvertKit, Buttondown, Mailchimp, or Supabase + email provider |
| Search | Not for small v1 | Client-side search now; hosted search later |
| Contact form | Yes | Serverless route + spam protection + email provider |
| Admin login | Yes | CMS auth or Supabase/Auth.js |
| Analytics | No app backend | Google Analytics, Plausible, or Fathom |

Avoid building custom auth, custom email infrastructure, or custom analytics for this project. Those are high-risk and low-value compared with managed services.

### Phase 4: Database Planning

If database-backed features are approved, design the data model before implementing UI.

Minimum tables for common blog features:

- `posts`: only if posts move out of static files/CMS.
- `comments`: post slug/id, author name, author email hash or optional email, body, status, created time, IP/rate metadata.
- `subscribers`: email, source page, consent timestamp, status, provider id.
- `contact_messages`: name, email, message, status, created time.

Database rules:

- Never expose service-role database keys to the browser.
- Validate all user input on the server.
- Store the minimum personal data needed.
- Add moderation status for public comments before showing them.
- Add rate limits before opening public write endpoints.
- Plan export and deletion for subscriber/contact data.

### Phase 5: Implementation Order

1. Stabilize current static app.
2. Add production SEO foundations: titles, descriptions, canonical URLs, Open Graph, sitemap, robots, RSS.
3. Deploy to the chosen host.
4. Connect custom domain and HTTPS.
5. Add analytics and Search Console.
6. Add content workflow improvements: MDX or CMS if needed.
7. Add one backend feature at a time, starting with the most valuable.
8. Add monitoring, backups, moderation, and security checks for each backend feature.

### Phase 6: Deployment Checklist

Before first deployment:

- `npm install` succeeds.
- `npm run build` succeeds.
- Home, About, Blog, Blog post, Projects, Project detail, and 404 routes work.
- Mobile layout is checked.
- No placeholder posts or fake public claims remain.
- All external links work.
- Images are optimized and have useful alt text.
- Site title, description, and favicon are set.

After deployment:

- Confirm HTTPS.
- Confirm canonical domain.
- Submit sitemap to Google Search Console.
- Install analytics.
- Test social preview with LinkedIn/Twitter/Facebook preview tools.
- Check 404 behavior on the live URL.
- Save deployment rollback instructions.

## 3. Security Warnings for Vibe-Coded Blog Features

Treat AI-generated backend code as a draft, not a trusted system.

High-risk mistakes to watch for:

- Putting API keys, database passwords, service-role keys, or OAuth secrets in frontend code.
- Accepting comment/contact/newsletter input without server-side validation.
- Rendering user-submitted HTML without sanitizing it.
- Building admin routes without real authentication and authorization.
- Trusting client-side checks for permissions.
- No rate limiting on public write endpoints.
- No spam protection for comments or contact forms.
- Storing more personal data than needed.
- Logging emails, tokens, or private messages in plain text.
- Skipping dependency audits after adding packages.

Security baseline:

- Keep secrets in host environment variables only.
- Use server-side validation schemas.
- Escape or sanitize all user-generated content.
- Use prepared queries or trusted database client APIs.
- Add rate limits and spam protection to public forms.
- Moderate comments before publishing.
- Keep dependencies updated.
- Review generated code before deploying.
- Back up database data before schema changes.

## 4. Project Manager Checkpoints

Use these checkpoints together before moving to the next phase:

- Scope confirmed: what is in launch, what is after launch.
- Architecture confirmed: static, MDX, CMS, or database-backed.
- Data ownership confirmed: where posts, comments, subscribers, and analytics live.
- Security confirmed: secrets, validation, moderation, rate limits.
- Deployment confirmed: host, domain, build command, environment variables.
- Operations confirmed: blog publishing workflow, analytics dashboard routine, backups, rollback.

## 5. Next Step

Recommended next project step: keep the current v1 static, add production SEO foundations and deployment readiness, then deploy. After traffic and writing cadence are real, decide whether MDX, CMS, comments, or subscriptions are worth the added backend complexity.
