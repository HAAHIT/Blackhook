/**
 * Tests for the PR-changed code in portfolio-film-motion.ts:
 *   - hasWebGL() probe function (module-private, tested via observable side-effects)
 *   - !hasWebGL() guard added to setupWebGL()
 *   - !hasWebGL() guard added to setupSphereStage()
 *
 * Strategy: heavy deps (gsap, lenis) are statically mocked so the module can be
 * imported in jsdom. We manipulate HTMLCanvasElement.prototype.getContext to
 * exercise the different WebGL-probe paths, then call initPortfolioMotion() and
 * verify it never throws regardless of canvas support.
 *
 * Because hasWebGL() caches its result in a module-level variable, we use
 * vi.resetModules() + dynamic import inside each test to get a fresh module
 * instance with webglOk = null for every test.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Static mocks — vi.mock() calls are hoisted above imports by vitest and
// persist across vi.resetModules() reloads (re-evaluated per reload).
// ---------------------------------------------------------------------------

vi.mock('gsap', () => {
  function noop() {}
  function timeline() {
    const t = { to: noop, add: noop, fromTo: noop, set: noop, kill: noop };
    t.to = function () { return t; };
    t.add = function () { return t; };
    t.fromTo = function () { return t; };
    t.set = function () { return t; };
    return t;
  }
  const stub = {
    registerPlugin: noop,
    set: noop,
    to: noop,
    from: noop,
    fromTo: noop,
    timeline,
    utils: { toArray: function () { return []; } },
    matchMedia: function () { return { add: noop, kill: noop }; },
    globalTimeline: { clear: noop },
  };
  return { gsap: stub, default: stub };
});

vi.mock('gsap/ScrollTrigger', () => {
  function noop() {}
  return {
    ScrollTrigger: {
      create: noop,
      batch: noop,
      getAll: function () { return []; },
      refresh: noop,
      update: noop,
    },
  };
});

vi.mock('gsap/CustomEase', () => ({
  CustomEase: { create: function () {} },
}));

// Lenis is instantiated with `new`, so the mock default export MUST be a
// proper function (not an arrow) or class.
vi.mock('lenis', () => {
  function MockLenis() {}
  MockLenis.prototype.on = function () {};
  MockLenis.prototype.destroy = function () {};
  MockLenis.prototype.stop = function () {};
  MockLenis.prototype.start = function () {};
  MockLenis.prototype.scrollTo = function () {};
  MockLenis.prototype.raf = function () {};
  return { default: MockLenis };
});

// Dynamic imports triggered inside setupWebGL and setupSphereStage
vi.mock('../portfolio-webgl', () => ({
  Backdrop: {
    mount: function () {},
    destroy: function () {},
    setScroll: function () {},
  },
}));

vi.mock('../portfolio-sphere', () => ({
  PortfolioSphere: {
    mount: function () {},
    destroy: function () {},
    setMorphState: function () {},
    setProgress: function () {},
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** jsdom doesn't ship window.matchMedia — install a working stub. */
function installMatchMedia(matchQuery: (q: string) => boolean = () => false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: matchQuery(query),
        media: query,
        onchange: null,
        addListener: function () {},
        removeListener: function () {},
        addEventListener: function () {},
        removeEventListener: function () {},
        dispatchEvent: function () { return false; },
      }) as MediaQueryList,
  });
}

function setViewportWidth(w: number) {
  Object.defineProperty(window, 'innerWidth', {
    value: w,
    configurable: true,
    writable: true,
  });
}

/** Only the WebGL target divs need to be present. */
function setupMinimalDom() {
  document.body.innerHTML = `
    <div class="pf-webgl"></div>
    <div class="pf-sphere-stage"></div>
  `;
}

function teardownDom() {
  document.body.innerHTML = '';
}

/** Configure what canvas.getContext returns for webgl2 / webgl. */
function mockCanvasGetContext(webgl2: unknown, webgl1: unknown = null) {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
    function (type: string) {
      if (type === 'webgl2') return webgl2 as RenderingContext;
      if (type === 'webgl') return webgl1 as RenderingContext;
      return null;
    },
  );
}

// ---------------------------------------------------------------------------
// hasWebGL — probe behaviour
// ---------------------------------------------------------------------------

