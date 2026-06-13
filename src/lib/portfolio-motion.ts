import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let lenisRaf: number | null = null;
const isTouch = () => window.matchMedia('(pointer: coarse)').matches;

function setupLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on('scroll', () => ScrollTrigger.update());
  const tick = (t: number) => { lenis!.raf(t); lenisRaf = requestAnimationFrame(tick); };
  lenisRaf = requestAnimationFrame(tick);
}

function splitWords(el: HTMLElement): HTMLElement[] {
  if (!el || el.dataset['split'] === '1') return [];
  el.dataset['split'] = '1';
  const tmp = document.createElement('div');
  tmp.innerHTML = el.innerHTML;
  const words: HTMLElement[] = [];
  function walk(node: Node, parent: HTMLElement) {
    node.childNodes.forEach((child) => {
      if (child.nodeType === 3) {
        child.textContent!.split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { parent.appendChild(document.createTextNode(' ')); }
          else {
            const w = document.createElement('span'); w.className = 'pf-word';
            const i = document.createElement('span'); i.className = 'pf-word-i';
            i.textContent = p; w.appendChild(i); parent.appendChild(w); words.push(i);
          }
        });
      } else if (child.nodeType === 1) {
        const c = (child as Element).cloneNode(false) as HTMLElement;
        parent.appendChild(c); walk(child, c);
      }
    });
  }
  el.innerHTML = ''; walk(tmp, el);
  return words;
}

function setupCursor() {
  if (isTouch()) return;
  const el = document.querySelector<HTMLElement>('.pf-cursor');
  if (!el) return;
  const ring = el.querySelector<HTMLElement>('.pf-cursor-ring');
  const dot = el.querySelector<HTMLElement>('.pf-cursor-dot');
  let tx = 0, ty = 0, rx = 0, ry = 0, first = true;

  window.addEventListener('pointermove', (e) => {
    if (first) { el.classList.add('on'); rx = e.clientX; ry = e.clientY; first = false; }
    tx = e.clientX; ty = e.clientY;
    if (dot) gsap.to(dot, { x: tx, y: ty, duration: 0.1, ease: 'power3.out', overwrite: 'auto' });
  });
  window.addEventListener('pointerleave', () => el.classList.add('hide'));
  window.addEventListener('pointerenter', () => el.classList.remove('hide'));
  window.addEventListener('pointerdown', () => el.classList.add('press'));
  window.addEventListener('pointerup', () => el.classList.remove('press'));

  const tick = () => {
    rx += (tx - rx) * 0.14; ry += (ty - ry) * 0.14;
    if (ring) ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  document.addEventListener('pointerover', (e) => {
    const over = !!(e.target as Element).closest?.('a, button');
    el.classList.toggle('link', over);
  });
}

function setupMagnetic() {
  if (isTouch()) return;
  document.querySelectorAll<HTMLElement>('.pf-magnetic').forEach((el) => {
    let rect: DOMRect | null = null;
    el.addEventListener('pointerenter', () => { rect = el.getBoundingClientRect(); });
    el.addEventListener('pointermove', (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (rect.left + rect.width / 2)) * 0.3,
        y: (e.clientY - (rect.top + rect.height / 2)) * 0.3,
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
  const eyebrow = document.querySelector<HTMLElement>('.pf-hero .pf-eyebrow');
  const h1 = document.querySelector<HTMLElement>('.pf-hero h1');
  const sub = document.querySelector<HTMLElement>('.pf-hero-sub');
  const ctas = document.querySelector<HTMLElement>('.pf-hero-ctas');
  const facts = document.querySelectorAll<HTMLElement>('.pf-fact');
  const photo = document.querySelector<HTMLElement>('.pf-hero-photo');

  if (eyebrow) { gsap.set(eyebrow, { y: 14, opacity: 0 }); tl.to(eyebrow, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0); }
  if (h1) {
    const words = splitWords(h1);
    gsap.set(words, { yPercent: 115, opacity: 0 });
    tl.to(words, { yPercent: 0, opacity: 1, duration: 1.05, ease: 'expo.out', stagger: 0.055 }, 0.1);
  }
  if (sub) { gsap.set(sub, { y: 22, opacity: 0 }); tl.to(sub, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.5); }
  if (ctas) { gsap.set(Array.from(ctas.children), { y: 16, opacity: 0 }); tl.to(ctas.children, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, 0.65); }
  if (facts.length) { gsap.set(facts, { y: 14, opacity: 0 }); tl.to(facts, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.8); }
  if (photo) { gsap.set(photo, { scale: 0.85, opacity: 0 }); tl.to(photo, { scale: 1, opacity: 1, duration: 1.3, ease: 'expo.out' }, 0.1); }
}

function setupReveals() {
  document.querySelectorAll<HTMLElement>('.pf-section-head h2, .pf-contact h2').forEach((h) => {
    const words = splitWords(h);
    gsap.set(words, { yPercent: 115, opacity: 0 });
    ScrollTrigger.create({ trigger: h, start: 'top 88%', once: true,
      onEnter: () => gsap.to(words, { yPercent: 0, opacity: 1, duration: 0.95, ease: 'expo.out', stagger: 0.05 }) });
  });

  document.querySelectorAll<HTMLElement>('.pf-section-tag, .pf-section-head p').forEach((el) => {
    gsap.set(el, { y: 14, opacity: 0 });
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }) });
  });

  const nowCards = Array.from(document.querySelectorAll<HTMLElement>('.pf-now-card'));
  if (nowCards.length) {
    gsap.set(nowCards, { y: 36, opacity: 0 });
    ScrollTrigger.create({ trigger: '.pf-now-grid', start: 'top 86%', once: true,
      onEnter: () => gsap.to(nowCards, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.1 }) });
  }

  document.querySelectorAll<HTMLElement>('.pf-xp').forEach((el) => {
    gsap.set(el, { y: 28, opacity: 0 });
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out' }) });
  });

  document.querySelectorAll<HTMLElement>('.pf-cs').forEach((el) => {
    gsap.set(el, { y: 40, opacity: 0 });
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.95, ease: 'expo.out' }) });
  });

  const principles = Array.from(document.querySelectorAll<HTMLElement>('.pf-principle'));
  if (principles.length) {
    gsap.set(principles, { y: 28, opacity: 0 });
    ScrollTrigger.create({ trigger: '.pf-principles', start: 'top 86%', once: true,
      onEnter: () => gsap.to(principles, { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out', stagger: 0.1 }) });
  }

  const recogs = Array.from(document.querySelectorAll<HTMLElement>('.pf-recog-item'));
  if (recogs.length) {
    gsap.set(recogs, { y: 24, opacity: 0 });
    ScrollTrigger.create({ trigger: '.pf-recog', start: 'top 88%', once: true,
      onEnter: () => gsap.to(recogs, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.12 }) });
  }

  const projCards = Array.from(document.querySelectorAll<HTMLElement>('.pf-proj-grid .pf-proj'));
  if (projCards.length) {
    gsap.set(projCards, { y: 40, opacity: 0 });
    ScrollTrigger.create({ trigger: '.pf-proj-grid', start: 'top 86%', once: true,
      onEnter: () => gsap.to(projCards, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.1 }) });
  }

  const skillGroups = Array.from(document.querySelectorAll<HTMLElement>('.pf-skill-group'));
  if (skillGroups.length) {
    gsap.set(skillGroups, { y: 24, opacity: 0 });
    ScrollTrigger.create({ trigger: '.pf-skills', start: 'top 86%', once: true,
      onEnter: () => gsap.to(skillGroups, { y: 0, opacity: 1, duration: 0.85, ease: 'expo.out', stagger: 0.12 }) });
  }

  const contactLeft = document.querySelector<HTMLElement>('.pf-contact-grid > div:first-child');
  if (contactLeft) {
    gsap.set(contactLeft, { y: 30, opacity: 0 });
    ScrollTrigger.create({ trigger: contactLeft, start: 'top 88%', once: true,
      onEnter: () => gsap.to(contactLeft, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out' }) });
  }
  const contactRows = Array.from(document.querySelectorAll<HTMLElement>('.pf-contact-row'));
  if (contactRows.length) {
    gsap.set(contactRows, { x: 24, opacity: 0 });
    ScrollTrigger.create({ trigger: '.pf-contact-rows', start: 'top 88%', once: true,
      onEnter: () => gsap.to(contactRows, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1 }) });
  }
}

function setupCounters() {
  document.querySelectorAll<HTMLElement>('[data-pf-counter]').forEach((el) => {
    const target = parseFloat(el.dataset['pfCounter']!);
    const suffix = el.dataset['pfSuffix'] ?? '';
    el.textContent = '0' + suffix;
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true,
      onEnter: () => {
        const obj = { v: 0 };
        gsap.to(obj, { v: target, duration: 2.0, ease: 'expo.out',
          onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; } });
      },
    });
  });
}

