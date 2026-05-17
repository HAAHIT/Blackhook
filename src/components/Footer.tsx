import { HookMark } from '@/icons';

export function Footer() {
  return (
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
            <tspan>BLACK</tspan>
            <tspan fontStyle="italic" dx="6">Hook</tspan>
          </text>
        </svg>
      </div>
      <div className="bh-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <HookMark size={16} color="var(--fg-3)" />
          <span>BlackHook Studio · © 2026</span>
        </div>
        <div className="bh-footer-mid">
          <span className="bh-status">
            <span className="d" /> Booking Q3 2026
          </span>
        </div>
        <div className="bh-footer-links">
          <a href="#">Twitter / X</a>
          <a href="#">LinkedIn</a>
          <a href="#">Dribbble</a>
          <a href="#">Read.cv</a>
        </div>
      </div>
    </footer>
  );
}
