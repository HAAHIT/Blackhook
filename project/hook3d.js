// 3D Hook — extruded from the BlackHook logo SVG path.
// Loaded as ES module. Exposes window.HookScene with mount(el, opts).

import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

// The hook glyph (open-circle variant from the wordmark).
const HOOK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 869 842">
  <path d="M554.461 91.2163C554.461 91.2163 379.822 320.957 329.501 395.473C279.181 469.988 371.062 581.953 487.451 523.031C521.766 505.659 539.699 470.459 592.748 404.647L539.699 392.282L530.927 381.109H635.031C635.031 381.109 589.963 437.626 530.927 511.143C471.892 584.66 358.466 557.889 322.572 514.607C287.523 472.344 284.43 418.879 311.479 375.562L526.935 103.505L487.451 74.0439M487.451 74.0439C470.023 71.3811 452.173 70 434 70C240.148 70 83 227.148 83 421C83 614.852 240.148 772 434 772C627.852 772 785 609.264 785 421C785 245.321 655.935 99.7865 487.451 74.0439Z" fill="#f4f0e8"/>
</svg>`;

const state = {
  renderer: null,
  scene: null,
  camera: null,
  hookGroup: null,
  edges: null,
  mesh: null,
  glow: null,
  raf: null,
  // mouse / drag
  pointer: { x: 0, y: 0, down: false, lx: 0, ly: 0 },
  rot: { x: 0, y: 0, vx: 0, vy: 0, autoY: 0 },
  // params
  opts: {
    style: 'wireframe',   // 'wireframe' | 'solid' | 'glass'
    speed: 0.35,          // auto-rotate speed
    color: '#f4f0e8',
  },
  mounted: false,
  container: null,
};

function buildHook(opts) {
  const group = new THREE.Group();
  const loader = new SVGLoader();
  const data = loader.parse(HOOK_SVG);
  const shapes = [];
  data.paths.forEach((p) => {
    p.toShapes(true).forEach((s) => shapes.push(s));
  });

  // Center & scale shapes around origin. SVG viewBox is 869x842.
  const cx = 869 / 2;
  const cy = 842 / 2;
  const scale = 0.0042; // arbitrary world-unit scale

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
    geom.scale(scale, -scale, scale); // flip Y for SVG coord system

    // Solid mesh (used for solid / glass styles, hidden for pure wireframe).
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
    const matSelected = opts.style === 'glass' ? matGlass : matSolid;
    const mesh = new THREE.Mesh(geom, matSelected);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.visible = opts.style !== 'wireframe';
    mesh.userData.kind = 'solid';
    group.add(mesh);

    // Edges overlay (used for wireframe + solid). Hidden for glass.
    const edgeGeom = new THREE.EdgesGeometry(geom, 18);
    const edgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(opts.color),
      transparent: true,
      opacity: opts.style === 'wireframe' ? 0.95 : 0.85,
    });
    const edges = new THREE.LineSegments(edgeGeom, edgeMat);
    edges.userData.kind = 'edges';
    edges.visible = opts.style !== 'glass';
    group.add(edges);
  });

  return group;
}

function applyStyle(opts) {
  if (!state.hookGroup) return;
  state.hookGroup.traverse((obj) => {
    if (obj.userData?.kind === 'solid') {
      obj.visible = opts.style !== 'wireframe';
      if (opts.style === 'glass') {
        obj.material.transmission = 0.85;
        obj.material.opacity = 0.55;
        obj.material.transparent = true;
        obj.material.roughness = 0.08;
        obj.material.color.set(opts.color);
      } else {
        obj.material.transmission = 0;
        obj.material.opacity = 1;
        obj.material.transparent = false;
        obj.material.roughness = 0.55;
        obj.material.color.set(opts.color);
      }
      obj.material.needsUpdate = true;
    } else if (obj.userData?.kind === 'edges') {
      obj.visible = opts.style !== 'glass';
      obj.material.color.set(opts.color);
      obj.material.opacity = opts.style === 'wireframe' ? 0.95 : 0.85;
    }
  });
}

function mount(el, opts = {}) {
  state.opts = { ...state.opts, ...opts };
  state.container = el;

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

  // lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xa9bfff, 0.6);
  rim.position.set(-4, -2, -3);
  scene.add(rim);
  const accent = new THREE.PointLight(0xfff1d2, 0.9, 20);
  accent.position.set(-2, 3, 4);
  scene.add(accent);

  const hook = buildHook(state.opts);
  // a tiny initial tilt so the extrusion is visible
  hook.rotation.x = -0.15;
  hook.rotation.y = 0.4;
  scene.add(hook);

  state.renderer = renderer;
  state.scene = scene;
  state.camera = camera;
  state.hookGroup = hook;
  state.mounted = true;

  // events
  const canvas = renderer.domElement;
  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';

  const onDown = (e) => {
    state.pointer.down = true;
    canvas.style.cursor = 'grabbing';
    state.pointer.lx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    state.pointer.ly = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
  };
  const onUp = () => {
    state.pointer.down = false;
    canvas.style.cursor = 'grab';
  };
  const onMove = (e) => {
    const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const cy = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    if (state.pointer.down) {
      const dx = cx - state.pointer.lx;
      const dy = cy - state.pointer.ly;
      state.rot.vy += dx * 0.005;
      state.rot.vx += dy * 0.005;
      state.pointer.lx = cx;
      state.pointer.ly = cy;
    }
    // store global pointer for subtle parallax
    const rect = canvas.getBoundingClientRect();
    state.pointer.x = ((cx - rect.left) / rect.width) * 2 - 1;
    state.pointer.y = ((cy - rect.top) / rect.height) * 2 - 1;
  };

  canvas.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointermove', onMove);

  const onResize = () => {
    if (!state.container) return;
    const ww = state.container.clientWidth;
    const hh = state.container.clientHeight;
    renderer.setSize(ww, hh);
    camera.aspect = ww / hh;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', onResize);

  // animation
  const tick = () => {
    state.raf = requestAnimationFrame(tick);

    // auto rotation + damping
    state.rot.autoY += 0.002 * state.opts.speed;
    state.rot.vx *= 0.92;
    state.rot.vy *= 0.92;
    state.rot.x += state.rot.vx;
    state.rot.y += state.rot.vy;

    // clamp pitch
    state.rot.x = Math.max(-0.9, Math.min(0.9, state.rot.x));

    // tiny parallax based on global pointer when not dragging
    const px = state.pointer.x * 0.15;
    const py = state.pointer.y * 0.1;

    hook.rotation.y = state.rot.y + state.rot.autoY + (state.rot.scrollY || 0) + px;
    hook.rotation.x = -0.15 + state.rot.x - py;

    renderer.render(scene, camera);
  };
  tick();
}

function setStyle(style) {
  state.opts.style = style;
  applyStyle(state.opts);
}
function setColor(color) {
  state.opts.color = color;
  applyStyle(state.opts);
}
function setSpeed(speed) {
  state.opts.speed = speed;
}
function setScroll(progress) {
  // 0..1 — extra Y rotation as the page scrolls
  state.rot.scrollY = (progress || 0) * Math.PI * 1.2;
}

window.HookScene = { mount, setStyle, setColor, setSpeed, setScroll };