function setupCardTilt() {
  if (isTouch()) return;
  document.querySelectorAll<HTMLElement>('.pf-proj, .pf-now-card').forEach((card) => {
    let rect: DOMRect | null = null;
    card.addEventListener('pointerenter', () => { rect = card.getBoundingClientRect(); });
    card.addEventListener('pointermove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      gsap.to(card, { rotateX: (py - 0.5) * -5, rotateY: (px - 0.5) * 6, transformPerspective: 900, duration: 0.45, ease: 'power2.out' });
    });
    card.addEventListener('pointerleave', () => {
      rect = null;
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.85, ease: 'elastic.out(1,0.4)' });
    });
  });
}

function setupWordmark() {
  const wm = document.querySelector<HTMLElement>('.pf-wordmark');
  if (!wm) return;
  gsap.set(wm, { y: 50, opacity: 0 });
  ScrollTrigger.create({ trigger: wm, start: 'top 95%', once: true,
    onEnter: () => gsap.to(wm, { y: 0, opacity: 1, duration: 1.8, ease: 'expo.out' }) });
  gsap.to(wm, { yPercent: -18, ease: 'none',
    scrollTrigger: { trigger: wm, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
}

function setupNav() {
  const nav = document.querySelector<HTMLElement>('.pf-nav');
  if (!nav) return;
  gsap.from(nav, { y: -40, opacity: 0, duration: 1.0, delay: 0.05, ease: 'expo.out' });
  ScrollTrigger.create({ start: 'top -40', end: 'max',
    onUpdate: (self) => nav.classList.toggle('scrolled', self.scroll() > 40) });
}

export function initPortfolioMotion() {
  setupLenis();
  setupCursor();
  setupNav();
  setupHeroEntrance();
  setupReveals();
  setupCounters();
  setupCardTilt();
  setupMagnetic();
  setupWordmark();
  setTimeout(() => ScrollTrigger.refresh(), 300);
}

export function destroyPortfolioMotion() {
  if (lenisRaf !== null) { cancelAnimationFrame(lenisRaf); lenisRaf = null; }
  lenis?.destroy(); lenis = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
  gsap.globalTimeline.clear();
}
