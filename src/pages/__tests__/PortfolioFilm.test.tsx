/**
 * Tests for the PR-changed code in PortfolioFilm.tsx:
 *   - menuOpen state (useState)
 *   - Hamburger toggle button (aria attributes, click handler)
 *   - Mobile nav (hidden attribute, link click closes menu)
 *   - header data-menu-open attribute
 *   - Escape key closes menu
 *   - Resize above 820px closes menu
 *   - Listeners are removed on cleanup / when menu closes
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PortfolioFilm } from '../PortfolioFilm';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@/lib/portfolio-film-motion', () => ({
  initPortfolioMotion: vi.fn(),
  destroyPortfolioMotion: vi.fn(),
}));

vi.mock('@/data/portfolio', () => ({
  PROJECTS: [
    {
      name: 'smriti',
      tagline: 'AI memory',
      desc: 'Memory tool',
      tags: ['TypeScript'],
      repo: 'https://github.com/example/smriti',
      year: '2024',
      current: true,
    },
    {
      name: 'bolodb',
      tagline: 'Vector DB',
      desc: 'Database tool',
      tags: ['Go'],
      repo: 'https://github.com/example/bolodb',
      year: '2023',
    },
    {
      name: 'SoloBooks',
      tagline: 'Accounting',
      desc: 'Books tool',
      tags: ['React'],
      repo: 'https://github.com/example/solobooks',
      live: 'https://solobooks.example.com',
      year: '2022',
    },
  ],
  CASE_STUDIES: [
    {
      title: 'Case Study 1',
      accent: 'One',
      kicker: 'Impact',
      subtitle: 'Sub 1',
      metrics: [{ label: 'Users', value: '1M' }],
    },
  ],
  PRINCIPLES: [{ title: 'Principle 1', desc: 'Desc 1' }],
  RECOGNITION: [{ value: 'Award', label: 'Best PM', detail: 'Some detail' }],
}));

vi.mock('@/icons', () => ({
  ArrowOut: () => null,
  ArrowRight: () => null,
  GithubMark: () => null,
  BrainIcon: () => null,
  DatabaseIcon: () => null,
  ReceiptIcon: () => null,
  CheckIcon: () => null,
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderComponent() {
  return render(<PortfolioFilm />);
}

function getToggleButton() {
  return screen.getByRole('button', { name: /open menu/i });
}

function getMobileNav() {
  return document.getElementById('pf-mobile-menu')!;
}

function getHeader() {
  return document.querySelector('header.pf-nav')!;
}

// ---------------------------------------------------------------------------
// Tests: initial state
// ---------------------------------------------------------------------------

describe('PortfolioFilm — initial render', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the hamburger toggle button', () => {
    renderComponent();
    expect(getToggleButton()).toBeInTheDocument();
  });

  it('toggle button has aria-label "Open menu" when closed', () => {
    renderComponent();
    expect(getToggleButton()).toHaveAttribute('aria-label', 'Open menu');
  });

  it('toggle button has aria-expanded false when closed', () => {
    renderComponent();
    expect(getToggleButton()).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggle button has aria-controls pointing at mobile menu id', () => {
    renderComponent();
    expect(getToggleButton()).toHaveAttribute('aria-controls', 'pf-mobile-menu');
  });

  it('mobile nav is hidden when menu is closed', () => {
    renderComponent();
    expect(getMobileNav()).toHaveAttribute('hidden');
  });

  it('header does not have data-menu-open attribute when menu is closed', () => {
    renderComponent();
    expect(getHeader()).not.toHaveAttribute('data-menu-open');
  });

  it('mobile nav contains a Work link', () => {
    renderComponent();
    const nav = getMobileNav();
    expect(nav.querySelector('a[href="#work"]')).toBeInTheDocument();
  });

  it('mobile nav contains a Contact link', () => {
    renderComponent();
    const nav = getMobileNav();
    expect(nav.querySelector('a[href="#contact"]')).toBeInTheDocument();
  });

  it('mobile nav contains an email link', () => {
    renderComponent();
    const nav = getMobileNav();
    expect(nav.querySelector('a[href^="mailto:"]')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Tests: opening the menu
// ---------------------------------------------------------------------------

describe('PortfolioFilm — opening the mobile menu', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('clicking toggle button opens the menu', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());
    expect(getMobileNav()).not.toHaveAttribute('hidden');
  });

  it('aria-expanded becomes true after opening', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());
    const btn = screen.getByRole('button', { name: /close menu/i });
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('aria-label changes to "Close menu" after opening', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
  });

  it('header gains data-menu-open="true" when menu is open', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());
    expect(getHeader()).toHaveAttribute('data-menu-open', 'true');
  });
});

// ---------------------------------------------------------------------------
// Tests: closing the menu
// ---------------------------------------------------------------------------

describe('PortfolioFilm — closing the mobile menu', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('clicking toggle button again closes the menu', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());
    await userEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(getMobileNav()).toHaveAttribute('hidden');
  });

  it('aria-label reverts to "Open menu" after closing', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());
    await userEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('header loses data-menu-open attribute after closing', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());
    await userEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(getHeader()).not.toHaveAttribute('data-menu-open');
  });

  it('pressing Escape closes an open menu', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());
    expect(getMobileNav()).not.toHaveAttribute('hidden');

    await userEvent.keyboard('{Escape}');
    expect(getMobileNav()).toHaveAttribute('hidden');
  });

  it('pressing Escape when menu is already closed does not error', async () => {
    renderComponent();
    expect(() => fireEvent.keyDown(window, { key: 'Escape' })).not.toThrow();
    expect(getMobileNav()).toHaveAttribute('hidden');
  });

  it('pressing a non-Escape key does not close the menu', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());
    // Tab key moves focus but does not trigger the Escape handler
    // Use ArrowDown which has no effect on buttons or links
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(getMobileNav()).not.toHaveAttribute('hidden');
  });
});

// ---------------------------------------------------------------------------
// Tests: closing via nav link click
// ---------------------------------------------------------------------------

describe('PortfolioFilm — clicking a mobile nav link closes the menu', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('clicking the Work link in mobile nav closes the menu', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());

    const workLink = getMobileNav().querySelector<HTMLAnchorElement>('a[href="#work"]')!;
    await userEvent.click(workLink);

    expect(getMobileNav()).toHaveAttribute('hidden');
  });

  it('clicking the Building link in mobile nav closes the menu', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());

    const link = getMobileNav().querySelector<HTMLAnchorElement>('a[href="#projects"]')!;
    await userEvent.click(link);

    expect(getMobileNav()).toHaveAttribute('hidden');
  });

  it('clicking the Contact link in mobile nav closes the menu', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());

    const link = getMobileNav().querySelector<HTMLAnchorElement>('a[href="#contact"]')!;
    await userEvent.click(link);

    expect(getMobileNav()).toHaveAttribute('hidden');
  });

  it('clicking the email link in mobile nav closes the menu', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());

    const link = getMobileNav().querySelector<HTMLAnchorElement>('a[href^="mailto:"]')!;
    await userEvent.click(link);

    expect(getMobileNav()).toHaveAttribute('hidden');
  });

  it('clicking the Résumé link in mobile nav closes the menu', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());

    // The résumé link is the last <a> in the mobile nav
    const links = getMobileNav().querySelectorAll<HTMLAnchorElement>('a');
    const resumeLink = links[links.length - 1]!;
    await userEvent.click(resumeLink);

    expect(getMobileNav()).toHaveAttribute('hidden');
  });
});

// ---------------------------------------------------------------------------
// Tests: resize listener
// ---------------------------------------------------------------------------

describe('PortfolioFilm — resize closes menu on wide viewport', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resize to >820px while menu is open closes the menu', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());
    expect(getMobileNav()).not.toHaveAttribute('hidden');

    // Simulate viewport growing to desktop width
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true, writable: true });
    act(() => {
      fireEvent(window, new Event('resize'));
    });

    expect(getMobileNav()).toHaveAttribute('hidden');
  });

  it('resize to ≤820px while menu is open does not close the menu', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());

    Object.defineProperty(window, 'innerWidth', { value: 600, configurable: true, writable: true });
    act(() => {
      fireEvent(window, new Event('resize'));
    });

    expect(getMobileNav()).not.toHaveAttribute('hidden');
  });

  it('resize event when menu is closed does not throw', () => {
    renderComponent();
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true, writable: true });
    expect(() => {
      act(() => {
        fireEvent(window, new Event('resize'));
      });
    }).not.toThrow();
  });

  it('resize to exactly 821px closes the menu (just above threshold)', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());

    Object.defineProperty(window, 'innerWidth', { value: 821, configurable: true, writable: true });
    act(() => {
      fireEvent(window, new Event('resize'));
    });

    expect(getMobileNav()).toHaveAttribute('hidden');
  });

  it('resize to exactly 820px does not close the menu (at threshold, not above)', async () => {
    renderComponent();
    await userEvent.click(getToggleButton());

    Object.defineProperty(window, 'innerWidth', { value: 820, configurable: true, writable: true });
    act(() => {
      fireEvent(window, new Event('resize'));
    });

    // innerWidth > 820 is false at exactly 820
    expect(getMobileNav()).not.toHaveAttribute('hidden');
  });
});

// ---------------------------------------------------------------------------
// Tests: event listener lifecycle
// ---------------------------------------------------------------------------

describe('PortfolioFilm — event listener cleanup', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds keydown and resize listeners only while menu is open', async () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    renderComponent();

    // No extra listeners before menu opens
    const beforeOpen = addSpy.mock.calls.length;

    await userEvent.click(getToggleButton());
    const afterOpen = addSpy.mock.calls.length;
    expect(afterOpen - beforeOpen).toBeGreaterThanOrEqual(2); // keydown + resize

    await userEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    // Cleanup should have removed those listeners
    const removeKeys = removeSpy.mock.calls.map(([ev]) => ev);
    expect(removeKeys).toContain('keydown');
    expect(removeKeys).toContain('resize');
  });

  it('removes listeners on component unmount', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderComponent();

    await userEvent.click(getToggleButton()); // open menu (adds listeners)
    unmount();

    const removeEvents = removeSpy.mock.calls.map(([ev]) => ev);
    expect(removeEvents).toContain('keydown');
    expect(removeEvents).toContain('resize');
  });
});
