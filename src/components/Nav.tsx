import { useState, useEffect } from 'react';
import { HookMark, ArrowOut } from '@/icons';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`bh-nav${scrolled ? ' scrolled' : ''}`}>
      <a href="#top" className="bh-logo">
        <HookMark size={24} color="var(--fg)" />
        <span>BlackHook</span>
      </a>
      <nav className="bh-nav-links">
        <a href="#services">Services</a>
        <a href="#work">Work</a>
        <a href="#approach">Approach</a>
        <a href="#team">Team</a>
        <a href="#contact">Contact</a>
      </nav>
      <a href="#contact" className="bh-nav-cta magnetic" data-magnetic="0.3">
        Start a project <ArrowOut size={11} />
      </a>
    </header>
  );
}
