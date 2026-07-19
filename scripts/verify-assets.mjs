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

const postsSource = read('src/app/data/posts.ts');
const projectsSource = read('src/app/data/projects.ts');
const markdownDir = path.join(root, 'src/imports/pasted_text');
const appSources = readSourceFiles(path.join(root, 'src/app'));

const referenced = new Set([
  ...appSources.flatMap(source => [...localPathsFromText(source)]),
  ...localPathsFromText(postsSource),
  ...localPathsFromText(projectsSource),
]);

const invalidPublicPaths = new Set([
  ...appSources.flatMap(source => [...invalidPublicPathsFromText(source)]),
  ...invalidPublicPathsFromText(postsSource),
  ...invalidPublicPathsFromText(projectsSource),
]);

const postMarkdownKeys = [
  ...postsSource.matchAll(/slug:\s*['"][^'"]+['"][\s\S]*?sourceMarkdown:\s*['"]([^'"]+)['"]/g),
].map(([, key]) => key);

for (const key of postMarkdownKeys) {
  const mdFile =
    fs.readdirSync(markdownDir).find(name => name === `${key}.md`) ||
    fs.readdirSync(markdownDir).find(name => name.replace(/\.md$/i, '') === key);
  if (!mdFile) continue;
  const markdown = fs.readFileSync(path.join(markdownDir, mdFile), 'utf8');
  for (const p of localPathsFromText(markdown)) referenced.add(p);
  for (const p of invalidPublicPathsFromText(markdown)) invalidPublicPaths.add(p);
}

if (invalidPublicPaths.size) {
  console.error('\nInvalid public asset paths:');
  for (const item of invalidPublicPaths) {
    console.error(`  ${item} -> remove the public prefix`);
  }
  process.exit(1);
}

const missing = [];
const caseMismatch = [];

for (const webPath of referenced) {
  const diskPath = path.join(publicDir, webPath);
  if (fs.existsSync(diskPath)) continue;

  const dir = path.dirname(diskPath);
  const base = path.basename(diskPath);
  const alt = fs
    .readdirSync(dir, { withFileTypes: true })
    .map(entry => entry.name)
    .find(name => name.toLowerCase() === base.toLowerCase());

  if (alt) {
    caseMismatch.push({ webPath, found: `/${path.relative(publicDir, path.join(dir, alt)).replace(/\\/g, '/')}` });
  } else {
    missing.push(webPath);
  }
}

if (caseMismatch.length) {
  console.warn('\nCase/extension mismatches (works on macOS, may fail on Linux deploy):');
  for (const item of caseMismatch) {
    console.warn(`  ${item.webPath} -> use ${item.found}`);
  }
}

if (missing.length) {
  console.error('\nMissing local assets:');
  for (const item of missing) console.error(`  ${item}`);
  process.exit(1);
}

console.log(`Verified ${referenced.size} local asset reference(s).`);
