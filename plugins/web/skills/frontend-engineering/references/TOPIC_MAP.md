# frontend-engineering Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `accessibility.md` | WCAG conformance workflow: keyboard-only pass, focus management on route change, screen reader verification, contrast/motion checks, before shipping or auditing any UI |
| `animation-performance.md` | Frame budgeting, compositor-only transform and opacity properties, `will-change` layer management, and eliminating layout thrashing |
| `anti-slop-taste.md` | Before styling a new page or when a UI looks generic: brief inference, a design plan checked against the brief, the default clusters to exclude (with hex values), Three Dials calibration, archetypes, and redesign audits |
| `design-systems.md` | Building or extending a shared component library: token layering (primitive/semantic/component), promoting repeated shapes, intent-based variant naming, breaking-change/migration discipline |
| `fluid-gestures.md` | Physics-based direct manipulation, 1:1 touch tracking, release velocity preservation, rubber-band resistance formulas, and dismissible sheets |
| `frontend-design.md` | Setting the visual system before writing markup: type scale, spacing rhythm, color/radius/elevation/motion as concrete numbers, translated into CSS custom properties |
| `frontend-optimization.md` | Writing a Server Action, or code that is slow or heavy: prioritized wrong/right rules for action auth, request waterfalls, barrel and dynamic imports, boundary serialization, derived state and memoization |
| `frontend-review.md` | Auditing UI code before merge: the a11y/layout/responsiveness checklist, severity levels (Blocker/Major/Minor/Nit), and the file:line review output format |
| `masonry-layouts.md` | Choosing between CSS multi-column, a JS masonry library, or native `grid-template-rows: masonry` — decided by whether visual order must match DOM order |
| `mobile-web-polish.md` | Eliminating mobile web browser defects: `100dvh` viewport units, sticky hover elimination, safe area insets, 16px input zoom prevention, and tap highlight suppression |
| `motion-audit.md` | Auditing codebase animations: spotting missing polish or abrupt pops, diagnosing sluggish over-animation, scoring motion quality, and prioritized remediation matrices |
| `motion-code-review.md` | Adversarial review standards for motion: property checks (no layout reflows), blanket transition bans (`transition: all`), duration caps, and reduced-motion enforcement |
| `motion-design-principles.md` | Purposeful animation foundations: motion decision framework, perceptual duration budgets (100ms–350ms), spring physics vs easing curves, and state interruptibility |
| `motion-vocabulary.md` | Standard motion and physics terminology: stiffness, damping, mass, settling time, spatial continuity, stagger, overshoot, and jank troubleshooting |
| `nextjs-app-router.md` | Working in a repo with an `app/` directory: Server vs Client Component boundaries, data fetching/caching/revalidation, streaming, and route-segment conventions |
| `playwright-recipes.md` | Exact copy-pasteable commands for ephemeral Playwright capture — temp dirs, starting/polling the dev server, hydration waits, teardown — for both POSIX and PowerShell |
| `prototype-variants.md` | Prototyping motion variants: runtime personality switchers (Snappy, Gentle, Tactile, Sharp), parameter exploration, and blind feel evaluations |
| `real-world-cases.md` | Starting point for a practical UI build, bug fix, or review: checklists for existing-app changes, React state bugs, Next.js data boundaries, forms, and performance/hydration issues |
| `screenshot-capture.md` | The end-to-end workflow for capturing UI screenshots: detecting the frontend, starting/stopping a server safely, avoiding project deps, and reporting output paths |
| `shadcn-integration.md` | shadcn/ui component catalog, architecture and class merging with `cn()`, variant styling with `cva`, CLI installation, blocks, and Radix accessibility guarantees |
| `state-recipes.md` | Modeling UI state as a discriminated union instead of independent booleans, plus optimistic-update-with-rollback patterns |
| `toast-notifications.md` | High-craft toast notification systems: stacking geometry, dynamic height expansion, swipe-to-dismiss physics, promise lifecycle states, and accessible announcements |
| `ui-components.md` | Building a reusable component: stack selection, the requirements-implementation-validation-documentation flow, atomic composition, and styling conventions |
| `ui-state-design.md` | Enumerating every UI state (loading, empty, partial, error, success) before writing markup, picking the treatment for each, and writing its microcopy (CTA/result verbs, error text, touch targets) |
| `vite-core.md` | Vite 8/Rolldown CLI commands and what changed migrating from Vite 7 (Rollup→Rolldown, esbuild→Oxc, `rollupOptions`→`rolldownOptions`) |
| `vite-patterns.md` | Per-framework Vite setup (React/Vue/Svelte plugins), `VITE_`-prefixed env vars, dev server proxy/alias config, and raw/url asset imports |
| `vite-tailwind-v4.md` | Wiring Tailwind CSS v4's CSS-first `@theme` config and OKLCH color functions into a Vite project |
| `web-animation-recipes.md` | Production-ready motion recipes: CSS Grid row accordion reveals, Framer Motion dialogs and overlays, staggered collections, shared layout indicators, and tactile micro-presses |
| `web-i18n.md` | Shipping a web UI in more than one language or locale: ICU messages and plurals, `Intl` dates/numbers/currency, RTL with logical CSS, locale routing and `hreflang`, pseudo-localization |
