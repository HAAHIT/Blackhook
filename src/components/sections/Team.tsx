import { TEAM } from '@/data/team';
import { ArrowOut } from '@/icons';

export function Team() {
  return (
    <section className="bh-section" id="team">
      <div className="bh-section-head">
        <div>
          <div className="bh-section-tag">Team</div>
          <h2>A small studio. <em>Senior on every call.</em></h2>
        </div>
        <p style={{ maxWidth: 380, color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
          You'll work directly with the founders — not a rotating roster of juniors.
          Every meeting, every commit, every decision.
        </p>
      </div>
      <div className="bh-team-grid">
        {TEAM.map((m) => (
          <article key={m.name} className="bh-member">
            <div className="bh-member-head">
              <div className="bh-member-portrait">{m.initial}</div>
              <div>
                <h3>{m.name}</h3>
                <div className="role">{m.role}</div>
              </div>
            </div>
            <p className="bh-member-bio">{m.bio}</p>
            <div className="bh-member-foot">
              <span>{m.foot[0]}</span>
              <a href="#">{m.foot[1]} <ArrowOut size={10} /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
