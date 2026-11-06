#!/usr/bin/env node
/* Writes the build-time render of the portfolio into dist/hitesh.html.
   Runs as part of `npm run build`, after the client build and an SSR build
   of src/portfolio-film.server.ts into .ssr/. If this step is skipped, the
   page still works: the client renders from scratch instead of hydrating. */

import { readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const page = resolve(root, 'dist/hitesh.html');
const marker = '<div id="root"></div>';

const { render } = await import(pathToFileURL(resolve(root, '.ssr/portfolio-film.server.js')).href);
const html = await readFile(page, 'utf8');
if (!html.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/hitesh.html`);
const app = render();
// A replacer function, so `$&`-style sequences in the markup are inserted as is.
await writeFile(page, html.replace(marker, () => `<div id="root">${app}</div>`));
await rm(resolve(root, '.ssr'), { recursive: true, force: true });
console.log(`prerender: dist/hitesh.html now carries ${(app.length / 1024).toFixed(1)} KB of rendered markup`);
