# frontend-engineering Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `accessibility.md` | WCAG conformance workflow: keyboard-only pass, focus management on route change, screen reader verification, contrast/motion checks, before shipping or auditing any UI |
| `anti-slop-taste.md` | Before styling a new page or when a UI looks generic: brief inference, a design plan checked against the brief, the default clusters to exclude (with hex values), Three Dials calibration, archetypes, and redesign audits |
| `app-ux-patterns.md` | Designing app UX when the brief is open: token layering, theme/skin switching without flash, one-tap flows, purposeful motion, command palette, status color, axe-in-CI quality gates, distilled from shipped apps |
| `design-systems.md` | Building or extending a shared component library: token layering (primitive/semantic/component), promoting repeated shapes, intent-based variant naming, breaking-change/migration discipline |
| `frontend-design.md` | Setting the visual system before writing markup: type scale, spacing rhythm, color/radius/elevation/motion as concrete numbers, translated into CSS custom properties |
| `frontend-optimization.md` | Writing a Server Action, or code that is slow or heavy: prioritized wrong/right rules for action auth, request waterfalls, barrel and dynamic imports, boundary serialization, derived state and memoization |
| `frontend-review.md` | Auditing UI code before merge: the a11y/layout/responsiveness checklist, severity levels (Blocker/Major/Minor/Nit), and the file:line review output format |
| `masonry-layouts.md` | Choosing between CSS multi-column, a JS masonry library, or native `grid-template-rows: masonry` — decided by whether visual order must match DOM order |
| `mobile-web-polish.md` | Eliminating mobile web browser defects: `100dvh` viewport units, sticky hover elimination, safe area insets, 16px input zoom prevention, and tap highlight suppression |
| `modern-web-platform.md` | Which standard to target (WCAG 2.2, Core Web Vitals, DTCG tokens), Baseline adoption policy, and native CSS/HTML alternatives to libraries: `@layer`, container queries, `:has()`, popover, `<dialog>`, anchor positioning, View Transitions, INP tactics |
| `nextjs-app-router.md` | Working in a repo with an `app/` directory: Server vs Client Component boundaries, data fetching/caching/revalidation, streaming, and route-segment conventions |
| `playwright-recipes.md` | Exact copy-pasteable commands for ephemeral Playwright capture — temp dirs, starting/polling the dev server, hydration waits, teardown — for both POSIX and PowerShell |
| `real-world-cases.md` | Starting point for a practical UI build, bug fix, or review: checklists for existing-app changes, React state bugs, Next.js data boundaries, forms, and performance/hydration issues |
| `screenshot-capture.md` | The end-to-end workflow for capturing UI screenshots: detecting the frontend, starting/stopping a server safely, avoiding project deps, and reporting output paths |
| `shadcn-integration.md` | shadcn/ui component catalog, architecture and class merging with `cn()`, variant styling with `cva`, CLI installation, blocks, and Radix accessibility guarantees |
| `state-recipes.md` | Modeling UI state as a discriminated union instead of independent booleans, plus optimistic-update-with-rollback patterns |
| `toast-notifications.md` | High-craft toast notification systems: stacking geometry, dynamic height expansion, swipe-to-dismiss physics, promise lifecycle states, and accessible announcements |
| `ui-components.md` | Building a reusable component: stack selection, the requirements-implementation-validation-documentation flow, atomic composition, and styling conventions |
| `ui-state-design.md` | Enumerating every UI state (loading, empty, partial, error, success) before writing markup, picking the treatment for each, and writing its microcopy (CTA/result verbs, error text, touch targets) |
| `ui-polish-pass.md` | Polishing an existing project end to end: before/after screenshots, component inventory, one token system, consolidating duplicates, a defect table for misalignment and broken CSS, and UX/a11y state coverage |
| `vite-core.md` | Vite 8/Rolldown CLI commands and what changed migrating from Vite 7 (Rollup→Rolldown, esbuild→Oxc, `rollupOptions`→`rolldownOptions`) |
| `vite-patterns.md` | Per-framework Vite setup (React/Vue/Svelte plugins), `VITE_`-prefixed env vars, dev server proxy/alias config, and raw/url asset imports |
| `vite-tailwind-v4.md` | Wiring Tailwind CSS v4's CSS-first `@theme` config and OKLCH color functions into a Vite project |
| `web-i18n.md` | Shipping a web UI in more than one language or locale: ICU messages and plurals, `Intl` dates/numbers/currency, RTL with logical CSS, locale routing and `hreflang`, pseudo-localization |
