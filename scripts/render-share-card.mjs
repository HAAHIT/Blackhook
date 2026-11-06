#!/usr/bin/env node
/* Renders public/og-hitesh.jpg, the 1200x630 image LinkedIn, Slack, WhatsApp
   and X show when someone shares blackhook.in/hitesh. It is set in the site's
   own type on the smoke backdrop (public/smoke-poster.webp).

     npm i --no-save playwright
     node scripts/render-share-card.mjs                      # typographic card
     node scripts/render-share-card.mjs --photo public/x.jpg # with a portrait

   Copy lives in COPY below; keep it in step with the hero on the page. After
   re-rendering, bump the ?v= on og:image/twitter:image in hitesh.html so the
   platforms fetch the new image instead of a cached one. */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname } from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WIDTH = 1200;
const HEIGHT = 630;

const COPY = {
  status: 'Open to senior product roles',
  name: 'Hitesh Agrawal',
  // The hero headline, with the accent word in gold italic.
  lineBefore: 'I help turn fuzzy ideas into',
  accent: 'shipped',
  lineAfter: 'product.',
  role: 'Product manager · 0→1 to 280M-user scale',
  url: 'blackhook.in/hitesh',
};

const photoArg = process.argv.indexOf('--photo');
const photoPath = photoArg > -1 ? resolve(root, process.argv[photoArg + 1]) : null;

const dataUri = async (file, mime) => `data:${mime};base64,${(await readFile(file)).toString('base64')}`;
const smoke = await dataUri(resolve(root, 'public/smoke-poster.webp'), 'image/webp');
const photo = photoPath
  ? await dataUri(photoPath, extname(photoPath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg')
  : null;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400&family=Geist+Mono:wght@400;500&display=block" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: #17171b; color: #f4f0e8; }
  .card { position: relative; width: 100%; height: 100%; padding: 76px 84px; display: flex; align-items: center; gap: 56px; }
  /* The poster's gold smoke sits near its edges; anchor the crop to the right-hand plume. */
  .smoke { position: absolute; inset: 0; background: url(${smoke}) 92% 40% / auto 135% no-repeat; }
  /* Darken the left, where the type sits; let the smoke glow on the right. */
  .shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(23,23,27,0.94) 0%, rgba(23,23,27,0.78) 45%, rgba(23,23,27,0.1) 100%); }
  .copy { position: relative; flex: 1; display: flex; flex-direction: column; gap: 26px; min-width: 0; }
  .status { display: inline-flex; align-items: center; gap: 12px; font: 500 17px 'Geist Mono', monospace; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(244,240,232,0.78); }
  .status i { width: 10px; height: 10px; border-radius: 50%; background: #b5f55b; box-shadow: 0 0 14px #b5f55b; }
  .name { font: 400 104px/0.95 'Instrument Serif', serif; letter-spacing: -0.02em; }
  .line { font: 400 46px/1.12 'Instrument Serif', serif; letter-spacing: -0.01em; color: rgba(244,240,232,0.92); max-width: 15em; }
  .line em { font-style: italic; background: linear-gradient(120deg, #fdf0c8 0%, #d8b15e 35%, #a9842f 60%, #f5dfa4 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .rule { width: 72px; height: 2px; background: linear-gradient(90deg, #d8b15e, transparent); }
  .meta { display: flex; justify-content: space-between; align-items: baseline; gap: 24px; font: 400 19px 'Geist Mono', monospace; letter-spacing: 0.04em; color: rgba(244,240,232,0.72); }
  .meta b { font-weight: 400; color: #d4b56a; }
  .photo { position: relative; flex: none; width: 300px; height: 300px; border-radius: 50%; padding: 7px; background: linear-gradient(150deg, rgba(230,200,126,0.75), rgba(201,164,92,0.15) 45%, rgba(255,255,255,0.05)); box-shadow: 0 0 80px rgba(212,181,106,0.25); }
  .photo img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block; }
</style></head><body>
  <div class="card">
    <div class="smoke"></div><div class="shade"></div>
    <div class="copy">
      <span class="status"><i></i>${COPY.status}</span>
      <h1 class="name">${COPY.name}</h1>
      <p class="line">${COPY.lineBefore} <em>${COPY.accent}</em> ${COPY.lineAfter}</p>
      <span class="rule"></span>
      <div class="meta"><span>${COPY.role}</span><b>${COPY.url}</b></div>
    </div>
    ${photo ? `<div class="photo"><img src="${photo}" alt=""></div>` : ''}
  </div>
</body></html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const missing = await page.evaluate(() =>
    ['Instrument Serif', 'Geist Mono'].filter((f) => !document.fonts.check(`16px "${f}"`)));
  if (missing.length) throw new Error(`Webfonts did not load: ${missing.join(', ')}`);
  const out = resolve(root, 'public/og-hitesh.jpg');
  await page.screenshot({ path: out, type: 'jpeg', quality: 88 });
  const { size } = await import('node:fs').then((fs) => fs.promises.stat(out));
  console.log(`og-hitesh.jpg ${WIDTH}x${HEIGHT}, ${(size / 1024).toFixed(0)} KB${photo ? ', with photo' : ''}`);
} finally {
  await browser.close();
}
