# Portfolio v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the light-mode, premium-feel single-page portfolio described in `docs/superpowers/specs/2026-07-21-portfolio-v2-design.md`, with a React Three Fiber hero scene, About/Projects/Skills/Contact sections, and placeholder content.

**Architecture:** Next.js 16 App Router site rendered as one scrolling page (`app/page.tsx`) composed of independent section components under `components/`. The 3D hero is an isolated client component loaded via `next/dynamic` with `ssr: false` so Three.js never runs server-side. Content (projects, skills) lives in typed data files under `data/`, imported by the relevant section components — no CMS, no backend.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`.

**Adaptations from a strict TDD template:** This is a visual/UI project with no business logic to unit-test. "Test" steps below mean: `npm run build` (type-checks the whole project) and `npm run lint`, plus a manual visual check via `npm run dev`. There are no unit-test files in this plan.

## Global Constraints

- Palette: background `#FAFAF8`, text `#111111`, accent `#4F46E5`.
- No contact form / no email-sending backend — footer uses `mailto:` and plain links only.
- No CMS — all content in local TypeScript data files.
- Single scrolling page — no additional routes.
- 3D scene must respect `prefers-reduced-motion` (skip 3D, show static fallback) and must not block first paint (loaded via `dynamic(..., { ssr: false })` with a loading fallback).
- Package name must be lowercase (currently `portfolio-v2-temp` in `package.json` — must be fixed).

---

### Task 1: Fix package name and install dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion` available as imports for all later tasks.

- [ ] **Step 1: Fix the package name**

In `package.json`, change:
```json
  "name": "portfolio-v2-temp",
```
to:
```json
  "name": "portfolio-v2",
```

- [ ] **Step 2: Install the new dependencies**

Run: `npm install three @react-three/fiber @react-three/drei framer-motion`
Run: `npm install -D @types/three`

- [ ] **Step 3: Verify install and existing build still work**

Run: `npm run build`
Expected: build completes with no errors (still using the default scaffold page at this point).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: rename package and add 3D/animation dependencies"
```

---

### Task 2: Design tokens, fonts, and global styles

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: CSS custom properties `--background` (`#FAFAF8`), `--foreground` (`#111111`), `--accent` (`#4F46E5`) usable via Tailwind's `@theme inline` as `bg-background`, `text-foreground`, `text-accent`, `border-accent`, etc. Also produces the `--font-heading` and `--font-sans` CSS variables applied on `<html>`.

- [ ] **Step 1: Replace the color tokens and remove dark-mode auto-switch**

The spec is light-mode only (no dark variant), so remove the `prefers-color-scheme: dark` block and set the light palette as the only theme. Replace the full contents of `app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --background: #FAFAF8;
  --foreground: #111111;
  --accent: #4F46E5;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-accent: var(--accent);
  --font-sans: var(--font-body);
  --font-heading: var(--font-heading);
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

- [ ] **Step 2: Add a heading font alongside the existing body font**

In `app/layout.tsx`, replace the `Geist`/`Geist_Mono` imports and metadata with a heading font (`Space_Grotesk` — geometric, distinctive, fits "premium minimal") plus a body font (`Inter`):

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const heading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Name — Developer Portfolio",
  description: "Full-stack and AI/automation developer portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build and visually check**

Run: `npm run build`
Expected: build succeeds with no type errors.
Run: `npm run dev`, open `http://localhost:3000` — page should render with the off-white background (existing default scaffold content is fine at this point; we're only checking the base styles apply).

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "style: set up light-mode design tokens and fonts"
```

---

### Task 3: Content data files (projects, skills)

**Files:**
- Create: `data/projects.ts`
- Create: `data/skills.ts`

**Interfaces:**
- Produces: `type Project = { title: string; description: string; tags: string[]; link: string; imageAlt: string }` and `projects: Project[]` from `data/projects.ts`.
- Produces: `type SkillCategory = { category: string; items: string[] }` and `skillCategories: SkillCategory[]` from `data/skills.ts`.
- Consumed by: Task 7 (Projects section), Task 8 (Skills section).

- [ ] **Step 1: Write `data/projects.ts` with placeholder content**

```ts
export type Project = {
  title: string;
  description: string;
  tags: string[];
  link: string;
  imageAlt: string;
};

