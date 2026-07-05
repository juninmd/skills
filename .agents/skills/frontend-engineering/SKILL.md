---
name: frontend-engineering
description: |
  Build and review accessible web interfaces. Use for React, Next.js, Vite, Tailwind, shadcn/ui, responsive design, component systems, browser performance, hydration, keyboard behavior, and accessibility.
---

# Frontend Engineering

## Workflow
1. Inspect framework/version, component system, route/data boundaries, styling, and existing test commands.
2. Define the primary user task, states, responsive behavior, and accessibility contract.
3. Keep server/client boundaries explicit; minimize client JavaScript and duplicated state.
4. Implement loading, empty, error, disabled, overflow, and slow-network behavior with the happy path.
5. Verify keyboard use, focus, labels, contrast, responsive layouts, browser console, tests, and production build.

## Reference Routing
- Real development cases and current frontend traps: [real-world-cases.md](references/real-world-cases.md)
- Product-quality review and optimization: [frontend-review.md](references/frontend-review.md), [frontend-optimization.md](references/frontend-optimization.md)
- UI composition: [ui-flow.md](references/ui-flow.md), [ui-best-practices.md](references/ui-best-practices.md), [ui-design-guidelines.md](references/ui-design-guidelines.md)
- shadcn/ui: [GUIDE_INSTALLATION.md](references/GUIDE_INSTALLATION.md), [GUIDE_ARCHITECTURE.md](references/GUIDE_ARCHITECTURE.md), [GUIDE_BLOCKS_A11Y.md](references/GUIDE_BLOCKS_A11Y.md)
- Vite/Tailwind: [vite-core.md](references/vite-core.md), [vite-patterns.md](references/vite-patterns.md), [vite-tailwind-v4.md](references/vite-tailwind-v4.md)

## Rules
- Preserve the repository design system; do not introduce a second component stack casually.
- Prefer semantic HTML and native behavior before ARIA.
- Avoid effects for derived state and avoid hydration-dependent initial rendering.
- Visual polish cannot hide broken states or inaccessible controls.

## Checklist
- [ ] Main, loading, empty, and error states work.
- [ ] Keyboard, focus, contrast, and responsive checks pass.
- [ ] Tests and production build pass cleanly.
