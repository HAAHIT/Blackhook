import type { TeamMember } from '@/types';

export const TEAM: TeamMember[] = [
  {
    initial: 'S',
    name: 'Suraj Ingle',
    role: 'Founding designer & engineer',
    bio: 'NID Ahmedabad. Designs systems and ships them. Eight years across product design and front-end engineering — the rare person who can both spec a component and write its production code.',
    foot: ['NID Ahmedabad · 2017', '@surajingle'],
  },
  {
    initial: 'H',
    name: 'Hitesh Agrawal',
    role: 'Founding product & strategy',
    bio: 'Product manager and business strategist. Built and scaled software with both Fortune 500 enterprises and zero-to-one startups. Translates a fuzzy ambition into something a team can actually ship.',
    foot: ['Ex-enterprise · Ex-startup', '@hiteshagrawal'],
  },
];

export const STEPS = [
  {
    n: '01',
    t: 'Listen & frame',
    d: "A short, blunt discovery. We figure out what you actually need, and what you don't. We say no to scope that won't earn its keep.",
    meta: '1–2 weeks',
  },
  {
    n: '02',
    t: 'Design in the open',
    d: 'Working sessions, not deliverable theater. You see prototypes inside the first fortnight, and you steer.',
    meta: '2–4 weeks',
  },
  {
    n: '03',
    t: 'Build with the design team',
    d: "Same humans designing and shipping. Decisions stay coherent because nothing gets translated through a brief.",
    meta: '4–12 weeks',
  },
  {
    n: '04',
    t: 'Polish, ship, observe',
    d: "We obsess over the final 5%, instrument what matters, and stay on as long as it's useful.",
    meta: 'Ongoing',
  },
];
