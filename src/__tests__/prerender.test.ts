// @vitest-environment node
// Plain Node, like the build-time render: no window or DOM.
import { describe, it, expect } from 'vitest';
import { render } from '../portfolio-film.server';

/* The build prerenders /hitesh with this function (scripts/prerender.mjs).
   If rendering throws, or the content stops coming out, crawlers that don't
   run JavaScript get an empty page again. */
describe('build-time render of /hitesh', () => {
  const html = render();

  it('contains the page content, not just an empty shell', () => {
    expect(html).toContain('I help turn fuzzy ideas into');
    for (const id of ['top', 'work', 'projects', 'principles', 'recognition', 'contact']) {
      expect(html).toContain(`id="${id}"`);
    }
  });

  it('includes each case study story', () => {
    expect(html.match(/<dt>Challenge<\/dt>/g)).toHaveLength(3);
  });
});
