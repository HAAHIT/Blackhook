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
let pageSphere: { setMorphState: (n: number) => void; setProgress: (n: number) => void; destroy: () => void } | null = null;
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
  document.querySelectorAll<HTMLElement>('.pf-proj-card, .pf-wpanel').forEach((card) => {
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

/* Intent picker — a one-off "what brings you here" step shown right after
   the loader curtain lifts. A brief bio orients first-time visitors, then
   their choice jumps straight to the relevant section. Reduced-motion and
   no-element cases skip it instantly, same contract as the preloader. */
function setupIntro(done: () => void) {
  const intro = document.querySelector<HTMLElement>('.pf-intro');
  if (!intro || prefersReduced()) {
    intro?.remove();
    done();
    return;
  }

  lenis?.stop();
  document.body.classList.add('pf-loading');
  gsap.set(intro, { display: 'flex', opacity: 1 });

  const parts = intro.querySelectorAll<HTMLElement>(
    '.pf-intro-orb, .pf-intro-eyebrow, .pf-intro-bio, .pf-intro-question, .pf-intro-options'
  );
  gsap.set(parts, { y: 16, opacity: 0, filter: 'blur(6px)' });
  gsap.to(parts, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: EASE_CINE, stagger: 0.08, delay: 0.1 });
  gsap.set('.pf-intro-orb', { scale: 0.5 });
  gsap.to('.pf-intro-orb', { scale: 1, duration: 1.1, ease: EASE_SPRING, delay: 0.1 });

  let dismissing = false;
  const inner = intro.querySelector<HTMLElement>('.pf-intro-inner');

  const dismiss = (targetSelector: string | null) => {
    if (dismissing) return;
    dismissing = true;

    const tl = gsap.timeline({
      onComplete: () => {
        intro.remove();
        document.body.classList.remove('pf-loading');
        lenis?.start();
        ScrollTrigger.refresh();
        // The hero was held hidden behind the overlay — play it now so the
        // curtain lift IS the title-sequence reveal. If they jumped to a
        // section, the hero still arms itself for when they scroll back up.
        done();
        if (targetSelector) {
          const el = document.querySelector<HTMLElement>(targetSelector);
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY;
            if (lenis) lenis.scrollTo(y, { duration: 1.1 });
            else el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      },
    });
    // Content lifts and blurs away first…
    if (inner) tl.to(inner, { y: -26, opacity: 0, filter: 'blur(8px)', duration: 0.45, ease: 'power2.in' }, 0);
    // …then the whole panel curtains up off the top, a clean scene cut.
    tl.to(intro, { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, 0.18);
  };

  intro.querySelectorAll<HTMLButtonElement>('[data-pf-intro]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset['pfIntro'];
      dismiss(choice === 'work' ? '#work' : choice === 'projects' ? '#projects' : null);
    }, { once: true });
  });

  // Scroll-to-enter: a downward wheel or swipe lifts the curtain straight into
  // the page in its default order (hero → work → …), so the picker never traps
  // someone who just wants to scroll.
  intro.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) dismiss(null);
  }, { passive: true });
  let touchY = 0;
  intro.addEventListener('touchstart', (e) => { touchY = e.touches[0]?.clientY ?? 0; }, { passive: true });
  intro.addEventListener('touchmove', (e) => {
    if (touchY - (e.touches[0]?.clientY ?? 0) > 8) dismiss(null);
  }, { passive: true });

  // Keyboard access: move focus into the dialog so the choices are reachable,
  // and let Escape skip straight through like the "just exploring" path.
  intro.querySelector<HTMLButtonElement>('[data-pf-intro="work"]')?.focus();
  intro.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dismiss(null);
  });
}

/* Hero entrance, split into arm + play so it never flashes. We hide the hero
   the instant the page boots (while the loader/intro still cover it), then
   play the reveal only when the intro curtain lifts. Arming late — at curtain
   lift — let the final hero blink in for a frame before re-animating, which
   read as a double "flash". Returns the play() to hand to the intro. */
