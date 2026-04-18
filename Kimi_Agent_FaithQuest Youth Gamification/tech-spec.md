# FaithQuest — Technical Specification

## Dependencies

### Core (from shibumi template)
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | React DOM renderer |
| typescript | ^5.7.0 | Type safety |
| vite | ^6.0.0 | Build tool (from template) |
| tailwindcss | ^3.4.0 | Utility-first CSS (from template) |
| lucide-react | ^0.460.0 | Icon library (from template) |
| clsx | ^2.1.0 | Conditional classnames (from template) |
| tailwind-merge | ^2.6.0 | Tailwind class deduplication (from template) |

### Animation & Scroll
| Package | Version | Purpose |
|---------|---------|---------|
| gsap | ^3.12.0 | Core animation engine, timelines, tweens |
| @gsap/react | ^2.1.0 | useGSAP hook for React lifecycle integration |
| lenis | ^1.1.0 | Smooth scroll with inertia |

### WebGL / 3D
| Package | Version | Purpose |
|---------|---------|---------|
| three | ^0.170.0 | WebGL engine for hero shader and 3D scene |
| @react-three/fiber | ^8.17.0 | React renderer for Three.js (values scene) |
| @react-three/drei | ^9.117.0 | CameraControls, helpers for 3D scene |
| three-custom-shader-material | ^5.4.0 | Custom shader injection on tube geometry |
| html2canvas | ^1.4.1 | DOM-to-canvas for 3D text pipeline |

### Utilities
| Package | Version | Purpose |
|---------|---------|---------|
| imagesloaded | ^5.0.0 | Image preload detection for layout stability |

> **Dev note**: Inter font loaded via Google Fonts `<link>` in index.html. No npm font package needed.

---

## Component Inventory

### Layout Components (reused/adapted from shibumi template)

| Component | Source | Purpose | Modification |
|-----------|--------|---------|-------------|
| App.tsx | Template root | Main app shell, nav, section ordering, footer | Replace all section imports with custom ones; replace nav/footer content; swap cart for CTA |
| Navigation / Header | Template | Sticky header with brand, menu links, search | Restyle to dark theme; replace brand text; swap search/cart for nav links |
| MobileMenu | Template | Fullscreen mobile nav overlay | Restyle to dark theme with CITAM red accents |
| Footer | Template | Footer with links, newsletter, social | Restyle to dark theme; replace all content |
| SmoothScrollProvider | New | Lenis initialization + GSAP ticker sync | Wraps entire app in App.tsx |

### Custom Section Components (new — replace template sections)

| Component | Description | Key Complexity |
|-----------|-------------|---------------|
| HeroSection | Full-viewport hero with WebGL shader bg, title, CTAs | **High** — raw WebGL shader canvas, mouse tracking, scroll-driven dim |
| ValuesSection | 400vh scroll container with pinned 3D canvas + text overlays | **High** — R3F Canvas, html2canvas text-to-geometry, instanced particles, scroll-driven value switching |
| WeeklyRhythmSection | 3-column glassmorphism bento grid with countdown | Medium — glassmorphism CSS, live countdown timer |
| SermonSyncSection | Horizontal scroll sermon carousel with video cards | Medium — CSS scroll-snap, horizontal scroll animations |
| LeaderboardSection | Two-column: tabbed leaderboard + points explanation | Medium — tab switching, progress bars, cross-fade animation |
| PastorCornerSection | 50/50 split: image left, quote right | Low — split layout, text reveal animation |
| JoinCTASection | Centered CTA with radial glow background | Low — glow animation, staggered entrance |

### Reusable Components (new)

| Component | Used By | Purpose |
|-----------|---------|---------|
| FluidFireShader | HeroSection | Raw WebGL canvas with the hero fragment shader |
| ValuesParticleScene | ValuesSection | R3F Canvas rendering 3D text tube + instanced particles |
| GlassCard | WeeklyRhythm, Leaderboard | Glassmorphism card wrapper (bg, border, blur, hover state) |
| PulseGlowButton | HeroSection, JoinCTASection | CTA button with persistent pulse glow animation |
| SectionHeader | Multiple sections | Reusable subsection label + title + description + entrance animation |
| ScrollReveal | Multiple sections | Wrapper component applying GSAP ScrollTrigger entrance animation |

### Hooks (new)

| Hook | Purpose |
|------|---------|
| useSmoothScroll | Lenis instance creation, GSAP ticker integration, expose lenis ref |
| useInView | IntersectionObserver wrapper for viewport detection (pause WebGL when offscreen) |

---

## Animation Implementation

