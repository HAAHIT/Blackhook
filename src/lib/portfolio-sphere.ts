import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three';

/* Gold particle sphere — the page-long centerpiece, in the spirit of
   miralabs.ai's morphing sphere. A fibonacci point cloud that holds a "morph
   state" (0..4); each state eases — with damping — toward a target amount of
   wave (radial ripple), turbulence (per-particle scatter) and swell, so the
   sphere fluidly changes shape as you move through the site. Two faint
   wireframe icosa shells sit behind the points as a structural scaffold. */

const fibonacciSphere = (count: number, radius: number) => {
  const base = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    // Tiny radial jitter keeps the cloud from looking like a perfect lattice.
    const rad = radius + (Math.random() - 0.5) * 0.12;
    base[i * 3] = Math.cos(theta) * r * rad;
    base[i * 3 + 1] = y * rad;
    base[i * 3 + 2] = Math.sin(theta) * r * rad;
    phase[i] = Math.random() * Math.PI * 2;
  }
  return { base, phase };
};

/* Per-state targets — mirrors mira's discrete-state approach: a section sets
   the state, and these are the wave / turbulence / scale the sphere damps to. */
const stateTargets = (s: number) => ({
  wave: s === 1 ? 1 : s === 4 ? 0.5 : s === 0 ? 0.25 : 0,
  turb: s === 2 ? 1 : s === 3 ? 0.5 : s === 4 ? 0.2 : 0,
  scale: s === 3 ? 1.5 : s === 2 ? 1.2 : s === 4 ? 1.8 : 1,
});

class SphereManager {
  private renderer: WebGLRenderer | null = null;
  private scene: Scene | null = null;
  private camera: PerspectiveCamera | null = null;
  private points: Points | null = null;
  private shells: Mesh[] = [];
  private container: HTMLElement | null = null;
  private raf: number | null = null;
  private start = 0;
  private progress = 0;
  private state = 0;
  // Damped morph values, eased toward the active state's targets each frame.
  private wave = 0.25;
  private turb = 0;
  private scale = 1;
  // Damped pointer parallax.
  private mx = 0;
  private my = 0;
  private px = 0;
  private py = 0;
  private count = 0;
  private onResize: (() => void) | null = null;
  private onVis: (() => void) | null = null;
  private onMove: ((e: MouseEvent) => void) | null = null;

  mount(el: HTMLElement) {
    this.container = el;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    el.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.1, 10);
    camera.position.z = 3.4;

    const count = window.innerWidth < 768 ? 1200 : 2400;
    const radius = 1.15;
    this.count = count;

    const { base, phase } = fibonacciSphere(count, radius);
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(base.slice(), 3));
    geometry.setAttribute('basePosition', new Float32BufferAttribute(base, 3));
    geometry.setAttribute('phase', new Float32BufferAttribute(phase, 1));

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

    // Faint wireframe icosa shells — a structural scaffold behind the dust.
    const shellDefs: Array<[number, number, number]> = [
      [radius * 0.42, 3, 0.06],
      [radius * 1.06, 2, 0.04],
    ];
    const shells = shellDefs.map(([r, detail, opacity]) => {
      const mesh = new Mesh(
        new IcosahedronGeometry(r, detail),
        new MeshBasicMaterial({ color: gold, wireframe: true, transparent: true, opacity, blending: AdditiveBlending, depthWrite: false }),
      );
      scene.add(mesh);
      return mesh;
    });

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.points = points;
    this.shells = shells;
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

    const move = (e: MouseEvent) => {
      this.mx = (e.clientX / window.innerWidth) * 2 - 1;
      this.my = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    this.onMove = move;
    window.addEventListener('mousemove', move);

    const vis = () => { if (document.hidden) this.stop(); else this.play(); };
    this.onVis = vis;
    document.addEventListener('visibilitychange', vis);

    this.play();
  }

  private tick = () => {
    if (!this.renderer || !this.scene || !this.camera || !this.points) return;
    this.raf = requestAnimationFrame(this.tick);
    const t = (performance.now() - this.start) / 1000;

    // Ease the morph controls toward the active state's targets (damped).
    const target = stateTargets(this.state);
    this.wave += (target.wave - this.wave) * 0.05;
    this.turb += (target.turb - this.turb) * 0.05;
    this.scale += (target.scale - this.scale) * 0.05;
    // Damp pointer parallax.
    this.px += (this.mx - this.px) * 0.04;
    this.py += (this.my - this.py) * 0.04;

    const geom = this.points.geometry;
    const pos = geom.attributes.position.array as Float32Array;
    const base = geom.attributes.basePosition.array as Float32Array;
    const phase = geom.attributes.phase.array as Float32Array;
    const breathe = 1 + Math.sin(t * 1.5) * 0.03;
    const swell = this.scale * breathe;

    for (let i = 0; i < this.count; i++) {
      const bx = base[i * 3]!;
      const by = base[i * 3 + 1]!;
      const bz = base[i * 3 + 2]!;
      const ph = phase[i]!;

      let along = 0;
      if (this.wave > 0.01) along = Math.sin(by * 5 + t * 3) * 0.13 * this.wave;

      let ox = 0, oy = 0, oz = 0;
      if (this.turb > 0.01) {
        ox = Math.sin(ph + t * 2) * 0.2 * this.turb;
        oy = Math.cos(ph + t * 2.2) * 0.2 * this.turb;
        oz = Math.sin(ph + t * 1.8) * 0.2 * this.turb;
      }

      const len = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
      pos[i * 3] = bx * swell + (bx / len) * along + ox;
      pos[i * 3 + 1] = by * swell + (by / len) * along + oy;
      pos[i * 3 + 2] = bz * swell + (bz / len) * along + oz;
    }
    geom.attributes.position.needsUpdate = true;

    // Ambient spin + scroll twist + pointer parallax.
    const ry = t * 0.05 + this.progress * Math.PI * 0.9 + this.px * 0.5;
    const rx = Math.sin(t * 0.12) * 0.06 + this.progress * 0.2 - this.py * 0.4;
    this.points.rotation.set(rx, ry, 0);
    this.points.scale.setScalar(1);
    this.shells.forEach((s) => { s.rotation.set(rx, ry, 0); s.scale.setScalar(swell); });

    this.renderer.render(this.scene, this.camera);
  };

  private play() { if (this.raf === null) this.tick(); }
  private stop() { if (this.raf !== null) { cancelAnimationFrame(this.raf); this.raf = null; } }

  /** Discrete morph state (0..4) — each section sets one as it scrolls in. */
  setMorphState(n: number) { this.state = n; }

  /** 0 → 1 across a pinned horizontal scroll, adds extra twist. */
  setProgress(n: number) { this.progress = n; }

  destroy() {
    this.stop();
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.onVis) document.removeEventListener('visibilitychange', this.onVis);
    if (this.onMove) window.removeEventListener('mousemove', this.onMove);
    this.points?.geometry.dispose();
    (this.points?.material as PointsMaterial | undefined)?.dispose();
    this.shells.forEach((s) => { s.geometry.dispose(); (s.material as MeshBasicMaterial).dispose(); });
    this.shells = [];
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.points = null;
    this.container = null;
    this.onResize = null;
    this.onVis = null;
    this.onMove = null;
  }
}

/* One persistent sphere for the whole page — mounted into the fixed sphere
   stage and morphed by section as you scroll. */
export const PortfolioSphere = new SphereManager();
