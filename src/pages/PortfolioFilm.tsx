import { useEffect, useState } from 'react';
import { ArrowOut, ArrowRight, GithubMark, BrainIcon, DatabaseIcon, ReceiptIcon, CheckIcon } from '@/icons';
import { PROJECTS, CASE_STUDIES, PRINCIPLES, RECOGNITION } from '@/data/portfolio';
import { initPortfolioMotion, destroyPortfolioMotion } from '@/lib/portfolio-film-motion';

const EMAIL = 'agrawalhitesh4444@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/hitesh-agrawal-5a02a416b/';
const RESUME = '/Hitesh-Agrawal-Resume.pdf';

const MARQUEE = [
  'Product strategy',
  '0→1 to 280M users',
  'AI in the loop',
  'Discovery before decks',
  'Revenue is validation',
  'Own the whole problem',
];

// The three live products — flagship work, shown as an orbiting trio
// (mira's "Who benefits" treatment) rather than the full project archive.
const FEATURED_NAMES = ['smriti', 'bolodb', 'SoloBooks'];
const featuredProjects = FEATURED_NAMES
  .map((n) => PROJECTS.find((p) => p.name === n))
  .filter((p): p is typeof PROJECTS[number] => Boolean(p));
const PROJECT_ICONS = [BrainIcon, DatabaseIcon, ReceiptIcon];

