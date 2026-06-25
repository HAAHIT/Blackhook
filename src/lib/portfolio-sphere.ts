import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three';

/* Gold particle sphere — the "Meet MIRA's voice" centerpiece, rebuilt for
   the Selected Work rail. A fibonacci-sphere point cloud, slow ambient spin,
   plus a scroll-driven swell/twist so it reads as the section's anchor. */

const fibonacciSphere = (count: number, radius: number) => {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    positions[i * 3] = x * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = z * radius;
  }
  return positions;
};

class SphereManager {
  private renderer: WebGLRenderer | null = null;
  private scene: Scene | null = null;
  private camera: PerspectiveCamera | null = null;
  private points: Points | null = null;
  private container: HTMLElement | null = null;
  private raf: number | null = null;
  private start = 0;
  private progress = 0;
  private onResize: (() => void) | null = null;
  private onVis: (() => void) | null = null;

  mount(el: HTMLElement) {
    this.container = el;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    el.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.1, 10);
    camera.position.z = 3.4;

    const count = 1400;
    const radius = 1.15;
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(fibonacciSphere(count, radius), 3));

    const gold = new Color('#d4b56a');
    const platinum = new Color('#f4f0e8');
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const mix = gold.clone().lerp(platinum, Math.random() * 0.35);
      colors[i * 3] = mix.r;
      colors[i * 3 + 1] = mix.g;
      colors[i * 3 + 2] = mix.b;
    }
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

    const material = new PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new Points(geometry, material);
    scene.add(points);

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.points = points;
    this.start = performance.now();

    const resize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    };
    this.onResize = resize;
    resize();
    window.addEventListener('resize', resize);

    const vis = () => { if (document.hidden) this.stop(); else this.play(); };
    this.onVis = vis;
    document.addEventListener('visibilitychange', vis);

    this.play();
  }

  private tick = () => {
    if (!this.renderer || !this.scene || !this.camera || !this.points) return;
    this.raf = requestAnimationFrame(this.tick);
    const t = (performance.now() - this.start) / 1000;
    this.points.rotation.y = t * 0.08 + this.progress * Math.PI * 0.9;
    this.points.rotation.x = Math.sin(t * 0.12) * 0.08 + this.progress * 0.25;
    const swell = 1 + Math.sin(this.progress * Math.PI) * 0.1;
    this.points.scale.setScalar(swell);
    this.renderer.render(this.scene, this.camera);
  };

  private play() { if (this.raf === null) this.tick(); }
  private stop() { if (this.raf !== null) { cancelAnimationFrame(this.raf); this.raf = null; } }

  /** 0 → 1 across the pinned horizontal scroll, drives twist + swell. */
  setProgress(n: number) { this.progress = n; }

  destroy() {
    this.stop();
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.onVis) document.removeEventListener('visibilitychange', this.onVis);
    this.points?.geometry.dispose();
    (this.points?.material as PointsMaterial | undefined)?.dispose();
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.points = null;
    this.container = null;
    this.onResize = null;
    this.onVis = null;
  }
}

export const WorkSphere = new SphereManager();
