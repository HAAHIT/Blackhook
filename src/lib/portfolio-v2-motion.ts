import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let lenisRaf: number | null = null;
const isTouch = () => window.matchMedia('(pointer: coarse)').matches;

function setupLenis() {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', () => ScrollTrigger.update());
  const tick = (t: number) => { lenis!.raf(t); lenisRaf = requestAnimationFrame(tick); };
  lenisRaf = requestAnimationFrame(tick);
}

function setupMagnetic() {
  if (isTouch()) return;
  document.querySelectorAll<HTMLElement>('.pv-magnetic').forEach((el) => {
    let rect: DOMRect | null = null;
    el.addEventListener('pointerenter', () => { rect = el.getBoundingClientRect(); });
    el.addEventListener('pointermove', (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (rect.left + rect.width / 2)) * 0.25,
        y: (e.clientY - (rect.top + rect.height / 2)) * 0.25,
        duration: 0.5, ease: 'power3.out',
      });
    });
    el.addEventListener('pointerleave', () => {
      rect = null;
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.5)' });
    });
  });
}

function setupHeroEntrance() {
  const tl = gsap.timeline({ delay: 0.1 });
  const rail = document.querySelector<HTMLElement>('.pv-hero-rail');
  const stats = document.querySelectorAll<HTMLElement>('.pv-hstat');
  const h1 = document.querySelector<HTMLElement>('.pv-hello');
  const tagline = document.querySelector<HTMLElement>('.pv-hero-tagline');
  const scroll = document.querySelector<HTMLElement>('.pv-scroll');
  const portrait = document.querySelector<HTMLElement>('.pv-hero-portrait');

  if (portrait) { gsap.set(portrait, { clipPath: 'inset(0 0 100% 0)' }); tl.to(portrait, { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'expo.out' }, 0); }
  if (stats.length) { gsap.set(stats, { y: 14, opacity: 0 }); tl.to(stats, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.15); }
  if (h1) { gsap.set(h1, { y: 40, opacity: 0 }); tl.to(h1, { y: 0, opacity: 1, duration: 1.05, ease: 'expo.out' }, 0.25); }
  if (tagline) { gsap.set(tagline, { y: 20, opacity: 0 }); tl.to(tagline, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.5); }
  if (rail) { gsap.set(rail, { opacity: 0 }); tl.to(rail, { opacity: 1, duration: 1.0, ease: 'power2.out' }, 0.4); }
  if (scroll) { gsap.set(scroll, { opacity: 0 }); tl.to(scroll, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.7); }
}

function setupReveals() {
  document.querySelectorAll<HTMLElement>('.pv-reveal').forEach((el) => {
    if (el.closest('.pv-hero')) return;
    gsap.set(el, { y: 32, opacity: 0 });
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out' }),
    });
  });
}

function setupCounters() {
  document.querySelectorAll<HTMLElement>('[data-pv-counter]').forEach((el) => {
    const target = parseFloat(el.dataset['pvCounter']!);
    const suffix = el.dataset['pvSuffix'] ?? '';
    el.textContent = '0' + suffix;
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.8, ease: 'expo.out',
          onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
        });
      },
    });
  });
}

function setupNav() {
  const nav = document.querySelector<HTMLElement>('.pv-nav');
  if (!nav) return;
  gsap.from(nav, { y: -40, opacity: 0, duration: 1.0, delay: 0.05, ease: 'expo.out' });
  ScrollTrigger.create({
    start: 'top -40', end: 'max',
    onUpdate: (self) => nav.classList.toggle('scrolled', self.scroll() > 40),
  });
}

export function initPortfolioV2Motion() {
  setupLenis();
  setupNav();
  setupHeroEntrance();
  setupReveals();
  setupCounters();
  setupMagnetic();
  setTimeout(() => ScrollTrigger.refresh(), 300);
}

export function destroyPortfolioV2Motion() {
  if (lenisRaf !== null) { cancelAnimationFrame(lenisRaf); lenisRaf = null; }
  lenis?.destroy(); lenis = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
  gsap.globalTimeline.clear();
}