| Animation | Library | Approach | Complexity |
|-----------|---------|----------|------------|
| Hero fluid shader | Raw WebGL + GLSL | Fragment shader on fullscreen triangle, rAF loop, mouse uniform via lerp | **High** 🔒 |
| Hero text letter reveal | GSAP SplitText | Split into lines, stagger from yPercent 125 → 0 | Medium |
| Hero CTA stagger entrance | GSAP timeline | Sequential fade+translateY with delays | Low |
| Shader dim on scroll | GSAP ScrollTrigger | Animate iDim uniform 0→0.4 over 200px scroll | Low |
| 3D text tube + particles | Three.js + R3F + GLSL | CatmullRomCurve3 → TubeGeometry → MeshSurfaceSampler → InstancedMesh with custom vertex/fragment shaders | **High** 🔒 |
| Values scroll-driven switching | GSAP ScrollTrigger (scrub) | 400vh container, scrub drives active index, tween uOpacity cross-fade | **High** 🔒 |
| Camera auto-fit on value change | @react-three/drei CameraControls | fitToBox with smoothTime 0.6 | Medium |
| Section heading line reveal | GSAP SplitText + ScrollTrigger | SplitText lines, yPercent 125→0, stagger 0.08, trigger at 85% | Medium |
| Card/list stagger entrance | GSAP ScrollTrigger | fromTo y:50+opacity:0, stagger 0.12, trigger at 80% | Low |
| Glass card hover | CSS transitions | border-color + background-color transition 0.3s | Low |
| Pulse glow on CTAs | CSS @keyframes | box-shadow pulse 3s infinite sine.inOut | Low |
| Sticky header show/hide | GSAP | translateY(-100%)→0 when scroll > 100vh | Low |
| Leaderboard tab switch | GSAP | Active indicator slide + content cross-fade | Medium |
| Sermon carousel entrance | GSAP ScrollTrigger | fromTo x:80+opacity:0, stagger 0.1 | Low |
| Pastor section split reveal | GSAP ScrollTrigger | Left fade 1s, right text stagger 0.12s | Medium |
| CTA spring entrance | GSAP | scale 0.95→1 with spring ease | Low |
| Footer fade in | GSAP ScrollTrigger | opacity 0→1, trigger at 90% | Low |
| Prayer countdown | React state + setInterval | Client-side calc to next Wed 18:30 EAT, update every 60s | Low |

---

## State & Logic

### Smooth Scroll Architecture
Lenis is initialized once at the app root via SmoothScrollProvider. It creates a single Lenis instance stored in a React ref (not state — avoids re-renders). The provider exposes the lenis instance via React context for child components that need scroll control (e.g., stopping scroll when mobile menu opens). GSAP's ticker drives Lenis's rAF loop, and Lenis's scroll events update ScrollTrigger.

### Hero Shader Lifecycle
The fluid-fire shader runs in its own rAF loop, independent of React's render cycle. The canvas element is a regular DOM element (not React Three Fiber — raw WebGL for performance). Mouse position is tracked via refs and lerped in the rAF loop. The iDim uniform is updated from a ScrollTrigger callback. The rAF loop is paused via IntersectionObserver when the hero is offscreen.

### 3D Values Scene Architecture
The values scene uses a separate R3F `<Canvas>` with `frameloop="demand"` — it only renders when scroll position changes or during GSAP tweens. The text-to-geometry pipeline runs once on mount (4 html2canvas calls). The active value index (0-3) is stored in a ref updated by ScrollTrigger's `onUpdate`. When the index changes, GSAP tweens the outgoing text's `uOpacity` to 0 and the incoming to 1. The canvas is unmounted when the section is more than 200px outside the viewport.

### Leaderboard Tab State
Simple React `useState` for active tab index (0 = Groups, 1 = Individuals). Tab switch triggers a GSAP timeline: slide active indicator → fade out content → fade in new content. No layout shift — both panels render in a container with `min-height` set to the taller panel.

### Countdown Timer Logic
Calculate time until next Wednesday 18:30 EAT using `Intl.DateTimeFormat` with `timeZone: 'Africa/Nairobi'`. Update every 60 seconds via `setInterval`. When target reached, display "LIVE now" with pulsing dot. The timer component is self-contained with its own state.

---

## Other Key Decisions

### Raw WebGL for Hero, R3F for Values
Two separate WebGL approaches: the hero uses raw WebGL (no Three.js overhead) for maximum performance of a single fullscreen fragment shader. The values section uses React Three Fiber for its declarative scene graph (camera, controls, instanced mesh). They never render simultaneously — the hero shader pauses when offscreen, and the R3F canvas only mounts near the values section.

### Shibumi Template Strategy
The template's light/artisan theme is completely replaced. The base color tokens in index.css are overridden with the dark palette. Template sections (Products, Features, Blog, FAQ, About, Contact) are removed from App.tsx by not importing them. The Navigation and Footer components are kept for their structural logic (mobile menu, link lists) but heavily restyled. The cart system is removed entirely.

### Glassmorphism Performance Guard
On mobile breakpoints (< 768px), `backdrop-filter: blur(20px)` is disabled and replaced with solid `#1A1A1A` backgrounds. This is a media query check, not runtime detection — keeps the decision simple and predictable.

### Image Asset Strategy
All images are generated as static assets in `public/images/`. Sermon thumbnails use lazy loading with a small blur-up placeholder. The pastor photo is eager-loaded as it appears in the first viewport segment after the hero.
