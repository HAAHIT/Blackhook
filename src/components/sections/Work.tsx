import React, { useState } from 'react';
import { WORK } from '@/data/work';
import { ArrowOut, GithubMark } from '@/icons';
import type { CaseStudy } from '@/types';

function CaseDetail({ c, onClose }: { c: CaseStudy; onClose: () => void }) {
  return (
    <div className="bh-case-detail open" style={{ '--accent': c.accent } as React.CSSProperties}>
      <div className="bh-case-detail-bg" onClick={onClose} />
      <div className="bh-case-detail-panel">
        <button className="bh-case-close" onClick={onClose} aria-label="Close">
          <span className="bh-close-line" />
          <span className="bh-close-line" />
        </button>

        <div className="bh-case-detail-visual">
          <div className="bh-case-glow" />
        </div>

        <div>
          <div className="bh-section-tag" style={{ marginBottom: 20 }}>{c.kind}</div>
          <h2>{c.title}</h2>
        </div>

        <p className="bh-case-long">{c.long}</p>

        <div className="bh-case-grid">
          <div>
            <div className="bh-case-label">Client</div>
            <div className="bh-case-val">{c.client}</div>
          </div>
          <div>
            <div className="bh-case-label">Duration</div>
            <div className="bh-case-val">{c.duration}</div>
          </div>
          <div>
            <div className="bh-case-label">Role</div>
            <div className="bh-case-val">{c.role}</div>
          </div>
          <div>
            <div className="bh-case-label">Team</div>
            <div className="bh-case-val">{c.team}</div>
          </div>
        </div>

        <div>
          <div className="bh-case-label" style={{ marginBottom: 12 }}>Stack</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {c.stack.map((s) => (
              <span key={s} style={{ fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '4px 12px', border: '1px solid var(--line)', color: 'var(--fg-2)' }}>{s}</span>
            ))}
          </div>
        </div>

        {(c.live || c.repo) && (
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            {c.live && (
              <a href={c.live} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: c.accent, borderBottom: `1px solid ${c.accent}`, paddingBottom: 2 }}>
                Live site <ArrowOut size={11} />
              </a>
            )}
            {c.repo && (
              <a href={c.repo} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-2)', borderBottom: '1px solid var(--line)' }}>
                <GithubMark size={14} /> GitHub
              </a>
            )}
          </div>
        )}

        <div className="bh-case-outcomes-grid">
          {c.outcomes.map(([v, l]) => (
            <div key={l} className="bh-case-outcome">
              <strong style={{ color: c.accent }}>{v}</strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Work() {
  const [open, setOpen] = useState<CaseStudy | null>(null);

  return (
    <section className="bh-section" id="work">
      <div className="bh-section-head">
        <div>
          <div className="bh-section-tag">Selected work</div>
          <h2>Things we've <em>shipped.</em></h2>
        </div>
        <p style={{ maxWidth: 380, color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
          Products, tools and platforms — from 0→1 ventures to internal ops. Same standard on every one.
        </p>
      </div>

      <div className="bh-work-grid">
        {WORK.map((c) => (
          <article
            key={c.id}
            className="bh-case col-4"
            data-cursor="view"
            style={{ '--accent': c.accent } as React.CSSProperties}
            onClick={() => setOpen(c)}
          >
            <div className="meta">
              <span>{c.id} / {String(WORK.length).padStart(2, '0')}</span>
              <span>{c.year}</span>
            </div>
            <div className="visual" />
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--fg-3)', marginBottom: 10 }}>{c.kind}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <div className="bh-case-outcomes-grid" style={{ gridTemplateColumns: '1fr', marginTop: 20 }}>
                {c.outcomes.map(([v, l]) => (
                  <div key={l} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <strong style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 400, color: c.accent }}>{v}</strong>
                    <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {open && <CaseDetail c={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
