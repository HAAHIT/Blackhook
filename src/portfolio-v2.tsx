import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/portfolio-v2.css';
import { PortfolioV2 } from '@/pages/PortfolioV2';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortfolioV2 />
  </StrictMode>,
);
