import { useEffect, useRef } from 'react';
import { useTweaks } from '@/hooks/useTweaks';
import { BHMotion } from '@/lib/motion';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/sections/Services';
import { Work } from '@/components/sections/Work';
import { Approach } from '@/components/sections/Approach';
import { Team } from '@/components/sections/Team';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/Footer';

const DEFAULTS = {
  theme: 'dark' as const,
  hookStyle: 'wireframe' as const,
  hookColor: '#f4f0e8',
  hookSpeed: 0.35,
  marqueeSpeed: 1,
  grain: true,
  customCursor: true,
  smoothScroll: true,
};

export function App() {
  const [tweaks, setTweak] = useTweaks(DEFAULTS);
  const motionStarted = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset['themeSwitching'] = '';
    root.dataset['theme'] = tweaks.theme;
    const t = setTimeout(() => delete root.dataset['themeSwitching'], 700);
    return () => clearTimeout(t);
  }, [tweaks.theme]);

  useEffect(() => {
    document.body.classList.toggle('bh-grain', tweaks.grain);
  }, [tweaks.grain]);

  useEffect(() => {
    BHMotion.setSmooth(tweaks.smoothScroll);
  }, [tweaks.smoothScroll]);

  useEffect(() => {
    if (motionStarted.current) return;
    motionStarted.current = true;
    BHMotion.init();
  }, []);

  const hookOpts = {
    style: tweaks.hookStyle,
    color: tweaks.hookColor,
    speed: tweaks.hookSpeed,
  };

  return (
    <>
      {tweaks.customCursor && (
        <div className="bh-cursor">
          <div className="bh-cursor-ring" />
          <div className="bh-cursor-dot" />
          <div className="bh-cursor-label" />
        </div>
      )}

      <Nav />

      <main>
        <Hero hookOpts={hookOpts} theme={tweaks.theme} />
        <Services />
        <Work />
        <Testimonials speed={tweaks.marqueeSpeed} />
        <Approach />
        <Team />
        <Contact />
      </main>

      <Footer />

      {import.meta.env.DEV && (
      <div className="bh-tweaks" aria-label="Dev tweaks">
        <div className="bh-tweaks-title">Tweaks</div>

        <label>
          Theme
          <select value={tweaks.theme} onChange={(e) => setTweak('theme', e.target.value as typeof tweaks.theme)}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>

        <label>
          Hook style
          <select value={tweaks.hookStyle} onChange={(e) => setTweak('hookStyle', e.target.value as typeof tweaks.hookStyle)}>
            <option value="wireframe">Wireframe</option>
            <option value="solid">Solid</option>
            <option value="glass">Glass</option>
          </select>
        </label>

        <label>
          Hook colour
          <input type="color" value={tweaks.hookColor} onChange={(e) => setTweak('hookColor', e.target.value)} />
        </label>

        <label>
          Hook speed
          <input type="range" min="0" max="2" step="0.05" value={tweaks.hookSpeed} onChange={(e) => setTweak('hookSpeed', Number(e.target.value))} />
        </label>

        <label>
          Marquee speed
          <input type="range" min="0.2" max="3" step="0.1" value={tweaks.marqueeSpeed} onChange={(e) => setTweak('marqueeSpeed', Number(e.target.value))} />
        </label>

        <label>
          <input type="checkbox" checked={tweaks.grain} onChange={(e) => setTweak('grain', e.target.checked)} />
          Film grain
        </label>

        <label>
          <input type="checkbox" checked={tweaks.customCursor} onChange={(e) => setTweak('customCursor', e.target.checked)} />
          Custom cursor
        </label>

        <label>
          <input type="checkbox" checked={tweaks.smoothScroll} onChange={(e) => setTweak('smoothScroll', e.target.checked)} />
          Smooth scroll
        </label>
      </div>
      )}
    </>
  );
}
