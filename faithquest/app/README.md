# FaithQuest - CITAM Woodley Youth Gamification

A modern React-based web application for CITAM Woodley Youth gamification platform featuring advanced visual effects, WebGL animations, and an engaging user experience. Built with performance and accessibility in mind.

## Features

- **Hero Section**: Full-viewport WebGL fluid-fire shader with mouse tracking and scroll-driven dimming
- **Values Section**: 400vh scroll container with 3D text particles and instanced mesh animations
- **Weekly Rhythm**: Glassmorphism bento grid with live countdown timer to Wednesday prayer
- **Sermon Sync**: Horizontal scroll carousel with video cards and smooth animations
- **Leaderboard**: Tabbed interface showing groups and individuals with progress tracking
- **Pastor Corner**: Split-screen layout with quote animations
- **Join CTA**: Centered call-to-action with radial glow effects
- **Smooth Scrolling**: Lenis-based scroll with inertia and GSAP integration
- **Responsive Design**: Mobile-optimized with performance guards for glassmorphism effects

## Tech Stack

### Core Framework
- **React 19** + TypeScript - Modern UI framework with type safety
- **Vite** - Fast build tool and development server
- **Tailwind CSS 3** - Utility-first CSS framework

### Animation & Graphics
- **GSAP** - Advanced animation engine with ScrollTrigger
- **Three.js** - WebGL engine for 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **Lenis** - Smooth scroll with inertia

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Modern icon library
- **React Hook Form** - Form management with validation

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000` in development mode.

## Project Structure

```
faithquest/app/
src/
  components/           # Reusable UI components
    GlassCard.tsx      # Glassmorphism card wrapper
    PulseGlowButton.tsx # CTA button with pulse animation
    ScrollReveal.tsx   # GSAP ScrollTrigger wrapper
    SectionHeader.tsx   # Reusable section header
  sections/            # Page sections
    HeroSection.tsx    # WebGL hero with fluid-fire shader
    ValuesSection.tsx  # 3D text particles and scroll animations
    WeeklyRhythmSection.tsx # Countdown timer and bento grid
    SermonSyncSection.tsx # Horizontal sermon carousel
    LeaderboardSection.tsx # Tabbed leaderboard interface
    PastorCornerSection.tsx # Split-screen quote layout
    JoinCTASection.tsx # Final call-to-action
  hooks/               # Custom React hooks
    useSmoothScroll.tsx # Lenis initialization
    useInView.tsx      # IntersectionObserver wrapper
  lib/                 # Utility functions
  config.ts           # Application configuration
  App.tsx             # Main app component
  main.tsx            # Entry point
```

## Architecture Highlights

### Performance Optimizations
- **WebGL Shaders**: Hero shader pauses when offscreen using IntersectionObserver
- **3D Scene**: React Three Fiber canvas uses `frameloop="demand"` for render efficiency
- **Mobile Guards**: Glassmorphism effects disabled on mobile (< 768px) for performance
- **Image Loading**: Lazy loading with blur-up placeholders for sermon thumbnails

### Animation System
- **GSAP Integration**: ScrollTrigger drives all scroll-based animations
- **Smooth Scrolling**: Lenis provides buttery-smooth scroll with inertia
- **Stagger Effects**: Sequential entrance animations for cards and text
- **Mouse Tracking**: Hero shader responds to mouse movement with lerp smoothing

### Component Architecture
- **Section-Based**: Each major section is a self-contained component
- **Reusable Elements**: GlassCard, SectionHeader, and ScrollReveal used throughout
- **Type Safety**: Full TypeScript implementation with strict typing
- **Accessibility**: Radix UI components for keyboard navigation and screen readers

## Configuration

The app uses `src/config.ts` for all content and settings. Key configuration sections include:

- **siteConfig**: Basic site metadata and SEO settings
- **navigationConfig**: Header navigation and mobile menu setup
- **heroConfig**: Hero section content and shader parameters
- **valuesConfig**: Values section text and 3D animation settings
- **rhythmConfig**: Weekly rhythm section and countdown timer
- **sermonConfig**: Sermon carousel content and video data
- **leaderboardConfig**: Leaderboard data and tab configuration
- **pastorConfig**: Pastor corner quote and image settings
- **ctaConfig**: Final call-to-action section content

## Required Assets

### Images
Place in `public/images/`:
- Hero background (landscape, high-resolution)
- Pastor photo (portrait, eager-loaded)
- Sermon thumbnails (multiple, lazy-loaded)
- Any section background images

### Fonts
- **Inter**: Loaded via Google Fonts in `index.html`
- No additional font packages needed

## Development Notes

### WebGL Performance
- Hero shader runs at 60fps with requestAnimationFrame
- Mouse position tracked with refs to avoid re-renders
- Shader uniforms updated via GSAP ScrollTrigger callbacks

### 3D Text Pipeline
- HTML text converted to canvas using html2canvas
- Canvas texture mapped to Three.js tube geometry
- Instanced mesh particles sampled from mesh surface
- Camera auto-fits to text bounds on value changes

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Glassmorphism effects gracefully degrade on mobile
- Touch-friendly interaction patterns
- Optimized scroll performance for mobile devices

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Browser Support

- Modern browsers with WebGL support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile browsers with WebGL capabilities
