export type HookStyle = 'wireframe' | 'solid' | 'glass';
export type Theme = 'dark' | 'light';

export interface HookOptions {
  style: HookStyle;
  color: string;
  speed: number;
}

export interface TweakValues {
  theme: Theme;
  hookStyle: HookStyle;
  hookColor: string;
  hookSpeed: number;
  shader: boolean;
  marqueeSpeed: number;
  grain: boolean;
  customCursor: boolean;
  smoothScroll: boolean;
}

export interface Service {
  n: string;
  shape: string;
  span: string;
  title: string;
  body: string;
  tags: string[];
}

export interface Step {
  n: string;
  t: string;
  d: string;
  meta: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  year: string;
  kind: string;
  title: string;
  body: string;
  accent: string;
  role: string;
  duration: string;
  team: string;
  stack: string[];
  outcomes: [string, string][];
  long: string;
}

export interface TeamMember {
  initial: string;
  name: string;
  role: string;
  bio: string;
  foot: [string, string];
}

export interface Quote {
  text: string;
  who: string;
}
