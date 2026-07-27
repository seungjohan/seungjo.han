#!/usr/bin/env node
/**
 * Promote the prerendered 404 route to build/client/404.html.
 *
 * React Router emits prerendered routes as <route>/index.html, so /404 lands at
 * build/client/404/index.html. Vercel's static not-found handler looks for
 * 404.html at the output root, so without this copy it never fires and unmatched
 * URLs fall back to Vercel's generic branded page.
 *
 * This is what makes a real HTTP 404 possible with ssr:false — there is no
 * runtime server to set a status code, so the status has to come from the
 * platform's static handling.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.join(__dirname, '..', 'build', 'client');
const source = path.join(buildDir, '404', 'index.html');
const target = path.join(buildDir, '404.html');

if (!fs.existsSync(source)) {
  console.error(
    `\n✗ Expected a prerendered 404 at build/client/404/index.html but it is missing.\n` +
      `  cause: '/404' is not in the prerender list in react-router.config.ts\n` +
      `  fix:   add '/404' to that list, or remove this step from postbuild\n`,
  );
  process.exit(1);
}

fs.copyFileSync(source, target);
console.log(`Wrote build/client/404.html (${(fs.statSync(target).size / 1024).toFixed(1)} KB).`);
