import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { PortfolioFilm } from '@/pages/PortfolioFilm';

/* Build-time render of /hitesh (see scripts/prerender.mjs), so the page's
   content is in the HTML for crawlers and link unfurlers that don't run
   JavaScript. The client hydrates this markup instead of rendering anew. */
export function render(): string {
  return renderToString(createElement(PortfolioFilm));
}
