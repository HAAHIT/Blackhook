import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { HookScene } from './hook3d';

gsap.registerPlugin(ScrollTrigger);

interface CursorState {
  el: HTMLElement | null;
  ring: HTMLElement | null;
  dot: HTMLElement | null;
  label: HTMLElement | null;
  tx: number;
  ty: number;
  rx: number;
  ry: number;
  mode: string;
}

const state = {
  lenis: null as Lenis | null,
  inited: false,
  smooth: true,
  scrollVel: 0,
  cursor: {
    el: null, ring: null, dot: null, label: null,
    tx: 0, ty: 0, rx: 0, ry: 0, mode: 'default',
  } as CursorState,
};

function setupLenis() {
  state.lenis?.destroy();
  state.lenis = null;
  if (!state.smooth) return;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    prevent: (node: Element) => !!node.closest?.('.bh-case-detail-panel'),
  });
  state.lenis = lenis;

  lenis.on('scroll', (e: { scroll: number; velocity: number }) => {
    state.scrollVel = e.velocity;
    ScrollTrigger.update();
  });

  const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}

function setupCursor() {
  const el = document.querySelector<HTMLElement>('.bh-cursor');
  if (!el) return;

  const ring = el.querySelector<HTMLElement>('.bh-cursor-ring');
  const dot = el.querySelector<HTMLElement>('.bh-cursor-dot');
  const label = el.querySelector<HTMLElement>('.bh-cursor-label');
  Object.assign(state.cursor, { el, ring, dot, label });

  let first = true;
  window.addEventListener('pointermove', (e) => {
    if (first) { el.classList.add('on'); state.cursor.rx = e.clientX; state.cursor.ry = e.clientY; first = false; }
    state.cursor.tx = e.clientX;
    state.cursor.ty = e.clientY;
    if (dot) gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.12, ease: 'power3.out', overwrite: 'auto' });
  });
  window.addEventListener('pointerleave', () => el.classList.add('hide'));
  window.addEventListener('pointerenter', () => el.classList.remove('hide'));
  window.addEventListener('pointerdown', () => el.classList.add('press'));
  window.addEventListener('pointerup', () => el.classList.remove('press'));

  const ringTick = () => {
    state.cursor.rx += (state.cursor.tx - state.cursor.rx) * 0.18;
    state.cursor.ry += (state.cursor.ty - state.cursor.ry) * 0.18;
    if (ring) ring.style.transform = `translate3d(${state.cursor.rx}px,${state.cursor.ry}px,0) translate(-50%,-50%)`;
    requestAnimationFrame(ringTick);
  };
  requestAnimationFrame(ringTick);

  const hoverTargets = [
    { sel: 'a, button, [data-cursor="link"]', mode: 'link', label: '' },
    { sel: '[data-cursor="drag"]', mode: 'drag', label: 'Drag' },
    { sel: '[data-cursor="view"]', mode: 'view', label: 'View' },
    { sel: '[data-cursor="read"]', mode: 'read', label: 'Read' },
  ];

  const setMode = (mode: string, labelText: string) => {
    if (state.cursor.mode === mode) return;
    state.cursor.mode = mode;
    el.dataset['mode'] = mode;
    if (label) label.textContent = labelText;
  };

  document.addEventListener('pointerover', (e) => {
    for (let i = hoverTargets.length - 1; i >= 0; i--) {
      const t = hoverTargets[i];
      if ((e.target as Element).closest?.(t.sel)) { setMode(t.mode, t.label); return; }
    }
    setMode('default', '');
  });
}

function setupMagnetic() {
  document.querySelectorAll<HTMLElement>('.magnetic, [data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset['magnetic'] ?? '0.35') || 0.35;
    let rect: DOMRect | null = null;
    el.addEventListener('pointerenter', () => { rect = el.getBoundingClientRect(); });
    el.addEventListener('pointermove', (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - (rect.left + rect.width / 2)) * strength, y: (e.clientY - (rect.top + rect.height / 2)) * strength, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => { rect = null; gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' }); });
  });
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
            const w = document.createElement('span'); w.className = 'bh-word';
            const i = document.createElement('span'); i.className = 'bh-word-i';
            i.textContent = p; w.appendChild(i); parent.appendChild(w); words.push(i);
          }
        });
      } else if (child.nodeType === 1) {
        const c = (child as Element).cloneNode(false) as HTMLElement;
        parent.appendChild(c);
        walk(child, c);
      }
    });
  }
  el.innerHTML = '';
  walk(tmp, el);
  return words;
}

