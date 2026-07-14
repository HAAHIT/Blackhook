import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/portfolio-film.css';
import { PortfolioFilm } from '@/pages/PortfolioFilm';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioFilm />
  </StrictMode>,
);