export const projects: Project[] = [
  {
    title: "Realtime Analytics Dashboard",
    description:
      "A full-stack dashboard for visualizing live product metrics, built with a Next.js frontend and a Node/Postgres backend.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    link: "https://github.com/",
    imageAlt: "Dashboard UI mockup",
  },
  {
    title: "AI Support Agent Pipeline",
    description:
      "An LLM-powered agent that triages support tickets, calls internal tools, and escalates edge cases to a human reviewer.",
    tags: ["LLM Agents", "Python", "Vector Search"],
    link: "https://github.com/",
    imageAlt: "Agent pipeline diagram",
  },
  {
    title: "No-Code Workflow Automations",
    description:
      "A set of low-code automations connecting CRM, email, and internal APIs to remove repetitive manual work.",
    tags: ["Automation", "APIs", "Low-Code"],
    link: "https://github.com/",
    imageAlt: "Workflow automation diagram",
  },
  {
    title: "E-commerce Storefront",
    description:
      "A performant storefront with server-rendered product pages, cart, and checkout, optimized for Core Web Vitals.",
    tags: ["Next.js", "Stripe", "Tailwind"],
    link: "https://github.com/",
    imageAlt: "Storefront UI mockup",
  },
];
```

- [ ] **Step 2: Write `data/skills.ts` with placeholder content**

```ts
export type SkillCategory = {
  category: string;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "PostgreSQL", "REST APIs", "Prisma"] },
  { category: "AI / Automation", items: ["LLM Agents", "RAG Pipelines", "n8n", "Vector DBs"] },
  { category: "Tools", items: ["Git", "Docker", "Vercel", "CI/CD"] },
];
```

- [ ] **Step 3: Verify the project type-checks**

Run: `npm run build`
Expected: build succeeds (data files are unused so far but must type-check cleanly).

- [ ] **Step 4: Commit**

```bash
git add data/projects.ts data/skills.ts
git commit -m "feat: add placeholder project and skill content"
```

---

### Task 4: Nav component

**Files:**
- Create: `components/Nav.tsx`

**Interfaces:**
- Consumes: nothing (static links).
- Produces: default export `Nav` (React component), rendered at the top of the page in Task 10.

- [ ] **Step 1: Write the sticky nav component**

```tsx
const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-foreground/10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#hero" className="font-heading text-lg font-bold">
          Your Name
        </a>
        <ul className="flex gap-6 text-sm font-medium">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-accent transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds (component not yet wired into a page, but must compile standalone since it has no external unresolved imports).

- [ ] **Step 3: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat: add sticky nav component"
```

---

### Task 5: 3D hero scene

**Files:**
- Create: `components/HeroScene.tsx`
- Create: `components/Hero.tsx`
- Create: `hooks/usePrefersReducedMotion.ts`

**Interfaces:**
- Produces: `usePrefersReducedMotion(): boolean` from `hooks/usePrefersReducedMotion.ts`, reusable by any component.
- Produces: default export `HeroScene` (client component, the R3F canvas) from `components/HeroScene.tsx`.
- Produces: default export `Hero` (section component wrapping `HeroScene` with the dynamic import + fallback + text) from `components/Hero.tsx`, consumed by Task 10's `app/page.tsx`.

- [ ] **Step 1: Write the reduced-motion hook**

```ts
"use client";

import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(query.matches);

    const listener = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return prefersReduced;
}
```

- [ ] **Step 2: Write the 3D scene built from primitive geometries**

```tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import type { Group } from "three";

