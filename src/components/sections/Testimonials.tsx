import React, { useMemo } from 'react';
import { QUOTES } from '@/data/quotes';

interface TestimonialsProps {
  speed: number;
}

export function Testimonials({ speed }: TestimonialsProps) {
  const items = useMemo(() => [...QUOTES, ...QUOTES], []);
  const duration = useMemo(() => `${Math.round(80 / speed)}s`, [speed]);

  return (
    <div className="bh-marquee-wrap" id="testimonials">
      <div className="bh-marquee" style={{ '--marquee-duration': duration } as React.CSSProperties}>
        {items.map((q, i) => (
          <div key={i} className="bh-quote">
            <div className="qmark">"</div>
            <div>
              <div className="text">{q.text}</div>
              <div className="who">— {q.who}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
