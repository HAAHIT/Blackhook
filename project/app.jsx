/* global React, ReactDOM, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakSlider, TweakToggle, TweakColor, useTweaks */
const { useState, useEffect, useRef, useMemo } = React;

/* ====== Logo ====== */
function HookMark({ size = 26, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 869 842" fill="none">
      <path d="M554.461 91.2163C554.461 91.2163 379.822 320.957 329.501 395.473C279.181 469.988 371.062 581.953 487.451 523.031C521.766 505.659 539.699 470.459 592.748 404.647L539.699 392.282L530.927 381.109H635.031C635.031 381.109 589.963 437.626 530.927 511.143C471.892 584.66 358.466 557.889 322.572 514.607C287.523 472.344 284.43 418.879 311.479 375.562L526.935 103.505L487.451 74.0439M487.451 74.0439C470.023 71.3811 452.173 70 434 70C240.148 70 83 227.148 83 421C83 614.852 240.148 772 434 772C627.852 772 785 609.264 785 421C785 245.321 655.935 99.7865 487.451 74.0439" stroke={color} strokeWidth="34"/>
    </svg>
  );
}

function ArrowOut({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"/>
    </svg>
  );
}
function ArrowRight({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2 7H12M12 7L7 2M12 7L7 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"/>
    </svg>
  );
}

/* ====== Reveal-on-scroll hook ====== */
function useReveal() {
  // GSAP/motion.js owns the reveal animations now. Keep this hook a no-op so
  // the old .reveal class doesn't double-animate elements.
  useEffect(() => {}, []);
}

