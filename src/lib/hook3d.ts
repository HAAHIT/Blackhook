import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import type { HookOptions, HookStyle } from '@/types';

const HOOK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 869 842">
  <path d="M554.461 91.2163C554.461 91.2163 379.822 320.957 329.501 395.473C279.181 469.988 371.062 581.953 487.451 523.031C521.766 505.659 539.699 470.459 592.748 404.647L539.699 392.282L530.927 381.109H635.031C635.031 381.109 589.963 437.626 530.927 511.143C471.892 584.66 358.466 557.889 322.572 514.607C287.523 472.344 284.43 418.879 311.479 375.562L526.935 103.505L487.451 74.0439M487.451 74.0439C470.023 71.3811 452.173 70 434 70C240.148 70 83 227.148 83 421C83 614.852 240.148 772 434 772C627.852 772 785 609.264 785 421C785 245.321 655.935 99.7865 487.451 74.0439Z" fill="#f4f0e8"/>
</svg>`;

interface PointerState {
  x: number;
  y: number;
  down: boolean;
  lx: number;
  ly: number;
}

interface RotState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  autoY: number;
  scrollY: number;
}

class HookSceneManager {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private hookGroup: THREE.Group | null = null;
  private raf: number | null = null;
  private container: HTMLElement | null = null;
  private pointer: PointerState = { x: 0, y: 0, down: false, lx: 0, ly: 0 };
  private rot: RotState = { x: 0, y: 0, vx: 0, vy: 0, autoY: 0, scrollY: 0 };
  private opts: HookOptions = { style: 'wireframe', speed: 0.35, color: '#f4f0e8' };
  private scrollHandler: ((e: Event) => void) | null = null;

  private buildHook(opts: HookOptions): THREE.Group {
    const group = new THREE.Group();
    const loader = new SVGLoader();
    const data = loader.parse(HOOK_SVG);
    const shapes: THREE.Shape[] = [];
    data.paths.forEach((p) => p.toShapes(true).forEach((s) => shapes.push(s)));

    const cx = 869 / 2;
    const cy = 842 / 2;
    const scale = 0.0042;
    const extrudeSettings = {
      depth: 38,
      bevelEnabled: true,
      bevelThickness: 4,
      bevelSize: 3,
      bevelOffset: 0,
      bevelSegments: 4,
      curveSegments: 24,
    };

    shapes.forEach((shape) => {
      const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geom.translate(-cx, -cy, -extrudeSettings.depth / 2);
      geom.scale(scale, -scale, scale);

      const matSolid = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(opts.color),
        metalness: 0.15,
        roughness: 0.55,
        clearcoat: 0.4,
        clearcoatRoughness: 0.5,
      });
      const matGlass = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(opts.color),
        metalness: 0.1,
        roughness: 0.08,
        transmission: 0.85,
        thickness: 0.6,
        ior: 1.4,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        transparent: true,
        opacity: 0.55,
      });

      const mesh = new THREE.Mesh(geom, opts.style === 'glass' ? matGlass : matSolid);
      mesh.visible = opts.style !== 'wireframe';
      mesh.userData['kind'] = 'solid';
      group.add(mesh);

      const edgeGeom = new THREE.EdgesGeometry(geom, 18);
      const edgeMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(opts.color),
        transparent: true,
        opacity: opts.style === 'wireframe' ? 0.95 : 0.85,
      });
      const edges = new THREE.LineSegments(edgeGeom, edgeMat);
      edges.userData['kind'] = 'edges';
      edges.visible = opts.style !== 'glass';
      group.add(edges);
    });

    return group;
  }

  private applyStyle(opts: HookOptions) {
    if (!this.hookGroup) return;
    this.hookGroup.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments)) return;
      if (obj.userData['kind'] === 'solid' && obj instanceof THREE.Mesh) {
        obj.visible = opts.style !== 'wireframe';
        const mat = obj.material as THREE.MeshPhysicalMaterial;
        if (opts.style === 'glass') {
          mat.transmission = 0.85;
          mat.opacity = 0.55;
          mat.transparent = true;
          mat.roughness = 0.08;
        } else {
          mat.transmission = 0;
          mat.opacity = 1;
          mat.transparent = false;
          mat.roughness = 0.55;
        }
        mat.color.set(opts.color);
        mat.needsUpdate = true;
      } else if (obj.userData['kind'] === 'edges' && obj instanceof THREE.LineSegments) {
        obj.visible = opts.style !== 'glass';
        const mat = obj.material as THREE.LineBasicMaterial;
        mat.color.set(opts.color);
        mat.opacity = opts.style === 'wireframe' ? 0.95 : 0.85;
      }
    });
  }

  mount(el: HTMLElement, opts: Partial<HookOptions> = {}) {
    this.opts = { ...this.opts, ...opts };
    this.container = el;

    const w = el.clientWidth;
    const h = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    camera.position.set(0, 0, 8);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xa9bfff, 0.6);
    rim.position.set(-4, -2, -3);
    scene.add(rim);
    const accent = new THREE.PointLight(0xfff1d2, 0.9, 20);
    accent.position.set(-2, 3, 4);
    scene.add(accent);

    const hook = this.buildHook(this.opts);
    hook.rotation.x = -0.15;
    hook.rotation.y = 0.4;
    scene.add(hook);

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.hookGroup = hook;

    const canvas = renderer.domElement;
    canvas.style.touchAction = 'none';
    canvas.style.cursor = 'grab';

    const onDown = (e: PointerEvent) => {
      this.pointer.down = true;
      canvas.style.cursor = 'grabbing';
      this.pointer.lx = e.clientX;
      this.pointer.ly = e.clientY;
    };
    const onUp = () => {
      this.pointer.down = false;
      canvas.style.cursor = 'grab';
    };
    const onMove = (e: PointerEvent) => {
      if (this.pointer.down) {
        this.rot.vy += (e.clientX - this.pointer.lx) * 0.005;
        this.rot.vx += (e.clientY - this.pointer.ly) * 0.005;
        this.pointer.lx = e.clientX;
        this.pointer.ly = e.clientY;
      }
      const rect = canvas.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const onResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const ww = this.container.clientWidth;
      const hh = this.container.clientHeight;
      this.renderer.setSize(ww, hh);
      this.camera.aspect = ww / hh;
      this.camera.updateProjectionMatrix();
    };

    this.scrollHandler = (e: Event) => { this.rot.scrollY = (e as CustomEvent<number>).detail * Math.PI * 1.2; };

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('resize', onResize);
    window.addEventListener('bh:scroll', this.scrollHandler);

    const tick = () => {
      this.raf = requestAnimationFrame(tick);
      this.rot.autoY += 0.002 * this.opts.speed;
      this.rot.vx *= 0.92;
      this.rot.vy *= 0.92;
      this.rot.x += this.rot.vx;
      this.rot.y += this.rot.vy;
      this.rot.x = Math.max(-0.9, Math.min(0.9, this.rot.x));

      hook.rotation.y = this.rot.y + this.rot.autoY + this.rot.scrollY + this.pointer.x * 0.15;
      hook.rotation.x = -0.15 + this.rot.x - this.pointer.y * 0.1;

      this.renderer!.render(this.scene!, this.camera!);
    };
    tick();
  }

  setStyle(style: HookStyle) {
    this.opts.style = style;
    this.applyStyle(this.opts);
  }

  setColor(color: string) {
    this.opts.color = color;
    this.applyStyle(this.opts);
  }

  setSpeed(speed: number) {
    this.opts.speed = speed;
  }

  setScroll(progress: number) {
    this.rot.scrollY = progress * Math.PI * 1.2;
  }

  destroy() {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    if (this.scrollHandler) { window.removeEventListener('bh:scroll', this.scrollHandler); this.scrollHandler = null; }
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.hookGroup = null;
    this.raf = null;
  }
}

export const HookScene = new HookSceneManager();
