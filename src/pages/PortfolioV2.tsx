import { useEffect } from 'react';
import { ArrowOut, ArrowRight, GithubMark, HookMark } from '@/icons';
import { PROJECTS, EXPERIENCE, SKILLS, CASE_STUDIES, PRINCIPLES, RECOGNITION } from '@/data/portfolio';
import { initPortfolioV2Motion, destroyPortfolioV2Motion } from '@/lib/portfolio-v2-motion';

const WHATSAPP = 'https://wa.me/919309803663';
const EMAIL = 'agrawalhitesh4444@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/hitesh-agrawal-5a02a416b/';
const GITHUB = 'https://github.com/HAAHIT';
const RESUME = '/Hitesh-Agrawal-Resume.pdf';

const EXP_TAGS: Record<string, string[]> = {
  'BlackHook Services': ['Product', '0→1', 'P&L'],
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

  const allSkills = SKILLS.flatMap((g) => g.items).slice(0, 12);

  return (
    <>
      <header className="pv-nav">
        <div className="pv-nav-inner">
          <a href="#top" className="pv-logo">Hitesh<span>.</span></a>
          <nav className="pv-nav-links">
            <a href="#about">About</a>
            <a href="#work">Case studies</a>
            <a href="#journey">Journey</a>
            <a href="#now">Now</a>
          </nav>
          <div className="pv-nav-right">
            <a href={RESUME} target="_blank" rel="noopener noreferrer" className="pv-nav-resume">Résumé</a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="pv-nav-cta pv-magnetic">
              Book a call <ArrowOut size={12} />
            </a>
          </div>
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
                  <strong data-pv-counter="280" data-pv-suffix="M+">280M+</strong>
                  <span>Users migrated, zero downtime</span>
                </div>
                <div className="pv-hstat">
                  <strong data-pv-counter="22" data-pv-suffix="">22</strong>
                  <span>Enterprise partners</span>
                </div>
                <div className="pv-hstat">
                  <strong data-pv-counter="5" data-pv-suffix="">5</strong>
                  <span>Ventures in flight</span>
                </div>
              </div>

              <div className="pv-hero-center">
                <h1 className="pv-hello">Hello</h1>
                <p className="pv-hero-tagline">
                  — I&apos;m Hitesh Agrawal. Product leader across 0→1 and 280M-user scale.
                </p>
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
            <div className="pv-label pv-reveal"><span className="pv-bullet" />About</div>
            <div className="pv-about-grid">
              <div className="pv-about-copy pv-reveal">
                <h2>
                  I&apos;ve operated at both extremes of product — <em>280M-user</em> enterprise
                  scale, and founder-mode <em>0→1</em> with my own capital on the line.
                </h2>
                <p className="pv-about-lede">
                  Most product people pick a lane. I&apos;ve shipped a zero-downtime migration for
                  one of the world&apos;s largest consumer platforms, sold a B2B product before it
                  existed, and run a services business that turned profitable in its first
                  quarter. Today I operate three ventures simultaneously as sole PM — with AI
                  tooling as the force multiplier.
                </p>
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
                    <span className="pv-point-k">Jio Platforms · Product Manager</span>
                    280M+ customers migrated with zero downtime. Sole Star Performer.
                  </li>
                  <li>
                    <span className="pv-point-k">BlackHook · Co-Founder</span>
                    Three ventures from 0→1 — one sold before it was built, one profitable in Q1.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Case studies ---------- */}
        <section className="pv-section pv-work" id="work">
          <div className="pv-wrap">
            <div className="pv-label pv-reveal"><span className="pv-bullet" />Selected work</div>
            <h2 className="pv-h2 pv-reveal">Proof, not <em>promises</em></h2>
            <p className="pv-section-sub pv-reveal">
              Four problems, four shipped outcomes — at enterprise scale and from zero.
            </p>
            <div className="pv-cs-list">
              {CASE_STUDIES.map((cs, i) => (
                <article key={cs.title} className="pv-cs pv-reveal">
                  <div className="pv-cs-head">
                    <span className="pv-cs-num">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <div className="pv-cs-kicker">{cs.kicker}</div>
                      <h3>{cs.title}</h3>
                    </div>
                  </div>
                  <div className="pv-cs-grid">
                    <div className="pv-cs-col">
                      <h4>The problem</h4>
                      <p>{cs.challenge}</p>
                    </div>
                    <div className="pv-cs-col">
                      <h4>What I did</h4>
                      <p>{cs.approach}</p>
                    </div>
                    <div className="pv-cs-col">
                      <h4>The outcome</h4>
                      <p>{cs.outcome}</p>
                    </div>
                  </div>
                  <div className="pv-cs-metrics">
                    {cs.metrics.map((m) => (
                      <div key={m.label} className="pv-cs-metric">
                        <strong>{m.value}</strong>
                        <span>{m.label}</span>
                      </div>
                    ))}
                    {cs.link && (
                      <a href={cs.link.href} target="_blank" rel="noopener noreferrer" className="pv-cs-link">
                        {cs.link.label} <ArrowOut size={12} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Hiring banner ---------- */}
        <section className="pv-promo">
          <div className="pv-wrap">
            <div className="pv-promo-inner pv-reveal">
              <div>
                <div className="pv-label pv-label--light"><span className="pv-bullet" />The short version</div>
                <h2>
                  I&apos;ve done the 280M-user thing and the zero-to-one thing.
                  I&apos;m looking for the next hard problem.
                </h2>
              </div>
              <a href={RESUME} target="_blank" rel="noopener noreferrer" className="pv-btn pv-btn-light pv-magnetic">
                View résumé <ArrowOut size={13} />
              </a>
            </div>
          </div>
        </section>

        {/* ---------- Journey ---------- */}
        <section className="pv-section pv-journey" id="journey">
          <div className="pv-wrap">
            <div className="pv-label pv-reveal"><span className="pv-bullet" />Experience</div>
            <h2 className="pv-h2 pv-reveal">Where I&apos;ve <em>been</em></h2>
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
                  <p className="pv-journey-desc">{x.desc.replace('28Cr+', '280M+')}</p>
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

        {/* ---------- Now building ---------- */}
        <section className="pv-section pv-now" id="now">
          <div className="pv-wrap">
            <div className="pv-label pv-reveal"><span className="pv-bullet" />Now</div>
            <h2 className="pv-h2 pv-reveal">What I&apos;m <em>building today</em></h2>
            <p className="pv-section-sub pv-reveal">
              Five ventures in flight as sole PM — here are three.
            </p>
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

        {/* ---------- Ship log ---------- */}
        <section className="pv-section pv-ship">
          <div className="pv-wrap">
            <div className="pv-label pv-reveal"><span className="pv-bullet" />Ship log</div>
            <h2 className="pv-h2 pv-reveal">Everything else I&apos;ve <em>shipped</em></h2>
            <div className="pv-ship-list pv-reveal">
              {PROJECTS.map((p) => (
                <div key={p.name} className="pv-ship-row">
                  <span className="pv-ship-year">{p.year}</span>
                  <span className="pv-ship-name">{p.name}</span>
                  <span className="pv-ship-tag">{p.tagline}</span>
                  <span className="pv-ship-links">
                    <a href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on GitHub`}>
                      <GithubMark size={15} />
                    </a>
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} live`}>
                        <ArrowOut size={13} />
                      </a>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="pv-ship-more pv-reveal">
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="pv-btn pv-btn-ghost pv-magnetic">
                Everything on GitHub <ArrowOut size={13} />
              </a>
            </div>
          </div>
        </section>

        {/* ---------- How I operate ---------- */}
        <section className="pv-section pv-principles">
          <div className="pv-wrap">
            <div className="pv-label pv-reveal"><span className="pv-bullet" />Operating system</div>
            <h2 className="pv-h2 pv-reveal">How I <em>operate</em></h2>
            <div className="pv-principles-grid">
              {PRINCIPLES.map((pr, i) => (
                <div key={pr.title} className="pv-principle pv-reveal">
                  <span className="pv-principle-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{pr.title}</h3>
                  <p>{pr.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Recognition ---------- */}
        <section className="pv-section pv-recog">
          <div className="pv-wrap">
            <div className="pv-label pv-reveal"><span className="pv-bullet" />Recognition</div>
            <div className="pv-recog-grid">
              {RECOGNITION.map((r) => (
                <div key={r.value} className="pv-recog-item pv-reveal">
                  <strong>{r.value}</strong>
                  <span className="pv-recog-label">{r.label}</span>
                  <span className="pv-recog-detail">{r.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className="pv-cta" id="contact">
          <div className="pv-wrap pv-cta-inner pv-reveal">
            <h2>Hiring for a senior<br />product seat? <em>Let&apos;s talk.</em></h2>
            <div className="pv-cta-actions">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="pv-btn pv-btn-primary pv-magnetic">
                Book a call <ArrowRight size={13} />
              </a>
              <a href={RESUME} target="_blank" rel="noopener noreferrer" className="pv-btn pv-btn-ghost pv-magnetic">
                View résumé
              </a>
              <a href={`mailto:${EMAIL}`} className="pv-cta-mail">{EMAIL}</a>
            </div>
            <p className="pv-availability">
              Open to senior product roles worldwide — remote or relocation · IST (UTC+5:30), overlap-flexible.
            </p>
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
              <a href={RESUME} target="_blank" rel="noopener noreferrer">Résumé</a>
              <a href="/">BlackHook Studio ↗</a>
            </div>
            <span className="pv-footer-copy">© 2026 Hitesh Agrawal</span>
          </div>
        </div>
      </footer>
    </>
  );
}
