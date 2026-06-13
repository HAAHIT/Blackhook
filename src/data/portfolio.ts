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
    name: 'bolodb',
    tagline: 'Ask your data. Trust the answer.',
    desc: 'A text-to-SQL product for non-technical users — type a question in plain language, get back the right query and a trustworthy answer, no SQL required. Built to close the gap between business owners and the data sitting in their own databases.',
    tags: ['Text-to-SQL', 'AI Tooling', 'Product'],
    repo: 'https://github.com/HAAHIT/bolodb',
    year: '2026 — Now',
    current: true,
  },
  {
    name: 'SoloBooks',
    tagline: 'MSME bookkeeping, reimagined',
    desc: 'A cognitive translator between simple business actions and double-entry accounting — fast billing, party ledgers (udhar khata) and AI-powered purchase-bill OCR, built for Indian MSMEs. (Formerly HisaabKitaab.)',
    tags: ['Next.js 16', 'TypeScript', 'Gemini OCR', 'PWA'],
    repo: 'https://github.com/HAAHIT/HisaabKitaab',
    live: 'https://solobooks.in',
    year: '2025 — Now',
    current: true,
  },
  {
    name: 'Edible Oil B2B Portal',
    tagline: 'Commodity pricing & orders',
    desc: 'A B2B portal for the edible-oil trade — real-time SKU pricing, multi-user logins and order booking. The MVP behind a paying pilot that covered full development cost before launch.',
    tags: ['Next.js 14', 'HeroUI', 'TypeScript'],
    repo: 'https://github.com/suraj-ingle/edible-oil-portal',
    live: 'https://murlioils.com',
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
    desc: 'Building SoloBooks and a commodity-industry SaaS (paying pilot secured before MVP), plus a healthcare-at-home services business at ₹3L+ MRR. Sole PM across all three — product, ops, hiring funnels and scaling playbooks, leaning on AI tooling to move faster.',
  },
  {
    range: '2022 — 2024',
    role: 'Product Manager',
    org: 'Jio Platforms Limited',
    place: 'Mumbai, IN',
    desc: "Helped scale Reliance's ROne loyalty platform from the ground up — moved 28Cr+ customers via a custom gateway with zero downtime, onboarded 22 enterprise partners (incl. JFS, Tira) and shipped 6+ core features. Recognised with the company's Star Performer Award.",
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

export interface CaseStudy {
  kicker: string;
  title: string;
  challenge: string;
  approach: string;
  outcome: string;
  metrics: { value: string; label: string }[];
  link?: { href: string; label: string };
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    kicker: 'Jio Platforms · Enterprise scale',
    title: 'Migrating 280M+ customers with zero downtime',
    challenge:
      "Reliance's ROne loyalty platform had to absorb 280M+ customers from legacy systems while the business kept transacting every day. At that scale, a failed cutover is national news.",
    approach:
      'Led it as PM, working closely with engineering — a custom gateway with phased cohort cutovers, a partner-onboarding playbook that brought 22 enterprise brands (including Jio Financial Services and Tira) onto one loyalty rail, and 6+ core platform features shipped along the way.',
    outcome:
      'Every customer moved, with zero downtime. The work earned a Star Performer Award.',
    metrics: [
      { value: '280M+', label: 'Customers migrated' },
      { value: '0', label: 'Minutes of downtime' },
      { value: '22', label: 'Enterprise partners' },
    ],
  },
  {
    kicker: 'BlackHook · B2B commodity SaaS',
    title: 'The customer paid before the product existed',
    challenge:
      'The edible-oil and cement trade runs on phone calls and notebooks. Software pitches die on adoption — buyers are sceptical, offline-first and allergic to subscriptions.',
    approach:
      'Started with discovery, not a deck: sat with traders, mapped the highest-pain workflow — live SKU pricing and order booking — scoped the MVP around exactly that, and closed a paying pilot before a line of code was written.',
    outcome:
      'Pilot revenue covered the full build cost before launch. The platform now runs live pricing and orders for the trade.',
    metrics: [
      { value: '100%', label: 'Build cost covered pre-launch' },
      { value: '1', label: 'Paying pilot before the MVP' },
    ],
    link: { href: 'https://murlioils.com', label: 'murlioils.com' },
  },
  {
    kicker: 'BlackHook · Healthcare at home',
    title: 'Taking on the P&L, not just the roadmap',
    challenge:
      'Home healthcare — nursing, physiotherapy, elder care — is an operations business. Software is necessary but not sufficient; unit economics decide survival.',
    approach:
      'Built both sides: the ops platform (visit scheduling, partner payouts, billing) and the business itself — partner network, pricing and service design.',
    outcome:
      'Profitable in its first quarter: 300+ visits at 30% margin, on a platform I built and still run.',
    metrics: [
      { value: '300+', label: 'Visits in the first quarter' },
      { value: '30%', label: 'Margin from day one' },
      { value: '₹3L+', label: 'Monthly recurring revenue' },
    ],
    link: { href: 'https://care-ops-central.vercel.app', label: 'care-ops-central' },
  },
  {
    kicker: 'Independent · AI-native product',
    title: 'Building and shipping an AI product solo',
    challenge:
      'AI memory is fragmented — every conversation with Claude, ChatGPT or Gemini is lost the moment it ends, locked in separate silos.',
    approach:
      'Designed, built and shipped smriti solo: a browser extension that archives conversations across all three, a local SQLite search index, and an MCP server that hands your history back to Claude in context.',
    outcome:
      'Three distribution layers — extension, CLI, MCP protocol — one product, built without a team. The same approach now powers bolodb, a text-to-SQL product.',
    metrics: [
      { value: '3', label: 'Distribution layers' },
      { value: '0', label: 'Engineers hired' },
    ],
    link: { href: 'https://github.com/HAAHIT/smriti', label: 'github.com/HAAHIT/smriti' },
  },
];

export interface Principle {
  title: string;
  desc: string;
}

export const PRINCIPLES: Principle[] = [
  {
    title: 'Discovery before decks',
    desc: "Every venture I've run started as customer conversations, not internal conviction. The commodity SaaS was sold before it was built.",
  },
  {
    title: 'Revenue over slides',
    desc: 'A paying customer before the MVP tells me more than any market-sizing deck. I try to optimise for proof over polish.',
  },
  {
    title: 'Own the whole problem',
    desc: "Strategy, ops, hiring funnels — and the code, when that's the fastest path. To me, seniority is range, not altitude.",
  },
  {
    title: 'AI is leverage',
    desc: "Used well, AI tooling lets one product person build and run more than usually fits in a day — it's how I keep three ventures moving without cutting corners.",
  },
];

export interface Recognition {
  value: string;
  label: string;
  detail: string;
}

export const RECOGNITION: Recognition[] = [
  {
    value: 'Star Performer',
    label: 'Jio Platforms Limited',
    detail: 'For the ROne loyalty-platform migration',
  },
  {
    value: 'Top 2.5%',
    label: 'CAT & XAT, nationwide',
    detail: 'Interview calls from 15 IIMs and XLRI',
  },
  {
    value: '9.23 / 10',
    label: 'B.E. Electronics & Telecom',
    detail: 'Savitribai Phule Pune University',
  },
];
