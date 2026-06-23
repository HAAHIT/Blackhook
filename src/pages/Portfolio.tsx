import { useEffect, useState } from 'react';
import { ArrowOut, ArrowRight, GithubMark } from '@/icons';
import { PROJECTS, EXPERIENCE, SKILLS, CASE_STUDIES, PRINCIPLES, RECOGNITION, PROOF_STATS } from '@/data/portfolio';
import type { Glimpse } from '@/data/portfolio';
import { initPortfolioMotion, destroyPortfolioMotion } from '@/lib/portfolio-motion';

// Feature flag: in-card product previews (screenshots + synthetic glimpse).
// Disabled until we have appropriate, real assets for every product.
const SHOW_PRODUCT_PREVIEWS = false;

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

const projectRank = (p: (typeof PROJECTS)[number]) => (p.featured ? 0 : p.current ? 1 : 2);
const orderedProjects = [...PROJECTS].sort((a, b) => projectRank(a) - projectRank(b));

/**
 * Card preview window. Shows the real product screenshot (with a hover
 * scroll-tour) when one is available; if the shot is missing or fails to
 * load, it falls back to the synthetic glimpse rows so a card is never
 * left with a broken image. Drop a file at the shot path to light it up.
 */
function GlimpsePreview({ glimpse }: { glimpse: Glimpse }) {
  const [shotFailed, setShotFailed] = useState(false);
  const showShot = Boolean(glimpse.shot) && !shotFailed;

  return (
    <div className={`pf-glimpse${showShot ? ' has-shot' : ''}`} aria-hidden="true">
      <div className="pf-glimpse-bar">
        <span className="pf-glimpse-dots"><i /><i /><i /></span>
        <span className="pf-glimpse-chrome">{glimpse.chrome}</span>
      </div>
      {showShot ? (
        <div className={`pf-shot-frame pf-shot-${glimpse.shotFit ?? 'wide'}`}>
          <img
            className="pf-shot"
            src={glimpse.shot}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setShotFailed(true)}
          />
          <span className="pf-shot-hint">Hover to explore</span>
        </div>
      ) : (
        <div className="pf-glimpse-body">
          {glimpse.rows.map((r, ri) => (
            <div key={ri} className={`pf-gl-row pf-gl-${r.type}`}>
              <span className="pf-gl-text">{r.text}</span>
              {r.value && (
                <span className={`pf-gl-val${r.trend ? ` pf-gl-${r.trend}` : ''}`}>
                  {r.value}
                  {r.trend === 'up' ? ' ▲' : r.trend === 'down' ? ' ▼' : ''}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Portfolio() {
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
      <div className="pf-webgl" aria-hidden="true" />

      <header className="pf-nav">
        <div className="pf-nav-inner">
          <a href="#top" className="pf-logo">Hitesh Agrawal<b>.</b></a>
          <nav className="pf-nav-links">
            <a href="#work">Work</a>
            <a href="#path">Path</a>
            <a href="#projects">Building</a>
            <a href="#contact">Contact</a>
          </nav>
          <a href={RESUME} target="_blank" rel="noopener noreferrer" className="pf-nav-studio">Résumé <ArrowOut size={11} /></a>
        </div>
      </header>

      <main>
        <section className="pf-hero" id="top">
          <div className="pf-wrap">
            <div className="pf-hero-layout">
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
              <div className="pf-hero-photo-wrap">
                <div className="pf-hero-photo pf-reveal">
                  <img src="/hitesh.jpg" alt="Hitesh Agrawal" />
                </div>
              </div>
            </div>
            <div className="pf-scrollcue pf-reveal" aria-hidden="true">
              <span>Scroll</span>
              <i />
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

        <section className="pf-numbers" id="proof-numbers" aria-label="Proof, by the numbers">
          <div className="pf-num-stage">
            {PROOF_STATS.map((s, i) => (
              <div className="pf-num-chapter" key={s.value}>
                <div className="pf-num-index">
                  {String(i + 1).padStart(2, '0')} <i>/</i> {String(PROOF_STATS.length).padStart(2, '0')}
                </div>
                <div className="pf-num-value">{s.value}</div>
                <div className="pf-num-label">{s.label}</div>
                <p className="pf-num-note">{s.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pf-work" id="work" aria-label="Selected work">
          <div className="pf-work-pin">
            <div className="pf-work-head">
              <div className="pf-section-tag">Selected work</div>
              <h2>Work I&apos;m <em>proud of</em></h2>
            </div>
            <div className="pf-work-track">
              {CASE_STUDIES.map((cs, i) => (
                <article key={cs.title} className="pf-wpanel">
                  <span className="pf-wpanel-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="pf-wpanel-body">
                    <div className="pf-wpanel-kicker">{cs.kicker}</div>
                    <h3 className="pf-wpanel-title">{cs.title}</h3>
                    <div className="pf-wpanel-cols">
                      <div className="pf-wpanel-col">
                        <h4>The problem</h4>
                        <p>{cs.challenge}</p>
                      </div>
                      <div className="pf-wpanel-col">
                        <h4>What I did</h4>
                        <p>{cs.approach}</p>
                      </div>
                      <div className="pf-wpanel-col">
                        <h4>The outcome</h4>
                        <p>{cs.outcome}</p>
                      </div>
                    </div>
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
            <div className="pf-work-rail" aria-hidden="true"><span className="pf-work-rail-fill" /></div>
          </div>
        </section>

        <section className="pf-section" id="path">
          <div className="pf-wrap">
            <div className="pf-section-head pf-reveal">
              <div className="pf-section-tag">Path</div>
              <h2>Where I&apos;ve <em>been</em></h2>
            </div>
            <div className="pf-xp-list">
              {EXPERIENCE.map((x) => (
                <article key={x.org} className="pf-xp pf-reveal">
                  <div className="pf-xp-range">{x.range}</div>
                  <div>
                    <h3 className="pf-xp-role">{x.role}</h3>
                    <div className="pf-xp-meta">
                      <span className="pf-xp-org">{x.org}</span>
                      <span className="pf-xp-place">{x.place}</span>
                    </div>
                    <p className="pf-xp-desc">{x.desc.replace('28Cr+', '280M+')}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pf-section" id="projects">
          <div className="pf-wrap">
            <div className="pf-section-head pf-reveal">
              <div className="pf-section-tag">Building &amp; shipped</div>
              <h2>What I&apos;ve <em>built</em></h2>
              <p>Products I&apos;m building, plus the tools and experiments behind them — most shipped with AI in the loop.{SHOW_PRODUCT_PREVIEWS ? ' Peek inside any card before you dig deeper.' : ''}</p>
            </div>
            <div className="pf-proj-grid">
              {orderedProjects.map((p) => (
                <article key={p.name} className="pf-proj pf-reveal">
                  {SHOW_PRODUCT_PREVIEWS && p.glimpse && <GlimpsePreview glimpse={p.glimpse} />}
                  <div className="pf-proj-top">
                    {p.featured ? (
                      <div className="pf-proj-featured-badges">
                        <span className="pf-badge pf-badge-ai">AI Product</span>
                        <span className="pf-badge pf-badge-featured">Featured</span>
                      </div>
                    ) : p.current ? (
                      <span className="pf-badge pf-badge-now"><i />Building now</span>
                    ) : (
                      <span className="pf-proj-year">{p.year}</span>
                    )}
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

        <section className="pf-section" id="principles">
          <div className="pf-wrap">
            <div className="pf-section-head pf-reveal">
              <div className="pf-section-tag">Operating system</div>
              <h2>How I <em>operate</em></h2>
            </div>
            <div className="pf-principles">
              {PRINCIPLES.map((pr, i) => (
                <div key={pr.title} className="pf-principle pf-reveal">
                  <span className="pf-principle-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{pr.title}</h3>
                  <p>{pr.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pf-section" id="recognition">
          <div className="pf-wrap">
            <div className="pf-section-head pf-reveal">
              <div className="pf-section-tag">Recognition</div>
              <h2>Worth <em>noting</em></h2>
            </div>
            <div className="pf-recog">
              {RECOGNITION.map((r) => (
                <div key={r.value} className="pf-recog-item pf-reveal">
                  <strong>{r.value}</strong>
                  <span className="pf-recog-label">{r.label}</span>
                  <span className="pf-recog-detail">{r.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pf-contact" id="contact">
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
              <div className="pf-contact-rows pf-reveal">
                <div className="pf-contact-row"><span>Email</span><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
                <div className="pf-contact-row"><span>LinkedIn</span><a href={LINKEDIN} target="_blank" rel="noopener noreferrer">hitesh-agrawal</a></div>
                <div className="pf-contact-row"><span>Résumé</span><a href={RESUME} target="_blank" rel="noopener noreferrer">Hitesh-Agrawal-Resume.pdf</a></div>
                <div className="pf-contact-row"><span>Based in</span><span className="pf-contact-loc">Dhule · Mumbai, IN</span></div>
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
