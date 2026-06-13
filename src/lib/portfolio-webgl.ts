import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
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

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uPointer;
  uniform float uScroll;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
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
  private onResize: (() => void) | null = null;
  private onPointer: ((e: PointerEvent) => void) | null = null;
  private onVis: (() => void) | null = null;

  mount(el: HTMLElement) {
    this.container = el;

    const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
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
    this.renderer.render(this.scene, this.camera);
  };

  private play() { if (this.raf === null) this.tick(); }
  private stop() { if (this.raf !== null) { cancelAnimationFrame(this.raf); this.raf = null; } }

  setScroll(n: number) { this.scrollN = n; }

  destroy() {
    this.stop();
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.onPointer) window.removeEventListener('pointermove', this.onPointer);
    if (this.onVis) document.removeEventListener('visibilitychange', this.onVis);
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
