import { describe, it, expect } from 'vitest';
import { smokeFingerprint } from '../portfolio-webgl';
import { SMOKE_POSTER_FINGERPRINT } from '../smoke-poster';

describe('smoke poster', () => {
  // The live canvas fades in over the poster; if they were rendered from
  // different shaders the hand-over would visibly jump.
  it('was rendered from the current shader and hash LUT', () => {
    expect(
      smokeFingerprint(),
      'The smoke shader or LUT changed: run `node scripts/render-smoke-poster.mjs` to re-render public/smoke-poster.*',
    ).toBe(SMOKE_POSTER_FINGERPRINT);
  });
});
