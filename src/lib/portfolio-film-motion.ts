import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, CustomEase);

/* miralabs.ai's motion language, in our dark+gold film:
   it leans on two signature cubic-béziers plus framer-motion springs.
   We recreate the curves verbatim with CustomEase and approximate the
   spring's overshoot with GSAP's back.out. Used everywhere below so the
   whole page shares one cohesive, premium cadence.
     · cine — long soft decelerate for reveals      (.25,.1,.35,1)
     · snap — punchy in/out for transforms          (.4,0,.1,1)
     · spring — the framer overshoot (stiff~300)      back.out(1.6) */
CustomEase.create('pf-cine', '0.25,0.1,0.35,1');
CustomEase.create('pf-snap', '0.4,0,0.1,1');
const EASE_CINE = 'pf-cine';
const EASE_SPRING = 'back.out(1.6)';

/* Reveal bookkeeping. Each registered element gets a guarded play() so it
   reveals at most once, whether fired by its ScrollTrigger or force-kicked
   at load. The kick is what saves content that's already scrolled past on
   load (anchor deep-link, browser scroll restoration) — with `once:true`,
   ScrollTrigger won't fire onEnter for elements above the start line, so
   they'd otherwise stay invisible and blurred forever. */
let reveals: { el: HTMLElement; play: () => void }[] = [];
let revealed: WeakSet<HTMLElement> = new WeakSet();
const START_RATIO = 0.88; // mirrors the 'top 88%' trigger start

function makeReveal(el: HTMLElement, run: () => void) {
  const play = () => { if (revealed.has(el)) return; revealed.add(el); run(); };
  reveals.push({ el, play });
  return play;
}

// Force-reveal anything already at or above the trigger start at load, so
// deep-linked / restored scroll positions never strand hidden content.
function kickPassedReveals() {
  const startLine = window.innerHeight * START_RATIO;
  reveals.forEach(({ el, play }) => {
    if (el.getBoundingClientRect().top < startLine) play();
  });
}

/* The mira reveal "fingerprint": rise + 3D flip + scale + blur clearing
   to sharp. Tunable per call so cards flip harder than paragraphs. */
type LiftOpts = {
  y?: number; rotateX?: number; scale?: number; blur?: number;
  duration?: number; ease?: string; stagger?: number;
  start?: string; perspective?: number;
};
function revealLift(els: HTMLElement[] | HTMLElement | null, opts: LiftOpts = {}) {
  const list = !els ? [] : Array.isArray(els) ? els : [els];
  if (!list.length) return;
  const {
    y = 26, rotateX = 0, scale = 1, blur = 8,
    duration = 1.0, ease = EASE_CINE, stagger = 0,
    start = 'top 88%', perspective = 1100,
  } = opts;
  gsap.set(list, {
    opacity: 0, y, rotateX, scale,
    filter: `blur(${blur}px)`,
    transformPerspective: perspective, transformOrigin: '50% 100%',
  });
  const to = { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)', duration, ease };
  list.forEach((el) => makeReveal(el, () => gsap.to(el, { ...to })));
  ScrollTrigger.batch(list, {
    start,
    onEnter: (batch) => {
      // Animate the group together (keeps the stagger); skip any element a
      // kick already revealed, and mark the rest so a later kick won't repeat.
      const fresh = (batch as HTMLElement[]).filter((el) => !revealed.has(el));
      fresh.forEach((el) => revealed.add(el));
      if (fresh.length) gsap.to(fresh, { ...to, stagger, overwrite: true });
    },
    once: true,
  });
}

let lenis: Lenis | null = null;
let lenisRaf: number | null = null;
let backdrop: { destroy: () => void } | null = null;
let counters: { el: HTMLElement; run: () => void }[] = [];
const isTouch = () => window.matchMedia('(pointer: coarse)').matches;
const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  const label = el.querySelector<HTMLElement>('.pf-cursor-label');
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

  // The ring trails the cursor; in label/disc modes it settles faster so
  // the text feels "attached" rather than lagging behind.
  const tick = () => {
    const ease = el.classList.contains('label') ? 0.22 : 0.14;
    rx += (tx - rx) * ease; ry += (ty - ry) * ease;
    if (ring) ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // Morph the cursor by intent: labelled disc over [data-cursor] elements,
  // a slim gold ring over any other interactive target.
  document.addEventListener('pointerover', (e) => {
    const target = e.target as Element;
    const labeled = target.closest?.('[data-cursor]') as HTMLElement | null;
    if (labeled) {
      if (label) label.textContent = labeled.dataset['cursor'] ?? '';
      el.classList.add('label');
      el.classList.remove('link');
    } else if (target.closest?.('a, button')) {
      el.classList.add('link');
      el.classList.remove('label');
    } else {
      el.classList.remove('link', 'label');
    }
  });
}

