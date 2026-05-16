# Blackhook 3D Hero Model

_Started 2026-05-13 04:59 UTC_

---

## User

We are blackhook software design and service company which build software product at highest quality (Sidenote we mention about team in one of the sections, Led by finest designer and developer from NID Ahamdabad - Suraj Ingle and Product Manager and business strategist worked with Big enterprise and startups - Hitesh Agrawal). Webpage hook k liye 3d model, mostly black theme with wight outline. Few inspirations - <svg width="869" height="842" viewBox="0 0 869 842" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="869" height="842" fill="white"/>
<path d="M554.461 91.2163C554.461 91.2163 379.822 320.957 329.501 395.473C279.181 469.988 371.062 581.953 487.451 523.031C521.766 505.659 539.699 470.459 592.748 404.647L539.699 392.282L530.927 381.109H635.031C635.031 381.109 589.963 437.626 530.927 511.143C471.892 584.66 358.466 557.889 322.572 514.607C287.523 472.344 284.43 418.879 311.479 375.562L526.935 103.505L487.451 74.0439M487.451 74.0439C470.023 71.3811 452.173 70 434 70C240.148 70 83 227.148 83 421C83 614.852 240.148 772 434 772C627.852 772 785 609.264 785 421C785 245.321 655.935 99.7865 487.451 74.0439Z" stroke="#253458" stroke-width="34"/>
</svg>
https://motion.zajno.com/, https://activetheory.net/ (Iska a ka 3d model jaisa apna hook ka kr sakte), https://kprverse.com/ (buttons n tiles ke shapes are interesting)

## Assistant

_[tool: list_files]_

_[tool: questions_v2]_

## User

Questions answered:
- sections: Hero with 3D hook, What we do / services, Selected work / case studies, Approach / process, Team (Suraj + Hitesh), Contact / get in touch, Testimonials / clients
- hook_3d_style: Real 3D via three.js (rotates, drag-orbit, light/shadow on wireframe)
- palette: Off-black (#0a0a0a) + warm off-white outlines (softer)
- typography: Decide for me
- motion: Moderate (scroll-triggered reveals, parallax, marquee)
- tile_shapes: All of the above, used in different places
- services: Software Design and Actual software products right from webapps to mobile apps to internal portal - almost whatever client needs
- case_studies: Yes, I'll provide them later (use placeholders for now)
- tagline: We build software at the highest quality
- variations: One polished hero/landing page, with Tweaks panel to toggle variations live
- viewport: Desktop + responsive mobile mockup
- contact: Use placeholders for now

## Assistant

_[tool: update_todos]_

Got it — let me build this. I'll create one polished landing page with the real 3D hook (extruded from the SVG path), all the sections, and a Tweaks panel for live variation toggling.

_[tool: copy_starter_component]_

_[tool: write_file]_

Now let me write the files. I'll keep the 3D in pure JS (module) and the UI in React.

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now let me check the page loads and the 3D hook renders.

_[tool: show_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

The hook looks great! Let me check the hero text — it might be in pre-reveal state.

_[tool: view_image]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: str_replace_edit]_

The CSS transitions are stuck because the iframe is hidden (document.timeline is paused). For real users it'll work, but to make the page robust even when first viewed mid-tab-switch, I'll switch to JS-applied initial hidden state — so above-fold content is visible immediately and only off-screen elements get the fade-in.

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: done]_

Let me show to user and then verify.

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: str_replace_edit]_

Let me tighten the hero — the headline gets a touch cramped at narrower viewports. I'll reduce the clamp and tighten spacing.

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: update_todos]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

Done — BlackHook landing page is up at **BlackHook.html**.

**What's in:**
- **Hero** with the real 3D hook (extruded from your logo SVG, drag-to-rotate, auto-spinning) + tagline "We build software at the highest quality"
- **Services** — 5 tiles using mixed shapes (chamfered, pill, arrow notch) for visual rhythm
- **Selected Work** — 3 placeholder case studies + an "in progress" tile (swap in real ones when ready)
- **Approach** — 4-step process in a clean ledger layout
- **Team** — Suraj (NID Ahmedabad) + Hitesh (PM/strategy), with chamfered-corner cards
- **Testimonials** — infinite marquee, pauses on hover
- **Contact** + footer with placeholder details

**Tweaks panel** (toggle from toolbar) lets you live-switch:
- Hook style: Wireframe / Solid / Glass
- Hook color (5 swatches incl. accent options)
- Rotation speed
- Marquee speed
- Film grain on/off

**Next steps when you're ready:**
- Drop in real case study screenshots/copy for the Work tiles
- Real contact email + social URLs
- Headshots for Suraj/Hitesh (currently initial-letter placeholders inside circle frames)
- I can add a custom cursor / magnetic buttons later if you want to push closer to the Zajno energy

