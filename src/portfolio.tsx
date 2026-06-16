import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import posthog from 'posthog-js';
import '@/styles/portfolio.css';
import { Portfolio } from '@/pages/Portfolio';

posthog.init('phc_BFHACdCjB5i85zXxpQi5fF2NFhCHGHBHvjsuv2uW3VhB', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Portfolio />
  </StrictMode>,
);