function setupHeroEntrance(): () => void {
  if (prefersReduced()) return () => {};

  const eyebrow = document.querySelector<HTMLElement>('.pf-hero .pf-eyebrow');
  const h1 = document.querySelector<HTMLElement>('.pf-hero h1');
  const sub = document.querySelector<HTMLElement>('.pf-hero-sub');
  const ctas = document.querySelector<HTMLElement>('.pf-hero-ctas');
  const facts = document.querySelectorAll<HTMLElement>('.pf-fact');
  const words = h1 ? splitWords(h1) : [];

  // Arm: hide everything now, before the curtain ever lifts.
  if (eyebrow) gsap.set(eyebrow, { y: 14, opacity: 0, scale: 0.9, filter: 'blur(8px)' });
  if (words.length) gsap.set(words, { yPercent: 115, opacity: 0, filter: 'blur(6px)' });
  if (sub) gsap.set(sub, { y: 24, opacity: 0, filter: 'blur(8px)' });
  if (ctas) gsap.set(Array.from(ctas.children), { y: 16, opacity: 0, filter: 'blur(5px)' });
  if (facts.length) gsap.set(facts, { y: 14, opacity: 0, filter: 'blur(5px)' });

  // Play: the staggered cinematic reveal, fired when the intro dismisses.
  return () => {
    const tl = gsap.timeline({ delay: 0.05 });
    if (eyebrow) tl.to(eyebrow, { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: EASE_CINE }, 0);
    if (words.length) tl.to(words, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: EASE_CINE, stagger: 0.06 }, 0.1);
    if (sub) tl.to(sub, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.95, ease: EASE_CINE }, 0.55);
    if (ctas) tl.to(ctas.children, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: EASE_CINE, stagger: 0.1 }, 0.7);
    if (facts.length) tl.to(facts, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: EASE_CINE, stagger: 0.08 }, 0.85);
  };
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
  document.querySelectorAll<HTMLElement>('.pf-proj-card').forEach((card) => {
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

/* One persistent gold particle sphere lives in a fixed stage behind all
   content and morphs as you scroll the site (mira-style): each major section
   sets a discrete morph state, and the sphere eases between forms (calm →
   rippling → turbulent → swollen). Skipped on touch / reduced-motion / no-WebGL. */
function setupSphereStage() {
  const el = document.querySelector<HTMLElement>('.pf-sphere-stage');
  if (!el || isTouch() || prefersReduced()) return;
  import('./portfolio-sphere').then(({ PortfolioSphere }) => {
    try { PortfolioSphere.mount(el); } catch { return; }
    pageSphere = PortfolioSphere;
    setupSphereMorph();
  }).catch(() => { /* WebGL unavailable — page just shows the CSS backdrop */ });
}

/* Map each section to a morph state. As a section's midline crosses the
   viewport center, the sphere is told to morph to that section's form. */
function setupSphereMorph() {
  const stages: Array<[string, number]> = [
    ['#top', 0],          // hero — calm, faint wave
    ['#work', 1],         // selected work — rippling
    ['#projects', 2],     // building — turbulent
    ['#skills', 3],       // skills — swollen scatter
    ['#principles', 3],   // principles — swollen scatter
    ['#recognition', 4],  // recognition — grand
    ['#contact', 4],      // contact — grand finale
  ];
  stages.forEach(([sel, state]) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el, start: 'top center', end: 'bottom center',
      onToggle: (self) => { if (self.isActive) pageSphere?.setMorphState(state); },
    });
  });
}

/* Selected work scrolls horizontally while the section is pinned (desktop);
   on mobile the panels just stack and reveal vertically. */
function setupHorizontalWork() {
  const section = document.querySelector<HTMLElement>('.pf-work');
  const track = document.querySelector<HTMLElement>('.pf-work-track');
  const railFill = document.querySelector<HTMLElement>('.pf-work-rail-fill');
  const dots = gsap.utils.toArray<HTMLElement>('.pf-work-dot');
  if (!section || !track) return;

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
      pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 2, animation: tween,
      onUpdate: (self) => {
        if (railFill) railFill.style.transform = `scaleX(${self.progress})`;
        pageSphere?.setProgress(self.progress);
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

/* Projects — mira's "Who benefits" treatment: pin the stage and cross-fade
   the active card + orbit node as you scrub through the trio. */
function setupProjectsStage() {
  const pin = document.querySelector<HTMLElement>('.pf-proj-pin');
  const cards = gsap.utils.toArray<HTMLElement>('.pf-proj-card');
  const nodes = gsap.utils.toArray<HTMLElement>('.pf-proj-orbit-node');
  if (!pin || !cards.length) return;

  const setActive = (i: number) => {
    cards.forEach((c, idx) => idx === i ? c.setAttribute('data-active', 'true') : c.removeAttribute('data-active'));
    nodes.forEach((n, idx) => idx === i ? n.setAttribute('data-active', 'true') : n.removeAttribute('data-active'));
  };

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const st = ScrollTrigger.create({
      trigger: pin, start: 'top top', end: `+=${cards.length * 60}%`,
      pin: true, scrub: 1, anticipatePin: 1,
      onUpdate: (self) => setActive(Math.min(cards.length - 1, Math.floor(self.progress * cards.length))),
    });
    // Tapping an orbit node scrolls the pinned scrub so that project lands
    // active, instead of the node being a dead decoration.
    const onNode = (i: number) => {
      const y = st.start + ((i + 0.5) / cards.length) * (st.end - st.start);
      if (lenis) lenis.scrollTo(y, { duration: 0.9 });
      else window.scrollTo({ top: y, behavior: 'smooth' });
    };
    nodes.forEach((node, i) => node.addEventListener('click', () => onNode(i)));
    return () => st.kill();
  });
  // Reduced motion: the stage isn't pinned, so just swap the visible card.
  mm.add('(prefers-reduced-motion: reduce)', () => {
    setActive(0);
    const handlers = nodes.map((node, i) => {
      const h = () => setActive(i);
      node.addEventListener('click', h);
      return [node, h] as const;
    });
    return () => handlers.forEach(([n, h]) => n.removeEventListener('click', h));
  });
}

