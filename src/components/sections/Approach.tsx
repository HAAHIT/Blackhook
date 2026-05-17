import { STEPS } from '@/data/team';

export function Approach() {
  return (
    <section className="bh-section" id="approach">
      <div className="bh-section-head">
        <div>
          <div className="bh-section-tag">Approach</div>
          <h2>Calm process. <em>Sharp output.</em></h2>
        </div>
        <p style={{ maxWidth: 380, color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
          We work in small, accountable phases. You always know what's happening,
          what we're stuck on, and what's next.
        </p>
      </div>
      <div className="bh-approach">
        {STEPS.map((s) => (
          <div key={s.n} className="bh-step">
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
