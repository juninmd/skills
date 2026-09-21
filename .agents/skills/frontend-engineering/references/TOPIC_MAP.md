# frontend-engineering Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `AVAILABLE_COMPONENTS.md` | shadcn/ui's full component catalog by category (layout, forms, data display, navigation, overlays, feedback) plus pre-built blocks, when picking which component to reach for |
| `GUIDE_ARCHITECTURE.md` | shadcn/ui file layout, the `cn()` class-merge helper, and how to theme or extend components without editing generated `ui/` files |
| `GUIDE_BLOCKS_A11Y.md` | shadcn/ui block discovery (`list_blocks`/`get_block`) and the accessibility guarantees Radix primitives already give you, before hand-rolling a form/modal/table pattern |
| `GUIDE_INSTALLATION.md` | shadcn/ui component discovery and installation, CLI (`shadcn add`) vs manual, and registry lookup commands |
| `accessibility.md` | WCAG conformance workflow: keyboard-only pass, focus management on route change, screen reader verification, contrast/motion checks, before shipping or auditing any UI |
| `design-systems.md` | building or extending a shared component library: token layering (primitive/semantic/component), promoting repeated shapes, intent-based variant naming, breaking-change/migration discipline |
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
