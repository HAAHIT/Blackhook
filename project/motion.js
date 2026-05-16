/* BlackHook motion layer — GSAP + Lenis. Loaded after React renders.
   Exposes window.BHMotion = { init, setEnabled, setSmooth }.
*/
(function () {
  'use strict';

  const state = {
    lenis: null,
    inited: false,
    cursor: { el: null, ring: null, dot: null, label: null, x: 0, y: 0, tx: 0, ty: 0, rx: 0, ry: 0, hidden: false, mode: 'default' },
    scrollY: 0,
    scrollVel: 0,
    lastScroll: 0,
    smooth: true,
    enabled: true,
    magneticEls: [],
    hookTilt: 0,
  };

  /* ============== Smooth scroll (Lenis) ============== */
  function setupLenis() {
    if (!window.Lenis) return;
    if (state.lenis) { state.lenis.destroy(); state.lenis = null; }
    if (!state.smooth) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    state.lenis = lenis;
    lenis.on('scroll', (e) => {
      state.scrollY = e.scroll;
      state.scrollVel = e.velocity;
      if (window.ScrollTrigger) ScrollTrigger.update();
    });
    function raf(t) {
      lenis.raf(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ============== Custom cursor ============== */
  function setupCursor() {
    const el = document.querySelector('.bh-cursor');
    if (!el) return;
    const ring = el.querySelector('.bh-cursor-ring');
    const dot = el.querySelector('.bh-cursor-dot');
    const label = el.querySelector('.bh-cursor-label');
    state.cursor.el = el;
    state.cursor.ring = ring;
    state.cursor.dot = dot;
    state.cursor.label = label;
    // wait for first pointermove before showing — avoids the cursor flashing at (0,0)
    let first = true;
    window.addEventListener('pointermove', (e) => {
      if (first) {
        el.classList.add('on');
        // jump ring to cursor on first move
        state.cursor.rx = e.clientX;
        state.cursor.ry = e.clientY;
        first = false;
      }
      state.cursor.tx = e.clientX;
      state.cursor.ty = e.clientY;
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.12, ease: 'power3.out', overwrite: 'auto' });
    });
    window.addEventListener('pointerleave', () => el.classList.add('hide'));
    window.addEventListener('pointerenter', () => el.classList.remove('hide'));
    window.addEventListener('pointerdown', () => el.classList.add('press'));
    window.addEventListener('pointerup', () => el.classList.remove('press'));

    // smooth ring follow
    const ringTick = () => {
      state.cursor.rx += (state.cursor.tx - state.cursor.rx) * 0.18;
      state.cursor.ry += (state.cursor.ty - state.cursor.ry) * 0.18;
      ring.style.transform = `translate3d(${state.cursor.rx}px, ${state.cursor.ry}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(ringTick);
    };
    requestAnimationFrame(ringTick);

    // hover targets — selectors that change cursor mode
    const hoverTargets = [
      { sel: 'a, button, [data-cursor="link"]', mode: 'link' },
      { sel: '[data-cursor="drag"]', mode: 'drag', label: 'Drag' },
      { sel: '[data-cursor="view"]', mode: 'view', label: 'View' },
      { sel: '[data-cursor="read"]', mode: 'read', label: 'Read' },
    ];

    function setMode(mode, labelText) {
      if (state.cursor.mode === mode && (label.textContent === (labelText || ''))) return;
      state.cursor.mode = mode;
      el.dataset.mode = mode;
      label.textContent = labelText || '';
    }

    document.addEventListener('pointerover', (e) => {
      // iterate in priority order — first match wins (most specific last actually)
      for (let i = hoverTargets.length - 1; i >= 0; i--) {
        const t = hoverTargets[i];
        if (e.target.closest && e.target.closest(t.sel)) {
          setMode(t.mode, t.label || '');
          return;
        }
      }
      setMode('default', '');
    });
  }

  /* ============== Magnetic effect ============== */
  function setupMagnetic() {
    const els = document.querySelectorAll('.magnetic, [data-magnetic]');
    els.forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.35;
      let rect = null;
      const enter = () => { rect = el.getBoundingClientRect(); };
      const move = (e) => {
        if (!rect) rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.5, ease: 'power3.out' });
      };
      const leave = () => {
        rect = null;
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      };
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      state.magneticEls.push({ el, leave });
    });
  }

  /* ============== Text splitting (word + char) ============== */
  function splitWords(el) {
    if (!el || el.dataset.split === '1') return [];
    el.dataset.split = '1';
    const html = el.innerHTML;
    // Build with two-level mask: line-mask + word-inner
    // We split on whitespace but preserve inline tags (em, span) as wholes.
    const tmp = document.createElement('div');
    tmp.innerHTML = html;

    const words = [];
    function walk(node, parentEl) {
      node.childNodes.forEach((child) => {
        if (child.nodeType === 3) {
          // text node — split into words
          const txt = child.textContent;
          const parts = txt.split(/(\s+)/);
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) {
              parentEl.appendChild(document.createTextNode(' '));
            } else {
              const wrap = document.createElement('span');
              wrap.className = 'bh-word';
              const inner = document.createElement('span');
              inner.className = 'bh-word-i';
              inner.textContent = p;
              wrap.appendChild(inner);
              parentEl.appendChild(wrap);
              words.push(inner);
            }
          });
        } else if (child.nodeType === 1) {
          // element — clone styles, recurse
          const clone = child.cloneNode(false);
          parentEl.appendChild(clone);
          walk(child, clone);
        }
      });
    }
    el.innerHTML = '';
    walk(tmp, el);
    return words;
  }

  /* ============== Hero entrance ============== */
  function setupHero() {
    const h1 = document.querySelector('.bh-hero h1');
    const eye = document.querySelector('.bh-hero-copy .bh-eyebrow');
    const sub = document.querySelector('.bh-hero-sub');
    const ctas = document.querySelector('.bh-hero-ctas');
    const meta = document.querySelector('.bh-hero-meta');
    const stage = document.querySelector('.bh-hook-stage');

    const tl = gsap.timeline({ delay: 0.15 });

    if (eye) {
      gsap.set(eye, { y: 12, opacity: 0 });
      tl.to(eye, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0);
    }

    if (h1) {
      const words = splitWords(h1);
      gsap.set(words, { yPercent: 110, opacity: 0 });
      tl.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'expo.out',
        stagger: 0.06,
      }, 0.05);
    }

    if (sub) {
      gsap.set(sub, { y: 24, opacity: 0 });
      tl.to(sub, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.5);
    }
    if (ctas) {
      gsap.set(ctas.children, { y: 16, opacity: 0 });
      tl.to(ctas.children, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.65);
    }
    if (meta) {
      gsap.set(meta.children, { y: 14, opacity: 0 });
      tl.to(meta.children, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06 }, 0.8);
    }
    if (stage) {
      gsap.set(stage, { opacity: 0, scale: 0.85 });
      tl.to(stage, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' }, 0);
    }
  }

  /* ============== Section heading reveals ============== */
  function setupHeadings() {
    const heads = document.querySelectorAll('.bh-section h2, .bh-contact h2');
    heads.forEach((h) => {
      const words = splitWords(h);
      gsap.set(words, { yPercent: 110, opacity: 0 });
      ScrollTrigger.create({
        trigger: h,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(words, {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'expo.out',
            stagger: 0.05,
          });
        },
      });
    });

    // tag + sibling para reveals
    const tags = document.querySelectorAll('.bh-section-tag, .bh-section-head p');
    tags.forEach((t) => {
      gsap.set(t, { y: 14, opacity: 0 });
      ScrollTrigger.create({
        trigger: t,
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to(t, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }),
      });
    });
  }

  /* ============== Block / card reveals ============== */
  function setupBlocks() {
    const blocks = document.querySelectorAll(
      '.bh-service, .bh-case, .bh-step, .bh-member, .bh-contact-side .row, .bh-cta-big'
    );
    blocks.forEach((b) => {
      gsap.set(b, { y: 40, opacity: 0 });
      ScrollTrigger.create({
        trigger: b,
        start: 'top 88%',
        once: true,
        onEnter: () => gsap.to(b, { y: 0, opacity: 1, duration: 1.0, ease: 'expo.out' }),
      });
    });
  }

  /* ============== Card hover (tilt + accent) ============== */
  function setupCardHover() {
    const cards = document.querySelectorAll('.bh-service, .bh-case, .bh-member');
    cards.forEach((card) => {
      let rect = null;
      const onEnter = () => { rect = card.getBoundingClientRect(); };
      const onMove = (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (py - 0.5) * -4;
        const ry = (px - 0.5) * 4;
        gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 1000, duration: 0.6, ease: 'power2.out' });
      };
      const onLeave = () => {
        rect = null;
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
      };
      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
    });
  }

  /* ============== Marquee skew on scroll velocity ============== */
  function setupMarqueeVelocity() {
    const marq = document.querySelector('.bh-marquee');
    if (!marq) return;
    let target = 0;
    let current = 0;
    function tick() {
      target = state.scrollVel || 0;
      current += (target - current) * 0.15;
      const skew = Math.max(-8, Math.min(8, current * 0.4));
      marq.style.setProperty('--skew', `${skew}deg`);
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ============== Hook 3D reacts to scroll ============== */
  function setupHookScroll() {
    const stage = document.querySelector('.bh-hook-stage');
    if (!stage) return;
    // Parallax the stage as we scroll past hero
    gsap.to(stage, {
      yPercent: -16,
      ease: 'none',
      scrollTrigger: {
        trigger: '.bh-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
    // Drive an extra Y rotation on the 3D hook proportional to page scroll progress.
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (s) => {
        if (window.HookScene && window.HookScene.setScroll) {
          window.HookScene.setScroll(s.progress);
        }
      },
    });
  }

  /* ============== Nav link underline draw — pure CSS already, but add stagger to nav-cta ============== */
  function setupNav() {
    const nav = document.querySelector('.bh-nav');
    if (!nav) return;
    gsap.from(nav, { y: -40, opacity: 0, duration: 1.0, delay: 0.1, ease: 'expo.out' });
    // nav becomes compact on scroll
    ScrollTrigger.create({
      trigger: document.body,
      start: 80,
      end: 99999,
      onEnter: () => nav.classList.add('scrolled'),
      onLeaveBack: () => nav.classList.remove('scrolled'),
    });
  }

  /* ============== Number counter ============== */
  function setupCounters() {
    const els = document.querySelectorAll('[data-counter]');
    els.forEach((el) => {
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      gsap.set(el, { textContent: '0' });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: 'expo.out',
            onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
          });
        },
      });
      // If element is already in view at boot, trigger immediately
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        setTimeout(() => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            delay: 1.0,
            ease: 'expo.out',
            onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
          });
        }, 300);
      }
    });
  }

  /* ============== Wordmark scroll reveal ============== */
  function setupWordmark() {
    const wm = document.querySelector('.bh-wordmark');
    if (!wm) return;
    gsap.set(wm, { yPercent: 30, opacity: 0 });
    ScrollTrigger.create({
      trigger: wm,
      start: 'top 95%',
      once: true,
      onEnter: () => gsap.to(wm, { yPercent: 0, opacity: 1, duration: 1.4, ease: 'expo.out' }),
    });
  }

  function setupPageEnter() {
    const overlay = document.createElement('div');
    overlay.className = 'bh-enter';
    overlay.innerHTML = `<div class="bh-enter-mark"><svg width="64" height="64" viewBox="0 0 869 842" fill="none">
      <path d="M554.461 91.2163C554.461 91.2163 379.822 320.957 329.501 395.473C279.181 469.988 371.062 581.953 487.451 523.031C521.766 505.659 539.699 470.459 592.748 404.647L539.699 392.282L530.927 381.109H635.031C635.031 381.109 589.963 437.626 530.927 511.143C471.892 584.66 358.466 557.889 322.572 514.607C287.523 472.344 284.43 418.879 311.479 375.562L526.935 103.505L487.451 74.0439M487.451 74.0439C470.023 71.3811 452.173 70 434 70C240.148 70 83 227.148 83 421C83 614.852 240.148 772 434 772C627.852 772 785 609.264 785 421C785 245.321 655.935 99.7865 487.451 74.0439" stroke="#f4f0e8" stroke-width="34"/>
    </svg></div>`;
    document.body.appendChild(overlay);
    gsap.to(overlay.querySelector('.bh-enter-mark'), { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' });
    gsap.to(overlay, {
      yPercent: -100,
      duration: 1.1,
      delay: 0.8,
      ease: 'expo.inOut',
      onComplete: () => overlay.remove(),
    });
  }

  /* ============== init ============== */
  let started = false;
  function init() {
    if (started) return;
    if (!window.gsap || !window.ScrollTrigger) { setTimeout(init, 60); return; }
    started = true;
    state.inited = true;
    gsap.registerPlugin(ScrollTrigger);

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

    // refresh once everything settles
    setTimeout(() => ScrollTrigger.refresh(), 400);

    // Safety net: if the page was hidden during boot (e.g. preview iframe,
    // background tab) GSAP timelines may not advance. Force any tween that
    // hasn't progressed by 4s to its final state so content is never stuck.
    setTimeout(() => {
      gsap.globalTimeline.getChildren(true, true, true).forEach((tween) => {
        if (tween.progress() < 1 && !tween.scrollTrigger) {
          tween.progress(1);
        }
      });
    }, 4000);
  }

  function setSmooth(s) {
    state.smooth = !!s;
    setupLenis();
  }
  function pauseScroll(paused) {
    if (state.lenis) {
      if (paused) state.lenis.stop();
      else state.lenis.start();
    }
  }
  function setEnabled(e) {
    state.enabled = !!e;
    document.body.classList.toggle('bh-no-cursor', !e);
  }

  window.BHMotion = { init, setSmooth, setEnabled, pauseScroll };

  // Auto-init after React mounts. App.jsx will also call init explicitly.
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(init, 200);
  });
  if (document.readyState !== 'loading') setTimeout(init, 200);
})();
