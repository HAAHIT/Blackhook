import { useState, useEffect } from 'react';
import { HookMark, ArrowOut } from '@/icons';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`bh-nav${scrolled ? ' scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
      <a href="#top" className="bh-logo" onClick={closeMenu}>
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
      <div className="bh-nav-right">
        <a href="https://wa.me/919309803663" target="_blank" rel="noopener noreferrer" className="bh-nav-cta magnetic" data-magnetic="0.3">
          Start a project <ArrowOut size={11} />
        </a>
        <button
          className="bh-hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <nav className="bh-mobile-menu">
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#approach" onClick={closeMenu}>Approach</a>
          <a href="#team" onClick={closeMenu}>Team</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <a href="https://wa.me/919309803663" target="_blank" rel="noopener noreferrer" className="bh-mobile-cta" onClick={closeMenu}>
            Start a project <ArrowOut size={12} />
          </a>
        </nav>
      )}
    </header>
  );
}