describe('hasWebGL probe', () => {
  beforeEach(() => {
    vi.resetModules();
    setupMinimalDom();
    setViewportWidth(1200);
    installMatchMedia(); // all queries → false (desktop, motion allowed)
  });

  afterEach(() => {
    vi.restoreAllMocks();
    teardownDom();
  });

  it('does not throw when webgl2 context is available', async () => {
    mockCanvasGetContext({} /* fake webgl2 ctx */);
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });

  it('creates a canvas element to probe WebGL support', async () => {
    mockCanvasGetContext({});
    const createSpy = vi.spyOn(document, 'createElement');
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    initPortfolioMotion();
    expect(createSpy.mock.calls.some(([tag]) => tag === 'canvas')).toBe(true);
  });

  it('does not throw when webgl2 is null but webgl1 fallback is available', async () => {
    mockCanvasGetContext(null, {} /* fake webgl1 ctx */);
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });

  it('does not throw when both contexts return null (WebGL unavailable)', async () => {
    mockCanvasGetContext(null, null);
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });

  it('does not throw when getContext raises an exception', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      function () { throw new Error('WebGL not supported'); },
    );
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });

  it('caches the result — getContext is called only once even after re-init', async () => {
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(function () { return {} as RenderingContext; });

    const { initPortfolioMotion, destroyPortfolioMotion } = await import(
      '../portfolio-film-motion'
    );

    initPortfolioMotion();
    const callsAfterFirst = getContextSpy.mock.calls.length;
    expect(callsAfterFirst).toBeGreaterThan(0);

    destroyPortfolioMotion();
    initPortfolioMotion();

    // Cache hit — no additional canvas probes
    expect(getContextSpy.mock.calls.length).toBe(callsAfterFirst);
  });
});

// ---------------------------------------------------------------------------
// setupWebGL — !hasWebGL() guard
// ---------------------------------------------------------------------------

describe('setupWebGL — !hasWebGL() guard', () => {
  beforeEach(() => {
    vi.resetModules();
    setupMinimalDom();
    setViewportWidth(1200);
    installMatchMedia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    teardownDom();
  });

  it('does not throw when WebGL is unavailable (null contexts)', async () => {
    mockCanvasGetContext(null, null);
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });

  it('does not throw when WebGL probe raises an exception', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      function () { throw new TypeError('Not a function'); },
    );
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });

  it('does not throw when viewport < 760 px (width guard fires first)', async () => {
    mockCanvasGetContext({});
    setViewportWidth(500);
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });

  it('does not throw when prefers-reduced-motion is active', async () => {
    mockCanvasGetContext({});
    installMatchMedia((q) => q.includes('prefers-reduced-motion'));
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });

  it('does not throw when pointer is coarse (touch device)', async () => {
    mockCanvasGetContext({});
    installMatchMedia((q) => q.includes('pointer: coarse'));
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });

  it('does not throw when .pf-webgl element is absent', async () => {
    mockCanvasGetContext({});
    document.querySelector('.pf-webgl')?.remove();
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// setupSphereStage — !hasWebGL() guard
// ---------------------------------------------------------------------------

describe('setupSphereStage — !hasWebGL() guard', () => {
  beforeEach(() => {
    vi.resetModules();
    setupMinimalDom();
    setViewportWidth(1200);
    installMatchMedia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    teardownDom();
  });

  it('does not throw when WebGL is unavailable', async () => {
    mockCanvasGetContext(null, null);
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });

  it('does not throw when .pf-sphere-stage element is absent', async () => {
    document.querySelector('.pf-sphere-stage')?.remove();
    mockCanvasGetContext(null, null);
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });

  it('does not throw when pointer is coarse', async () => {
    mockCanvasGetContext({});
    installMatchMedia((q) => q.includes('pointer: coarse'));
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });

  it('does not throw when prefers-reduced-motion is set', async () => {
    mockCanvasGetContext({});
    installMatchMedia((q) => q.includes('prefers-reduced-motion'));
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });

  it('does not throw when WebGL probe throws (regression — must not bubble)', async () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      function () { throw new Error('GL context lost'); },
    );
    const { initPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => initPortfolioMotion()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// destroyPortfolioMotion
// ---------------------------------------------------------------------------

describe('destroyPortfolioMotion', () => {
  beforeEach(() => {
    vi.resetModules();
    setupMinimalDom();
    setViewportWidth(1200);
    installMatchMedia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    teardownDom();
  });

  it('does not throw when called without a prior initPortfolioMotion', async () => {
    const { destroyPortfolioMotion } = await import('../portfolio-film-motion');
    expect(() => destroyPortfolioMotion()).not.toThrow();
  });

  it('does not throw when called after init with WebGL unavailable', async () => {
    mockCanvasGetContext(null, null);
    const { initPortfolioMotion, destroyPortfolioMotion } = await import(
      '../portfolio-film-motion'
    );
    initPortfolioMotion();
    expect(() => destroyPortfolioMotion()).not.toThrow();
  });

  it('does not throw when called after init with WebGL available', async () => {
    mockCanvasGetContext({});
    const { initPortfolioMotion, destroyPortfolioMotion } = await import(
      '../portfolio-film-motion'
    );
    initPortfolioMotion();
    expect(() => destroyPortfolioMotion()).not.toThrow();
  });
});