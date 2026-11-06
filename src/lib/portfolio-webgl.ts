import {
  DataTexture,
  FloatType,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  RGFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';
import { FrameGovernor } from './frame-governor';

/* Full-screen domain-warped fbm field in charcoal -> gold.
   Cheap: renders to a downscaled buffer that CSS stretches to fill,
   so it stays a soft, premium backdrop without burning fill-rate. */

export const SMOKE_VERT = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/* The hash amplifies rounding differences in its per-axis steps ~4000x, so a
   GPU that rounds them differently (Intel Macs via Metal) gets inconsistent
   lattice values and hard square seams. Those steps depend on one axis at a
   time, so we precompute them exactly (float32, as a conforming GPU would):
   row 0 = (a, a * (a + 45.32)) with a = fract(i * 123.34); row 1 the same with
   456.21. The GPU is left with only additions and one final multiply, which
   match a conforming GPU to within 1/255. noise() fetches each lattice column
   and row once for all four corners, which is cheaper than the original hash.
   Coordinates wrap past +/-LUT_SIZE/2 cells, which is seamless. */
const LUT_SIZE = 4096;

export function buildHashLutData() {
  const f = Math.fround;
  const fract = (x: number) => f(x - Math.floor(x));
  const data = new Float32Array(LUT_SIZE * 2 * 2);
  for (let k = 0; k < LUT_SIZE; k++) {
    const i = k < LUT_SIZE / 2 ? k : k - LUT_SIZE;
    const ax = fract(f(i * f(123.34)));
    const ay = fract(f(i * f(456.21)));
    data[2 * k] = ax;
    data[2 * k + 1] = f(ax * f(ax + f(45.32)));
    data[2 * (LUT_SIZE + k)] = ay;
    data[2 * (LUT_SIZE + k) + 1] = f(ay * f(ay + f(45.32)));
  }
  return data;
}

/* The hero's scroll fade is not in here: it's a black overlay above the canvas
   (.pf-smoke-dim), which multiplies identically but costs no redraw and dims
   the still poster the same way on devices that don't run this shader. */
export const SMOKE_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uPointer;
  uniform highp sampler2D uHashLut;

  float hash(vec2 col, vec2 row) {
    vec2 p = vec2(col.r, row.r);
    p += col.g + row.g;
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    ivec2 c0 = ivec2(i) & ${LUT_SIZE - 1};
    ivec2 c1 = (c0 + 1) & ${LUT_SIZE - 1};
    vec2 x0 = texelFetch(uHashLut, ivec2(c0.x, 0), 0).rg;
    vec2 x1 = texelFetch(uHashLut, ivec2(c1.x, 0), 0).rg;
    vec2 y0 = texelFetch(uHashLut, ivec2(c0.y, 1), 0).rg;
    vec2 y1 = texelFetch(uHashLut, ivec2(c1.y, 1), 0).rg;
    float a = hash(x0, y0);
    float b = hash(x1, y0);
    float c = hash(x0, y1);
    float d = hash(x1, y1);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
    float t = uTime * 0.045;

    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(
      fbm(p + q * 1.6 + vec2(1.7, 9.2) + t * 0.6),
      fbm(p + q * 1.6 + vec2(8.3, 2.8) - t * 0.6)
    );
    float f = fbm(p + r * 1.3);

    vec3 base = vec3(0.090, 0.090, 0.106);
    vec3 amber = vec3(0.40, 0.28, 0.11);
    vec3 gold = vec3(0.84, 0.69, 0.36);

    float fil = smoothstep(0.52, 0.96, f + 0.15 * r.x);
    vec3 col = base;
    col = mix(col, amber, smoothstep(0.28, 0.82, f) * 0.45);
    col = mix(col, gold, fil * 0.55);

    // soft glow that follows the pointer
    vec2 pm = uPointer * vec2(uRes.x / uRes.y, 1.0);
    float g = exp(-dot(p - pm, p - pm) * 1.1);
    col += gold * g * 0.10;

    // vignette keeps the edges (and text area) calm
    float vig = smoothstep(1.5, 0.25, length(p * vec2(0.72, 1.0)));
    col *= mix(0.45, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function createSmokeMaterial(): ShaderMaterial {
  const lut = new DataTexture(buildHashLutData(), LUT_SIZE, 2, RGFormat, FloatType);
  lut.minFilter = NearestFilter;
  lut.magFilter = NearestFilter;
  lut.needsUpdate = true;
  return new ShaderMaterial({
    vertexShader: SMOKE_VERT,
    fragmentShader: SMOKE_FRAG,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uRes: { value: new Vector2(1, 1) },
      uPointer: { value: new Vector2(0, 0) },
      uHashLut: { value: lut },
    },
  });
}

/* public/smoke-poster.* is this field's first frame (time 0, pointer centred),
   so the live canvas fades in over it without a visible change. The poster
   records this fingerprint of what it was rendered from, and a unit test fails
   if the shader or LUT change without re-running scripts/render-smoke-poster.mjs. */
export function smokeFingerprint(): string {
  let h = 0x811c9dc5;
  const mix = (byte: number) => { h ^= byte; h = Math.imul(h, 0x01000193) >>> 0; };
  for (const ch of SMOKE_VERT + SMOKE_FRAG) mix(ch.charCodeAt(0) & 0xff);
  new Uint8Array(buildHashLutData().buffer).forEach(mix);
  return h.toString(16).padStart(8, '0');
}

/* Render budget, in canvas rows. The field is so smooth that ~360 rows stretched
   by the compositor stay within 1/255 of a full-resolution render (measured
   against 1440x900 and 390x844 references), so the buffer is sized by rows, not
   devicePixelRatio: the same picture on every screen at a fraction of the fill
   cost on retina, 5K and phone displays. The governor steps down this ladder on
   devices that can't keep up; 240 rows is still within 2/255. */
const ROW_STEPS = [480, 400, 336, 288, 240];
/* Renders are capped near 60/s. The field drifts <=1/255 per 60Hz frame, so the
   extra renders a 90-144Hz screen would ask for are invisible but double the work. */
const MIN_RENDER_MS = 1000 / 75;
// Matches the CSS cross-fade between the canvas and the poster.
const FADE_MS = 1200;

class BackdropManager {
  private renderer: WebGLRenderer | null = null;
  private scene: Scene | null = null;
  private camera: OrthographicCamera | null = null;
  private material: ShaderMaterial | null = null;
  private raf: number | null = null;
  private container: HTMLElement | null = null;
  private start = 0;
  private lastFrame = 0;
  private lastRender = 0;
  private pointer = new Vector2(0, 0);
  private pointerTarget = new Vector2(0, 0);
  private field = 0;
  private fullFrameNext = true;
  private shown = false;
  private lost = false;
  private governor = new FrameGovernor(ROW_STEPS.length);
  private cssSize = new Vector2();
  private size = new Vector2();
  private fallbackTimer: number | null = null;
  private onResize: (() => void) | null = null;
  private onPointer: ((e: PointerEvent) => void) | null = null;
  private onVis: (() => void) | null = null;
  private onLost: ((e: Event) => void) | null = null;
  private onRestored: (() => void) | null = null;

  mount(el: HTMLElement) {
    // A second mount (e.g. React StrictMode re-running effects) replaces the first.
    if (this.renderer) this.destroy();
    this.container = el;

    // failIfMajorPerformanceCaveat refuses software rendering (GPU blocklisted or
    // hardware acceleration switched off), where this shader would crawl; the
    // caller then keeps the poster.
    const renderer = new WebGLRenderer({
      antialias: false, alpha: false, powerPreference: 'default',
      preserveDrawingBuffer: true, failIfMajorPerformanceCaveat: true,
    });
    renderer.autoClear = false;
    // The shader needs GLSL ES 3.00 (texelFetch, integer ops); throwing keeps the poster.
    if (!renderer.capabilities.isWebGL2) {
      renderer.dispose();
      throw new Error('WebGL2 unavailable');
    }
    renderer.setClearColor(0x17171b, 1);
    el.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = createSmokeMaterial();
    scene.add(new Mesh(new PlaneGeometry(2, 2), material));

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.material = material;
    this.start = performance.now();
    this.governor = new FrameGovernor(ROW_STEPS.length);

    const resize = () => this.applySize();
    this.onResize = resize;
    resize();

    const pointerMove = (e: PointerEvent) => {
      this.pointerTarget.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    this.onPointer = pointerMove;
    window.addEventListener('pointermove', pointerMove, { passive: true });
    window.addEventListener('resize', resize);

    const vis = () => { if (document.hidden) this.stop(); else this.play(); };
    this.onVis = vis;
    document.addEventListener('visibilitychange', vis);

    // Mobile GPUs drop contexts under memory pressure or after a long time in
    // the background. Show the poster meanwhile; three.js rebuilds its state
    // (shaders, the LUT texture) on restore and we fade the canvas back in.
    // A lost context's buffer is already blank, so hide it at once rather than
    // fading a dark canvas out over the poster.
    const canvas = renderer.domElement;
    this.onLost = () => {
      this.lost = true;
      this.stop();
      this.shown = false;
      canvas.style.visibility = 'hidden';
      el.classList.remove('on');
    };
    this.onRestored = () => {
      this.lost = false;
      canvas.style.visibility = '';
      this.applySize(true);
      this.play();
    };
    renderer.domElement.addEventListener('webglcontextlost', this.onLost);
    renderer.domElement.addEventListener('webglcontextrestored', this.onRestored);

    this.play();
  }

  /* Size the drawing buffer from the row budget; the canvas element itself is
     stretched to the container by CSS. Unchanged sizes are skipped, because
     resizing a canvas clears it (mobile toolbars fire resize while scrolling). */
  private applySize(force = false) {
    if (!this.container || !this.renderer || !this.material) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (!w || !h) return;
    const rows = Math.min(ROW_STEPS[this.governor.level]!, Math.round(h * (window.devicePixelRatio || 1)));
    const ratio = rows / h;
    if (!force && this.cssSize.x === w && this.cssSize.y === h && this.renderer.getPixelRatio() === ratio) return;
    this.cssSize.set(w, h);
    this.renderer.setPixelRatio(ratio);
    this.renderer.setSize(w, h, false);
    this.renderer.getDrawingBufferSize(this.material.uniforms['uRes'].value as Vector2);
    this.fullFrameNext = true;
  }

  private tick = (now: number) => {
    if (!this.renderer || !this.scene || !this.camera || !this.material) return;
    this.raf = requestAnimationFrame(this.tick);

    // Every display frame feeds the governor, rendered or not: what matters is
    // whether the page as a whole keeps up.
    if (this.lastFrame) {
      const action = this.governor.sample(now - this.lastFrame);
      if (action === 'step-down') this.applySize(true);
      else if (action === 'fallback') { this.lastFrame = now; this.fallback(); return; }
    }
    this.lastFrame = now;

    const sinceRender = now - this.lastRender;
    if (!this.fullFrameNext && sinceRender < MIN_RENDER_MS) return;
    this.lastRender = now;

    // Ease the glow toward the pointer at the same speed on any refresh rate.
    const ease = 1 - Math.pow(0.95, Math.min(sinceRender, 100) / (1000 / 60));
    this.pointer.lerp(this.pointerTarget, ease);
    const u = this.material.uniforms;
    u['uTime'].value = (now - this.start) / 1000;
    (u['uPointer'].value as Vector2).copy(this.pointer);

    // Redraw alternate halves (2px overlap) each frame: the field changes <=1/255
    // per frame, so a one-frame-old half is invisible and GPU work is halved.
    const r = this.renderer;
    if (this.fullFrameNext) {
      r.setScissorTest(false);
      this.fullFrameNext = false;
    } else {
      const size = r.getSize(this.size);
      const half = Math.floor(size.y / 2);
      r.setScissorTest(true);
      // three floors scissor rects to device pixels, so over-extend past the edges.
      if (this.field === 0) r.setScissor(0, 0, size.x + 4, half + 2);
      else r.setScissor(0, half - 2, size.x + 4, size.y);
      this.field ^= 1;
    }
    r.render(this.scene, this.camera);

    if (!this.shown) {
      this.shown = true;
      const el = this.container;
      // Fade in only once a real frame is on the canvas.
      requestAnimationFrame(() => { if (this.renderer && !this.lost) el?.classList.add('on'); });
    }
  };

  private play() {
    if (this.raf !== null || this.lost || !this.renderer) return;
    // Time jumped while paused, so the undrawn half would be stale, and the
    // first frames back are not representative of steady-state cost.
    this.fullFrameNext = true;
    this.lastFrame = 0;
    this.governor.reset();
    this.raf = requestAnimationFrame(this.tick);
  }
  private stop() { if (this.raf !== null) { cancelAnimationFrame(this.raf); this.raf = null; } }

  /* Even the cheapest level can't keep this page smooth: cross-fade to the
     drifting poster and release the GPU once the canvas has faded out. */
  private fallback() {
    this.stop();
    const el = this.container;
    if (el) {
      el.classList.remove('on');
      el.dataset['smoke'] = 'drift';
    }
    this.fallbackTimer = window.setTimeout(() => this.destroy(), FADE_MS + 100);
  }

  destroy() {
    this.stop();
    if (this.fallbackTimer !== null) { clearTimeout(this.fallbackTimer); this.fallbackTimer = null; }
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.onPointer) window.removeEventListener('pointermove', this.onPointer);
    if (this.onVis) document.removeEventListener('visibilitychange', this.onVis);
    const canvas = this.renderer?.domElement;
    if (canvas && this.onLost) canvas.removeEventListener('webglcontextlost', this.onLost);
    if (canvas && this.onRestored) canvas.removeEventListener('webglcontextrestored', this.onRestored);
    (this.material?.uniforms['uHashLut'].value as DataTexture | undefined)?.dispose();
    this.material?.dispose();
    this.renderer?.dispose();
    canvas?.remove();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.material = null;
    this.container = null;
    this.shown = false;
    this.lost = false;
    this.lastFrame = 0;
    this.cssSize.set(0, 0);
    this.onResize = null;
    this.onPointer = null;
    this.onVis = null;
    this.onLost = null;
    this.onRestored = null;
  }
}

export const Backdrop = new BackdropManager();
