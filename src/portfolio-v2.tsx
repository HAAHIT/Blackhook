import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import posthog from 'posthog-js';
import '@/styles/portfolio-film.css';
import { PortfolioFilm } from '@/pages/PortfolioFilm';

posthog.init('phc_BFHACdCjB5i85zXxpQi5fF2NFhCHGHBHvjsuv2uW3VhB', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioFilm />
  </StrictMode>,
);
