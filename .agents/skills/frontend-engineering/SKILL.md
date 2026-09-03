---
name: frontend-engineering
description: |
  Build, bundle, and review web UIs. Use for React, Next.js App Router, Vite, Tailwind, shadcn/ui, server and client boundaries, component systems, responsive layout, hydration mismatches, and keyboard behavior.
---

# Frontend Engineering

## Preflight

```bash
cat package.json | jq '{dependencies, devDependencies, scripts}' | head -40
ls next.config.* vite.config.* components.json tailwind.config.* 2>/dev/null
ls app/ pages/ src/ 2>/dev/null      # App Router, Pages Router, or SPA
```

Framework and router decide where data may be fetched, where state may live, and what "server component" means here. Read this before writing a line.

## Workflow
1. Name the primary user task, its states, and its responsive behavior before building anything.
2. Keep server/client boundaries explicit. `'use client'` is a leaf decision — put it on the smallest component that needs it, because everything imported below it becomes client code too.
3. Implement loading, empty, error, disabled, overflow, and slow-network alongside the happy path. Enumerate them with `ui-state-design`.
4. Keep the UI layer thin: calculations and business policy live in domain modules, services, or hooks — not in JSX.
5. Verify keyboard, focus, responsive layout, a clean console, tests, and the production build. The dev build hides real failures.

## Hydration Mismatch
Server and client HTML differ, React discards the server markup, and the console names the node.

| Cause | Fix |
|---|---|
| `Date`, `Math.random`, `crypto` during render | compute in an effect, or pass a server-generated value down |
| `window`, `document`, `localStorage` during render | `useSyncExternalStore`, or render after mount |
| Locale/timezone formatting | format on one side only, or pin the locale explicitly |
| Invalid nesting (`<div>` in `<p>`, `<p>` in `<p>`) | fix the markup — the browser silently rewrites the tree |
| Extension-injected markup | reproduce in a clean profile before chasing it |

Never silence it with `suppressHydrationWarning` on a parent. That hides the real divergence and every future one under the same subtree.

## State That Should Not Be State

| Instinct | Do instead |
|---|---|
| `useEffect` to derive B from A | compute during render |
| `useEffect` to sync props into state | read the prop; key the component to reset |
| `useState` for server data | the framework's data layer or a query cache |
| `useEffect` to fetch on mount | server component, loader, or query library |

An effect for derived state produces one extra render and a window where the two disagree.

## Reference Routing
Open a file only when its trigger matches.
- Any component work: [ui-components.md](references/ui-components.md).
- `app/` directory: [nextjs-app-router.md](references/nextjs-app-router.md) — server/client boundaries, streaming, caching, actions.
- `components.json` (shadcn/ui): adding it [GUIDE_INSTALLATION.md](references/GUIDE_INSTALLATION.md), extending a primitive [GUIDE_ARCHITECTURE.md](references/GUIDE_ARCHITECTURE.md), picking one [AVAILABLE_COMPONENTS.md](references/AVAILABLE_COMPONENTS.md), blocks [GUIDE_BLOCKS_A11Y.md](references/GUIDE_BLOCKS_A11Y.md).
- `vite.config.*`: [vite-core.md](references/vite-core.md), [vite-patterns.md](references/vite-patterns.md); Tailwind v4 there: [vite-tailwind-v4.md](references/vite-tailwind-v4.md).
- Reviewing UI: [frontend-review.md](references/frontend-review.md); slow UI: [frontend-optimization.md](references/frontend-optimization.md).
- Behavior that should work but does not: [real-world-cases.md](references/real-world-cases.md).

## Stop
- A hydration warning appears in the console. Fix the divergence; never silence it with `suppressHydrationWarning`.
- A secret or server-only value would cross into a client component. Stop before it ships to every browser.
- Only the dev build was verified. Verify against the production build — StrictMode and minification change behavior.

## Rules
- Preserve the repository's design system. Never add a second component stack casually — two stacks is a permanent tax on every future component.
- A secret read in a client component ships to the browser. Environment variables without the public prefix are server-only for a reason; check before moving code across the boundary.
- `key` on a list must be stable and identity-bearing. Array index as key corrupts state whenever the list reorders.
- Delegate accessibility to `accessibility`, runtime and bundle cost to `web-performance`, visual system decisions to `frontend-design`, and native or cross-platform mobile apps to `mobile-engineering`. Do not restate their rules here.
- Verify against the production build. Dev-only warnings, double-invoked effects in StrictMode, and unminified behavior all differ.

## Checklist
- [ ] Framework, router, and component system read before writing.
- [ ] `'use client'` sits on the smallest component that needs it; no secret crosses the boundary.
- [ ] Main, loading, empty, error, and slow-network states all work.
- [ ] No hydration warning in the console, and none suppressed.
- [ ] No effect used for derived state; list keys stable.
- [ ] Keyboard, focus, and responsive checks pass; tests and the production build are clean.