/* Recognition — all three honors sit on one page, rendered statically.
   (No pinned scrub or reveal gating: the panels are always visible.) */
function setupRecogStage() {
  /* intentionally empty — layout is handled in CSS */
}

/* Scene transitions — draw a gold "scene cut" rule across the top edge of
   each major section as it enters, so scrolling reads as cuts between shots
   rather than one continuous scroll. Cheap (one transform per section) and
   safe alongside the pinned sections, since the line lives inside each
   section and only animates on first enter. */
function setupSceneTransitions() {
  if (prefersReduced()) return;
  const sections = gsap.utils.toArray<HTMLElement>(
    '.pf-work, .pf-proj-section, .pf-principles-section, .pf-recog-section, .pf-contact'
  );
  sections.forEach((section) => {
    const cut = document.createElement('span');
    cut.className = 'pf-scene-cut';
    cut.setAttribute('aria-hidden', 'true');
    section.prepend(cut);
    ScrollTrigger.create({
      trigger: section, start: 'top 92%', once: true,
      // Sweep the rule across, then fade it fully out — leaving it on screen
      // would strand a persistent gold bar at the top of pinned sections,
      // which hold their top edge under the nav for the whole pin.
      onEnter: () => gsap.fromTo(cut,
        { scaleX: 0, opacity: 1 },
        { scaleX: 1, duration: 1.1, ease: 'expo.out',
          onComplete: () => gsap.to(cut, { opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.15 }) }),
    });
  });
}

/* Heading drift — the big section headings ride a hair slower than the
   scroll, a parallax depth cue that makes each section feel layered. Kept
   small and desktop-only so headings never ride up under the floating nav. */
function setupHeadingParallax() {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 821px) and (prefers-reduced-motion: no-preference)', () => {
    const tweens = gsap.utils.toArray<HTMLElement>('.pf-section-head').map((head) => {
      // Skip pinned-section heads — they're already choreographed by their
      // own pin timeline, and parallax would fight the pin.
      if (head.closest('.pf-work, .pf-proj-section, .pf-recog-section')) return null;
      return gsap.fromTo(head, { y: 14 }, {
        y: -14, ease: 'none',
        scrollTrigger: { trigger: head.parentElement ?? head, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
    return () => tweens.forEach((t) => t?.scrollTrigger?.kill());
  });
}

function setupNav() {
  const nav = document.querySelector<HTMLElement>('.pf-nav');
  if (!nav) return;
  gsap.from(nav, { y: -40, opacity: 0, duration: 1.0, delay: 0.05, ease: 'expo.out' });
  ScrollTrigger.create({ start: 'top -40', end: 'max',
    onUpdate: (self) => nav.classList.toggle('scrolled', self.scroll() > 40) });

  const links = gsap.utils.toArray<HTMLAnchorElement>('.pf-nav-links a');
  if (!links.length) return;
  links.forEach((link) => {
    const id = link.getAttribute('href');
    const target = id ? document.querySelector<HTMLElement>(id) : null;
    if (!target) return;
    ScrollTrigger.create({
      trigger: target, start: 'top center', end: 'bottom center',
      onToggle: (self) => { if (self.isActive) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current'); },
    });
  });
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
  setupSphereStage();
  setupHorizontalWork();
  setupProjectsStage();
  setupRecogStage();
  setupSceneTransitions();
  setupHeadingParallax();
  setupPreloader(() => {
    // Re-measure against the now-unlocked layout so reveals + pins fire
    // correctly, then explicitly kick any in-view counters and force-reveal
    // anything already scrolled past (deep-link / scroll restoration).
    ScrollTrigger.refresh();
    kickVisibleCounters();
    kickPassedReveals();
    // Arm the hero hidden *now* (it's still behind the loader/intro), then
    // play it only when the intro curtain lifts — so the entrance doubles as
    // the title-sequence reveal with no flash of the final hero beforehand.
    // If the intro is absent (reduced motion / already dismissed), setupIntro
    // fires the play callback immediately.
    const playHero = setupHeroEntrance();
    setupIntro(playHero);
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
  if (pageSphere) { pageSphere.destroy(); pageSphere = null; }
  ScrollTrigger.getAll().forEach((t) => t.kill());
  gsap.globalTimeline.clear();
}
