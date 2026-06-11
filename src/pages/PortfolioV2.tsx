import { useEffect } from 'react';
import { ArrowOut, ArrowRight, HookMark } from '@/icons';
import { PROJECTS, EXPERIENCE, SKILLS } from '@/data/portfolio';
import { initPortfolioV2Motion, destroyPortfolioV2Motion } from '@/lib/portfolio-v2-motion';

const WHATSAPP = 'https://wa.me/919309803663';
const EMAIL = 'agrawalhitesh4444@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/hitesh-agrawal-5a02a416b/';
const GITHUB = 'https://github.com/HAAHIT';

const EXP_TAGS: Record<string, string[]> = {
  'BlackHook Services': ['Product', '0→1', 'Ops'],
  'Jio Platforms Limited': ['Scale', 'Loyalty', 'B2B'],
  FindUtsav: ['0→1', 'Mobile'],
  'Savitribai Phule Pune University': ['B.E. ECE', 'CAT / XAT'],
};

const NOW_BUILDING = [
  {
    name: 'bolodb',
    label: 'AI · Text-to-SQL',
    href: 'https://github.com/HAAHIT/bolodb',
    desc: 'Ask your data, trust the answer — a text-to-SQL product for non-technical users.',
  },
  {
    name: 'smriti',
    label: 'AI · Memory',
    href: 'https://github.com/HAAHIT/smriti',
    desc: 'An AI memory layer across Claude, ChatGPT and Gemini, with a local search index and MCP server.',
  },
  {
    name: 'SoloBooks',
    label: 'SaaS · MSME',
    href: 'https://solobooks.in',
    desc: 'Bookkeeping for Indian MSMEs in plain business language — fast billing and AI bill OCR.',
  },
];

