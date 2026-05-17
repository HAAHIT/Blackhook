import { SERVICES } from '@/data/services';

export function Services() {
  return (
    <section className="bh-section" id="services">
      <div className="bh-section-head">
        <div>
          <div className="bh-section-tag">What we do</div>
          <h2>Design and build, <em>end to end</em>.</h2>
        </div>
        <p style={{ maxWidth: 360, color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
          One small team handles the work from sketch to ship — no handoffs to disappear into,
          no agencies in a trench coat.
        </p>
      </div>
      <div className="bh-services-grid">
        {SERVICES.map((s) => (
          <div key={s.n} className={`bh-service ${s.shape} ${s.span}`}>
            <div className="num">{s.n} / 05</div>
            <div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="tags">
                {s.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
