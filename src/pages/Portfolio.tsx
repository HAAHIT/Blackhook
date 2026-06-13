import { useEffect } from 'react';
import { ArrowOut, ArrowRight, GithubMark } from '@/icons';
import { PROJECTS, EXPERIENCE, SKILLS, CASE_STUDIES, PRINCIPLES, RECOGNITION } from '@/data/portfolio';
import { initPortfolioMotion, destroyPortfolioMotion } from '@/lib/portfolio-motion';

const WHATSAPP = 'https://wa.me/919309803663';
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
            <a href="#proof">Proof</a>
            <a href="#now">Now</a>
            <a href="#path">Path</a>
            <a href="#projects">Projects</a>
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
                  I turn fuzzy <em>ambition</em> into shipped product.
                </h1>
                <p className="pf-hero-sub pf-reveal">
                  Product leader across 0→1 and 280M-user scale. I&apos;ve migrated
                  280M+ customers with zero downtime at one of the world&apos;s largest
                  consumer platforms, sold a B2B product before it existed, and run a
                  services business that turned profitable in its first quarter.
                </p>
                <div className="pf-hero-ctas pf-reveal">
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="pf-btn pf-btn-primary pf-magnetic" data-cursor="Let's talk">
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
            <div className="pf-facts">
              <div className="pf-fact"><strong data-pf-counter="280" data-pf-suffix="M+">280M+</strong><span>Users migrated · zero downtime</span></div>
              <div className="pf-fact"><strong data-pf-counter="22" data-pf-suffix="">22</strong><span>Enterprise partners</span></div>
              <div className="pf-fact"><strong data-pf-counter="5" data-pf-suffix="">5</strong><span>Ventures in flight</span></div>
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

        <section className="pf-section" id="proof">
          <div className="pf-wrap">
            <div className="pf-section-head pf-reveal">
              <div className="pf-section-tag">Proof</div>
              <h2>Proof, not <em>promises</em></h2>
              <p>Four problems, four shipped outcomes — at enterprise scale and from zero.</p>
            </div>
            <div className="pf-cs-list">
              {CASE_STUDIES.map((cs, i) => (
                <article key={cs.title} className="pf-cs pf-reveal">
                  <div className="pf-cs-head">
                    <span className="pf-cs-num">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <div className="pf-cs-kicker">{cs.kicker}</div>
                      <h3>{cs.title}</h3>
                    </div>
                  </div>
                  <div className="pf-cs-grid">
                    <div className="pf-cs-col">
                      <h4>The problem</h4>
                      <p>{cs.challenge}</p>
                    </div>
                    <div className="pf-cs-col">
                      <h4>What I did</h4>
                      <p>{cs.approach}</p>
                    </div>
                    <div className="pf-cs-col">
                      <h4>The outcome</h4>
                      <p>{cs.outcome}</p>
                    </div>
                  </div>
                  <div className="pf-cs-metrics">
                    {cs.metrics.map((m) => (
                      <div key={m.label} className="pf-cs-metric">
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
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pf-section" id="now">
          <div className="pf-wrap">
            <div className="pf-section-head pf-reveal">
              <div className="pf-section-tag">Now</div>
              <h2>What I&apos;m <em>building today</em></h2>
              <p>Five ventures in flight at once — all started from customer discovery, not a deck.</p>
            </div>
            <div className="pf-now-grid">
              <a href="https://github.com/HAAHIT/bolodb" target="_blank" rel="noopener noreferrer" className="pf-now-card pf-reveal" data-cursor="View">
                <div className="pf-now-k">bolodb <ArrowOut size={10} /></div>
                <p>
                  Ask your data, trust the answer — a text-to-SQL product for
                  non-technical users. Type a question in plain language, get back
                  the right query and an answer you can rely on.
                </p>
              </a>
              <a href="https://github.com/HAAHIT/smriti" target="_blank" rel="noopener noreferrer" className="pf-now-card pf-reveal" data-cursor="View">
                <div className="pf-now-k">smriti <ArrowOut size={10} /></div>
                <p>
                  An AI memory layer — a browser extension that archives conversations
                  from Claude, ChatGPT and Gemini, a local SQLite search index, and an
                  MCP server that hands your history back to Claude in context.
                </p>
              </a>
              <a href="https://solobooks.in" target="_blank" rel="noopener noreferrer" className="pf-now-card pf-reveal" data-cursor="View">
                <div className="pf-now-k">SoloBooks <ArrowOut size={10} /></div>
                <p>
                  Bookkeeping for Indian MSMEs that speaks plain business, not
                  accounting jargon — fast billing, party ledgers and AI purchase-bill
                  OCR under the hood.
                </p>
              </a>
              <a href="https://murlioils.com" target="_blank" rel="noopener noreferrer" className="pf-now-card pf-reveal" data-cursor="View">
                <div className="pf-now-k">Commodity SaaS <ArrowOut size={10} /></div>
                <p>
                  A pricing and order-management platform for the oil and cement trade.
                  Validated through discovery, then secured a paying pilot that covered
                  the full build before launch.
                </p>
              </a>
              <a href="https://care-ops-central.vercel.app" target="_blank" rel="noopener noreferrer" className="pf-now-card pf-reveal" data-cursor="View">
                <div className="pf-now-k">Healthcare at home <ArrowOut size={10} /></div>
                <p>
                  An Urban-Company-style services business — nursing, physiotherapy and
                  elder care. 300+ visits and ₹3L+ MRR at 30% margin in the first
                  quarter, on an ops platform I built and run.
                </p>
              </a>
            </div>
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
              <div className="pf-section-tag">Projects</div>
              <h2>Things I&apos;ve <em>shipped</em></h2>
              <p>Eight repos — products, tools and experiments, most built with AI in the loop.</p>
            </div>
            <div className="pf-proj-grid">
              {PROJECTS.map((p) => (
                <article key={p.name} className="pf-proj pf-reveal">
                  <div className="pf-proj-top">
                    {p.featured ? (
                      <div className="pf-proj-featured-badges">
                        <span className="pf-badge pf-badge-ai">AI Product</span>
                        <span className="pf-badge pf-badge-featured">Featured</span>
                      </div>
                    ) : p.current ? (
                      <span className="pf-badge">Current</span>
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
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="pf-btn pf-btn-primary pf-magnetic" data-cursor="Let's talk">
                    Chat on WhatsApp <ArrowRight size={13} />
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
                <div className="pf-contact-row"><span>Based in</span><a href={WHATSAPP} target="_blank" rel="noopener noreferrer">Dhule · Mumbai, IN</a></div>
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
