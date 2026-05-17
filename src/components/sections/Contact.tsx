import { ArrowOut } from '@/icons';

export function Contact() {
  return (
    <section className="bh-contact" id="contact">
      <div className="bh-contact-inner">
        <div>
          <div className="bh-section-tag" style={{ marginBottom: 32 }}>Contact</div>
          <h2>Have something <em>worth building?</em></h2>
          <a href="mailto:hello@blackhook.studio" className="bh-cta-big magnetic" data-magnetic="0.18">
            hello@blackhook.studio <ArrowOut size={14} />
          </a>
        </div>
        <div className="bh-contact-side">
          <div className="row"><strong>Hours</strong><span>Mon – Fri · 10–7 IST</span></div>
          <div className="row"><strong>Availability</strong><span>Q3 2026</span></div>
          <div className="row"><strong>For</strong><span>Founders &amp; PMs</span></div>
        </div>
      </div>
    </section>
  );
}
