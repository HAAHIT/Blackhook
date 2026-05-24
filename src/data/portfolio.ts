export interface Project {
  name: string;
  tagline: string;
  desc: string;
  tags: string[];
  repo: string;
  live?: string;
  year: string;
}

export interface Experience {
  range: string;
  role: string;
  org: string;
  place: string;
  desc: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const PROJECTS: Project[] = [
  {
    name: 'HisaabKitaab',
    tagline: 'MSME bookkeeping, reimagined',
    desc: 'A cognitive translator between simple business actions and double-entry accounting — fast billing, party ledgers (udhar khata) and AI-powered purchase-bill OCR, built for Indian MSMEs.',
    tags: ['Next.js 16', 'TypeScript', 'Gemini OCR', 'PWA'],
    repo: 'https://github.com/HAAHIT/HisaabKitaab',
    year: '2025',
  },
  {
    name: 'Recall',
    tagline: 'A memory layer for your AI chats',
    desc: 'Local-first archive, search and recall across Claude, ChatGPT, Gemini and Claude Code. A browser extension, a local SQLite helper and an MCP server that hands your history back to Claude.',
    tags: ['TypeScript', 'WXT', 'SQLite', 'MCP'],
    repo: 'https://github.com/HAAHIT/smriti',
    year: '2025',
  },
  {
    name: 'Edible Oil B2B Portal',
    tagline: 'Commodity pricing & orders',
    desc: 'A B2B portal for the edible-oil trade — real-time SKU pricing, multi-user logins and order booking. The MVP behind a paying pilot that covered full development cost pre-launch.',
    tags: ['Next.js 14', 'HeroUI', 'TypeScript'],
    repo: 'https://github.com/suraj-ingle/edible-oil-portal',
    live: 'https://edible-oil-b2b-portal.vercel.app',
    year: '2025',
  },
  {
    name: 'CareOps Central',
    tagline: 'Mission control for home care',
    desc: 'The operations platform behind a healthcare-at-home business — patient and partner management, visit scheduling, billing and partner payouts, all in one surface.',
    tags: ['Next.js', 'Firebase', 'ShadCN'],
    repo: 'https://github.com/suraj-ingle/hitesh-care-ops',
    live: 'https://care-ops-central.vercel.app',
    year: '2025',
  },
  {
    name: 'BlackHook Studio',
    tagline: 'This very corner of the web',
    desc: "The studio's digital home — a WebGL hook, a hand-written shader background and a tuned motion system. The page you'd land on one click away from here.",
    tags: ['React', 'Vite', 'Three.js', 'GSAP'],
    repo: 'https://github.com/HAAHIT/Blackhook',
    live: 'https://blackhook.in',
    year: '2026',
  },
  {
    name: 'Audit Report CMS',
    tagline: 'Audit reporting, organised',
    desc: 'A content system for managing and generating audit reports end to end — structured data in, clean reports out.',
    tags: ['Next.js', 'TypeScript'],
    repo: 'https://github.com/suraj-ingle/audit-report-management-cms',
    year: '2025',
  },
  {
    name: 'SpacePro Furniture',
    tagline: 'Furniture, on the web',
    desc: 'A furniture storefront concept — product showcase and a browsing experience built from the ground up.',
    tags: ['HTML', 'CSS', 'Web'],
    repo: 'https://github.com/HAAHIT/SpacePro-Furniture',
    year: '2024',
  },
];

export const EXPERIENCE: Experience[] = [
  {
    range: '2024 — Now',
    role: 'Co-Founder & Product Manager',
    org: 'BlackHook Services',
    place: 'Dhule, IN',
    desc: 'Building a commodity-industry SaaS (paying pilot secured before MVP) and a healthcare-at-home services business at ₹3L+ MRR. Sole PM across both — product, ops, hiring funnels and scaling playbooks, with AI tooling for 3× velocity.',
  },
  {
    range: '2022 — 2024',
    role: 'Product Manager',
    org: 'Jio Platforms Limited',
    place: 'Mumbai, IN',
    desc: "Scaled Reliance's ROne loyalty platform from scratch — migrated 28Cr+ customers via a custom gateway with zero downtime, onboarded 22 enterprise partners (incl. JFS, Tira) and shipped 6+ core features. Sole recipient of the Star Performer Award.",
  },
  {
    range: '2020 — 2022',
    role: 'Co-Founder',
    org: 'FindUtsav',
    place: 'Pune, IN',
    desc: 'Built and launched an Android app connecting students with career events from 0→1 — 3,000+ active users across 20+ colleges, driven by a three-click event-creation flow.',
  },
  {
    range: '2018 — 2022',
    role: 'B.E. Electronics & Telecommunication',
    org: 'Savitribai Phule Pune University',
    place: 'CGPA 9.23 / 10',
    desc: 'Top of class fundamentals in signals, systems and networks — the engineering grounding under the product work. Top 2.5% in CAT & XAT, with interview calls from 15 IIMs and XLRI.',
  },
];

export const SKILLS: SkillGroup[] = [
  { label: 'Product & Strategy', items: ['Product Strategy', 'Roadmapping', 'A/B Testing', 'RICE', 'JTBD', 'OKRs', 'Market Analysis'] },
  { label: 'AI & Building', items: ['RAG', 'Claude & Claude Code', 'Gemini / Antigravity', 'Prompt Engineering', 'AI-assisted Dev'] },
  { label: 'Analytics & Tools', items: ['SQL', 'Mixpanel', 'Figma', 'JIRA', 'Confluence', 'Notion', 'Postman', 'Azure DevOps'] },
  { label: 'Technical & Domains', items: ['REST APIs', 'Webhooks', 'Loyalty', 'B2B SaaS', 'Marketplaces'] },
];