function Desk() {
  const groupRef = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetY = pointer.x * 0.4;
    const targetX = -pointer.y * 0.2;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * delta * 2;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * delta * 2;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={groupRef} position={[0, -0.3, 0]}>
        {/* desk */}
        <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.12, 1.2]} />
          <meshStandardMaterial color="#e8e4dc" />
        </mesh>
        {/* monitor stand */}
        <mesh position={[0, -0.3, -0.3]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#3a3a3a" />
        </mesh>
        {/* monitor body */}
        <mesh position={[0, 0.15, -0.3]} castShadow>
          <boxGeometry args={[1.3, 0.8, 0.06]} />
          <meshStandardMaterial color="#2b2b2b" />
        </mesh>
        {/* glowing screen */}
        <mesh position={[0, 0.15, -0.265]}>
          <planeGeometry args={[1.16, 0.66]} />
          <meshStandardMaterial color="#4F46E5" emissive="#4F46E5" emissiveIntensity={1.4} />
        </mesh>
        {/* keyboard */}
        <mesh position={[0, -0.53, 0.25]} castShadow>
          <boxGeometry args={[0.9, 0.05, 0.32]} />
          <meshStandardMaterial color="#f5f5f0" />
        </mesh>
        {/* coffee cup */}
        <mesh position={[0.85, -0.45, 0.25]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.18, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* plant pot */}
        <mesh position={[-0.95, -0.48, 0.25]} castShadow>
          <cylinderGeometry args={[0.11, 0.09, 0.16, 16]} />
          <meshStandardMaterial color="#c96f4a" />
        </mesh>
        {/* plant leaves */}
        <mesh position={[-0.95, -0.3, 0.25]} castShadow>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#4d7c4d" />
        </mesh>
      </group>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [1.8, 0.6, 2.4], fov: 40 }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
      <Desk />
      <Environment preset="city" />
    </Canvas>
  );
}
```

- [ ] **Step 3: Write the Hero section wrapper with dynamic import + fallback**

```tsx
"use client";

import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-background to-accent/10" />,
});

export default function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden">
      <div className="absolute inset-0">
        {prefersReducedMotion ? (
          <div className="absolute inset-0 bg-gradient-to-br from-background to-accent/10" />
        ) : (
          <HeroScene />
        )}
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
          Developer
        </p>
        <h1 className="font-heading max-w-2xl text-5xl font-bold leading-tight sm:text-6xl">
          Full-stack &amp; AI/automation developer
        </h1>
        <p className="mt-4 max-w-lg text-lg text-foreground/70">
          I build web products and AI-driven automations, end to end.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add the `@` path alias if not already present**

Check `tsconfig.json` for a `paths` entry mapping `@/*` to `./*`. `create-next-app` sets this up by default — confirm it's there; if missing, add under `compilerOptions`:
```json
"paths": { "@/*": ["./*"] }
```

- [ ] **Step 5: Verify build and visually check**