export function PortfolioFilm() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    initPortfolioMotion();
    return () => destroyPortfolioMotion();
  }, []);

  // Close the mobile menu on Escape, and whenever the viewport grows back to
  // desktop width (where the inline nav links take over).
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    const onResize = () => { if (window.innerWidth > 820) setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  return (
    <>
      <div className="pf-cursor" aria-hidden="true">
        <div className="pf-cursor-ring"><span className="pf-cursor-label" /></div>
        <div className="pf-cursor-dot" />
      </div>

      <div className="pf-loader" aria-hidden="true">
        <div className="pf-loader-inner">
          <div className="pf-loader-name">Hitesh <i>Agrawal</i></div>
          <div className="pf-loader-count"><span data-pf-load>0</span><i>%</i></div>
        </div>
        <div className="pf-loader-bar"><span /></div>
      </div>

      <div className="pf-intro pf-intro--coherent" role="dialog" aria-modal="true" aria-label="Welcome" data-lenis-prevent>
        <div className="pf-intro-ambient" aria-hidden="true">
          <span className="pf-halo" />
          <span className="pf-ping pf-ping-1" />
          <span className="pf-ping pf-ping-2" />
        </div>
        <div className="pf-intro-inner">
          <div className="pf-intro-topbar">
            <span className="pf-intro-name">Hitesh Agrawal</span>
            <span className="pf-intro-status"><span className="d" /> Open to senior product roles</span>
          </div>

          <div className="pf-intro-lead">
            <div className="pf-intro-orb">
              <span className="pf-intro-orb-glow" />
              <span className="pf-intro-orb-photo">
                <img src="/hitesh-round.jpg" alt="Hitesh Agrawal" width={142} height={142} />
              </span>
            </div>
            <div className="pf-intro-lead-copy">
              <p className="pf-intro-eyebrow"><span aria-hidden="true">👋</span> Hey there</p>
              <h2 className="pf-intro-bio">
                Thanks for stopping by my corner of the web. A little about me —
                I enjoy taking things, businesses, products, <em>from concept to reality</em>.
              </h2>
            </div>
          </div>

          <div className="pf-intro-question">
            <span>What brings you here today?</span>
            <span className="pf-intro-rule" aria-hidden="true" />
          </div>

          <div className="pf-intro-options">
            <button type="button" className="pf-intro-opt pf-intro-opt--featured" data-pf-intro="work">
              <div className="pf-intro-opt-head">
                <span className="pf-intro-opt-num">01</span>
                <span className="pf-intro-opt-tag">Most visited</span>
              </div>
              <div className="pf-intro-opt-art" aria-hidden="true">
                <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20" y="38" width="120" height="56" rx="6" fill="rgba(201,164,92,0.07)" stroke="rgba(201,164,92,0.25)" strokeWidth="1" />
                  <rect x="10" y="28" width="120" height="56" rx="6" fill="rgba(201,164,92,0.05)" stroke="rgba(201,164,92,0.18)" strokeWidth="1" />
                  <rect x="0" y="18" width="120" height="56" rx="6" fill="rgba(201,164,92,0.04)" stroke="rgba(201,164,92,0.12)" strokeWidth="1" />
                  <rect x="8" y="30" width="40" height="3" rx="1.5" fill="rgba(230,200,126,0.4)" />
                  <rect x="8" y="38" width="70" height="2" rx="1" fill="rgba(236,229,216,0.12)" />
                  <rect x="8" y="44" width="55" height="2" rx="1" fill="rgba(236,229,216,0.08)" />
                  <rect x="8" y="52" width="30" height="8" rx="4" fill="rgba(201,164,92,0.2)" stroke="rgba(201,164,92,0.35)" strokeWidth="0.75" />
                  <rect x="130" y="20" width="28" height="28" rx="4" fill="rgba(201,164,92,0.12)" stroke="rgba(201,164,92,0.3)" strokeWidth="0.75" />
                  <text x="144" y="38" fontFamily="serif" fontSize="14" fill="rgba(230,200,126,0.7)" textAnchor="middle" fontStyle="italic">+</text>
                </svg>
              </div>
              <div className="pf-intro-opt-foot">
                <h3 className="pf-intro-opt-title">See the work</h3>
                <p className="pf-intro-opt-sub">Real work &amp; impact</p>
                <span className="pf-intro-opt-enter">Enter →</span>
              </div>
            </button>

            <button type="button" className="pf-intro-opt" data-pf-intro="projects">
              <div className="pf-intro-opt-head">
                <span className="pf-intro-opt-num">02</span>
              </div>
              <div className="pf-intro-opt-art" aria-hidden="true">
                <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="30" y1="50" x2="80" y2="25" stroke="rgba(201,164,92,0.2)" strokeWidth="1" />
                  <line x1="80" y1="25" x2="130" y2="50" stroke="rgba(201,164,92,0.2)" strokeWidth="1" />
                  <line x1="30" y1="50" x2="80" y2="75" stroke="rgba(201,164,92,0.15)" strokeWidth="1" />
                  <line x1="80" y1="75" x2="130" y2="50" stroke="rgba(201,164,92,0.15)" strokeWidth="1" />
                  <line x1="80" y1="25" x2="80" y2="75" stroke="rgba(201,164,92,0.1)" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="30" cy="50" r="5" fill="rgba(201,164,92,0.15)" stroke="rgba(201,164,92,0.5)" strokeWidth="1" />
                  <circle cx="80" cy="25" r="7" fill="rgba(201,164,92,0.25)" stroke="rgba(201,164,92,0.7)" strokeWidth="1" />
                  <circle cx="80" cy="25" r="3" fill="rgba(230,200,126,0.8)" />
                  <circle cx="130" cy="50" r="5" fill="rgba(201,164,92,0.15)" stroke="rgba(201,164,92,0.4)" strokeWidth="1" />
                  <circle cx="80" cy="75" r="5" fill="rgba(201,164,92,0.1)" stroke="rgba(201,164,92,0.3)" strokeWidth="1" />
                  <text x="80" y="13" fontFamily="var(--pf-mono)" fontSize="8" fill="rgba(201,164,92,0.5)" textAnchor="middle" letterSpacing="1">0→1</text>
                </svg>
              </div>
              <div className="pf-intro-opt-foot">
                <h3 className="pf-intro-opt-title">See what I&apos;m building</h3>
                <p className="pf-intro-opt-sub">Live products, 0→1</p>
                <span className="pf-intro-opt-enter">Enter →</span>
              </div>
            </button>

            <button type="button" className="pf-intro-opt" data-pf-intro="skip">
              <div className="pf-intro-opt-head">
                <span className="pf-intro-opt-num">03</span>
              </div>
              <div className="pf-intro-opt-art" aria-hidden="true">
                <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 80 90 A 50 50 0 0 1 30 50" stroke="rgba(201,164,92,0.12)" strokeWidth="1" fill="none" />
                  <path d="M 80 80 A 40 40 0 0 1 40 50" stroke="rgba(201,164,92,0.18)" strokeWidth="1" fill="none" />
                  <path d="M 80 70 A 30 30 0 0 1 50 50" stroke="rgba(201,164,92,0.25)" strokeWidth="1" fill="none" />
                  <path d="M 80 60 A 20 20 0 0 1 60 50" stroke="rgba(201,164,92,0.35)" strokeWidth="1.2" fill="none" />
                  <path d="M 80 50 A 10 10 0 0 1 70 50" stroke="rgba(201,164,92,0.5)" strokeWidth="1.5" fill="none" />
                  <path d="M 50 20 Q 90 10 120 40 T 140 80" stroke="rgba(201,164,92,0.2)" strokeWidth="1" fill="none" strokeDasharray="4 3" />
                  <circle cx="140" cy="80" r="4" fill="rgba(201,164,92,0.4)" stroke="rgba(230,200,126,0.7)" strokeWidth="1" />
                  <circle cx="50" cy="20" r="3" fill="rgba(201,164,92,0.25)" stroke="rgba(201,164,92,0.5)" strokeWidth="0.75" />
                </svg>
              </div>
              <div className="pf-intro-opt-foot">
                <h3 className="pf-intro-opt-title">Just exploring</h3>
                <p className="pf-intro-opt-sub">Browse at your own pace</p>
                <span className="pf-intro-opt-enter">Enter →</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="pf-progress" aria-hidden="true"><span /></div>
      <div className="pf-sphere-stage" aria-hidden="true" />

      <div className="pf-webgl" aria-hidden="true">
        {/* Ambient living layer — mira-style slow halo, radar pings and
            drifting motes. Pure CSS, sits behind all content, gold-tinted. */}
        <div className="pf-ambient">
          <span className="pf-halo" />
          <span className="pf-ping pf-ping-1" />
          <span className="pf-ping pf-ping-2" />
          <span className="pf-ping pf-ping-3" />
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={`pf-mote pf-mote-${i + 1}`} />
          ))}
        </div>
      </div>

      <header className="pf-nav" data-menu-open={menuOpen ? 'true' : undefined}>
        <div className="pf-nav-inner">
          <a href="#top" className="pf-logo">Hitesh Agrawal<b>.</b></a>
          <nav className="pf-nav-links">
            <a href="#work">Work</a>
            <a href="#projects">Building</a>
            <a href="#contact">Contact</a>
          </nav>
          <a href={RESUME} target="_blank" rel="noopener noreferrer" className="pf-nav-studio">Résumé <ArrowOut size={11} /></a>
          <button
            type="button"
            className="pf-nav-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="pf-mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
        <nav id="pf-mobile-menu" className="pf-nav-mobile" aria-label="Sections" hidden={!menuOpen}>
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#projects" onClick={() => setMenuOpen(false)}>Building</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a href={`mailto:${EMAIL}`} onClick={() => setMenuOpen(false)}>Email</a>
          <a href={RESUME} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Résumé <ArrowOut size={11} /></a>
        </nav>
      </header>

      <main>
        <section className="pf-hero" id="top">
          <div className="pf-wrap">
            <div className="pf-hero-center">
              <div className="pf-hero-copy">
                <div className="pf-eyebrow pf-reveal">
                  <span className="dot" />
                  Open to senior product roles — worldwide
                </div>
                <h1 className="pf-reveal">
                  I help turn fuzzy ideas into <em>shipped</em> product.
                </h1>
                <p className="pf-hero-sub pf-reveal">
                  Product manager, 0→1 to 280M-user scale. At Jio I helped onboard
                  280M+ customers with zero downtime. On my own since: sold a B2B
                  product before building it, and took a services business to profit
                  in one quarter.
                </p>
                <div className="pf-hero-ctas pf-reveal">
                  <a href={`mailto:${EMAIL}`} className="pf-btn pf-btn-primary pf-magnetic" data-cursor="Let's talk">
                    Start a conversation <ArrowRight size={13} />
                  </a>
                  <a href={RESUME} target="_blank" rel="noopener noreferrer" className="pf-btn pf-btn-ghost pf-magnetic">
                    Read résumé
                  </a>
                </div>
              </div>
            </div>
            <div className="pf-scrollcue pf-reveal" aria-hidden="true">
              <span>Scroll</span>
              <i />
            </div>
          </div>
        </section>

        <section className="pf-work" id="work" aria-label="Selected work">
          <div className="pf-work-pin">
            <div className="pf-work-side-label" aria-hidden="true">
              <span>Selected work</span>
            </div>
            <div className="pf-work-head">
              <div className="pf-section-tag">Selected work</div>
              <h2>Work <em>I&apos;m proud of</em></h2>
            </div>
            <div className="pf-work-track">
              {CASE_STUDIES.map((cs, i) => (
                <article key={cs.title} className="pf-wpanel">
                  <span className="pf-wpanel-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="pf-wpanel-body">
                    <div className="pf-wpanel-kicker">{cs.kicker}</div>
                    <h3 className="pf-wpanel-title">{cs.title} <em>{cs.accent}</em></h3>
                    <p className="pf-wpanel-sub">{cs.subtitle}</p>
                    <div className="pf-wpanel-metrics">
                      {cs.metrics.map((m) => (
                        <div key={m.label} className="pf-wpanel-metric">
                          <strong>{m.value}</strong>
                          <span>{m.label}</span>
                        </div>
                      ))}
                      {cs.link && (
                        <a href={cs.link.href} target="_blank" rel="noopener noreferrer" className="pf-cs-link" data-cursor="Open">
                          {cs.link.label} <ArrowOut size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="pf-work-dots" aria-hidden="true">
              {CASE_STUDIES.map((cs, i) => (
                <span key={cs.title} className="pf-work-dot" data-active={i === 0 ? 'true' : undefined} />
              ))}
            </div>
          </div>
        </section>

        <div className="pf-marquee" aria-hidden="true">
          <div className="pf-marquee-track">
            {[0, 1].map((dup) => (
              <div className="pf-marquee-set" key={dup}>
                {MARQUEE.map((m) => (
                  <span className="pf-marquee-item" key={m}>{m}<span className="s">◆</span></span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="pf-section pf-proj-section" id="projects">
          <div className="pf-proj-pin">
            <div className="pf-section-vlabel" aria-hidden="true"><span>Building</span></div>
            <div className="pf-section-head pf-reveal">
              <div className="pf-section-tag">Building &amp; shipped</div>
              <h2>Projects I&apos;m <em>building</em></h2>
            </div>
            <div className="pf-proj-stage">
              <div className="pf-proj-orbit">
                <span className="pf-proj-orbit-ring pf-proj-orbit-ring-1" aria-hidden="true" />
                <span className="pf-proj-orbit-ring pf-proj-orbit-ring-2" aria-hidden="true" />
                <span className="pf-proj-orbit-core" aria-hidden="true"><GithubMark size={26} /></span>
                {featuredProjects.map((p, i) => {
                  const Icon = PROJECT_ICONS[i] ?? GithubMark;
                  return (
                    <button
                      type="button"
                      key={p.name}
                      className={`pf-proj-orbit-node pf-proj-orbit-node-${i}`}
                      data-active={i === 0 ? 'true' : undefined}
                      data-proj-node={i}
                      aria-label={`Show ${p.name}`}
                    >
                      <span className="pf-proj-orbit-node-ico"><Icon size={22} /></span>
                    </button>
                  );
                })}
              </div>
              <div className="pf-proj-cards">
                {featuredProjects.map((p, i) => (
                  <article key={p.name} className="pf-proj-card" data-active={i === 0 ? 'true' : undefined}>
                    <div className="pf-proj-card-top">
                      {p.current ? <span className="pf-badge pf-badge-now"><i />Building now</span> : <span className="pf-proj-year">{p.year}</span>}
                      <div className="pf-proj-links">
                        <a href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on GitHub`} data-cursor="Code">
                          <GithubMark size={16} />
                        </a>
                        {p.live && (
                          <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} live`} data-cursor="Live">
                            <ArrowOut size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                    <h3 className="pf-proj-name">{p.name}</h3>
                    <div className="pf-proj-tagline">{p.tagline}</div>
                    <p className="pf-proj-desc">{p.desc}</p>
                    <div className="pf-proj-tags">
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pf-section pf-principles-section" id="principles">
          <div className="pf-section-vlabel" aria-hidden="true"><span>How I operate</span></div>
          <div className="pf-wrap">
            <div className="pf-section-head pf-reveal">
              <div className="pf-section-tag">Operating system</div>
              <h2>Intelligence across <em>every decision</em></h2>
            </div>
            <div className="pf-principles">
              {PRINCIPLES.map((pr, i) => (
                <div key={pr.title} className="pf-principle pf-reveal" style={{ top: `calc(7vh + ${i * 1.6}rem)` }}>
                  <div className="pf-principle-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="pf-principle-body">
                    <h3>{pr.title}</h3>
                    <p>{pr.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pf-section pf-recog-section" id="recognition">
          <div className="pf-recog-pin">
            <div className="pf-section-vlabel" aria-hidden="true"><span>Recognition</span></div>
            <div className="pf-wrap pf-recog-stage">
              <div className="pf-recog-text">
                <div className="pf-section-tag">Recognition</div>
                <h2 className="pf-recog-heading">Worth <em>noting</em></h2>
                <div className="pf-recog-panels">
                  {RECOGNITION.map((r) => (
                    <div key={r.value} className="pf-recog-panel">
                      <span className="pf-recog-panel-badge" aria-hidden="true">★</span>
                      <strong className="pf-recog-panel-value">{r.value}</strong>
                      <p className="pf-recog-panel-label">{r.label}</p>
                      <ul className="pf-recog-panel-list">
                        <li><CheckIcon size={15} /> {r.detail}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pf-contact" id="contact">
          <div className="pf-section-vlabel" aria-hidden="true"><span>Hiring</span></div>
          <div className="pf-wrap">
            <div className="pf-contact-grid">
              <div className="pf-reveal">
                <div className="pf-section-tag">Contact</div>
                <h2>Hiring for a senior <em>product seat?</em></h2>
                <div className="pf-contact-ctas">
                  <a href={`mailto:${EMAIL}`} className="pf-btn pf-btn-primary pf-magnetic" data-cursor="Email me">
                    Email me <ArrowRight size={13} />
                  </a>
                  <a href={RESUME} target="_blank" rel="noopener noreferrer" className="pf-btn pf-btn-ghost pf-magnetic">
                    View résumé
                  </a>
                </div>
                <p className="pf-availability">
                  <span className="d" />
                  Remote or relocation · IST (UTC+5:30), overlap-flexible
                </p>
              </div>
              <div className="pf-reveal">
                <div className="pf-hiring-card">
                  <span className="pf-badge pf-badge-now"><i />Open to offers</span>
                  <strong>Product Manager</strong>
                  <span>0→1, growth, or platform — bring the ambiguous problem</span>
                </div>
                <div className="pf-contact-rows">
                  <div className="pf-contact-row"><span>Email</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
                  <div className="pf-contact-row"><span>LinkedIn</span><a href={LINKEDIN} target="_blank" rel="noopener noreferrer">hitesh-agrawal</a></div>
                  <div className="pf-contact-row"><span>Résumé</span><a href={RESUME} target="_blank" rel="noopener noreferrer">Hitesh-Agrawal-Resume.pdf</a></div>
                  <div className="pf-contact-row"><span>Based in</span><span className="pf-contact-loc">Dhule · Mumbai, IN</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="pf-wordmark pf-reveal" aria-hidden="true">
        <svg viewBox="0 0 1600 220" preserveAspectRatio="xMidYMid meet">
          <text
            x="800" y="182"
            textAnchor="middle"
            fontFamily="Instrument Serif, Times New Roman, serif"
            fontSize="220"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <tspan>Hitesh</tspan>
            <tspan fontStyle="italic" dx="18">Agrawal</tspan>
          </text>
        </svg>
      </div>

      <footer className="pf-footer">
        <div className="pf-footer-inner">
          <span>Hitesh Agrawal · © 2026</span>
          <span className="pf-footer-status"><span className="d" /> Open to senior product roles</span>
          <a href="/" className="pf-footer-back">BlackHook Studio <ArrowOut size={11} /></a>
        </div>
      </footer>
    </>
  );
}
