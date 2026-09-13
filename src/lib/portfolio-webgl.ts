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

/* Full-screen domain-warped fbm field in charcoal -> gold.
   Cheap: renders to a downscaled buffer that CSS stretches to fill,
   so it stays a soft, premium backdrop without burning fill-rate. */

const VERT = /* glsl */ `
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

function buildHashLut(): DataTexture {
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
  const tex = new DataTexture(data, LUT_SIZE, 2, RGFormat, FloatType);
  tex.minFilter = NearestFilter;
  tex.magFilter = NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uPointer;
  uniform float uScroll;
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

    // fade the field out as the hero scrolls away
    col *= 1.0 - uScroll * 0.55;

    gl_FragColor = vec4(col, 1.0);
  }
`;

class BackdropManager {
  private renderer: WebGLRenderer | null = null;
  private scene: Scene | null = null;
  private camera: OrthographicCamera | null = null;
  private material: ShaderMaterial | null = null;
  private raf: number | null = null;
  private container: HTMLElement | null = null;
  private start = 0;
  private renderScale = 0.6;
  private pointer = new Vector2(0, 0);
  private pointerTarget = new Vector2(0, 0);
  private scrollN = 0;
  private field = 0;
  private fullFrameNext = true;
  private size = new Vector2();
  private onResize: (() => void) | null = null;
  private onPointer: ((e: PointerEvent) => void) | null = null;
  private onVis: (() => void) | null = null;

  mount(el: HTMLElement) {
    this.container = el;

    const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: true });
    renderer.autoClear = false;
    // The shader needs GLSL ES 3.00 (texelFetch, integer ops); throwing keeps the CSS aurora fallback.
    if (!renderer.capabilities.isWebGL2) {
      renderer.dispose();
      throw new Error('WebGL2 unavailable');
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5) * this.renderScale);
    renderer.setClearColor(0x17171b, 1);
    el.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: new Vector2(1, 1) },
        uPointer: { value: new Vector2(0, 0) },
        uScroll: { value: 0 },
        uHashLut: { value: buildHashLut() },
      },
    });
    scene.add(new Mesh(new PlaneGeometry(2, 2), material));

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.material = material;
    this.start = performance.now();

    const resize = () => {
      if (!this.container || !this.renderer || !this.material) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.renderer.setSize(w, h, false);
      this.fullFrameNext = true;
      const dpr = this.renderer.getPixelRatio();
      (this.material.uniforms['uRes'].value as Vector2).set(w * dpr, h * dpr);
    };
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

    this.play();
  }

  private tick = () => {
    if (!this.renderer || !this.scene || !this.camera || !this.material) return;
    this.raf = requestAnimationFrame(this.tick);
    const time = (performance.now() - this.start) / 1000;
    this.pointer.lerp(this.pointerTarget, 0.05);
    const u = this.material.uniforms;
    u['uTime'].value = time;
    (u['uPointer'].value as Vector2).copy(this.pointer);
    u['uScroll'].value = this.scrollN;
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
  };

  private play() { if (this.raf === null) this.tick(); }
  private stop() { if (this.raf !== null) { cancelAnimationFrame(this.raf); this.raf = null; } }

  setScroll(n: number) { this.scrollN = n; }

  destroy() {
    this.stop();
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.onPointer) window.removeEventListener('pointermove', this.onPointer);
    if (this.onVis) document.removeEventListener('visibilitychange', this.onVis);
    (this.material?.uniforms['uHashLut'].value as DataTexture | undefined)?.dispose();
    this.material?.dispose();
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.material = null;
    this.container = null;
    this.onResize = null;
    this.onPointer = null;
    this.onVis = null;
  }
}

export const Backdrop = new BackdropManager();