/* Gold spotlight that tracks the pointer inside each card surface. */
function setupSpotlight() {
  if (isTouch()) return;
  document.querySelectorAll<HTMLElement>('.pf-proj, .pf-wpanel').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    });
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

/* WebGL hero backdrop — desktop, motion-on, sized-up screens only.
   Everything else keeps the CSS aurora fallback (see .pf-webgl::before). */
function setupWebGL() {
  const el = document.querySelector<HTMLElement>('.pf-webgl');
  if (!el) return;
  if (isTouch() || prefersReduced() || window.innerWidth < 760) return;
  // Lazy-load three.js only on capable desktops, after first paint.
  import('./portfolio-webgl').then(({ Backdrop }) => {
    try {
      Backdrop.mount(el);
    } catch {
      return;
    }
    backdrop = Backdrop;
    requestAnimationFrame(() => el.classList.add('on'));
    ScrollTrigger.create({
      trigger: '.pf-hero', start: 'top top', end: 'bottom top',
      onUpdate: (self) => Backdrop.setScroll(self.progress),
    });
  }).catch(() => { /* WebGL unavailable — CSS aurora fallback stays */ });
}

function setupProgress() {
  const bar = document.querySelector<HTMLElement>('.pf-progress span');
  if (!bar) return;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => { bar.style.transform = `scaleX(${self.progress})`; },
  });
}

/* Intro preloader — counts to 100, then curtains up and hands off to
   the hero entrance. On reduced-motion it's removed instantly. */
function setupPreloader(done: () => void) {
  const loader = document.querySelector<HTMLElement>('.pf-loader');
  if (!loader || prefersReduced()) {
    loader?.remove();
    done();
    return;
  }
  const num = loader.querySelector<HTMLElement>('[data-pf-load]');
  const bar = loader.querySelector<HTMLElement>('.pf-loader-bar span');

  lenis?.stop();
  document.body.classList.add('pf-loading');

  const counter = { v: 0 };
  const tl = gsap.timeline();
  tl.to(counter, {
    v: 100, duration: 1.15, ease: 'power2.inOut',
    onUpdate: () => {
      if (num) num.textContent = String(Math.round(counter.v));
      if (bar) bar.style.transform = `scaleX(${counter.v / 100})`;
    },
  });
  tl.to('.pf-loader-inner', { y: -24, opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.12');
  tl.to(loader, {
    yPercent: -100, duration: 0.95, ease: 'expo.inOut',
    onComplete: () => loader.remove(),
  }, '<0.05');
  tl.add(() => {
    document.body.classList.remove('pf-loading');
    lenis?.start();
    done();
  }, '<0.18');
}

function setupHeroEntrance() {
  const tl = gsap.timeline({ delay: 0.05 });
  const eyebrow = document.querySelector<HTMLElement>('.pf-hero .pf-eyebrow');
  const h1 = document.querySelector<HTMLElement>('.pf-hero h1');
  const sub = document.querySelector<HTMLElement>('.pf-hero-sub');
  const ctas = document.querySelector<HTMLElement>('.pf-hero-ctas');
  const facts = document.querySelectorAll<HTMLElement>('.pf-fact');
  const orb = document.querySelector<HTMLElement>('.pf-orb');

  if (eyebrow) { gsap.set(eyebrow, { y: 14, opacity: 0, scale: 0.9, filter: 'blur(8px)' }); tl.to(eyebrow, { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: EASE_CINE }, 0); }
  if (h1) {
    const words = splitWords(h1);
    gsap.set(words, { yPercent: 115, opacity: 0, filter: 'blur(6px)' });
    tl.to(words, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: EASE_CINE, stagger: 0.06 }, 0.1);
  }
  if (sub) { gsap.set(sub, { y: 24, opacity: 0, filter: 'blur(8px)' }); tl.to(sub, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.95, ease: EASE_CINE }, 0.55); }
  if (ctas) { gsap.set(Array.from(ctas.children), { y: 16, opacity: 0, filter: 'blur(5px)' }); tl.to(ctas.children, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: EASE_CINE, stagger: 0.1 }, 0.7); }
  if (facts.length) { gsap.set(facts, { y: 14, opacity: 0, filter: 'blur(5px)' }); tl.to(facts, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: EASE_CINE, stagger: 0.08 }, 0.85); }
  // Orb materialises first and leads the hero: springs up from a small point
  // so it feels like it powers on. Scale+opacity only — no lingering filter,
  // which would flatten the orb's preserve-3d orbit ring.
  if (orb) { gsap.set(orb, { opacity: 0, scale: 0.35 }); tl.to(orb, { opacity: 1, scale: 1, duration: 1.4, ease: EASE_SPRING }, 0); }
}