function setupHero() {
  const h1 = document.querySelector<HTMLElement>('.bh-hero h1');
  const eye = document.querySelector<HTMLElement>('.bh-hero-copy .bh-eyebrow');
  const sub = document.querySelector<HTMLElement>('.bh-hero-sub');
  const ctas = document.querySelector<HTMLElement>('.bh-hero-ctas');
  const meta = document.querySelector<HTMLElement>('.bh-hero-meta');
  const stage = document.querySelector<HTMLElement>('.bh-hook-stage');

  const tl = gsap.timeline({ delay: 0.15 });
  if (eye) { gsap.set(eye, { y: 12, opacity: 0 }); tl.to(eye, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0); }
  if (h1) { const w = splitWords(h1); gsap.set(w, { yPercent: 110, opacity: 0 }); tl.to(w, { yPercent: 0, opacity: 1, duration: 1.0, ease: 'expo.out', stagger: 0.06 }, 0.05); }
  if (sub) { gsap.set(sub, { y: 24, opacity: 0 }); tl.to(sub, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.5); }
  if (ctas) { gsap.set(ctas.children, { y: 16, opacity: 0 }); tl.to(ctas.children, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.65); }
  if (meta) { gsap.set(meta.children, { y: 14, opacity: 0 }); tl.to(meta.children, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06 }, 0.8); }
  if (stage) { gsap.set(stage, { opacity: 0, scale: 0.85 }); tl.to(stage, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' }, 0); }
}

function setupHeadings() {
  document.querySelectorAll<HTMLElement>('.bh-section h2, .bh-contact h2').forEach((h) => {
    const words = splitWords(h);
    gsap.set(words, { yPercent: 110, opacity: 0 });
    ScrollTrigger.create({ trigger: h, start: 'top 85%', once: true, onEnter: () => gsap.to(words, { yPercent: 0, opacity: 1, duration: 0.95, ease: 'expo.out', stagger: 0.05 }) });
  });
  document.querySelectorAll<HTMLElement>('.bh-section-tag, .bh-section-head p').forEach((t) => {
    gsap.set(t, { y: 14, opacity: 0 });
    ScrollTrigger.create({ trigger: t, start: 'top 88%', once: true, onEnter: () => gsap.to(t, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }) });
  });
}

function setupBlocks() {
  document.querySelectorAll<HTMLElement>('.bh-service, .bh-case, .bh-step, .bh-member, .bh-contact-side .row, .bh-cta-big').forEach((b) => {
    gsap.set(b, { y: 40, opacity: 0 });
    ScrollTrigger.create({ trigger: b, start: 'top 88%', once: true, onEnter: () => gsap.to(b, { y: 0, opacity: 1, duration: 1.0, ease: 'expo.out' }) });
  });
}

function setupCardHover() {
  document.querySelectorAll<HTMLElement>('.bh-service, .bh-case, .bh-member').forEach((card) => {
    let rect: DOMRect | null = null;
    card.addEventListener('pointerenter', () => { rect = card.getBoundingClientRect(); });
    card.addEventListener('pointermove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      gsap.to(card, { rotateX: (py - 0.5) * -4, rotateY: (px - 0.5) * 4, transformPerspective: 1000, duration: 0.6, ease: 'power2.out' });
    });
    card.addEventListener('pointerleave', () => { rect = null; gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'elastic.out(1,0.5)' }); });
  });
}

function setupMarqueeVelocity() {
  const marq = document.querySelector<HTMLElement>('.bh-marquee');
  if (!marq) return;
  let current = 0;
  const tick = () => {
    current += (state.scrollVel - current) * 0.15;
    marq.style.setProperty('--skew', `${Math.max(-8, Math.min(8, current * 0.4))}deg`);
    requestAnimationFrame(tick);
  };
  tick();
}

