import type { Service } from '@/types';

export const SERVICES: Service[] = [
  {
    n: '01',
    shape: 's-clip',
    span: 'col-6',
    title: 'Product Design',
    body: 'Research, IA, interaction, visual systems. We design things people actually want to use — and engineering can actually build.',
    tags: ['UX research', 'UI systems', 'Prototyping'],
  },
  {
    n: '02',
    shape: 's-pill',
    span: 'col-6',
    title: 'Web Applications',
    body: 'Production-grade web apps with real state, auth, integrations and observability. Built to scale from day one.',
    tags: ['React', 'TypeScript', 'Postgres', 'Edge runtime'],
  },
  {
    n: '03',
    shape: '',
    span: 'col-4',
    title: 'Mobile Apps',
    body: 'iOS and Android, native-feel performance, ships to stores.',
    tags: ['React Native', 'Swift', 'Kotlin'],
  },
  {
    n: '04',
    shape: 's-clip',
    span: 'col-4',
    title: 'Internal Tools',
    body: 'Admin portals, ops dashboards, CRMs — the unsexy software that runs the business.',
    tags: ['Dashboards', 'Workflows', 'Reporting'],
  },
  {
    n: '05',
    shape: 's-arrow',
    span: 'col-4',
    title: 'Whatever the client needs',
    body: "We don't hide behind a service menu. If it's software-shaped, we'll quote it.",
    tags: ['Open scope'],
  },
];