function setupReveals() {
  reveals = [];
  revealed = new WeakSet();

  // Big serif headings keep the masked word-rise (our most premium move),
  // now timed on mira's cine curve with a faint blur clearing per word.
  document.querySelectorAll<HTMLElement>('.pf-section-head h2, .pf-work-head h2, .pf-contact h2').forEach((h) => {
    const words = splitWords(h);
    gsap.set(words, { yPercent: 115, opacity: 0, filter: 'blur(5px)' });
    const play = makeReveal(h, () => gsap.to(words, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.0, ease: EASE_CINE, stagger: 0.05 }));
    ScrollTrigger.create({ trigger: h, start: 'top 88%', once: true, onEnter: play });
  });

  // Eyebrows / supporting copy: a soft blur-lift, no flip.
  document.querySelectorAll<HTMLElement>('.pf-section-tag, .pf-section-head p').forEach((el) => {
    revealLift(el, { y: 16, blur: 6, duration: 0.85, start: 'top 90%' });
  });

  // Experience rows — gentle flip so the timeline feels like turning pages.
  document.querySelectorAll<HTMLElement>('.pf-xp').forEach((el) => {
    revealLift(el, { y: 34, rotateX: 12, blur: 8, duration: 1.0 });
  });

  // Card surfaces get the full mira fingerprint: rise + hard 3D flip +
  // scale-up + blur-to-sharp, landing on a spring overshoot.
  revealLift(Array.from(document.querySelectorAll<HTMLElement>('.pf-principle')),
    { y: 44, rotateX: 24, scale: 0.94, blur: 10, duration: 1.05, ease: EASE_SPRING, stagger: 0.1, start: 'top 86%' });

  revealLift(Array.from(document.querySelectorAll<HTMLElement>('.pf-recog-item')),
    { y: 30, rotateX: 16, blur: 8, duration: 0.9, stagger: 0.12 });

  revealLift(Array.from(document.querySelectorAll<HTMLElement>('.pf-proj-grid .pf-proj')),
    { y: 52, rotateX: 26, scale: 0.93, blur: 10, duration: 1.15, ease: EASE_SPRING, stagger: 0.1, start: 'top 86%' });

  revealLift(Array.from(document.querySelectorAll<HTMLElement>('.pf-skill-group')),
    { y: 30, rotateX: 14, blur: 8, duration: 0.95, stagger: 0.12, start: 'top 86%' });

  revealLift(document.querySelector<HTMLElement>('.pf-contact-grid > div:first-child'),
    { y: 38, rotateX: 12, blur: 9, duration: 1.0 });

  const rowsWrap = document.querySelector<HTMLElement>('.pf-contact-rows');
  const contactRows = Array.from(document.querySelectorAll<HTMLElement>('.pf-contact-row'));
  if (rowsWrap && contactRows.length) {
    gsap.set(contactRows, { x: 26, opacity: 0, filter: 'blur(5px)' });
    const play = makeReveal(rowsWrap, () => gsap.to(contactRows, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.75, ease: EASE_CINE, stagger: 0.1 }));
    ScrollTrigger.create({ trigger: rowsWrap, start: 'top 88%', once: true, onEnter: play });
  }
}

