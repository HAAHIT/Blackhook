export interface GlimpseRow {
  /** q = input/prompt · a = result/output · code = query/code line · item = label+value row · meta = caption */
  type: 'q' | 'a' | 'code' | 'item' | 'meta';
  text: string;
  value?: string;
  trend?: 'up' | 'down';
}

export interface Glimpse {
  /** window chrome label — usually the live domain or app surface */
  chrome: string;
  /** optional real product screenshot; when set, the card shows it (with a hover scroll-tour) instead of the rows */
  shot?: string;
  /** 'tall' pans further on hover for full-page / portrait captures */
  shotFit?: 'wide' | 'tall';
  rows: GlimpseRow[];
}

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
  glimpse?: Glimpse;
}

/** One stop on the career timeline, newest first. Dates are 'YYYY-MM'; an
    entry with no `end` is the current role. Keep in step with the résumé PDF. */
export interface Experience {
  org: string;
  role: string;
  start: string;
  end?: string;
  place: string;
  /** One line on what the role was. */
  summary: string;
  /** Highlights. Wrap a figure in **double asterisks** to set it bright. */
  points: string[];
  /** A distinction shown under the role, such as an award. */
  honor?: string;
  kind?: 'education';
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const PROJECTS: Project[] = [
  {
    name: 'smriti',
    tagline: 'AI memory layer across Claude, ChatGPT & Gemini',
    desc: 'AI memory across Claude, ChatGPT and Gemini — an extension that archives every chat to a local index, plus an MCP server that feeds your history back into context. Built and shipped solo.',
    tags: ['TypeScript', 'WXT', 'SQLite', 'MCP', 'AI Tooling'],
    repo: 'https://github.com/HAAHIT/smriti',
    year: '2025',
    featured: true,
    glimpse: {
      chrome: 'smriti · memory',
      shot: '/shots/smriti.webp',
      shotFit: 'wide',
      rows: [
        { type: 'q', text: 'What did we decide about the gateway?' },
        { type: 'a', text: 'Found 3 memories · piped into context' },
        { type: 'item', text: 'Claude', value: '2d ago' },
        { type: 'item', text: 'ChatGPT', value: '5d ago' },
        { type: 'meta', text: 'Local SQLite index · MCP server live' },
      ],
    },
  },
  {
    name: 'bolodb',
    tagline: 'Ask your data. Trust the answer.',
    desc: 'Text-to-SQL for non-technical users — ask in plain language, get the right query and an answer you can trust. No SQL required.',
    tags: ['Text-to-SQL', 'AI Tooling', 'Product'],
    repo: 'https://github.com/HAAHIT/bolodb',
    year: '2026 — Now',
    current: true,
    glimpse: {
      chrome: 'bolodb',
      shot: '/shots/bolodb.webp',
      shotFit: 'tall',
      rows: [
        { type: 'q', text: 'Top 5 customers by revenue this quarter' },
        { type: 'code', text: 'SELECT name, SUM(total) … LIMIT 5' },
        { type: 'a', text: '5 rows · 240ms · verified' },
        { type: 'meta', text: 'Plain English in, trustworthy answer out' },
      ],
    },
  },
  {
    name: 'SoloBooks',
    tagline: 'MSME bookkeeping, reimagined',
    desc: 'Bookkeeping for Indian MSMEs — fast billing, udhar khata and AI bill-OCR, with double-entry handled underneath. (Formerly HisaabKitaab.)',
    tags: ['Next.js 16', 'TypeScript', 'Gemini OCR', 'PWA'],
    repo: 'https://github.com/HAAHIT/HisaabKitaab',
    live: 'https://solobooks.in',
    year: '2025 — Now',
    current: true,
    glimpse: {
      chrome: 'solobooks.in',
      shot: '/shots/solobooks.webp',
      shotFit: 'tall',
      rows: [
        { type: 'item', text: 'Invoice #1042 · Sharma Traders', value: '₹12,400' },
        { type: 'item', text: 'Udhar khata · pending', value: '₹3,200' },
        { type: 'a', text: 'Purchase bill scanned · 7 line items' },
        { type: 'meta', text: 'Plain business actions → double-entry books' },
      ],
    },
  },
  {
    name: 'Edible Oil B2B Portal',
    tagline: 'Commodity pricing & orders',
    desc: 'B2B portal for the edible-oil trade — live SKU pricing, logins and order booking. Built behind a paying pilot.',
    tags: ['Next.js 14', 'HeroUI', 'TypeScript'],
    repo: 'https://github.com/suraj-ingle/edible-oil-portal',
    live: 'https://murlioils.com',
    year: '2025 — Now',
    current: true,
    glimpse: {
      chrome: 'murlioils.com',
      shot: '/shots/murlioils.webp',
      shotFit: 'tall',
      rows: [
        { type: 'item', text: 'Soybean Oil · 15L tin', value: '₹1,820', trend: 'up' },
        { type: 'item', text: 'Palm Oil · 15L tin', value: '₹1,540', trend: 'down' },
        { type: 'a', text: 'Order #318 booked · 40 units' },
        { type: 'meta', text: 'Live SKU pricing · multi-user logins' },
      ],
    },
  },
  {
    name: 'CareOps Central',
    tagline: 'Mission control for home care',
    desc: 'Ops platform for a home-care business — patients, partners, scheduling, billing and payouts in one place.',
    tags: ['Next.js', 'Firebase', 'ShadCN'],
    repo: 'https://github.com/suraj-ingle/hitesh-care-ops',
    live: 'https://care-ops-central.vercel.app',
    year: '2025 — Now',
    current: true,
    glimpse: {
      chrome: 'care-ops-central',
      shot: '/shots/careops.webp',
      shotFit: 'wide',
      rows: [
        { type: 'item', text: 'Visit · Physiotherapy · 4:30 PM', value: 'Assigned' },
        { type: 'item', text: 'Partner payout · cleared', value: '₹1,200' },
        { type: 'a', text: '300+ visits · 30% margin in Q1' },
        { type: 'meta', text: 'Scheduling · billing · payouts in one place' },
      ],
    },
  },
  {
    name: 'BlackHook Studio',
    tagline: 'A studio site, built from scratch',
    desc: "The studio's brand site — a WebGL hook, hand-written shaders and a tuned motion system.",
    tags: ['React', 'Vite', 'Three.js', 'GSAP'],
    repo: 'https://github.com/HAAHIT/Blackhook',
    live: 'https://blackhook.in',
    year: '2026',
    glimpse: {
      chrome: 'blackhook.in',
      shot: '/shots/blackhook.webp',
      shotFit: 'wide',
      rows: [
        { type: 'a', text: 'WebGL hook · hand-written shader' },
        { type: 'item', text: 'Frame budget', value: '60 fps' },
        { type: 'meta', text: 'Three.js + GSAP motion system' },
      ],
    },
  },
  {
    name: 'Audit Report CMS',
    tagline: 'Audit reporting, organised',
    desc: 'Manage and generate audit reports end to end — structured data in, clean reports out.',
    tags: ['Next.js', 'TypeScript'],
    repo: 'https://github.com/suraj-ingle/audit-report-management-cms',
    year: '2025',
    glimpse: {
      chrome: 'audit-cms',
      shot: '/shots/audit.webp',
      shotFit: 'tall',
      rows: [
        { type: 'item', text: 'Report · Q3 FY25', value: 'Draft' },
        { type: 'a', text: 'Generated · 18 pages exported' },
        { type: 'meta', text: 'Structured data in, clean reports out' },
      ],
    },
  },
  {
    name: 'SpacePro Furniture',
    tagline: 'Furniture, on the web',
    desc: 'A furniture storefront concept — product showcase and browsing, built from scratch.',
    tags: ['HTML', 'CSS', 'Web'],
    repo: 'https://github.com/HAAHIT/SpacePro-Furniture',
    year: '2024',
    glimpse: {
      chrome: 'spacepro',
      shot: '/shots/spacepro.webp',
      shotFit: 'wide',
      rows: [
        { type: 'item', text: 'Oslo · 3-seater sofa', value: 'In stock' },
        { type: 'a', text: 'Product showcase · browse view' },
        { type: 'meta', text: 'Storefront concept · built from scratch' },
      ],
    },
  },
];

export const EXPERIENCE: Experience[] = [
  {
    org: 'Saleshandy',
    role: 'Product Manager · Product strategy & end-to-end UI/UX',
    start: '2026-08',
    place: 'Ahmedabad, IN',
    summary: 'Growth and new-segment expansion for a B2B sales-engagement SaaS, from strategy to shipped UI.',
    points: [
      'Evolving a flat client label into **dedicated client workspaces**, opening a win-back pool of **10+ churned agency accounts** plus new agency sales. Solo-designed all **36 features and settings**.',
      'Pitched, designed and coded an **exit-intent 14-day trial** flow for high-traffic marketing pages, with the production PR raised **within 24 hours** of founder approval.',
    ],
  },
  {
    org: 'Blackhook Services',
    role: 'Co-Founder',
    start: '2024-12',
    end: '2026-07',
    place: 'Dhule, IN',
    summary: 'Two ventures of my own, from customer discovery to revenue.',
    points: [
      'Launched a **healthcare-at-home** service (nursing, physiotherapy, elder care): **300+ patient visits** and **₹3L+ MRR** at a **30% margin** in the first quarter.',
      'Found whitespace in the commodity trade, **pre-sold a paying pilot** that covered the full build, then shipped the SaaS MVP with AI tools at **3x dev velocity**.',
    ],
  },
  {
    org: 'Jio Platforms',
    role: 'Product Manager · Loyalty platform',
    start: '2022-12',
    end: '2024-11',
    place: 'Mumbai, IN',
    honor: 'Star Performer Award · sole recipient on the team',
    summary: "Owned product on Reliance's loyalty platform, and wrote Jio's product playbook with the CPO.",
    points: [
      "Led the migration of Reliance Retail's ROne loyalty program, **280M+ customers**, onto Jio's stack with **zero customer-facing downtime**.",
      'Built the loyalty gateway from scratch: one integration layer for **22 enterprise partners**, cutting partner onboarding time by **60%**.',
      'Onboarded Jio Financial Services and Tira, and shipped **6+ features** that lifted adoption **35%** and partner NPS from **38 to 52**.',
    ],
  },
  {
    org: 'FindUtsav',
    role: 'Co-Founder',
    start: '2020-02',
    end: '2022-02',
    place: 'Pune, IN',
    summary: 'My first 0→1, built while still in college.',
    points: [
      'Built an Android app for student career events: **3,000+ active users**.',
      'Pivoted to a community model on cohort retention, scaling to **20+ medical colleges** with 12 volunteers.',
    ],
  },
  {
    org: 'Savitribai Phule Pune University',
    role: 'B.E. Electronics & Telecommunication',
    start: '2018-08',
    end: '2022-05',
    place: 'Pune, IN',
    summary: 'CGPA **9.23 / 10**',
    points: [],
    kind: 'education',
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
  /** Headline before the italic-serif accent word. */
  title: string;
  /** Italic-serif accent word that closes the headline (mira-style emphasis). */
  accent: string;
  /** The story beside the headline: what was hard, what you did, what happened. */
  challenge: string;
  approach: string;
  outcome: string;
  metrics: { value: string; label: string }[];
  link?: { href: string; label: string };
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    kicker: 'Jio Loyalty · Jio Platforms Limited',
    title: 'Jio Loyalty: 280M+ customers onboarded, zero',
    accent: 'downtime',
    challenge:
      'Move 280M+ customers and their enterprise partners onto a brand-new loyalty platform — business live, zero room for a broken login.',
    approach:
      'Led it as PM: a custom onboarding gateway with phased rollouts, a partner playbook for 22 brands (incl. JFS and Tira), and 6+ core features.',
    outcome:
      'Everyone onboarded, zero downtime. Earned a Star Performer Award.',
    metrics: [
      { value: '280M+', label: 'Customers onboarded' },
      { value: '0', label: 'Minutes of downtime' },
      { value: '22', label: 'Partners onboarded' },
    ],
  },
  {
    kicker: 'BlackHook · B2B commodity SaaS',
    title: 'The customer paid before the product',
    accent: 'existed',
    challenge:
      'The edible-oil and cement trade runs on phone calls and notebooks — sceptical of software, allergic to subscriptions.',
    approach:
      'Discovery first: sat with traders, scoped the MVP around live pricing and order booking, and closed a paying pilot before writing code.',
    outcome:
      'Pilot revenue covered the full build before launch. Now live for the trade.',
    metrics: [
      { value: '100%', label: 'Build cost covered pre-launch' },
      { value: '1', label: 'Paying pilot before the MVP' },
    ],
    link: { href: 'https://murlioils.com', label: 'murlioils.com' },
  },
  {
    kicker: 'BlackHook · Healthcare at home',
    title: 'Taking on the P&L, not just the',
    accent: 'roadmap',
    challenge:
      'Home healthcare is an operations business — unit economics, not software, decide survival.',
    approach:
      'Built both sides: the ops platform (scheduling, payouts, billing) and the business itself.',
    outcome:
      'Profitable in Q1 — 300+ visits at 30% margin, run on the ops platform I built.',
    metrics: [
      { value: '300+', label: 'Visits in the first quarter' },
      { value: '30%', label: 'Margin from day one' },
      { value: '₹3L+', label: 'Monthly recurring revenue' },
    ],
    link: { href: 'https://care-ops-central.vercel.app', label: 'care-ops-central' },
  },
];

export interface Principle {
  title: string;
  desc: string;
}

export const PRINCIPLES: Principle[] = [
  {
    title: 'Discovery before decks',
    desc: "Every venture I've run began as customer conversations, not internal conviction.",
  },
  {
    title: 'Revenue over slides',
    desc: 'A paying customer before the MVP beats any market-sizing deck. Proof over polish.',
  },
  {
    title: 'Own the whole problem',
    desc: "Strategy, ops, hiring — and the code when that's fastest. Seniority is range, not altitude.",
  },
  {
    title: 'AI is leverage',
    desc: 'Used well, AI lets one PM build and run what used to take a team.',
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
    detail: 'Sole recipient on the Jio loyalty platform team',
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