Run: `npm run build`
Expected: succeeds with no type errors.
Run: `npm run dev`, visit `http://localhost:3000` (Hero not yet wired into `page.tsx` — skip visual check until Task 10, just confirm the build compiles this task's files without error via `npx tsc --noEmit`).

- [ ] **Step 6: Commit**

```bash
git add components/HeroScene.tsx components/Hero.tsx hooks/usePrefersReducedMotion.ts tsconfig.json
git commit -m "feat: add 3D hero scene with reduced-motion fallback"
```

---

### Task 6: About section

**Files:**
- Create: `components/About.tsx`

**Interfaces:**
- Produces: default export `About`, consumed by Task 10's `app/page.tsx`.

- [ ] **Step 1: Write the About section with two domain callouts**

```tsx
"use client";

import { motion } from "framer-motion";

const domains = [
  {
    title: "Web Development",
    description:
      "Building fast, accessible, full-stack products — from React/Next.js frontends to the APIs and databases behind them.",
  },
  {
    title: "AI / Automation & Agents",
    description:
      "Designing LLM-powered agents and low-code automations that connect tools and remove repetitive manual work.",
  },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-heading text-3xl font-bold"
      >
        About
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mt-4 max-w-2xl text-foreground/70"
      >
        I&apos;m a developer who works across the full stack and in AI/automation —
        equally comfortable shipping a product UI or wiring up an agent pipeline.
      </motion.p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {domains.map((domain, index) => (
          <motion.div
            key={domain.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * index }}
            className="rounded-2xl border border-foreground/10 p-6"
          >
            <h3 className="font-heading text-xl font-semibold">{domain.title}</h3>
            <p className="mt-2 text-foreground/70">{domain.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/About.tsx
git commit -m "feat: add About section"
```

---

### Task 7: Projects section

**Files:**
- Create: `components/ProjectCard.tsx`
- Create: `components/Projects.tsx`

**Interfaces:**
- Consumes: `Project` type and `projects` array from `data/projects.ts` (Task 3).
- Produces: default export `ProjectCard` (props: `{ project: Project }`) and default export `Projects`, consumed by Task 10's `app/page.tsx`.

- [ ] **Step 1: Write `ProjectCard`**

```tsx
"use client";

import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4 }}
      className="block rounded-2xl border border-foreground/10 p-6 shadow-sm transition-shadow hover:shadow-lg"
    >
      <h3 className="font-heading text-xl font-semibold">{project.title}</h3>
      <p className="mt-2 text-sm text-foreground/70">{project.description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
          >
            {tag}
          </li>
        ))}
      </ul>
    </motion.a>
  );
}
```

- [ ] **Step 2: Write `Projects` section**

```tsx
"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-heading text-3xl font-bold"
      >
        Projects
      </motion.h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/ProjectCard.tsx components/Projects.tsx
git commit -m "feat: add Projects section"
```

---

### Task 8: Skills section

**Files:**
- Create: `components/Skills.tsx`

**Interfaces:**
- Consumes: `SkillCategory` type and `skillCategories` array from `data/skills.ts` (Task 3).
- Produces: default export `Skills`, consumed by Task 10's `app/page.tsx`.

- [ ] **Step 1: Write the Skills section**

```tsx
"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-heading text-3xl font-bold"
      >
        Skills
      </motion.h2>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {skillCategories.map((group) => (
          <div key={group.category}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/50">
              {group.category}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-foreground/10 px-3 py-1 text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/Skills.tsx
git commit -m "feat: add Skills section"
```

---

### Task 9: Contact/Footer section

**Files:**
- Create: `components/Footer.tsx`

**Interfaces:**
- Produces: default export `Footer`, consumed by Task 10's `app/page.tsx`.

- [ ] **Step 1: Write the Footer with mailto and social links**

```tsx
export default function Footer() {
  return (
    <footer id="contact" className="border-t border-foreground/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Let&apos;s talk</h2>
          <a
            href="mailto:you@example.com"
            className="mt-2 inline-block text-accent hover:underline"
          >
            you@example.com
          </a>
        </div>
        <ul className="flex gap-6 text-sm font-medium">
          <li>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add Footer/contact section"
```

---

### Task 10: Assemble the page

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Nav` (Task 4), `Hero` (Task 5), `About` (Task 6), `Projects` (Task 7), `Skills` (Task 8), `Footer` (Task 9) — all default exports.

- [ ] **Step 1: Replace `app/page.tsx` with the section assembly**

```tsx
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <About />
        <Projects />
        <Skills />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Remove the now-unused default Next.js public assets**

Delete `public/next.svg` and `public/vercel.svg` if nothing else references them (check first):
Run: `grep -r "next.svg\|vercel.svg" app components` — expect no matches after Step 1's replacement.
Then remove the two files.

- [ ] **Step 3: Run build and lint**

Run: `npm run build`
Expected: succeeds with no type errors.
Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000`.
Verify: sticky nav at top, 3D desk scene rotates subtly toward the mouse in the hero, About/Projects/Skills sections render with placeholder content, footer has a working `mailto:` link. Test with OS-level "reduce motion" enabled to confirm the static gradient fallback replaces the 3D canvas.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx public/
git commit -m "feat: assemble portfolio page from sections"
```

---

## Self-Review Notes

- **Spec coverage:** tech stack (Task 1), 3D hero + fallback (Task 5), page structure/nav (Tasks 4, 10), About/Projects/Skills/Footer (Tasks 6-9), design system tokens/fonts (Task 2), placeholder content (Task 3) — all spec sections have a task.
- **Deviation flagged:** 3D model built from primitive geometries instead of an imported Sketchfab/Poly Haven GLTF file, to avoid external asset download/licensing steps in this session. Visual goal (low-poly desk/monitor/plant, floating, mouse-parallax) is preserved.
- **Type consistency:** `Project` and `SkillCategory` types defined once in `data/` (Task 3) and imported everywhere they're used (Tasks 7, 8) rather than redefined.
- **Out of scope carried over from spec:** no contact form, no CMS — confirmed no task introduces either.
