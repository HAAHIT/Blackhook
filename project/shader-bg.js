// shader-bg.js — subtle WebGL flow-noise field behind the hero.
// Pure GL (no three.js dep). Exposes window.ShaderBG.{init, setColors, destroy}.

(function () {
  'use strict';

  const VERT = `
    attribute vec2 a_pos;
    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  // Simplex/perlin-ish flowing field. Cheap.
  const FRAG = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_scroll;
    uniform vec3 u_bg;
    uniform vec3 u_fg;

    // hash + value noise
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
        mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
        u.y
      );
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
      vec2 uv = gl_FragCoord.xy / u_res.xy;
      vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;
      // slow flow field
      float t = u_time * 0.04;
      vec2 q = p * 0.8;
      // mouse warp
      vec2 m = (u_mouse - 0.5 * u_res) / u_res.y;
      q += (p - m) * 0.03 * exp(-length(p - m) * 1.5);

      float n = fbm(q + vec2(t, -t * 0.7));
      float n2 = fbm(q * 1.8 + vec2(-t * 0.4, t * 0.5) + 7.0);

      // vignette
      float vig = 1.0 - smoothstep(0.3, 1.0, length(p));

      // soft glow blob following mouse
      float glow = smoothstep(0.5, 0.0, length(p - m) - 0.05) * 0.04;

      // soft volumetric haze — no grid, no contours
      float density = pow(n * 0.6 + n2 * 0.4, 1.4) * vig;

      vec3 col = mix(u_bg, u_fg, density * 0.04 + glow);

      // subtle grain
      float g = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.018;
      col += g;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const state = {
    canvas: null,
    gl: null,
    program: null,
    raf: null,
    start: 0,
    mouse: { x: 0, y: 0, tx: 0, ty: 0 },
    scroll: 0,
    colors: { bg: [0.04, 0.04, 0.04], fg: [0.96, 0.94, 0.91] },
    uniforms: {},
    visible: true,
  };

  function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('Shader compile fail', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function init(container) {
    if (state.canvas) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'bh-shader-bg';
    container.appendChild(canvas);
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    state.canvas = canvas;
    state.gl = gl;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Shader link fail', gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);
    state.program = program;

    // fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    state.uniforms = {
      u_res: gl.getUniformLocation(program, 'u_res'),
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_mouse: gl.getUniformLocation(program, 'u_mouse'),
      u_scroll: gl.getUniformLocation(program, 'u_scroll'),
      u_bg: gl.getUniformLocation(program, 'u_bg'),
      u_fg: gl.getUniformLocation(program, 'u_fg'),
    };

    state.start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    window.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.tx = (e.clientX - rect.left) * (canvas.width / rect.width);
      state.mouse.ty = (rect.height - (e.clientY - rect.top)) * (canvas.height / rect.height);
    });
    window.addEventListener('scroll', () => {
      state.scroll = Math.min(1, window.scrollY / 800);
    }, { passive: true });

    // pause when not visible (hero off-screen)
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { state.visible = e.isIntersecting; });
    }, { threshold: 0 });
    io.observe(canvas);

    function tick() {
      state.raf = requestAnimationFrame(tick);
      if (!state.visible) return;
      // ease mouse
      state.mouse.x += (state.mouse.tx - state.mouse.x) * 0.08;
      state.mouse.y += (state.mouse.ty - state.mouse.y) * 0.08;
      const t = (performance.now() - state.start) / 1000;
      gl.uniform2f(state.uniforms.u_res, canvas.width, canvas.height);
      gl.uniform1f(state.uniforms.u_time, t);
      gl.uniform2f(state.uniforms.u_mouse, state.mouse.x, state.mouse.y);
      gl.uniform1f(state.uniforms.u_scroll, state.scroll);
      gl.uniform3f(state.uniforms.u_bg, state.colors.bg[0], state.colors.bg[1], state.colors.bg[2]);
      gl.uniform3f(state.uniforms.u_fg, state.colors.fg[0], state.colors.fg[1], state.colors.fg[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    tick();
  }

  function setColors(bg, fg) {
    if (bg) state.colors.bg = bg;
    if (fg) state.colors.fg = fg;
  }

  function destroy() {
    if (state.raf) cancelAnimationFrame(state.raf);
    if (state.canvas && state.canvas.parentNode) state.canvas.parentNode.removeChild(state.canvas);
    state.canvas = null;
    state.gl = null;
  }

  window.ShaderBG = { init, setColors, destroy };
})();
