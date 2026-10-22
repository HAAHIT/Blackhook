/* Frame-time governor for the live smoke backdrop.

   Watches requestAnimationFrame intervals and decides when the smoke should
   render fewer pixels, or hand over to its still poster when even the lowest
   level can't keep the page smooth. Decisions are made once per second of
   frames (not per N frames, which would take minutes on a struggling device)
   from the window's median, so one-off hitches (GC, a long task, a font swap)
   don't count.

   A badly struggling page (under ~20fps) jumps straight to the cheapest level
   instead of walking down one step per window. And it only keeps adapting
   while adapting helps: if rendering fewer pixels doesn't make frames faster,
   the smoke isn't what limits this device (a 30fps battery-saver cap, or other
   main-thread work), so it stops rather than strip quality for nothing. */

export type GovernorAction = 'hold' | 'step-down' | 'fallback';

export interface GovernorOptions {
  /** Length of a decision window, in ms of frames. */
  windowMs?: number;
  /** Fewest frames a window needs before it can decide. */
  minSamples?: number;
  /** Frames ignored at start-up (shader compile, page boot), in ms. */
  startupMs?: number;
  /** Frames ignored after a reset or a step, while timing settles, in ms. */
  warmupMs?: number;
  /** Median frame time (ms) above which the page counts as struggling. */
  slowMs?: number;
  /** Median frame time (ms) bad enough to act on one window and jump to the cheapest level. */
  severeMs?: number;
  /** Still at least this slow on the cheapest level for two windows → give up the live field. */
  fallbackMs?: number;
  /** A step must cut the median frame time by this fraction to count as helping. */
  minGain?: number;
}

// Longer than any frame worth measuring: a debugger pause or a frozen tab.
const STALL_MS = 2000;

export function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

export class FrameGovernor {
  /** Current quality level: 0 is best, levels - 1 is the cheapest. */
  level = 0;
  private locked = false;
  private samples: number[] = [];
  private elapsed = 0;
  private skipMs: number;
  private slowWindows = 0;
  private fallbackWindows = 0;
  private beforeStep: number | null = null;
  private readonly windowMs: number;
  private readonly minSamples: number;
  private readonly warmupMs: number;
  private readonly slowMs: number;
  private readonly severeMs: number;
  private readonly fallbackMs: number;
  private readonly minGain: number;

  constructor(private readonly levels: number, opts: GovernorOptions = {}) {
    this.windowMs = opts.windowMs ?? 1000;
    this.minSamples = opts.minSamples ?? 5;
    this.warmupMs = opts.warmupMs ?? 500;
    this.slowMs = opts.slowMs ?? 22;
    this.severeMs = opts.severeMs ?? 50;
    this.fallbackMs = opts.fallbackMs ?? 28;
    this.minGain = opts.minGain ?? 0.08;
    // Covers the loader count and curtain, whose main-thread work isn't render cost.
    this.skipMs = opts.startupMs ?? 2500;
  }

  /** Drop in-flight measurements, e.g. after the tab was hidden or the context restored. */
  reset() {
    this.samples = [];
    this.elapsed = 0;
    this.skipMs = Math.max(this.skipMs, this.warmupMs);
    this.slowWindows = 0;
    this.fallbackWindows = 0;
  }

  sample(dt: number): GovernorAction {
    if (this.locked || !(dt > 0) || dt > STALL_MS) return 'hold';
    if (this.skipMs > 0) { this.skipMs -= dt; return 'hold'; }
    this.samples.push(dt);
    this.elapsed += dt;
    if (this.elapsed < this.windowMs || this.samples.length < this.minSamples) return 'hold';

    const m = median(this.samples);
    this.samples = [];
    this.elapsed = 0;

    if (this.beforeStep !== null) {
      const helped = m < this.beforeStep * (1 - this.minGain);
      this.beforeStep = null;
      if (!helped) { this.locked = true; return 'hold'; }
    }

    if (m <= this.slowMs) { this.slowWindows = 0; this.fallbackWindows = 0; return 'hold'; }
    this.slowWindows++;

    if (this.level < this.levels - 1) {
      const severe = m > this.severeMs;
      if (!severe && this.slowWindows < 2) return 'hold';
      this.level = severe ? this.levels - 1 : this.level + 1;
      this.slowWindows = 0;
      this.beforeStep = m;
      this.skipMs = this.warmupMs;
      return 'step-down';
    }

    if (m > this.fallbackMs) {
      if (++this.fallbackWindows >= 2) { this.locked = true; return 'fallback'; }
    } else {
      this.fallbackWindows = 0;
    }
    return 'hold';
  }
}