/* ====== Nav ====== */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`bh-nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#top" className="bh-logo">
        <HookMark size={24} color="var(--fg)" />
        <span>BlackHook</span>
      </a>
      <nav className="bh-nav-links">
        <a href="#services">Services</a>
        <a href="#work">Work</a>
        <a href="#approach">Approach</a>
        <a href="#team">Team</a>
        <a href="#contact">Contact</a>
      </nav>
      <a href="#contact" className="bh-nav-cta magnetic" data-magnetic="0.3">
        Start a project <ArrowOut size={11} />
      </a>
    </header>
  );
}

/* ====== Hero ====== */
function Hero({ hookOpts, theme }) {
  const stageRef = useRef(null);
  const heroRef = useRef(null);
  const mountedRef = useRef(false);
  const shaderMountedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const tryMount = () => {
      if (cancelled || mountedRef.current) return;
      if (!window.HookScene || !stageRef.current) {
        setTimeout(tryMount, 80);
        return;
      }
      window.HookScene.mount(stageRef.current, hookOpts);
      mountedRef.current = true;
    };
    tryMount();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mount shader bg once
  useEffect(() => {
    if (shaderMountedRef.current || !heroRef.current) return;
    if (window.ShaderBG && window.ShaderBG.init) {
      window.ShaderBG.init(heroRef.current);
      shaderMountedRef.current = true;
    }
  }, []);

  // Update shader colors when theme changes
  useEffect(() => {
    if (!window.ShaderBG) return;
    if (theme === 'light') {
      window.ShaderBG.setColors([0.957, 0.941, 0.910], [0.04, 0.04, 0.04]);
    } else {
      window.ShaderBG.setColors([0.04, 0.04, 0.04], [0.957, 0.941, 0.910]);
    }
  }, [theme]);

  // Live-update style/color/speed when tweaks change
  useEffect(() => {
    if (!window.HookScene || !mountedRef.current) return;
    window.HookScene.setStyle(hookOpts.style);
    window.HookScene.setColor(hookOpts.color);
    window.HookScene.setSpeed(hookOpts.speed);
  }, [hookOpts.style, hookOpts.color, hookOpts.speed]);

  return (
    <section className="bh-hero" id="top" ref={heroRef}>
      <div className="bh-hero-copy">
        <div className="bh-eyebrow reveal">
          <span className="dot" />
          Studio · Est. Ahmedabad
        </div>
        <h1 className="reveal">
          We build <span className="ital">software</span>{' '}
          at the <span className="underline">highest</span> quality.
        </h1>
        <p className="bh-hero-sub reveal">
          BlackHook is a small, senior studio designing and shipping web apps,
          mobile apps, and internal tools — end to end. Calm process, sharp craft,
          obsessive attention to the final 5%.
        </p>
        <div className="bh-hero-ctas reveal">
          <a href="#contact" className="btn-primary magnetic" data-magnetic="0.25">
            Start a project <ArrowRight size={12} />
          </a>
          <a href="#work" className="btn-ghost magnetic" data-magnetic="0.2">
            See selected work
          </a>
        </div>
        <div className="bh-hero-meta reveal">
          <div>
            <strong data-counter="8" data-suffix="+">0</strong>
            Years of craft
          </div>
          <div>
            <strong data-counter="24">0</strong>
            Products shipped
          </div>
          <div>
            <strong data-counter="2">0</strong>
            Founders, one studio
          </div>
        </div>
      </div>

      <div className="bh-hook-stage" data-cursor="drag">
        <div className="bh-hook-ring" />
        <div className="bh-hook-canvas" ref={stageRef} />
        <div className="bh-hook-label">
          <span className="dot" /> Drag to rotate
        </div>
      </div>
    </section>
  );
}

/* ====== Services ====== */
const SERVICES = [
  {
    n: '01', shape: 's-clip', span: 'col-6',
    title: 'Product Design',
    body: 'Research, IA, interaction, visual systems. We design things people actually want to use — and engineering can actually build.',
    tags: ['UX research', 'UI systems', 'Prototyping'],
  },
  {
    n: '02', shape: 's-pill', span: 'col-6',
    title: 'Web Applications',
    body: 'Production-grade web apps with real state, auth, integrations and observability. Built to scale from day one.',
    tags: ['React', 'TypeScript', 'Postgres', 'Edge runtime'],
  },
  {
    n: '03', shape: '', span: 'col-4',
    title: 'Mobile Apps',
    body: 'iOS and Android, native-feel performance, ships to stores.',
    tags: ['React Native', 'Swift', 'Kotlin'],
  },
  {
    n: '04', shape: 's-clip', span: 'col-4',
    title: 'Internal Tools',
    body: 'Admin portals, ops dashboards, CRMs — the unsexy software that runs the business.',
    tags: ['Dashboards', 'Workflows', 'Reporting'],
  },
  {
    n: '05', shape: 's-arrow', span: 'col-4',
    title: 'Whatever the client needs',
    body: 'We don\'t hide behind a service menu. If it\'s software-shaped, we\'ll quote it.',
    tags: ['Open scope'],
  },
];

function Services() {
  return (
    <section className="bh-section" id="services">
      <div className="bh-section-head reveal">
        <div>
          <div className="bh-section-tag">What we do</div>
          <h2>Design and build, <em>end to end</em>.</h2>
        </div>
        <p style={{ maxWidth: 360, color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
          One small team handles the work from sketch to ship — no handoffs to disappear into, no agencies in a trench coat.
        </p>
      </div>
      <div className="bh-services-grid">
        {SERVICES.map((s) => (
          <div key={s.n} className={`bh-service ${s.shape} ${s.span} reveal`}>
            <div className="num">{s.n} / 05</div>
            <div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ====== Selected Work ====== */
const WORK = [
  {
    id: '01', client: 'Lumen Health', year: '2025', kind: 'Web app · Design + Build',
    title: 'A calmer clinical workflow',
    body: 'Replaced a 14-screen intake flow with a single, paced conversation. Reduced abandonment 38%.',
    accent: '#b5f55b',
    role: 'Discovery, IA, UX, UI, full-stack build',
    duration: '14 weeks',
    team: 'Suraj + Hitesh + 1 client PM',
    stack: ['Next.js', 'TypeScript', 'Postgres', 'tRPC', 'Tailwind'],
    outcomes: [
      ['38%', 'lower drop-off across the intake flow'],
      ['4.7★', 'patient feedback in pilot (n=240)'],
      ['½', 'the support tickets after launch'],
    ],
    long: 'Lumen ran a 14-screen patient intake that bled users at every step. We reframed it as a single paced conversation — one decision per moment, with quiet visual rhythm. The redesign cut perceived length, restored trust, and stayed within the existing EMR integration. The team shipped it in 14 weeks; abandonment dropped 38% in the first month.',
  },
  {
    id: '02', client: 'Forge Logistics', year: '2024', kind: 'Internal portal',
    title: 'Ops dashboard for a 2,000-truck fleet',
    body: 'Real-time route, status and exception monitoring. From spreadsheet to mission control.',
    accent: '#ff7a45',
    role: 'UX research, design system, frontend',
    duration: '22 weeks',
    team: 'Suraj + Hitesh + 2 client engineers',
    stack: ['React', 'WebSockets', 'Mapbox', 'Postgres', 'Redis'],
    outcomes: [
      ['2.1k', 'trucks monitored in real time'],
      ['11s', 'mean exception-to-alert time'],
      ['72%', 'reduction in dispatcher screen-switches'],
    ],
    long: 'Forge ran their entire dispatch off a daisy-chain of spreadsheets and chat windows. We shadowed dispatchers for two weeks, then built a single command surface — map, table, status stream — wired into their existing telematics. It now monitors 2,100 trucks live with sub-15s exception detection.',
  },
  {
    id: '03', client: 'Mirror Studio', year: '2024', kind: 'Mobile · iOS + Android',
    title: 'A creative tool that fits in a pocket',
    body: 'A native mobile editor with sub-100ms feedback, built to feel like an instrument.',
    accent: '#9bb6ff',
    role: 'Product strategy, design, native build',
    duration: '18 weeks',
    team: 'Suraj + Hitesh + 1 motion designer',
    stack: ['Swift', 'Kotlin', 'Metal', 'Skia', 'Rust core'],
    outcomes: [
      ['<100ms', 'tap-to-pixel feedback'],
      ['4.9★', 'App Store rating after launch'],
      ['18%', 'D30 retention — 3× category benchmark'],
    ],
    long: 'Mirror wanted a phone app that felt like an instrument, not an editor. We built the rendering core in Rust, wrapped it in native Swift and Kotlin, and tuned every gesture for sub-100ms response. Launched to 4.9★ and a 18% D30 retention — three times the category benchmark.',
  },
];

function CaseMock({ accent, kind }) {
  // simple placeholder mock — different per kind
  if (kind.includes('Internal') || kind.includes('Web')) {
    return (
      <div className="mock" style={{ width: '78%', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ flex: 2, height: 10, background: 'rgba(244,240,232,0.1)', borderRadius: 2 }} />
          <div style={{ flex: 1, height: 10, background: accent, opacity: 0.6, borderRadius: 2 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 6 }}>
          <div style={{ height: 64, background: 'rgba(244,240,232,0.06)', borderRadius: 4 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ height: 30, background: 'rgba(244,240,232,0.08)', borderRadius: 4 }} />
            <div style={{ height: 30, background: 'rgba(244,240,232,0.05)', borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ flex: 1, height: 18, background: 'rgba(244,240,232,0.06)', borderRadius: 2 }} />
          <div style={{ flex: 1, height: 18, background: 'rgba(244,240,232,0.06)', borderRadius: 2 }} />
          <div style={{ flex: 1, height: 18, background: 'rgba(244,240,232,0.06)', borderRadius: 2 }} />
        </div>
      </div>
    );
  }
  // mobile mock
  return (
    <div className="mock" style={{ width: 90, height: 180, border: '1px solid rgba(244,240,232,0.18)', borderRadius: 14, padding: 6, background: 'rgba(244,240,232,0.03)' }}>
      <div style={{ height: '100%', borderRadius: 10, background: 'linear-gradient(160deg, rgba(244,240,232,0.06), rgba(244,240,232,0.02))', display: 'flex', flexDirection: 'column', gap: 6, padding: 8 }}>
        <div style={{ height: 8, width: '40%', background: 'rgba(244,240,232,0.2)', borderRadius: 2 }} />
        <div style={{ flex: 1, background: accent, opacity: 0.35, borderRadius: 6 }} />
        <div style={{ height: 24, background: 'rgba(244,240,232,0.08)', borderRadius: 6 }} />
      </div>
    </div>
  );
}

function Work() {
  const [openId, setOpenId] = useState(null);
  const open = WORK.find((w) => w.id === openId);

  // lock scroll when open
  useEffect(() => {
    if (openId) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      if (window.BHMotion && window.BHMotion.pauseScroll) window.BHMotion.pauseScroll(true);
      const onKey = (e) => { if (e.key === 'Escape') setOpenId(null); };
      window.addEventListener('keydown', onKey);
      return () => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        if (window.BHMotion && window.BHMotion.pauseScroll) window.BHMotion.pauseScroll(false);
        window.removeEventListener('keydown', onKey);
      };
    }
  }, [openId]);

  return (
    <section className="bh-section" id="work">
      <div className="bh-section-head reveal">
        <div>
          <div className="bh-section-tag">Selected work</div>
          <h2>Quietly shipped, <em>loudly used</em>.</h2>
        </div>
        <a href="#contact" className="btn-ghost" style={{ alignSelf: 'flex-end' }}>
          Request full case studies <ArrowRight size={12} />
        </a>
      </div>
      <div className="bh-work-grid">
        {WORK.map((w, i) => (
          <button
            key={w.id}
            type="button"
            className={`bh-case reveal ${i === 0 ? 'col-8' : i === 1 ? 'col-4' : 'col-6'}`}
            data-cursor="view"
            onClick={() => setOpenId(w.id)}
          >
            <div className="meta">
              <span>{w.client} · {w.year}</span>
              <span>{w.id}</span>
            </div>
            <h3>{w.title}</h3>
            <p>{w.body}</p>
            <div className="visual">
              <CaseMock accent={w.accent} kind={w.kind} />
            </div>
            <div className="meta" style={{ marginTop: 16, marginBottom: 0 }}>
              <span>{w.kind}</span>
              <span className="bh-case-cta">Read <ArrowOut size={11} /></span>
            </div>
          </button>
        ))}
        <div className="bh-case reveal col-6" style={{ background: 'transparent', border: '1px dashed var(--line-strong)', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: 220 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 12 }}>04 — In progress</div>
          <h3 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 28, margin: 0 }}>More case studies, coming soon.</h3>
        </div>
      </div>

      <CaseDetail item={open} onClose={() => setOpenId(null)} />
    </section>
  );
}

function CaseDetail({ item, onClose }) {
  return (
    <div className={`bh-case-detail ${item ? 'open' : ''}`} aria-hidden={!item}>
      <div className="bh-case-detail-bg" onClick={onClose} />
      <aside className="bh-case-detail-panel" role="dialog" aria-modal="true">
        {item && (
          <>
            <header>
              <button type="button" className="bh-case-close" onClick={onClose} aria-label="Close">
                <span className="bh-close-line" />
                <span className="bh-close-line" />
              </button>
              <div className="bh-case-detail-meta">
                <span>{item.client}</span>
                <span>·</span>
                <span>{item.year}</span>
                <span>·</span>
                <span>{item.kind}</span>
              </div>
              <h2>{item.title}</h2>
            </header>

            <div className="bh-case-detail-visual" style={{ '--accent': item.accent }}>
              <CaseMock accent={item.accent} kind={item.kind} />
              <div className="bh-case-glow" />
            </div>

            <div className="bh-case-detail-body">
              <p className="bh-case-long">{item.long}</p>

              <div className="bh-case-grid">
                <div>
                  <div className="bh-case-label">Role</div>
                  <div className="bh-case-val">{item.role}</div>
                </div>
                <div>
                  <div className="bh-case-label">Duration</div>
                  <div className="bh-case-val">{item.duration}</div>
                </div>
                <div>
                  <div className="bh-case-label">Team</div>
                  <div className="bh-case-val">{item.team}</div>
                </div>
                <div>
                  <div className="bh-case-label">Stack</div>
                  <div className="bh-case-val">{item.stack.join(' · ')}</div>
                </div>
              </div>

              <div className="bh-case-outcomes">
                <div className="bh-case-label">Outcomes</div>
                <div className="bh-case-outcomes-grid">
                  {item.outcomes.map(([n, l]) => (
                    <div key={l} className="bh-case-outcome">
                      <strong>{n}</strong>
                      <span>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a href="#contact" className="btn-primary" onClick={onClose}>
                Discuss a similar project <ArrowRight size={12} />
              </a>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* ====== Approach ====== */
const STEPS = [
  { n: '01', t: 'Listen & frame', d: 'A short, blunt discovery. We figure out what you actually need, and what you don\'t. We say no to scope that won\'t earn its keep.', meta: '1–2 weeks' },
  { n: '02', t: 'Design in the open', d: 'Working sessions, not deliverable theater. You see prototypes inside the first fortnight, and you steer.', meta: '2–4 weeks' },
  { n: '03', t: 'Build with the design team', d: 'Same humans designing and shipping. Decisions stay coherent because nothing gets translated through a brief.', meta: '4–12 weeks' },
  { n: '04', t: 'Polish, ship, observe', d: 'We obsess over the final 5%, instrument what matters, and stay on as long as it\'s useful.', meta: 'Ongoing' },
];

function Approach() {
  return (
    <section className="bh-section" id="approach">
      <div className="bh-section-head reveal">
        <div>
          <div className="bh-section-tag">Approach</div>
          <h2>Calm process. <em>Sharp output.</em></h2>
        </div>
        <p style={{ maxWidth: 380, color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
          We work in small, accountable phases. You always know what's happening, what we're stuck on, and what's next.
        </p>
      </div>
      <div className="bh-approach">
        {STEPS.map((s) => (
          <div key={s.n} className="bh-step reveal">
            <div className="num">{s.n} / 04</div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
            <div className="meta">{s.meta}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ====== Team ====== */
const TEAM = [
  {
    initial: 'S',
    name: 'Suraj Ingle',
    role: 'Founding designer & engineer',
    bio: 'NID Ahmedabad. Designs systems and ships them. Eight years across product design and front-end engineering — the rare person who can both spec a component and write its production code.',
    foot: ['NID Ahmedabad · 2017', '@surajingle'],
  },
  {
    initial: 'H',
    name: 'Hitesh Agrawal',
    role: 'Founding product & strategy',
    bio: 'Product manager and business strategist. Built and scaled software with both Fortune 500 enterprises and zero-to-one startups. Translates a fuzzy ambition into something a team can actually ship.',
    foot: ['Ex-enterprise · Ex-startup', '@hiteshagrawal'],
  },
];

function Team() {
  return (
    <section className="bh-section" id="team">
      <div className="bh-section-head reveal">
        <div>
          <div className="bh-section-tag">Team</div>
          <h2>A small studio. <em>Senior on every call.</em></h2>
        </div>
        <p style={{ maxWidth: 380, color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
          You'll work directly with the founders — not a rotating roster of juniors. Every meeting, every commit, every decision.
        </p>
      </div>
      <div className="bh-team-grid">
        {TEAM.map((m) => (
          <article key={m.name} className="bh-member reveal">
            <div className="bh-member-head">
              <div className="bh-member-portrait">{m.initial}</div>
              <div>
                <h3>{m.name}</h3>
                <div className="role">{m.role}</div>
              </div>
            </div>
            <p className="bh-member-bio">{m.bio}</p>
            <div className="bh-member-foot">
              <span>{m.foot[0]}</span>
              <a href="#">{m.foot[1]} <ArrowOut size={10} /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ====== Testimonials marquee ====== */
const QUOTES = [
  { text: 'They shipped what three previous teams couldn\'t. Quietly, in half the time.', who: 'CTO · Series B Fintech' },
  { text: 'Felt like hiring two senior people, not an agency.', who: 'Head of Product · Lumen Health' },
  { text: 'The polish on the final 5% is what kept users.', who: 'Founder · Mirror Studio' },
  { text: 'They said no to features we would have regretted shipping.', who: 'CEO · Forge Logistics' },
];

function Testimonials({ speed }) {
  const items = [...QUOTES, ...QUOTES]; // doubled for seamless loop
  const duration = useMemo(() => `${Math.round(80 / speed)}s`, [speed]);
  return (
    <div className="bh-marquee-wrap" id="testimonials">
      <div className="bh-marquee" style={{ animationDuration: duration }}>
        {items.map((q, i) => (
          <div key={i} className="bh-quote">
            <div className="qmark">"</div>
            <div>
              <div className="text">{q.text}</div>
              <div className="who">— {q.who}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ====== Contact ====== */
function Contact() {
  return (
    <section className="bh-contact" id="contact">
      <div className="bh-contact-inner">
        <div className="reveal">
          <div className="bh-section-tag" style={{ marginBottom: 32 }}>Contact</div>
          <h2>Have something <em>worth building?</em></h2>
          <a href="#" className="bh-cta-big magnetic" data-magnetic="0.18">
            hello@blackhook.studio <ArrowOut size={14} />
          </a>
        </div>
        <div className="bh-contact-side reveal">
          <div className="row"><strong>Studio</strong><span>Ahmedabad, IN</span></div>
          <div className="row"><strong>Hours</strong><span>Mon – Fri · 10–7 IST</span></div>
          <div className="row"><strong>Availability</strong><span>Q3 2026</span></div>
          <div className="row"><strong>For</strong><span>Founders & PMs</span></div>
        </div>
      </div>
    </section>
  );
}

/* ====== Footer ====== */
function Footer() {
  return (
    <footer className="bh-footer-wrap">
      <div className="bh-wordmark" aria-hidden="true">
        <svg viewBox="0 0 1400 220" preserveAspectRatio="xMidYMid meet">
          <text x="700" y="180" textAnchor="middle"
                fontFamily="Instrument Serif, serif"
                fontSize="230"
                letterSpacing="0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2">
            <tspan>BLACK</tspan>
            <tspan fontStyle="italic" dx="6">Hook</tspan>
          </text>
        </svg>
      </div>
      <div className="bh-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <HookMark size={16} color="var(--fg-3)" />
          <span>BlackHook Studio · © 2026</span>
        </div>
        <div className="bh-footer-mid">
          <span className="bh-status"><span className="d" /> Booking Q3 2026</span>
        </div>
        <div className="bh-footer-links">
          <a href="#">Twitter / X</a>
          <a href="#">LinkedIn</a>
          <a href="#">Dribbble</a>
          <a href="#">Read.cv</a>
        </div>
      </div>
    </footer>
  );
}

/* ====== Tweaks ====== */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "hookStyle": "wireframe",
  "hookColor": "#f4f0e8",
  "hookSpeed": 0.35,
  "shader": true,
  "marqueeSpeed": 1,
  "grain": true,
  "customCursor": true,
  "smoothScroll": true,
  "accent": "#f4f0e8"
}/*EDITMODE-END*/;

const HOOK_COLORS_DARK = ['#f4f0e8', '#ffffff', '#b5f55b', '#ff7a45', '#9bb6ff'];
const HOOK_COLORS_LIGHT = ['#0a0a0a', '#253458', '#7a3aff', '#d94a1f', '#1a5a3a'];

function AppTweaks({ t, setTweak }) {
  const colors = t.theme === 'light' ? HOOK_COLORS_LIGHT : HOOK_COLORS_DARK;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme">
        <TweakRadio
          label="Mode"
          value={t.theme}
          onChange={(v) => {
            setTweak('theme', v);
            // also bump the hook color so it stays visible
            if (v === 'light' && !HOOK_COLORS_LIGHT.includes(t.hookColor)) {
              setTweak('hookColor', '#0a0a0a');
            } else if (v === 'dark' && !HOOK_COLORS_DARK.includes(t.hookColor)) {
              setTweak('hookColor', '#f4f0e8');
            }
          }}
          options={[
            { label: 'Dark', value: 'dark' },
            { label: 'Light', value: 'light' },
          ]}
        />
      </TweakSection>

      <TweakSection label="3D Hook">
        <TweakRadio
          label="Style"
          value={t.hookStyle}
          onChange={(v) => setTweak('hookStyle', v)}
          options={[
            { label: 'Wireframe', value: 'wireframe' },
            { label: 'Solid', value: 'solid' },
            { label: 'Glass', value: 'glass' },
          ]}
        />
        <TweakColor
          label="Color"
          value={t.hookColor}
          onChange={(v) => setTweak('hookColor', v)}
          options={colors}
        />
        <TweakSlider
          label="Rotation speed"
          value={t.hookSpeed}
          onChange={(v) => setTweak('hookSpeed', v)}
          min={0} max={1.5} step={0.05}
        />
      </TweakSection>

      <TweakSection label="Motion">
        <TweakToggle
          label="Hero shader bg"
          value={t.shader}
          onChange={(v) => setTweak('shader', v)}
        />
        <TweakToggle
          label="Custom cursor"
          value={t.customCursor}
          onChange={(v) => setTweak('customCursor', v)}
        />
        <TweakToggle
          label="Smooth scroll"
          value={t.smoothScroll}
          onChange={(v) => setTweak('smoothScroll', v)}
        />
        <TweakSlider
          label="Marquee speed"
          value={t.marqueeSpeed}
          onChange={(v) => setTweak('marqueeSpeed', v)}
          min={0.3} max={3} step={0.1}
        />
        <TweakToggle
          label="Film grain"
          value={t.grain}
          onChange={(v) => setTweak('grain', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

/* ====== App ====== */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();

  // theme switch
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme || 'dark');
  }, [t.theme]);

  // grain toggle on body
  useEffect(() => {
    document.body.classList.toggle('bh-grain', !!t.grain);
  }, [t.grain]);

  // shader bg toggle
  useEffect(() => {
    const canvas = document.querySelector('.bh-shader-bg');
    if (canvas) canvas.style.display = t.shader ? '' : 'none';
  }, [t.shader]);

  // Custom cursor on/off
  useEffect(() => {
    document.documentElement.classList.toggle('bh-no-cursor', !t.customCursor);
    const c = document.querySelector('.bh-cursor');
    if (c) c.style.display = t.customCursor ? '' : 'none';
  }, [t.customCursor]);

  // Smooth scroll toggle (Lenis)
  useEffect(() => {
    if (window.BHMotion && window.BHMotion.setSmooth) {
      window.BHMotion.setSmooth(t.smoothScroll);
    }
  }, [t.smoothScroll]);

  // Boot motion layer once the React tree is mounted.
  useEffect(() => {
    const id = setTimeout(() => {
      if (window.BHMotion && window.BHMotion.init) window.BHMotion.init();
    }, 100);
    return () => clearTimeout(id);
  }, []);

  const hookOpts = {
    style: t.hookStyle,
    color: t.hookColor,
    speed: t.hookSpeed,
  };

  return (
    <>
      <Nav />
      <main>
        <Hero hookOpts={hookOpts} theme={t.theme} />
        <Services />
        <Work />
        <Approach />
        <Team />
        <Testimonials speed={t.marqueeSpeed} />
        <Contact />
      </main>
      <Footer />
      <AppTweaks t={t} setTweak={setTweak} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