export function PortfolioV2() {
  useEffect(() => {
    initPortfolioV2Motion();
    return () => destroyPortfolioV2Motion();
  }, []);

  const featured = PROJECTS.filter((p) => p.featured || p.current).slice(0, 6);
  const allSkills = SKILLS.flatMap((g) => g.items).slice(0, 12);

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
          </nav>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="pv-nav-cta pv-magnetic">
            Book a call <ArrowOut size={12} />
          </a>
        </div>
      </header>

      <main>
        {/* ---------- Hero ---------- */}
        <section className="pv-hero" id="top">
          <div className="pv-hero-stage">
            <div className="pv-hero-rail">
              <a href="/" className="pv-hero-mark" aria-label="BlackHook Studio">
                <HookMark size={22} />
              </a>
              <div className="pv-hero-rail-mid">
                <span className="pv-hero-rail-line" />
                <span className="pv-hero-vert">Product &amp; Strategy</span>
                <span className="pv-hero-rail-line" />
              </div>
              <span className="pv-hero-year">2026</span>
            </div>

            <div className="pv-hero-main">
              <div className="pv-hero-stats pv-reveal">
                <div className="pv-hstat">
                  <strong data-pv-counter="28" data-pv-suffix="Cr+">28Cr+</strong>
                  <span>Users scaled</span>
                </div>
                <div className="pv-hstat">
                  <strong data-pv-counter="22" data-pv-suffix="">22</strong>
                  <span>Enterprise partners</span>
                </div>
              </div>

              <div className="pv-hero-center">
                <h1 className="pv-hello">Hello</h1>
                <p className="pv-hero-tagline">— I&apos;m Hitesh, a product &amp; 0→1 builder.</p>
              </div>

              <a href="#about" className="pv-scroll">
                Scroll down <span className="pv-scroll-arrow">↓</span>
              </a>
            </div>

            <div className="pv-hero-portrait">
              <img src="/hitesh-bw.jpg" alt="Hitesh Agrawal" />
            </div>
          </div>
        </section>

        {/* ---------- About ---------- */}
        <section className="pv-section pv-about" id="about">
          <div className="pv-wrap">
            <div className="pv-label pv-reveal"><span className="pv-bullet" />About Me</div>
            <div className="pv-about-grid">
              <div className="pv-about-copy pv-reveal">
                <h2>
                  I turn fuzzy <em>ambition</em> into shipped product. I&apos;ve scaled an
                  enterprise platform to 28&nbsp;Cr+ users and bootstrapped ventures from a
                  blank page to paying customers.
                </h2>
                <div className="pv-tools">
                  {allSkills.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
              <div className="pv-about-side pv-reveal">
                <div className="pv-statcard">
                  <div className="pv-statcard-badge" aria-hidden="true">✦</div>
                  <strong>3×</strong>
                  <p>Delivery velocity with AI tooling — running three ventures as sole PM, at once.</p>
                </div>
                <ul className="pv-about-points">
                  <li>
                    <span className="pv-point-k">Jio · Product Manager</span>
                    Migrated 28&nbsp;Cr+ customers with zero downtime. Sole Star Performer.
                  </li>
                  <li>
                    <span className="pv-point-k">BlackHook · Co-Founder</span>
                    Three ventures from 0→1, a paying pilot secured before MVP.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Journey ---------- */}
        <section className="pv-section pv-journey" id="journey">
          <div className="pv-wrap">
            <div className="pv-label pv-reveal"><span className="pv-bullet" />Experience</div>
            <h2 className="pv-h2 pv-reveal">Explore my design <em>journey</em></h2>
            <div className="pv-journey-list">
              {EXPERIENCE.map((x) => (
                <article key={x.org} className="pv-journey-item pv-reveal">
                  <div className="pv-journey-head">
                    <h3>{x.org}</h3>
                    <span className="pv-journey-range">{x.range}</span>
                  </div>
                  <div className="pv-journey-role">
                    <span>{x.role}</span>
                    <span className="pv-journey-place">{x.place}</span>
                  </div>
                  <p className="pv-journey-desc">{x.desc}</p>
                  <div className="pv-journey-tags">
                    {(EXP_TAGS[x.org] ?? []).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Promo banner ---------- */}
        <section className="pv-promo">
          <div className="pv-wrap">
            <div className="pv-promo-inner pv-reveal">
              <div>
                <div className="pv-label pv-label--light"><span className="pv-bullet" />Let&apos;s work together</div>
                <h2>Have something worth building? Let&apos;s make it real.</h2>
              </div>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="pv-btn pv-btn-light pv-magnetic">
                Start a conversation <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </section>

        {/* ---------- Latest Works ---------- */}
        <section className="pv-section pv-work" id="work">
          <div className="pv-wrap">
            <div className="pv-work-head">
              <div className="pv-label pv-reveal pv-center"><span className="pv-bullet" />Portfolio</div>
              <h2 className="pv-h2 pv-center pv-reveal">Latest works</h2>
            </div>
            <div className="pv-work-grid">
              {featured.map((p, i) => (
                <a
                  key={p.name}
                  href={p.live ?? p.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`pv-work-card pv-tone-${(i % 4) + 1} pv-reveal`}
                >
                  <div className="pv-work-cover">
                    <span className="pv-art-sphere" />
                    <span className="pv-art-base" />
                    {p.featured && <div className="pv-work-badge">Featured</div>}
                  </div>
                  <div className="pv-work-body">
                    <h3>{p.name}</h3>
                    <span className="pv-work-arrow"><ArrowOut size={14} /></span>
                  </div>
                  <div className="pv-work-tagline">{p.tagline}</div>
                </a>
              ))}
            </div>
            <div className="pv-work-more pv-reveal">
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="pv-btn pv-btn-ghost pv-magnetic">
                View all on GitHub <ArrowOut size={13} />
              </a>
            </div>
          </div>
        </section>

        {/* ---------- Now building ---------- */}
        <section className="pv-section pv-now" id="now">
          <div className="pv-wrap">
            <div className="pv-label pv-reveal"><span className="pv-bullet" />Now</div>
            <h2 className="pv-h2 pv-reveal">What I&apos;m <em>building today</em></h2>
            <div className="pv-now-grid">
              {NOW_BUILDING.map((n, i) => (
                <a key={n.name} href={n.href} target="_blank" rel="noopener noreferrer" className={`pv-now-card pv-tone-${i + 1} pv-reveal`}>
                  <div className="pv-now-cover">
                    <span className="pv-art-sphere" />
                    <span className="pv-art-base" />
                  </div>
                  <div className="pv-now-tag">{n.label}</div>
                  <h3>{n.name}</h3>
                  <p>{n.desc}</p>
                  <span className="pv-now-link">Open <ArrowOut size={12} /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className="pv-cta">
          <div className="pv-wrap pv-cta-inner pv-reveal">
            <h2>Got a vision?<br />Let&apos;s bring it <em>to life.</em></h2>
            <div className="pv-cta-actions">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="pv-btn pv-btn-primary pv-magnetic">
                Book a call <ArrowRight size={13} />
              </a>
              <a href={`mailto:${EMAIL}`} className="pv-cta-mail">{EMAIL}</a>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="pv-footer">
        <div className="pv-wrap">
          <a href={`mailto:${EMAIL}`} className="pv-footer-mail">{EMAIL}</a>
          <div className="pv-footer-row">
            <a href="#top" className="pv-logo pv-logo--light">Hitesh<span>.</span></a>
            <div className="pv-footer-links">
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="/">BlackHook Studio ↗</a>
            </div>
            <span className="pv-footer-copy">© 2026 Hitesh Agrawal</span>
          </div>
        </div>
      </footer>
    </>
  );
}
