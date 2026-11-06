import { describe, it, expect } from 'vitest';
import { FrameGovernor, median, type GovernorAction } from '../frame-governor';

const OPTS = { windowMs: 1000, minSamples: 5, startupMs: 1500, warmupMs: 500, slowMs: 22, severeMs: 50, fallbackMs: 28, minGain: 0.08 };

/** Feed `seconds` of frames at a steady `dt`; returns the non-hold actions in order. */
function run(g: FrameGovernor, dt: number | ((level: number) => number), seconds: number): GovernorAction[] {
  const out: GovernorAction[] = [];
  for (let t = 0; t < seconds * 1000;) {
    const d = typeof dt === 'function' ? dt(g.level) : dt;
    const a = g.sample(d);
    if (a !== 'hold') out.push(a);
    t += d;
  }
  return out;
}

/** Seconds of simulated time until the first non-hold action (or Infinity). */
function timeToAction(g: FrameGovernor, dt: number, limitS = 120): number {
  let t = 0;
  while (t < limitS * 1000) {
    t += dt;
    if (g.sample(dt) !== 'hold') return t / 1000;
  }
  return Infinity;
}

describe('median', () => {
  it('handles odd and even lengths without mutating input', () => {
    const v = [5, 1, 3];
    expect(median(v)).toBe(3);
    expect(v).toEqual([5, 1, 3]);
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });
});

describe('FrameGovernor', () => {
  it('holds on a smooth 60fps page', () => {
    const g = new FrameGovernor(5, OPTS);
    expect(run(g, 16.7, 30)).toEqual([]);
    expect(g.level).toBe(0);
  });

  it('holds on a smooth 120Hz page', () => {
    expect(run(new FrameGovernor(5, OPTS), 8.3, 30)).toEqual([]);
  });

  it('ignores the start-up period (shader compile, page boot)', () => {
    const g = new FrameGovernor(5, OPTS);
    // 1.4s of terrible frames during start-up, then smooth: never counted.
    expect(run(g, 200, 1.4)).toEqual([]);
    expect(run(g, 16.7, 10)).toEqual([]);
    expect(g.level).toBe(0);
  });

  it('needs two slow windows before stepping down a moderately slow page', () => {
    const g = new FrameGovernor(5, OPTS);
    run(g, 30, 1.5 + 1.01); // start-up + one full window
    expect(g.level).toBe(0);
    expect(run(g, 30, 1)).toEqual(['step-down']);
    expect(g.level).toBe(1);
  });

  it('one slow window between smooth ones does not step down', () => {
    const g = new FrameGovernor(5, OPTS);
    run(g, 16.7, 2.5);
    run(g, 30, 1);
    run(g, 16.7, 1);
    run(g, 30, 1);
    expect(g.level).toBe(0);
  });

  it('is robust to isolated long frames inside a window (median, not mean)', () => {
    const g = new FrameGovernor(5, OPTS);
    run(g, 16.7, 1.5);
    const out: GovernorAction[] = [];
    for (let i = 0; i < 600; i++) {
      const a = g.sample(i % 20 < 3 ? 120 : 16.7);
      if (a !== 'hold') out.push(a);
    }
    expect(out).toEqual([]);
  });

  it('ignores multi-second stalls (debugger, frozen tab)', () => {
    const g = new FrameGovernor(5, OPTS);
    for (let i = 0; i < 50; i++) expect(g.sample(5000)).toBe('hold');
    expect(g.level).toBe(0);
  });

  it('reacts within seconds on a badly struggling device, whatever its frame rate', () => {
    // Frame-count windows would take a minute at 8fps; time windows don't.
    expect(timeToAction(new FrameGovernor(5, OPTS), 125)).toBeLessThan(3.5); // 8fps
    expect(timeToAction(new FrameGovernor(5, OPTS), 400)).toBeLessThan(4.5); // 2.5fps
  });

  it('jumps straight to the cheapest level when frames are severely slow', () => {
    const g = new FrameGovernor(5, OPTS);
    expect(run(g, 80, 3)).toEqual(['step-down']);
    expect(g.level).toBe(4);
  });

  it('keeps stepping down while each step makes frames faster, then settles', () => {
    const g = new FrameGovernor(5, OPTS);
    const cost = [34, 27, 21];
    expect(run(g, (l) => cost[Math.min(l, 2)]!, 20)).toEqual(['step-down', 'step-down']);
    expect(g.level).toBe(2);
  });

  it('stops adapting when a step does not help (e.g. 30fps battery-saver cap)', () => {
    const g = new FrameGovernor(5, OPTS);
    expect(run(g, 33.3, 30)).toEqual(['step-down']);
    expect(g.level).toBe(1);
  });

  it('a severe jump that does not help locks at the cheapest level instead of falling back', () => {
    // Slow for reasons other than the smoke: keep the (cheap) live field.
    const g = new FrameGovernor(5, OPTS);
    expect(run(g, 120, 30)).toEqual(['step-down']);
    expect(g.level).toBe(4);
  });

  it('falls back after two confirming windows when the cheapest level is still too slow', () => {
    const g = new FrameGovernor(5, OPTS);
    // The jump helps (120ms -> 40ms) but 40ms is still under 30fps.
    const actions = run(g, (l) => (l === 4 ? 40 : 120), 10);
    expect(actions).toEqual(['step-down', 'fallback']);
    // Locked afterwards.
    expect(run(g, 120, 10)).toEqual([]);
  });

  it('a single slow window at the cheapest level does not fall back', () => {
    const g = new FrameGovernor(2, OPTS);
    run(g, (l) => (l === 1 ? 24 : 34), 6); // stepped to 1, now fine-ish
    expect(g.level).toBe(1);
    run(g, 35, 1.05);
    expect(run(g, 20, 3)).toEqual([]);
  });

  it('stays live at the cheapest level when it is only mildly slow', () => {
    const g = new FrameGovernor(2, OPTS);
    expect(run(g, (l) => (l === 1 ? 25 : 34), 20)).toEqual(['step-down']);
  });

  it('reset() discards a half-measured window and re-arms the warmup', () => {
    const g = new FrameGovernor(5, OPTS);
    run(g, 30, 1.5 + 1.9);
    g.reset();
    expect(run(g, 16.7, 5)).toEqual([]);
    expect(g.level).toBe(0);
  });
});