function setupCounters() {
  counters = [];
  document.querySelectorAll<HTMLElement>('[data-pf-counter]').forEach((el) => {
    const target = parseFloat(el.dataset['pfCounter']!);
    const suffix = el.dataset['pfSuffix'] ?? '';
    el.textContent = '0' + suffix;
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const obj = { v: 0 };
      gsap.to(obj, { v: target, duration: 2.0, ease: 'expo.out',
        onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; } });
    };
    counters.push({ el, run });
    ScrollTrigger.create({ trigger: el, start: 'top 95%', once: true, onEnter: run });
  });
}

// Fire counters already in view (e.g. hero stats) once scrolling unlocks —
// ScrollTrigger won't reliably onEnter for elements above the start line at load.
function kickVisibleCounters() {
  const vh = window.innerHeight;
  counters.forEach(({ el, run }) => {
    const r = el.getBoundingClientRect();
    if (r.top < vh && r.bottom > 0) run();
  });
}

function setupCardTilt() {
  if (isTouch()) return;
  document.querySelectorAll<HTMLElement>('.pf-proj').forEach((card) => {
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
  gsap.set(wm, { y: 50, opacity: 0, filter: 'blur(16px)' });
  ScrollTrigger.create({ trigger: wm, start: 'top 95%', once: true,
    onEnter: () => gsap.to(wm, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.8, ease: EASE_CINE }) });
  gsap.to(wm, { yPercent: -18, ease: 'none',
    scrollTrigger: { trigger: wm, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
}

/* Hero copy drifts up and dims as you scroll into the film. Copy column
   only — the portrait keeps its own hover transform untouched. */
function setupHeroParallax() {
  if (prefersReduced() || isTouch()) return;
  const copy = document.querySelector<HTMLElement>('.pf-hero-copy');
  if (!copy) return;
  gsap.to(copy, {
    yPercent: -16, opacity: 0.15, ease: 'none',
    scrollTrigger: { trigger: '.pf-hero', start: 'top top', end: 'bottom top', scrub: true },
  });
}

/* Pinned "chapters" stage — each big proof number cross-fades to the next
   as you scroll. Desktop + motion-on only; mobile stacks them (CSS). */
function setupNumbersStage() {
  const section = document.querySelector<HTMLElement>('.pf-numbers');
  if (!section) return;
  const chapters = gsap.utils.toArray<HTMLElement>('.pf-num-chapter');
  if (chapters.length < 2) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 821px) and (prefers-reduced-motion: no-preference)', () => {
    // Each chapter racks-focus out (blur + drift up) as the next racks in —
    // mira's defining scene-to-scene transition, applied to the proof reel.
    gsap.set(chapters, { autoAlpha: 0, yPercent: 18, scale: 0.94, filter: 'blur(14px)' });
    gsap.set(chapters[0]!, { autoAlpha: 1, yPercent: 0, scale: 1, filter: 'blur(0px)' });
    const tl = gsap.timeline({
      defaults: { ease: EASE_CINE },
      scrollTrigger: {
        trigger: section, start: 'top top',
        end: () => '+=' + window.innerHeight * (chapters.length - 1) * 1.05,
        pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true,
      },
    });
    for (let i = 1; i < chapters.length; i++) {
      tl.to(chapters[i - 1]!, { autoAlpha: 0, yPercent: -18, scale: 0.94, filter: 'blur(14px)', duration: 0.5 });
      tl.fromTo(chapters[i]!, { autoAlpha: 0, yPercent: 18, scale: 0.94, filter: 'blur(14px)' },
        { autoAlpha: 1, yPercent: 0, scale: 1, filter: 'blur(0px)', duration: 0.5 }, '<0.12');
    }
  });
}

/* Selected work scrolls horizontally while the section is pinned (desktop);
   on mobile the panels just stack and reveal vertically. */
function setupHorizontalWork() {
  const section = document.querySelector<HTMLElement>('.pf-work');
  const track = document.querySelector<HTMLElement>('.pf-work-track');
  const railFill = document.querySelector<HTMLElement>('.pf-work-rail-fill');
  const sphereEl = document.querySelector<HTMLElement>('.pf-work-sphere');
  const dots = gsap.utils.toArray<HTMLElement>('.pf-work-dot');
  if (!section || !track) return;

  let sphere: { setProgress: (n: number) => void; destroy: () => void } | null = null;
  if (sphereEl && !isTouch() && !prefersReduced() && window.innerWidth >= 760) {
    import('./portfolio-sphere').then(({ WorkSphere }) => {
      try { WorkSphere.mount(sphereEl); } catch { return; }
      sphere = WorkSphere;
    }).catch(() => { /* WebGL unavailable — sphere just stays empty */ });
  }

  const panelCount = Math.max(1, gsap.utils.toArray('.pf-wpanel').length);
  const setActiveDot = (progress: number) => {
    const i = Math.min(panelCount - 1, Math.floor(progress * panelCount));
    dots.forEach((d, idx) => {
      if (idx === i) d.setAttribute('data-active', 'true');
      else d.removeAttribute('data-active');
    });
  };

  const mm = gsap.matchMedia();
  mm.add('(min-width: 821px) and (prefers-reduced-motion: no-preference)', () => {
    const amount = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, { x: () => -amount(), ease: 'none' });
    const st = ScrollTrigger.create({
      trigger: section, start: 'top top', end: () => '+=' + amount(),
      pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true, animation: tween,
      onUpdate: (self) => {
        if (railFill) railFill.style.transform = `scaleX(${self.progress})`;
        sphere?.setProgress(self.progress);
        setActiveDot(self.progress);
      },
    });

    // Reveal each panel's content as it scrolls into view *horizontally*
    // (containerAnimation ties the trigger to the track tween), and float the
    // giant index number on its own depth plane for a parallax layer.
    const cleanups: Array<() => void> = [];
    gsap.utils.toArray<HTMLElement>('.pf-wpanel').forEach((panel, i) => {
      const body = panel.querySelector<HTMLElement>('.pf-wpanel-body');
      const num = panel.querySelector<HTMLElement>('.pf-wpanel-num');
      // Panel 1 is already on screen when the pin engages — reveal it with the
      // hero entrance rather than a containerAnimation trigger (which can miss
      // at progress 0). Panels 2+ flip in as they scroll across.
      if (body && i === 0) {
        gsap.fromTo(body, { opacity: 0, y: 40, rotateX: 14, filter: 'blur(12px)', transformPerspective: 1200, transformOrigin: '50% 100%' },
          { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 1.0, ease: EASE_CINE, delay: 0.15 });
      } else if (body) {
        gsap.set(body, { opacity: 0, y: 40, rotateX: 18, filter: 'blur(12px)', transformPerspective: 1200, transformOrigin: '50% 100%' });
        const t = ScrollTrigger.create({
          trigger: panel, containerAnimation: tween, start: 'left 78%', once: true,
          onEnter: () => gsap.to(body, { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', duration: 1.0, ease: EASE_CINE }),
        });
        cleanups.push(() => t.kill());
      }
      if (num) {
        const t = gsap.fromTo(num, { xPercent: 14 }, {
          xPercent: -14, ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        });
        cleanups.push(() => t.scrollTrigger?.kill());
      }
    });

    return () => { cleanups.forEach((c) => c()); st.kill(); tween.kill(); };
  });

  mm.add('(max-width: 820px)', () => {
    const panels = gsap.utils.toArray<HTMLElement>('.pf-wpanel');
    panels.forEach((p) => {
      gsap.set(p, { y: 36, opacity: 0 });
      ScrollTrigger.create({ trigger: p, start: 'top 86%', once: true,
        onEnter: () => gsap.to(p, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }) });
    });
  });
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
  setupWebGL();
  setupProgress();
  setupReveals();
  setupCounters();
  setupCardTilt();
  setupSpotlight();
  setupMagnetic();
  setupWordmark();
  setupHeroParallax();
  setupNumbersStage();
  setupHorizontalWork();
  setupPreloader(() => {
    // Re-measure against the now-unlocked layout so reveals + pins fire
    // correctly, then explicitly kick any in-view counters and force-reveal
    // anything already scrolled past (deep-link / scroll restoration).
    ScrollTrigger.refresh();
    kickVisibleCounters();
    kickPassedReveals();
    setupHeroEntrance();
  });

  // Pinned/horizontal sections depend on final layout — re-measure once
  // images and webfonts have settled.
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

export function destroyPortfolioMotion() {
  if (lenisRaf !== null) { cancelAnimationFrame(lenisRaf); lenisRaf = null; }
  lenis?.destroy(); lenis = null;
  if (backdrop) { backdrop.destroy(); backdrop = null; }
  ScrollTrigger.getAll().forEach((t) => t.kill());
  gsap.globalTimeline.clear();
}
