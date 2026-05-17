# BlackHook Studio

Website for BlackHook — a small, senior software design & engineering studio based in Ahmedabad.

Built with Vite + React + TypeScript. Features a Three.js 3D hook, WebGL shader background, GSAP scroll animations, Lenis smooth scroll, and a custom cursor.

## Getting started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Other commands

```bash
# Type-check and build for production
npm run build

# Preview the production build locally
npm run preview

# Lint
npm run lint
```

## Project structure

```
src/
├── App.tsx                  # Root component, manages global state & tweaks
├── main.tsx                 # React entry point
├── types.ts                 # Shared TypeScript types
├── icons.tsx                # SVG icon components
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx             # 3D hook + shader background
│   ├── Footer.tsx
│   └── sections/
│       ├── Services.tsx
│       ├── Work.tsx         # Case studies with slide-in detail panel
│       ├── Approach.tsx
│       ├── Team.tsx
│       ├── Testimonials.tsx # Marquee
│       └── Contact.tsx
├── data/                    # Content (services, work, team, quotes)
├── hooks/
│   └── useTweaks.ts         # Dev tweaks panel state (persisted to localStorage)
├── lib/
│   ├── hook3d.ts            # Three.js 3D hook scene
│   ├── shader-bg.ts         # WebGL noise shader background
│   └── motion.ts            # GSAP animations, Lenis scroll, custom cursor
└── styles/
    └── globals.css
```

## Dev tweaks panel

A floating panel in the bottom-right corner (desktop only) lets you adjust the 3D hook style, colours, animation speeds, film grain, custom cursor, and smooth scroll in real time. Settings persist across page reloads via `localStorage`.
