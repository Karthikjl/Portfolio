# Portfolio v2 — Design Spec

**Branch:** `portfolio-v2`
**Date:** 2026-07-21

## Purpose

A personal portfolio site for a developer to showcase projects and domain
knowledge across full-stack web development and AI/automation & agents work.
Not job-hunting focused — a general professional showcase. Premium look, using
a real-time 3D hero scene.

## Tech stack

- Next.js 16 (App Router, TypeScript) — already scaffolded on `portfolio-v2`
- Tailwind CSS v4 — all styling/layout
- React Three Fiber + `@react-three/drei` — declarative Three.js for the 3D
  hero scene
- Framer Motion — scroll-triggered reveals, hover states, section transitions
  outside the 3D canvas
- Content as local data (`data/projects.ts`), no CMS/backend — no contact
  form submission handling is in scope for this iteration
- Deploy target: Vercel (confirm vs. existing GitHub Pages setup used by the
  old portfolio before going live)

## 3D hero scene

- Stylized low-poly futuristic desk setup: desk, monitor(s) with a subtly
  glowing screen, keyboard, small warmth details (plant/coffee cup), floating
  above a soft shadow/platform. Light-mode-friendly low-poly aesthetic, not
  photorealistic.
- Model sourced free from Sketchfab/Poly Haven (CC-licensed), optimized via
  Draco/glTF compression for fast load.
- Interactivity: subtle mouse-parallax rotation of the scene toward the
  cursor, plus gentle idle animation (screen glow pulse, slow float) so it
  reads as alive without input.
- Scroll behavior: canvas fades/scales out as the user scrolls from Hero into
  About — no full-page scroll-jacking.
- Implementation: Client Component (`HeroScene.tsx`), loaded via Next.js
  `dynamic()` with `ssr: false`.
- Fallback: static poster image shown while the 3D asset loads; skip 3D
  entirely (show the static image) for `prefers-reduced-motion` or low-end
  devices.

## Page structure & content sections

Single-page scrolling layout with a sticky minimal top nav (logo/name +
anchor links: About, Projects, Skills, Contact).

1. **Hero** — 3D scene, name, one-line tagline, scroll-down cue
2. **About** — short bio + two callout blocks with equal visual weight: "Web
   Development" and "AI/Automation & Agents"
3. **Projects** — grid of cards (image, title, description, tech-tag pills,
   external link); 4-6 placeholder projects mixing web-dev and AI/automation
   examples
4. **Skills** — tech/tool badges grouped by category (Frontend, Backend,
   AI/Automation, Tools)
5. **Contact/Footer** — email (mailto), social links (GitHub/LinkedIn
   placeholders). No contact form in this iteration — flagged as a possible
   future addition (would require an email-sending backend/service).

Content for Projects/Skills/About starts as realistic placeholder text/data
in `data/projects.ts` (and similar), to be swapped with real content later.

## Visual design system

- **Palette**: warm off-white background (`#FAFAF8`-ish, not pure white),
  near-black text (`#111`), one accent color — deep indigo/violet
  (`#4F46E5`-ish) — for links, CTAs, and tags.
- **Typography**: a distinctive sans-serif for headings (geometric or
  slightly condensed, not a default system font) paired with a clean,
  readable body font. Large hero headline type scale, generous whitespace.
- **Motion**: subtle fade/slide-up reveals on scroll (Framer Motion
  `whileInView`), gentle hover lift + shadow on project cards. Restrained —
  no gratuitous animation.
- **Layout**: max-width content container (~1200px), generous margins,
  consistent vertical rhythm between sections.

## Out of scope (this iteration)

- Real contact form / email-sending backend
- CMS-backed content — content lives in local data files
- Photorealistic 3D rendering
- Multi-page routing (single scrolling page only)
