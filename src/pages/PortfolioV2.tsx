import { useEffect } from 'react';
import { ArrowOut, ArrowRight, GithubMark } from '@/icons';
import { PROJECTS, EXPERIENCE, SKILLS } from '@/data/portfolio';
import { initPortfolioV2Motion, destroyPortfolioV2Motion } from '@/lib/portfolio-v2-motion';

const WHATSAPP = 'https://wa.me/919309803663';
const EMAIL = 'agrawalhitesh4444@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/hitesh-agrawal-5a02a416b/';

const NOW_BUILDING = [
  {
    name: 'bolodb',
    href: 'https://github.com/HAAHIT/bolodb',
    desc: 'Ask your data, trust the answer — a text-to-SQL product for non-technical users. Type a question in plain language, get back the right query and an answer you can rely on.',
  },
  {
    name: 'smriti',
    href: 'https://github.com/HAAHIT/smriti',
    desc: 'An AI memory layer — a browser extension that archives conversations from Claude, ChatGPT and Gemini, a local SQLite search index, and an MCP server that hands your history back to Claude in context.',
  },
  {
    name: 'SoloBooks',
    href: 'https://solobooks.in',
    desc: 'Bookkeeping for Indian MSMEs that speaks plain business, not accounting jargon — fast billing, party ledgers and AI purchase-bill OCR under the hood.',
  },
  {
    name: 'Commodity SaaS',
    href: 'https://murlioils.com',
    desc: 'A pricing and order-management platform for the oil and cement trade. Validated through discovery, then secured a paying pilot that covered the full build before launch.',
  },
  {
    name: 'Healthcare at home',
    href: 'https://care-ops-central.vercel.app',
    desc: 'An Urban-Company-style services business — nursing, physiotherapy and elder care. 300+ visits and ₹3L+ MRR at 30% margin in the first quarter, on an ops platform I built and run.',
  },
];

