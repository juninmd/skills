# frontend-engineering Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `AVAILABLE_COMPONENTS.md` | shadcn/ui's full component catalog by category (layout, forms, data display, navigation, overlays, feedback) plus pre-built blocks, when picking which component to reach for |
| `GUIDE_ARCHITECTURE.md` | shadcn/ui file layout, the `cn()` class-merge helper, and how to theme or extend components without editing generated `ui/` files |
| `GUIDE_BLOCKS_A11Y.md` | shadcn/ui block discovery (`list_blocks`/`get_block`) and the accessibility guarantees Radix primitives already give you, before hand-rolling a form/modal/table pattern |
| `GUIDE_INSTALLATION.md` | shadcn/ui component discovery and installation, CLI (`shadcn add`) vs manual, and registry lookup commands |
| `accessibility.md` | WCAG conformance workflow: keyboard-only pass, focus management on route change, screen reader verification, contrast/motion checks, before shipping or auditing any UI |
| `anti-slop-taste.md` | Anti-slop UI direction, Brief Inference (Read the Room), Three Dials calibration (variance/motion/density), aesthetic archetypes, and redesign audits |
| `design-systems.md` | building or extending a shared component library: token layering (primitive/semantic/component), promoting repeated shapes, intent-based variant naming, breaking-change/migration discipline |
| `emil-design-eng/design-eng.md` | UI polish and motion philosophy (Emil Kowalski, MIT): easing and duration choices, springs, interruptibility, shadows over borders, the invisible details; read first for any motion decision |
| `emil-design-eng/animate.md` | Building one web animation from scratch: should it animate, purpose, tool, properties, curve, duration, interruption, exit; ready recipes in `emil-design-eng/animate-recipes.md` |
| `emil-design-eng/review-animations.md` | Strict review of animation or motion code in a diff; rule set in `emil-design-eng/review-standards.md`; default to flagging |
| `emil-design-eng/improve-animations.md` | Auditing all motion in a codebase and writing prioritized executor plans; audit rubric in `emil-design-eng/improve-audit.md`, plan shape in `emil-design-eng/improve-plan-template.md` |
| `emil-design-eng/find-animation-opportunities.md` | Read-only sweep for places that would benefit from motion, and what must stay static |
| `emil-design-eng/animation-vocabulary.md` | Naming a motion effect from a vague description, to prompt a designer or model precisely |
| `emil-design-eng/apple-design.md` | Apple-style fluid motion for the web: gesture-driven springs, momentum, sheets, materials and depth, optical type, reduced motion |
| `emil-design-eng/mobile-native.md` | Web app that feels wrong on a phone: sticky hover, tap highlight, 100vh, input zoom, safe areas, pull-to-refresh, carousels, PWA |
| `emil-design-eng/prototype-variants.md` | Building several genuinely different versions of one UI piece behind a live switcher; picker code in `emil-design-eng/prototype-picker.md` |
| `emil-design-eng/sonner.md` | Sonner toasts: setup, promise/loading toasts, styling, theming, and toasts that vanish, duplicate, or sit behind a modal; API in `emil-design-eng/sonner-api.md` |
| `emil-design-eng/performance-cheatsheet.md` | Animation that stutters or drops frames: transform/opacity only, blur limits, no `transition: all`, ref-driven styles |
| `frontend-design.md` | setting the visual system before writing markup: type scale, spacing rhythm, color/radius/elevation/motion as concrete numbers, translated into CSS custom properties |
| `frontend-optimization.md` | React/Next.js performance patterns: RSC vs client boundary strategy, render efficiency (memoization, state location), bundle size (barrel imports, dynamic imports) |
| `frontend-review.md` | auditing UI code before merge: the a11y/layout/responsiveness checklist, severity levels (BLOCKER/HIGH/LOW), and the file:line review output format |
| `masonry-layouts.md` | choosing between CSS multi-column, a JS masonry library, or native `grid-template-rows: masonry` — decided by whether visual order must match DOM order |
| `nextjs-app-router.md` | working in a repo with an `app/` directory: Server vs Client Component boundaries, data fetching/caching/revalidation, streaming, and route-segment conventions |
| `playwright-recipes.md` | exact copy-pasteable commands for ephemeral Playwright capture — temp dirs, starting/polling the dev server, hydration waits, teardown — for both POSIX and PowerShell |
| `real-world-cases.md` | starting point for a practical UI build, bug fix, or review: checklists for existing-app changes, React state bugs, Next.js data boundaries, forms, and performance/hydration issues |
| `screenshot-capture.md` | the end-to-end workflow for capturing UI screenshots: detecting the frontend, starting/stopping a server safely, avoiding project deps, and reporting output paths |
| `state-recipes.md` | modeling UI state as a discriminated union instead of independent booleans, plus optimistic-update-with-rollback patterns |
| `ui-components.md` | building a reusable component: stack selection, the requirements-implementation-validation-documentation flow, atomic composition, and styling conventions |
| `ui-state-design.md` | enumerating every UI state (loading, empty, partial, error, success) before writing markup, and picking the right treatment for each |
| `vite-core.md` | Vite 8/Rolldown CLI commands and what changed migrating from Vite 7 (Rollup→Rolldown, esbuild→Oxc, `rollupOptions`→`rolldownOptions`) |
| `vite-patterns.md` | per-framework Vite setup (React/Vue/Svelte plugins), `VITE_`-prefixed env vars, dev server proxy/alias config, and raw/url asset imports |
| `vite-tailwind-v4.md` | wiring Tailwind CSS v4's CSS-first `@theme` config and OKLCH color functions into a Vite project |
