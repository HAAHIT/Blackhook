import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/globals.css';
import { Portfolio } from '@/pages/Portfolio';
import { BHMotion } from '@/lib/motion';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Portfolio />
  </StrictMode>,
);

BHMotion.init();
