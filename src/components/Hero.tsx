import { useEffect, useRef } from 'react';
import { HookScene } from '@/lib/hook3d';
import { ShaderBG } from '@/lib/shader-bg';
import { ArrowRight } from '@/icons';
import type { HookOptions, Theme } from '@/types';

interface HeroProps {
  hookOpts: HookOptions;
  theme: Theme;
}

export function Hero({ hookOpts, theme }: HeroProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const hookMounted = useRef(false);
  const shaderMounted = useRef(false);

  // Mount 3D hook once (poll until HookScene is ready)
  useEffect(() => {
    let cancelled = false;
    const tryMount = () => {
      if (cancelled || hookMounted.current || !stageRef.current) return;
      HookScene.mount(stageRef.current, hookOpts);
      hookMounted.current = true;
    };
    tryMount();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mount shader background once
  useEffect(() => {
    if (shaderMounted.current || !heroRef.current) return;
    ShaderBG.init(heroRef.current);
    shaderMounted.current = true;
  }, []);

  // Sync shader colors with theme
  useEffect(() => {
    if (theme === 'light') ShaderBG.setColors([0.957, 0.941, 0.91], [0.04, 0.04, 0.04]);
    else ShaderBG.setColors([0.04, 0.04, 0.04], [0.957, 0.941, 0.91]);
  }, [theme]);

  // Sync 3D hook tweaks
  useEffect(() => {
    if (!hookMounted.current) return;
    HookScene.setStyle(hookOpts.style);
    HookScene.setColor(hookOpts.color);
    HookScene.setSpeed(hookOpts.speed);
  }, [hookOpts.style, hookOpts.color, hookOpts.speed]);

  return (
    <section className="bh-hero" id="top" ref={heroRef}>
      <div className="bh-hero-copy">
        <div className="bh-eyebrow">
          <span className="dot" />
          BlackHook Studio
        </div>
        <h1>
          We build <span className="ital">software</span>{' '}
          at the <span className="underline">highest</span> quality.
        </h1>
        <p className="bh-hero-sub">
          BlackHook is a small, senior studio designing and shipping web apps,
          mobile apps, and internal tools — end to end. Calm process, sharp craft,
          obsessive attention to the final 5%.
        </p>
        <div className="bh-hero-ctas">
          <a href="#contact" className="btn-primary magnetic" data-magnetic="0.25">
            Start a project <ArrowRight size={12} />
          </a>
          <a href="#work" className="btn-ghost magnetic" data-magnetic="0.2">
            See selected work
          </a>
        </div>
        <div className="bh-hero-meta">
          <div>
            <strong data-counter="8" data-suffix="+">0</strong>
            Years of craft
          </div>
          <div>
            <strong data-counter="24">0</strong>
            Products shipped
          </div>
          <div>
            <strong data-counter="2">0</strong>
            Founders, one studio
          </div>
        </div>
      </div>

      <div className="bh-hook-stage" data-cursor="drag">
        <div className="bh-hook-ring" />
        <div className="bh-hook-canvas" ref={stageRef} />
        <div className="bh-hook-label">
          <span className="dot" /> Drag to rotate
        </div>
      </div>
    </section>
  );
}
