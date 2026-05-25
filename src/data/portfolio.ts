export interface Project {
  name: string;
  tagline: string;
  desc: string;
  tags: string[];
  repo: string;
  live?: string;
  year: string;
  current?: boolean;
  featured?: boolean;
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
    name: 'smriti',
    tagline: 'AI memory layer across Claude, ChatGPT & Gemini',
    desc: 'A cross-platform AI memory product — a browser extension that archives conversations from Claude, ChatGPT and Gemini into a local SQLite index, plus an MCP server that pipes your history back into Claude\'s context window on demand. Three distribution layers (extension, CLI helper, MCP protocol), one clear user job: never lose a conversation. Designed, built and shipped solo using AI-assisted development. The product that ate its own dog food.',
    tags: ['TypeScript', 'WXT', 'SQLite', 'MCP', 'AI Tooling'],
    repo: 'https://github.com/HAAHIT/smriti',
    year: '2025',
    featured: true,
  },
  {
    name: 'SoloBooks',
    tagline: 'MSME bookkeeping, reimagined',
    desc: 'A cognitive translator between simple business actions and double-entry accounting — fast billing, party ledgers (udhar khata) and AI-powered purchase-bill OCR, built for Indian MSMEs. (Formerly HisaabKitaab.)',
    tags: ['Next.js 16', 'TypeScript', 'Gemini OCR', 'PWA'],
    repo: 'https://github.com/HAAHIT/HisaabKitaab',
    year: '2025 — Now',
    current: true,
  },
  {
    name: 'Edible Oil B2B Portal',
    tagline: 'Commodity pricing & orders',
    desc: 'A B2B portal for the edible-oil trade — real-time SKU pricing, multi-user logins and order booking. The MVP behind a paying pilot that covered full development cost before launch.',
    tags: ['Next.js 14', 'HeroUI', 'TypeScript'],
    repo: 'https://github.com/suraj-ingle/edible-oil-portal',
    live: 'https://edible-oil-b2b-portal.vercel.app',
    year: '2025 — Now',
    current: true,
  },
  {
    name: 'CareOps Central',
    tagline: 'Mission control for home care',
    desc: 'The operations platform behind a healthcare-at-home business — patient and partner management, visit scheduling, billing and partner payouts, all in one surface.',
    tags: ['Next.js', 'Firebase', 'ShadCN'],
    repo: 'https://github.com/suraj-ingle/hitesh-care-ops',
    live: 'https://care-ops-central.vercel.app',
    year: '2025 — Now',
    current: true,
  },
  {
    name: 'BlackHook Studio',
    tagline: 'A studio site, built from scratch',
    desc: 'The studio brand site — a WebGL hook, a hand-written shader background and a tuned motion system. A playground for craft on the web.',
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
    desc: 'Building SoloBooks and a commodity-industry SaaS (paying pilot secured before MVP), plus a healthcare-at-home services business at ₹3L+ MRR. Sole PM across all three — product, ops, hiring funnels and scaling playbooks, with AI tooling for 3× velocity.',
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
    desc: 'The engineering grounding under the product work — signals, systems and networks. Top 2.5% in CAT & XAT, with interview calls from 15 IIMs and XLRI.',
  },
];

export const SKILLS: SkillGroup[] = [
  { label: 'Product & Strategy', items: ['Product Strategy', 'Roadmapping', 'A/B Testing', 'RICE', 'JTBD', 'OKRs', 'Market Analysis'] },
  { label: 'AI & Building', items: ['RAG', 'Claude & Claude Code', 'Gemini / Antigravity', 'Prompt Engineering', 'AI-assisted Dev'] },
  { label: 'Analytics & Tools', items: ['SQL', 'Mixpanel', 'Figma', 'JIRA', 'Confluence', 'Notion', 'Postman', 'Azure DevOps'] },
  { label: 'Technical & Domains', items: ['REST APIs', 'Webhooks', 'Loyalty', 'B2B SaaS', 'Marketplaces'] },
];