export function PortfolioV2() {
  useEffect(() => {
    initPortfolioV2Motion();
    return () => destroyPortfolioV2Motion();
  }, []);

  return (
    <>
      <header className="pv-nav">
        <div className="pv-nav-inner">
          <a href="#top" className="pv-logo">Hitesh<span>.</span></a>
          <nav className="pv-nav-links">
            <a href="#about">About</a>
            <a href="#journey">Journey</a>
            <a href="#work">Work</a>
            <a href="#now">Now</a>
            <a href="#contact">Contact</a>
          </nav>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="pv-nav-cta pv-magnetic">
            Say hello <ArrowRight size={12} />
          </a>
        </div>
      </header>

      <main>
        <section className="pv-hero" id="top">
          <div className="pv-wrap">
            <div className="pv-hero-grid">
              <div className="pv-hero-copy">
                <div className="pv-eyebrow pv-reveal">
                  <span className="pv-dot" />
                  Open to new projects
                </div>
                <h1 className="pv-reveal">
                  Hey, I&apos;m Hitesh —<br />
                  I build <span className="pv-highlight">0&nbsp;to&nbsp;1</span><br />
                  products that ship.
                </h1>
                <p className="pv-hero-sub pv-reveal">
                  Product manager and builder. I&apos;ve scaled an enterprise platform
                  to 28&nbsp;Cr+ users and bootstrapped ventures from a blank page to
                  paying customers.
                </p>
                <div className="pv-hero-ctas pv-reveal">
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="pv-btn pv-btn-primary pv-magnetic">
                    Start a conversation <ArrowRight size={13} />
                  </a>
                  <a href="/Hitesh-Agrawal-Resume.pdf" target="_blank" rel="noopener noreferrer" className="pv-btn pv-btn-ghost pv-magnetic">
                    Read résumé
                  </a>
                </div>
              </div>
              <div className="pv-hero-photo pv-reveal">
                <img src="/hitesh.jpg" alt="Hitesh Agrawal" />
                <div className="pv-hero-tag">
                  <strong>3+ yrs</strong>
                  <span>Scale &amp; 0→1</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pv-section" id="about">
          <div className="pv-wrap">
            <div className="pv-about-grid">
              <div className="pv-reveal">
                <div className="pv-section-tag">About</div>
                <h2>A bit <span className="pv-highlight">about me</span></h2>
                <p className="pv-about-text">
                  I&apos;m a product manager and 0-to-1 builder based in India. I spent
                  three years scaling Reliance&apos;s loyalty platform to hundreds of
                  millions of users, and now run BlackHook — building AI products and
                  bootstrapped ventures from a blank page to paying customers.
                </p>
                <div className="pv-skills">
                  {SKILLS.map((g) => (
                    <div key={g.label} className="pv-skill-group">
                      <div className="pv-skill-label">{g.label}</div>
                      <div className="pv-skill-items">
                        {g.items.map((i) => (
                          <span key={i}>{i}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pv-stats pv-reveal">
                <div className="pv-stat">
                  <strong data-pv-counter="28" data-pv-suffix="Cr+">28Cr+</strong>
                  <span>Users scaled at Jio</span>
                </div>
                <div className="pv-stat">
                  <strong data-pv-counter="22" data-pv-suffix="">22</strong>
                  <span>Enterprise partners</span>
                </div>
                <div className="pv-stat pv-stat--dark">
                  <strong>3+</strong>
                  <span>Years across scale &amp; 0→1</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pv-section" id="journey">
          <div className="pv-wrap">
            <div className="pv-section-head pv-reveal">
              <div className="pv-section-tag">Journey</div>
              <h2>Where I&apos;ve <span className="pv-highlight">been</span></h2>
            </div>
            <div className="pv-journey-list">
              {EXPERIENCE.map((x) => (
                <article key={x.org} className="pv-journey-item pv-reveal">
                  <div className="pv-journey-range">{x.range}</div>
                  <div className="pv-journey-body">
                    <h3>{x.role}</h3>
                    <div className="pv-journey-meta">
                      <span className="pv-journey-org">{x.org}</span>
                      <span className="pv-journey-place">{x.place}</span>
                    </div>
                    <p>{x.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pv-promo">
          <div className="pv-wrap">
            <div className="pv-promo-inner pv-reveal">
              <h2>Got something worth building? <span className="pv-highlight">Let&apos;s talk.</span></h2>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="pv-btn pv-btn-light pv-magnetic">
                Chat on WhatsApp <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </section>

        <section className="pv-section" id="work">
          <div className="pv-wrap">
            <div className="pv-section-head pv-reveal">
              <div className="pv-section-tag">Work</div>
              <h2>Things I&apos;ve <span className="pv-highlight">shipped</span></h2>
              <p>A selection of repos — products, tools and experiments, most built with AI in the loop.</p>
            </div>
            <div className="pv-work-grid">
              {PROJECTS.map((p, i) => (
                <article key={p.name} className={`pv-work-card pv-cover-${(i % 4) + 1} pv-reveal`}>
                  <div className="pv-work-cover">
                    <span>{p.name.slice(0, 2).toUpperCase()}</span>
                    {p.featured && <div className="pv-work-badge">Featured</div>}
                    {p.current && !p.featured && <div className="pv-work-badge pv-work-badge--alt">Current</div>}
                  </div>
                  <div className="pv-work-body">
                    <div className="pv-work-top">
                      <h3>{p.name}</h3>
                      <div className="pv-work-links">
                        <a href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on GitHub`}>
                          <GithubMark size={15} />
                        </a>
                        {p.live && (
                          <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} live`}>
                            <ArrowOut size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="pv-work-tagline">{p.tagline}</div>
                    <div className="pv-work-tags">
                      {p.tags.map((t) => <span key={t}>{t}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pv-section" id="now">
          <div className="pv-wrap">
            <div className="pv-section-head pv-reveal">
              <div className="pv-section-tag">Now</div>
              <h2>What I&apos;m <span className="pv-highlight">building today</span></h2>
              <p>Five things in flight at once — all started from customer discovery, not a deck.</p>
            </div>
            <div className="pv-now-list">
              {NOW_BUILDING.map((n) => (
                <a key={n.name} href={n.href} target="_blank" rel="noopener noreferrer" className="pv-now-row pv-reveal">
                  <div className="pv-now-name">{n.name}</div>
                  <p className="pv-now-desc">{n.desc}</p>
                  <ArrowOut size={16} />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="pv-cta" id="contact">
          <div className="pv-wrap">
            <div className="pv-cta-inner pv-reveal">
              <div className="pv-section-tag">Contact</div>
              <h2>Let&apos;s create<br /><span className="pv-highlight">something great.</span></h2>
              <div className="pv-cta-actions">
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="pv-btn pv-btn-primary pv-magnetic">
                  Chat on WhatsApp <ArrowRight size={13} />
                </a>
                <a href={`mailto:${EMAIL}`} className="pv-btn pv-btn-ghost pv-magnetic">
                  {EMAIL}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="pv-footer">
        <div className="pv-wrap pv-footer-inner">
          <a href="#top" className="pv-logo pv-logo--light">Hitesh<span>.</span></a>
          <div className="pv-footer-links">
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/HAAHIT" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
          <div className="pv-footer-meta">
            <span>Hitesh Agrawal · © 2026</span>
            <a href="/" className="pv-footer-back">BlackHook Studio <ArrowOut size={11} /></a>
          </div>
        </div>
      </footer>
    </>
  );
}
