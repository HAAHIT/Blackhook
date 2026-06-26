import { useEffect } from 'react';
import { ArrowOut, ArrowRight, GithubMark, BrainIcon, DatabaseIcon, ReceiptIcon, CheckIcon } from '@/icons';
import { PROJECTS, SKILLS, CASE_STUDIES, PRINCIPLES, RECOGNITION } from '@/data/portfolio';
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
  useEffect(() => {
    initPortfolioMotion();
    return () => destroyPortfolioMotion();
  }, []);

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

      <header className="pf-nav">
        <div className="pf-nav-inner">
          <a href="#top" className="pf-logo">Hitesh Agrawal<b>.</b></a>
          <nav className="pf-nav-links">
            <a href="#work">Work</a>
            <a href="#projects">Building</a>
            <a href="#contact">Contact</a>
          </nav>
          <a href={RESUME} target="_blank" rel="noopener noreferrer" className="pf-nav-studio">Résumé <ArrowOut size={11} /></a>
        </div>
      </header>

      <main>
        <section className="pf-hero" id="top">
          <div className="pf-wrap">
            <div className="pf-hero-center">
              <div className="pf-hero-copy">
                <div className="pf-orb pf-reveal">
                  <span className="pf-orb-glow" />
                  <span className="pf-orb-core">
                    <span className="pf-orb-photo">
                      <img src="/hitesh-round.jpg" alt="Hitesh" width={148} height={148} />
                    </span>
                  </span>
                  <span className="pf-orb-spec" />
                </div>
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
              <h2>Case studies <em>I&apos;m proud of</em></h2>
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
              <div className="pf-proj-orbit" aria-hidden="true">
                <span className="pf-proj-orbit-ring pf-proj-orbit-ring-1" />
                <span className="pf-proj-orbit-ring pf-proj-orbit-ring-2" />
                <span className="pf-proj-orbit-core"><GithubMark size={26} /></span>
                {featuredProjects.map((p, i) => {
                  const Icon = PROJECT_ICONS[i] ?? GithubMark;
                  return (
                    <span key={p.name} className={`pf-proj-orbit-node pf-proj-orbit-node-${i}`} data-active={i === 0 ? 'true' : undefined}>
                      <span className="pf-proj-orbit-node-ico"><Icon size={22} /></span>
                    </span>
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

        <section className="pf-section" id="skills">
          <div className="pf-wrap">
            <div className="pf-section-head pf-reveal">
              <div className="pf-section-tag">Toolkit</div>
              <h2>What I <em>work with</em></h2>
            </div>
            <div className="pf-skills">
              {SKILLS.map((g) => (
                <div key={g.label} className="pf-skill-group pf-reveal">
                  <div className="pf-skill-label">{g.label}</div>
                  <div className="pf-skill-items">
                    {g.items.map((i) => (
                      <span key={i}>{i}</span>
                    ))}
                  </div>
                </div>
              ))}
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
                  {RECOGNITION.map((r, i) => (
                    <div key={r.value} className="pf-recog-panel" data-active={i === 0 ? 'true' : undefined}>
                      <strong className="pf-recog-panel-value">{r.value}</strong>
                      <p className="pf-recog-panel-label">{r.label}</p>
                      <ul className="pf-recog-panel-list">
                        <li><CheckIcon size={15} /> {r.detail}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pf-recog-card" aria-hidden="true">
                {RECOGNITION.map((r, i) => (
                  <div key={r.value} className="pf-recog-card-face" data-active={i === 0 ? 'true' : undefined}>
                    <span className="pf-recog-card-badge">★</span>
                    <strong>{r.value}</strong>
                    <span>{r.label}</span>
                  </div>
                ))}
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
                  <strong>Senior Product Manager</strong>
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
