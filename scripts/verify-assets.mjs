#!/usr/bin/env node
/**
 * Verify local image paths referenced in posts, projects, and markdown sources.
 * Run before deploy: npm run verify:assets
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readSourceFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readSourceFiles(fullPath));
    } else if (/\.(ts|tsx|js|jsx|md|html)$/i.test(entry.name)) {
      files.push(fs.readFileSync(fullPath, 'utf8'));
    }
  }
  return files;
}

function localPathsFromText(text) {
  const paths = new Set();
  for (const match of text.matchAll(/['"](\/(?:blog-images|project-images|images)\/[^'"]+)['"]/g)) {
    paths.add(match[1]);
  }
  for (const match of text.matchAll(/\]\((\/(?:blog-images|project-images|images)\/[^)]+)\)/g)) {
    paths.add(match[1].split('|')[0].trim());
  }
  for (const match of text.matchAll(/['"`](?:https?:\/\/[^'"`]*?)?(\/(?:favicon|og-image)\.(?:svg|png))['"`]/g)) {
    paths.add(match[1]);
  }
  // Unquoted YAML frontmatter values, e.g. `coverImage: /blog-images/x.jpg`.
  // Without this the quote-delimited patterns above miss every cover image, and
  // the gate reports success while verifying nothing about them.
  for (const match of text.matchAll(/^\s*\w+:\s*(\/(?:blog-images|project-images|images)\/\S+)\s*$/gm)) {
    paths.add(match[1]);
  }
  return paths;
}

function invalidPublicPathsFromText(text) {
  const paths = new Set();
  for (const match of text.matchAll(/['"]((?:\/?public\/)(?:blog-images|project-images|images)\/[^'"]+)['"]/g)) {
    paths.add(match[1]);
  }
  for (const match of text.matchAll(/['"](\/public\/(?:favicon|og-image)\.svg)['"]/g)) {
    paths.add(match[1]);
  }
  return paths;
}

const blogDir = path.join(root, 'src/content/blog');
const projectsDir = path.join(root, 'src/content/projects');
const appSources = readSourceFiles(path.join(root, 'src/app'));

// One directory per project; the directory name is the slug.
const projectDirs = fs
  .readdirSync(projectsDir, { withFileTypes: true })
  .filter(e => e.isDirectory())
  .map(e => e.name);

const projectSources = projectDirs.map(slug => {
  const file = path.join(projectsDir, slug, 'index.ts');
  if (!fs.existsSync(file)) {
    console.error(`\n✗ src/content/projects/${slug}/ has no index.ts — every project directory must contain one.\n`);
    process.exit(1);
  }
  return { slug, src: fs.readFileSync(file, 'utf8') };
});

const referenced = new Set([
  ...appSources.flatMap(source => [...localPathsFromText(source)]),
  ...projectSources.flatMap(({ src }) => [...localPathsFromText(src)]),
]);

const invalidPublicPaths = new Set([
  ...appSources.flatMap(source => [...invalidPublicPathsFromText(source)]),
  ...projectSources.flatMap(({ src }) => [...invalidPublicPathsFromText(src)]),
]);

// Every post is src/content/blog/<slug>/index.md. Iterating the directory means
// a post cannot be skipped: the previous version looked up a hand-maintained key,
// silently `continue`d when it did not resolve, and still reported success — so
// one post's images were never verified at all.
const postDirs = fs
  .readdirSync(blogDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name);

for (const slug of postDirs) {
  const mdPath = path.join(blogDir, slug, 'index.md');
  if (!fs.existsSync(mdPath)) {
    console.error(`\n✗ src/content/blog/${slug}/ has no index.md — every post directory must contain one.\n`);
    process.exit(1);
  }
  const markdown = fs.readFileSync(mdPath, 'utf8');
  for (const p of localPathsFromText(markdown)) referenced.add(p);
  for (const p of invalidPublicPathsFromText(markdown)) invalidPublicPaths.add(p);
}

// Build the real, case-exact set of files on disk.
//
// The previous implementation used fs.existsSync(), which is case-INSENSITIVE on
// macOS (APFS). That made the case-mismatch branch below unreachable on the dev
// machine and warn-only on Linux, so a reference to `_7.jpg` when the file is
// `_7.JPG` passed the gate and shipped. Vercel serves from Linux, where the
// request 404s. Exact string membership is the only check that behaves the same
// on both.
function walk(dir, prefix = '') {
  const found = new Map(); // web path -> bytes
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue; // .DS_Store and friends
    const abs = path.join(dir, entry.name);
    const web = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      for (const [k, v] of walk(abs, web)) found.set(k, v);
    } else {
      found.set(web, fs.statSync(abs).size);
    }
  }
  return found;
}

const onDisk = walk(publicDir);
const lowerIndex = new Map([...onDisk.keys()].map(p => [p.toLowerCase(), p]));

const missing = [];
const caseMismatch = [];

for (const webPath of referenced) {
  if (onDisk.has(webPath)) continue;
  const alt = lowerIndex.get(webPath.toLowerCase());
  if (alt) caseMismatch.push({ webPath, found: alt });
  else missing.push(webPath);
}

// ─── Project content shape ────────────────────────────────────────────────────
// TypeScript requires these fields but cannot require them to be non-empty, and
// `impact: ''` renders a heading over nothing. The narrative fields are the whole
// case study, so an empty one is a blank page shipped silently.
const shapeProblems = [];
for (const { slug, src } of projectSources) {
  for (const field of ['impact', 'whatIDid', 'outcome']) {
    const v = src.match(new RegExp(`${field}:\\s*['"]((?:[^'"\\\\]|\\\\.)*)['"]`));
    if (!v || !v[1].trim()) shapeProblems.push(`${slug}: "${field}" is missing or empty`);
  }
  const bullets = src.match(/whatIDidBullets:\s*\[([\s\S]*?)\]/);
  const count = bullets ? [...bullets[1].matchAll(/['"][^'"]+['"]/g)].length : 0;
  if (count === 0) shapeProblems.push(`${slug}: "whatIDidBullets" has no entries`);
}

// ─── Size budgets ─────────────────────────────────────────────────────────────
// Per-class, not a single flat cap. A flat 100KB threshold fires on 29 of 35
// files here, and the allowlist needed to silence it would swallow the gate.
const SIZE_BUDGETS = [
  // The favicon ships on every page view, so it gets the tightest budget.
  { test: /^\/favicon\.[a-z0-9]+$/i, max: 15 * 1024, label: 'favicon' },
  // Only fetched on "add to home screen", and it is a photograph at 180px.
  { test: /^\/apple-touch-icon\.[a-z0-9]+$/i, max: 100 * 1024, label: 'apple touch icon' },
  { test: /^\/og-image\.[a-z0-9]+$/i, max: 300 * 1024, label: 'social share image' },
  { test: /^\/(blog-images|project-images|images)\//i, max: 500 * 1024, label: 'content image' },
];

// Known outliers, tracked rather than hidden behind a loose threshold. Each needs
// tooling this repo does not have (svgo / gifsicle); sips cannot compress a GIF or
// an SVG without destroying it. Keep this list SHORT — it is technical debt, not an
// escape hatch. A fourth entry means the budget is wrong or the habit has slipped.
const KNOWN_OVERSIZED = new Set([
  '/project-images/travel-cp_7.gif', // animated, needs gifsicle
  '/project-images/busking-town_1.png', // flat-colour PNG, needs pngquant
  '/project-images/webeing-hybrid-app.svg', // path-heavy vector, needs svgo
]);

const oversized = [];
for (const [webPath, bytes] of onDisk) {
  if (KNOWN_OVERSIZED.has(webPath)) continue;
  const budget = SIZE_BUDGETS.find(b => b.test.test(webPath));
  if (budget && bytes > budget.max) {
    oversized.push({ webPath, bytes, max: budget.max, label: budget.label });
  }
}

// ─── Report every class at once, then exit ────────────────────────────────────
// Collect all problems before exiting so one run surfaces every issue rather
// than making the caller re-run per error class.
const kb = n => `${(n / 1024).toFixed(0)} KB`;
let failed = false;

if (invalidPublicPaths.size) {
  failed = true;
  console.error(`\n✗ Invalid public asset paths (${invalidPublicPaths.size})\n`);
  for (const item of invalidPublicPaths) {
    console.error(`  ${item}`);
    console.error(`    fix: drop the "public/" prefix — paths are web-root-relative, e.g. "/blog-images/x.jpg"\n`);
  }
}

if (missing.length) {
  failed = true;
  console.error(`\n✗ Missing local assets (${missing.length})\n`);
  for (const item of missing) {
    console.error(`  ${item}`);
    console.error(`    expected at: public${item}`);
    console.error(`    fix: add the file, or correct the path in the file that references it\n`);
  }
}

if (caseMismatch.length) {
  failed = true;
  console.error(`\n✗ Case mismatches (${caseMismatch.length}) — these 404 on Linux/Vercel\n`);
  for (const item of caseMismatch) {
    console.error(`  referenced: ${item.webPath}`);
    console.error(`  on disk:    ${item.found}`);
    console.error(`    fix: rename the file to match the reference, or update the reference\n`);
  }
}

if (shapeProblems.length) {
  failed = true;
  console.error(`\n✗ Project content incomplete (${shapeProblems.length})\n`);
  for (const item of shapeProblems) {
    console.error(`  ${item}`);
  }
  console.error(
    `\n  These fields are the case-study body in src/content/projects/<slug>/index.ts.\n` +
      `  An empty one renders a heading with nothing under it.\n`,
  );
}

if (oversized.length) {
  failed = true;
  console.error(`\n✗ Assets over budget (${oversized.length})\n`);
  for (const item of oversized.sort((a, b) => b.bytes - a.bytes)) {
    console.error(`  ${item.webPath}`);
    console.error(`    ${kb(item.bytes)} — budget for ${item.label} is ${kb(item.max)}`);
    console.error(`    fix: re-encode or resize. Every visitor downloads this.\n`);
  }
}

if (failed) process.exit(1);

console.log(`Verified ${referenced.size} asset reference(s), ${onDisk.size} file(s) within budget.`);
