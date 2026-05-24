import { useEffect, useRef } from 'react';
import { ShaderBG } from '@/lib/shader-bg';
import { HookMark, ArrowOut, ArrowRight, GithubMark } from '@/icons';
import { PROJECTS, EXPERIENCE, SKILLS } from '@/data/portfolio';

const WHATSAPP = 'https://wa.me/919309803663';
const EMAIL = 'agrawalhitesh4444@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/hitesh-agrawal-5a02a416b/';

export function Portfolio() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (heroRef.current) ShaderBG.init(heroRef.current);
  }, []);

  return (
    <>
      <div className="bh-cursor">
        <div className="bh-cursor-ring" />
        <div className="bh-cursor-dot" />
        <div className="bh-cursor-label" />
      </div>

      <header className="bh-nav">
        <a href="/" className="bh-logo">
          <HookMark size={24} color="var(--fg)" />
          <span>Hitesh</span>
        </a>
        <nav className="bh-nav-links">
          <a href="#now">Now</a>
          <a href="#path">Path</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="/" className="bh-nav-cta magnetic" data-magnetic="0.3">
          BlackHook Studio <ArrowOut size={11} />
        </a>
      </header>

      <main>
        <section className="bh-hero bh-hero--solo" id="top" ref={heroRef}>
          <div className="bh-hero-copy">
            <div className="bh-eyebrow">
              <span className="dot" />
              Hitesh Agrawal — Product &amp; Strategy
            </div>
            <h1>
              I turn fuzzy <span className="ital">ambition</span>{' '}
              into <span className="underline">shipped</span> product.
            </h1>
            <p className="bh-hero-sub">
              Product manager and 0-to-1 builder. I&apos;ve scaled an enterprise
              platform to 28Cr+ users and bootstrapped ventures from a blank page
              to paying customers. This is my corner of the digital world — what
              I&apos;m building, where I&apos;ve been, and the things I&apos;ve shipped.
            </p>
            <div className="bh-hero-ctas">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-primary magnetic" data-magnetic="0.25">
                Start a conversation <ArrowRight size={12} />
              </a>
              <a href="/Hitesh-Agrawal-Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-ghost magnetic" data-magnetic="0.2">
                Résumé
              </a>
            </div>
            <div className="bh-hero-meta">
              <div>
                <strong data-counter="28" data-suffix="Cr+">0</strong>
                Users migrated at Jio
              </div>
              <div>
                <strong data-counter="22" data-suffix="">0</strong>
                Enterprise partners onboarded
              </div>
              <div>
                <strong data-counter="3" data-suffix="+">0</strong>
                Years across scale &amp; 0→1
              </div>
            </div>
          </div>
        </section>

        <section className="bh-section" id="now">
          <div className="bh-section-head">
            <div>
              <div className="bh-section-tag">Now</div>
              <h2>What I&apos;m <em>building today</em></h2>
            </div>
            <p style={{ maxWidth: 380, color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
              Two ventures, one operator. Both started from customer discovery —
              not a deck.
            </p>
          </div>
          <div className="bh-now-grid">
            <article className="bh-now-card">
              <div className="bh-now-k">Commodity SaaS</div>
              <p>
                A pricing and order-management platform for the oil and cement trade.
                Validated the whitespace through discovery interviews, then secured a
                paying pilot that covered the full build before MVP launch.
              </p>
            </article>
            <article className="bh-now-card">
              <div className="bh-now-k">Healthcare at home</div>
              <p>
                An Urban-Company-style services business — nursing, physiotherapy and
                elder care. 300+ patient visits, ₹3L+ MRR at 30% margin in the first
                quarter, with an ops platform I built and run.
              </p>
            </article>
            <article className="bh-now-card">
              <div className="bh-now-k">How I work</div>
              <p>
                Sole PM across both — product, SOPs, hiring funnels and scaling
                playbooks. I lean hard on AI tooling for research, content and dev,
                shipping at roughly 3× the usual velocity.
              </p>
            </article>
          </div>
        </section>

        <section className="bh-section" id="path">
          <div className="bh-section-head">
            <div>
              <div className="bh-section-tag">Path</div>
              <h2>Where I&apos;ve <em>been</em></h2>
            </div>
          </div>
          <div className="bh-xp-list">
            {EXPERIENCE.map((x) => (
              <article key={x.org} className="bh-step">
                <div className="n">{x.range}</div>
                <div>
                  <h3 className="bh-xp-role">{x.role}</h3>
                  <div className="bh-xp-org">{x.org}</div>
                  <p className="bh-xp-desc">{x.desc}</p>
                </div>
                <div className="meta">{x.place}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="bh-section" id="projects">
          <div className="bh-section-head">
            <div>
              <div className="bh-section-tag">Projects</div>
              <h2>Things I&apos;ve <em>shipped</em></h2>
            </div>
            <p style={{ maxWidth: 380, color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
              A selection of repos — products, tools and experiments. Most are built
              with AI in the loop.
            </p>
          </div>
          <div className="bh-proj-grid">
            {PROJECTS.map((p) => (
              <article key={p.name} className="bh-proj">
                <div className="bh-proj-top">
                  <span className="bh-proj-year">{p.year}</span>
                  <div className="bh-proj-links">
                    <a href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on GitHub`}>
                      <GithubMark size={16} />
                    </a>
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} live`}>
                        <ArrowOut size={14} />
                      </a>
                    )}
                  </div>
                </div>
                <h3 className="bh-proj-name">{p.name}</h3>
                <div className="bh-proj-tagline">{p.tagline}</div>
                <p className="bh-proj-desc">{p.desc}</p>
                <div className="bh-proj-tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bh-section" id="skills">
          <div className="bh-section-head">
            <div>
              <div className="bh-section-tag">Toolkit</div>
              <h2>What I <em>work with</em></h2>
            </div>
          </div>
          <div className="bh-skills">
            {SKILLS.map((g) => (
              <div key={g.label} className="bh-skill-group">
                <div className="bh-skill-label">{g.label}</div>
                <div className="bh-skill-items">
                  {g.items.map((i) => (
                    <span key={i}>{i}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bh-contact" id="contact">
          <div className="bh-contact-inner">
            <div>
              <div className="bh-section-tag" style={{ marginBottom: 32 }}>Contact</div>
              <h2>Have something <em>worth building?</em></h2>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="bh-cta-big magnetic" data-magnetic="0.18">
                Chat on WhatsApp <ArrowOut size={14} />
              </a>
            </div>
            <div className="bh-contact-side">
              <div className="row"><strong>Email</strong><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div>
              <div className="row"><strong>LinkedIn</strong><a href={LINKEDIN} target="_blank" rel="noopener noreferrer">hitesh-agrawal</a></div>
              <div className="row"><strong>Based in</strong><span>Dhule · Mumbai, IN</span></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bh-footer-wrap">
        <div className="bh-wordmark" aria-hidden="true">
          <svg viewBox="0 0 1400 220" preserveAspectRatio="xMidYMid meet">
            <text
              x="700" y="180"
              textAnchor="middle"
              fontFamily="Instrument Serif, serif"
              fontSize="230"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <tspan>HITESH</tspan>
            </text>
          </svg>
        </div>
        <div className="bh-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <HookMark size={16} color="var(--fg-3)" />
            <span>Hitesh Agrawal · © 2026</span>
          </div>
          <div className="bh-footer-mid">
            <span className="bh-status">
              <span className="d" /> Open to conversations
            </span>
          </div>
          <a href="/" className="bh-footer-back">BlackHook Studio <ArrowOut size={11} /></a>
        </div>
      </footer>
    </>
  );
}