function setupHookScroll() {
  const stage = document.querySelector<HTMLElement>('.bh-hook-stage');
  if (!stage) return;
  gsap.to(stage, { yPercent: -16, ease: 'none', scrollTrigger: { trigger: '.bh-hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
  ScrollTrigger.create({ trigger: document.body, start: 'top top', end: 'bottom bottom', onUpdate: (s) => HookScene.setScroll(s.progress) });
}

function setupNav() {
  const nav = document.querySelector<HTMLElement>('.bh-nav');
  if (!nav) return;
  gsap.from(nav, { y: -40, opacity: 0, duration: 1.0, delay: 0.1, ease: 'expo.out' });
  ScrollTrigger.create({ trigger: document.body, start: '80px top', end: '99999px top', onEnter: () => nav.classList.add('scrolled'), onLeaveBack: () => nav.classList.remove('scrolled') });
}

function setupCounters() {
  document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
    const target = parseFloat(el.dataset['counter']!);
    const suffix = el.dataset['suffix'] ?? '';
    gsap.set(el, { textContent: '0' });
    const animate = (delay = 0) => {
      const obj = { v: 0 };
      gsap.to(obj, { v: target, duration: 1.6, delay, ease: 'expo.out', onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; } });
    };
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight) { setTimeout(() => animate(1.0), 300); return; }
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => animate() });
  });
}

function setupWordmark() {
  const wm = document.querySelector<HTMLElement>('.bh-wordmark');
  if (!wm) return;
  gsap.set(wm, { yPercent: 30, opacity: 0 });
  ScrollTrigger.create({ trigger: wm, start: 'top 95%', once: true, onEnter: () => gsap.to(wm, { yPercent: 0, opacity: 1, duration: 1.4, ease: 'expo.out' }) });
}

function setupPageEnter() {
  const overlay = document.createElement('div');
  overlay.className = 'bh-enter';
  overlay.innerHTML = `<div class="bh-enter-mark"><svg width="64" height="64" viewBox="0 0 869 842" fill="none"><path d="M554.461 91.2163C554.461 91.2163 379.822 320.957 329.501 395.473C279.181 469.988 371.062 581.953 487.451 523.031C521.766 505.659 539.699 470.459 592.748 404.647L539.699 392.282L530.927 381.109H635.031C635.031 381.109 589.963 437.626 530.927 511.143C471.892 584.66 358.466 557.889 322.572 514.607C287.523 472.344 284.43 418.879 311.479 375.562L526.935 103.505L487.451 74.0439M487.451 74.0439C470.023 71.3811 452.173 70 434 70C240.148 70 83 227.148 83 421C83 614.852 240.148 772 434 772C627.852 772 785 609.264 785 421C785 245.321 655.935 99.7865 487.451 74.0439" stroke="#f4f0e8" stroke-width="34"/></svg></div>`;
  document.body.appendChild(overlay);
  gsap.to(overlay.querySelector('.bh-enter-mark'), { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' });
  gsap.to(overlay, { yPercent: -100, duration: 1.1, delay: 0.8, ease: 'expo.inOut', onComplete: () => overlay.remove() });
}

let started = false;

export const BHMotion = {
  init() {
    if (started) return;
    started = true;
    state.inited = true;
    setupPageEnter();
    setupLenis();
    setupCursor();
    setupNav();
    setupHero();
    setupHeadings();
    setupBlocks();
    setupCardHover();
    setupMagnetic();
    setupMarqueeVelocity();
    setupHookScroll();
    setupCounters();
    setupWordmark();
    setTimeout(() => ScrollTrigger.refresh(), 400);
    setTimeout(() => {
      gsap.globalTimeline.getChildren(true, true, true).forEach((t) => {
        if (t.progress() < 1 && !t.scrollTrigger) t.progress(1);
      });
    }, 4000);
  },

  setSmooth(smooth: boolean) {
    state.smooth = smooth;
    setupLenis();
  },

  pauseScroll(paused: boolean) {
    if (paused) state.lenis?.stop();
    else state.lenis?.start();
  },
};
