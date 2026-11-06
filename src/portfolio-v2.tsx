import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@/styles/portfolio-film.css';
import { PortfolioFilm } from '@/pages/PortfolioFilm';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <PortfolioFilm />
  </StrictMode>
);
// The build prerenders the page into #root (scripts/prerender.mjs); hydrate
// that markup, or render from scratch if the page arrived without it.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