## User

Use smooth animation like gsap, award worthy micro interaction like cssda awards, awwwards awards

## Assistant

_[tool: update_todos]_

Let me add proper GSAP-driven animations, Lenis smooth scroll, custom cursor, magnetic buttons, and a bunch of award-worthy micro interactions.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now write motion.js — the heart of the new motion layer:

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Let me restructure the cursor — label needs to ride the ring:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now wire data-cursor attrs + magnetic + init Motion after React mounts:

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

Now add data-cursor attrs to other key elements:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now wire BHMotion init from React and add tweaks:

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now let me add some more CSS micro-interactions — nav underline draw, footer arrow slide, button arrow slide:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

Now nav CTA arrow slide and bh-cta-big arrow slide:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

Let me check the page loads:

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: str_replace_edit]_

Let me add a safety net so animations complete even if the page is briefly hidden:

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

The italic letters are getting clipped by the word containers. Let me fix:

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

The hero is rendering correctly now. Let me check the other sections.

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: str_replace_edit]_

Let me tighten the case card text spacing and verify everything's in good shape:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: update_todos]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Added the full motion layer — should feel a lot closer to Awwwards territory now.

**What I added:**
- **GSAP + ScrollTrigger + Lenis** smooth scroll
- **Page-enter overlay** that lifts off with the hook glyph
- **Custom cursor** — dot + ring that scales on links, balloons over the 3D hook ("Drag"), and over case cards ("View"). `mix-blend-mode: difference` so it always reads
- **Magnetic buttons** — CTAs subtly pull toward the cursor with elastic snap-back
- **Word-stagger hero reveal** — clip-masked words slide up with `expo.out`
- **Section heading word-splits** triggered on scroll, plus block fades for cards/steps
- **Card 3D tilt** on hover (services, work, team) with elastic return
- **Marquee skew** driven by scroll velocity (push fast, see it lean)
- **Hook reacts to scroll** — adds a Y rotation tied to page progress, so it spins as you scroll
- **Nav link underline draw**, **button arrow slide**, **footer link `↗` slide**, **ghost button fill-up sweep** — all CSS micro-interactions

**Tweaks panel additions:**
- Custom cursor on/off
- Smooth scroll on/off
- Existing hook + grain + marquee speed

Quick caveats:
- The custom cursor only kicks in on hover-capable pointer devices (desktop). Touch falls back to native.
- Lenis is the de-facto for award sites — feel free to dial the duration in tweaks/code if it feels too floaty.

## User

Verifier agent check completed

## Assistant

## User

continue

## Assistant

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

Let me take a fresh look and see if anything needs polishing.

_[tool: read_file]_

Let me keep polishing — there's a few award-worthy touches I want to add: stat counter animation, a massive footer wordmark, and richer case study placeholder visuals.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

I broke the init by removing setupLenis. Let me restore properly:

_[tool: str_replace_edit]_

_[tool: read_file]_

I duplicated the calls. Let me fix:

_[tool: str_replace_edit]_

Now the CSS for the giant wordmark and footer styles:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

The wordmark text overflows. Let me use SVG for guaranteed fit:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: sleep]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: done]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: save_screenshot]_

_[tool: view_image]_

The hero words are colliding because of horizontal negative margins. Fix:

_[tool: grep]_

_[tool: read_file]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: grep]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

Hero looks clean. Let me check the footer and other sections:

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: done]_

_[tool: fork_verifier_agent]_

_[tool: snip]_

Few extra polish moves landed:

- **Hero stat numbers** count up from 0 (8+, 24, 2) when revealed
- **Giant outlined "BLACK*Hook*" wordmark** above the footer — SVG-stroked so it fits cleanly at any width
- **Status pill** in footer ("● Booking Q3 2026") with a pulsing dot
- Hero h1 word-split fixed so spaces breathe correctly

Page should feel award-worthy now. Let me know if you'd like to push further — bigger ideas I could add:
- An **interactive case-study viewer** instead of the placeholder tiles
- **Cursor "magnet" zones** in the 3D hook (specific anchor points the cursor pulls toward)
- **WebGL shader background** behind the hero (subtle distortion field)
- **Theme switcher** in tweaks (current dark + a daylight off-white inverse)

## User

Perfect go ahead

## Assistant

_[tool: update_todos]_

Let me build the shader first (highest visual impact):

_[tool: write_file]_

Now let me wire up shader, theme switcher, and case study expand. First, the theme variables + case study expand UX:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

Good, structure preserved. Now wire up the Hero to mount the shader, add theme switcher + case expand:

_[tool: str_replace_edit]_

Now Work section with case-study expand:

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now CSS for case detail overlay + button reset for cards:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: grep]_

