#!/usr/bin/env node
/**
 * Build-time OpenGraph fetcher for standalone links in blog posts.
 *
 * The site is `ssr: false` with build-time prerender and no runtime server, so a
 * preview cannot be fetched when a visitor loads the page. It has to be baked in
 * here and shipped as JSON.
 *
 * Scope, deliberately narrow: only a link that occupies a whole block on its own
 * becomes a card. Links inside a sentence stay inline links — turning an Unsplash
 * credit mid-paragraph into a card would shred the prose.
 *
 * FAIL SOFT IS THE WHOLE POINT. This adds a network dependency to the build, and
 * the build must never break because GitHub rate-limited us or a host went down:
 *   - a fetch failure keeps whatever is already in the cache
 *   - a failure with no cached entry writes nothing, and the renderer falls back
 *     to a plain inline link
 *   - the script always exits 0
 *
 * Re-fetch everything with:  node scripts/fetch-link-previews.mjs --refresh
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = join(ROOT, 'src/content/blog');
const OUT = join(ROOT, 'src/app/content/link-previews.json');
const REFRESH = process.argv.includes('--refresh');
const TIMEOUT_MS = 8000;

/** A block that is nothing but a markdown link. */
const STANDALONE = /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/;
/** Explicit opt-in marker: {preview=URL} alone on a line. */
const MARKER = /^\{preview=(\S+?)\}$/;

// The site's own posts are resolved from local content by the renderer, so
// fetching them here would hit production for data we already have, and could
// return a stale title for a post edited since the last deploy.
const SITE_URL = 'https://seungjohan.vercel.app';
const isInternal = url => url.startsWith(SITE_URL) || url.startsWith('/');

function collectPreviewLinks() {
  const urls = new Map(); // url -> [post slugs]
  if (!existsSync(BLOG_DIR)) return urls;

  for (const slug of readdirSync(BLOG_DIR)) {
    const file = join(BLOG_DIR, slug, 'index.md');
    if (!existsSync(file)) continue;
    const body = readFileSync(file, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '');
    for (const raw of body.split(/\n{2,}/)) {
      const block = raw.trim();
      const url = block.match(STANDALONE)?.[2] ?? block.match(MARKER)?.[1];
      if (!url || isInternal(url)) continue;
      if (!urls.has(url)) urls.set(url, []);
      urls.get(url).push(slug);
    }
  }
  return urls;
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/** Pull a meta tag's content regardless of attribute order. */
function meta(html, prop) {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${prop}["']`, 'i'),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1].trim()) return decodeEntities(m[1]);
  }
  return '';
}

async function fetchPreview(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        // Some hosts serve no OG tags to an unknown agent. Identify honestly.
        'User-Agent': 'Mozilla/5.0 (compatible; seungjohan.com link preview bot)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!res.ok) return { error: `HTTP ${res.status}` };

    const html = (await res.text()).slice(0, 300_000);
    const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

    const title = meta(html, 'og:title') || (titleTag ? decodeEntities(titleTag[1]) : '');
    const description = meta(html, 'og:description') || meta(html, 'description');
    let image = meta(html, 'og:image') || meta(html, 'twitter:image');
    const siteName = meta(html, 'og:site_name');

    // Resolve a protocol-relative or root-relative og:image against the page.
    if (image && !/^https?:\/\//i.test(image)) {
      try { image = new URL(image, res.url || url).href; } catch { image = ''; }
    }

    if (!title) return { error: 'no title found' };
    return { title, description, image, siteName, url: res.url || url };
  } catch (err) {
    return { error: err.name === 'AbortError' ? 'timeout' : String(err.message || err) };
  } finally {
    clearTimeout(timer);
  }
}

const cache = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
const links = collectPreviewLinks();

if (links.size === 0) {
  console.log('link-previews: no external preview links found');
} else {
  console.log(`link-previews: ${links.size} external preview link(s) across blog posts`);
}

let fetched = 0, cached = 0, failed = 0;

for (const [url, posts] of links) {
  if (!REFRESH && cache[url]?.title) {
    cached += 1;
    continue;
  }
  const result = await fetchPreview(url);
  if (result.error) {
    failed += 1;
    const kept = cache[url]?.title ? ' (keeping cached copy)' : ' (will render as a plain link)';
    console.warn(`  ! ${url}\n    ${result.error}${kept}`);
    continue;
  }
  cache[url] = { ...result, posts, fetchedAt: new Date().toISOString().slice(0, 10) };
  fetched += 1;
  console.log(`  + ${result.title}  [${new URL(url).hostname}]`);
}

// Drop entries whose link no longer appears in any post.
for (const url of Object.keys(cache)) {
  if (!links.has(url)) {
    delete cache[url];
    console.log(`  - removed stale preview: ${url}`);
  }
}

writeFileSync(OUT, JSON.stringify(cache, null, 2) + '\n');
console.log(`link-previews: ${fetched} fetched, ${cached} cached, ${failed} failed -> ${OUT.replace(ROOT + '/', '')}`);