Now add the theme switcher tweak + wire to body, and pass theme prop down to Hero:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now show and verify:

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: get_webview_logs]_

_[tool: done]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: sleep]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: view_image]_

Let me boost shader visibility slightly so it reads as intentional design:

_[tool: done]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

Three big additions landed:

**1. WebGL shader background behind hero** — a subtle flowing noise field with mouse-reactive warp and a soft glow that follows your cursor. Renders in `<canvas class="bh-shader-bg">` mounted inside the hero. Auto-pauses when scrolled off-screen.

**2. Light/dark theme switcher** in Tweaks → **Theme: Dark / Light**
- Inverts the whole palette via CSS variables
- Hook color auto-swaps to a sensible default in each theme
- Cursor blend mode adjusts
- Shader colors swap too
- Smooth 0.5s color transitions everywhere

**3. Case study click-to-expand overlay**
- Cards are now buttons — click any of the 3 work tiles
- Right-side detail panel slides in over a blurred backdrop
- Shows: big title, **Role / Duration / Team / Stack** grid, a long-form summary, and a **3-stat outcomes grid** (e.g. "38% lower drop-off", "4.7★ rating", "½ support tickets")
- Close with ✕, click-outside, or Escape
- Mobile-responsive (full-bleed panel on narrow viewports)

Plus a **shader on/off toggle** in Tweaks if you want pure black.

## User

What is this element and what is it doing?

## Assistant

That's the **WebGL shader background** I added behind the hero in the last update — a real-time fragment shader running on the canvas you can see.

**What it's doing:**
- An animated [flow-noise field](https://en.wikipedia.org/wiki/Simplex_noise) — two layers of perlin-ish noise drifting slowly
- Warped contour grid lines (the "scales" / "cracked earth" pattern you see) — sin-waves of XY distorted by the noise
- A soft glow blob that follows your cursor
- A bright/dark gradient driven by the same noise

It's reactive to mouse movement and scrolls in subtly. **But honestly — it's reading way too loud right now.** Looks more "weathered leather texture" than "subtle atmosphere". Not the vibe.

A few quick options — tell me which you'd prefer:

**A. Make it dramatically more subtle** — drop the contour grid entirely, keep only a faint volumetric haze. Award-style backgrounds usually whisper, not shout.

**B. Swap the pattern** to something cleaner:
- Soft animated **gradient blobs** (Stripe / Linear hero vibe)
- A **dot grid** that ripples around the cursor
- A **scan-line** sweep that pulses once per minute

**C. Kill it entirely** — pure black hero, just the 3D hook does the heavy lifting. You can also toggle it off right now in **Tweaks → Motion → Hero shader bg**.

My recommendation: **A or B-dot-grid** — both keep the technical sophistication without screaming for attention. Which way?

## User

It's not in background to our hero element it's implemented as separate section after Hero element

## Assistant

_[tool: grep]_

_[tool: eval_js]_

_[tool: eval_js]_

Let me look at what's happening with the DOM:

_[tool: str_replace_edit]_

_[tool: eval_js]_

Found it — my `.bh-hero > *` rule was overriding the canvas's `position: absolute`. Quick fix:

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

Fixed — canvas is now `position: absolute`, fills the hero (909×795), z-index 0 behind content. Also let me dial the shader pattern way back so it's a subtle atmosphere instead of a busy texture:

_[tool: str_replace_edit]_

_[tool: done]_

Two fixes:

1. **Bug fix** — the shader canvas was being treated as a grid item by the hero's CSS grid, so it appeared as a sized-down rectangle below the hero content instead of filling the background. Now it correctly sits behind everything as `position: absolute`.

2. **Toned down the shader** — dropped the noisy contour grid entirely. It's now just a slow volumetric haze + a soft glow that follows your cursor. Whispers, not shouts.

You can still toggle it off in **Tweaks → Motion → Hero shader bg** if you want pure black.

## User

Apply comment

## Assistant

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

The scroll cue's `position: absolute; bottom: 28px` was floating awkwardly. Let me anchor it properly as a full-width strip at the bottom of the hero:Reanchored. The scroll cue is now a full-width strip pinned to the bottom of the hero with:
- A top border so it reads as part of the hero footer
- "● Scroll to explore" on the left with a bouncing dot
- An animated sweep line in the middle
- "01 / 07 — The studio" on the right

It now sits flush at the bottom edge of the viewport (where it always belongs), not floating.

## User

Apply comment

## Assistant

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: read_file]_

## Assistant

## User

Please check if this working as expected

## Assistant

_[tool: str_replace_edit]_

_[tool: done]_

Fixed — the scroll-cue removal left a duplicate `<div>` tag that broke the JSX. Hero is now clean (no scroll cue, single hook stage). Page is back to working.

## User

Scroll not working properly when we open case study side plane

