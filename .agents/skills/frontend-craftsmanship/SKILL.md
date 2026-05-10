---
name: frontend-craftsmanship
description: "Production frontend implementation and review across React/Next.js performance, distinctive UI design, accessibility, and web interface quality. Use when building, reviewing, or refactoring React components, Next.js pages, dashboards, landing pages, design-system surfaces, or any web UI where visual polish, performance, and guideline compliance all matter. Triggers: frontend craft, UI quality, React performance, Next.js performance, web design review, production UI."
argument-hint: "[file/module or product context] [options]"
applyTo: '**/*.{tsx,jsx,ts,js,css,scss,mdx}'
---

# Frontend Craftsmanship

Use this skill to produce web UI that is fast, accessible, visually intentional, and maintainable. Balance three lenses before coding or reviewing:

1. Product fit: who uses this, what they need to do, and what density or tone fits the domain.
2. Interface quality: typography, layout, color, states, responsiveness, focus, and motion.
3. Runtime quality: React/Next.js data flow, bundle size, render behavior, hydration, and testability.

When trade-offs conflict, preserve product workflow first, accessibility second, performance third, and visual novelty last. A polished UI that breaks the primary task is a failed implementation.

## Workflow

### 1. Establish The UI Contract

- Identify the primary workflow, target user, viewport constraints, and success criteria.
- Choose a clear visual direction that fits the domain instead of defaulting to generic SaaS cards or purple gradient themes.
- Preserve existing design-system primitives, tokens, spacing, and naming unless the task explicitly asks for a new direction.
- Define required states before implementation: loading, empty, error, disabled, hover, focus, selected, and optimistic/pending.

### 2. Build The Right Boundary

- Default to Server Components and server data loading in Next.js; add `"use client"` only for interactivity, browser APIs, local state, or event handlers.
- Start independent promises early and await late. Use `Promise.all` for independent work.
- Keep external input validated at the boundary with project-standard schemas such as Zod.
- Keep components under the local size limit by extracting stable view pieces, hooks, or server helpers only when that improves clarity.
- Avoid moving business invariants into UI state stores. Keep UI state local unless several distant surfaces truly share it.

### 3. Design With Intent

- Make one strong compositional decision: density, rhythm, navigation model, visual hierarchy, or interaction model.
- Use typography deliberately. Match font scale to context: compact tool surfaces need tighter type than marketing heroes.
- Use color as a system: neutral base, semantic states, and one or two purposeful accents.
- Use motion to clarify state changes and focus attention; keep it short, interruptible, and respectful of reduced-motion preferences.
- Use real product, data, or domain-specific visual cues when possible. Avoid decorative visuals that do not support the task.

### 4. Optimize React And Next.js

- Avoid data fetching in `useEffect` when server data, RSC, route loaders, SWR, or Suspense-aware promises fit better.
- Minimize client props crossing the RSC boundary; pass only serializable data needed by the client component.
- Import directly from packages or component modules when barrel imports inflate bundles.
- Dynamically import heavy, rare, or below-the-fold client components.
- Hoist stable objects, arrays, regexes, and static JSX out of render paths when they cause churn.
- Use `useMemo`, `useCallback`, and `memo` only for real render pressure or stable identities required by child components.
- Prefer primitive effect dependencies; derive state during render instead of syncing derived values in effects.
- Use `startTransition` or deferred values for non-urgent updates that would block input.

### 5. Validate Interface Quality

- Inspect keyboard flow, visible focus, accessible names, contrast, and semantic HTML before marking complete.
- Confirm no text overlaps, clipped labels, unstable layout shifts, or viewport-only font scaling.
- Verify responsive behavior at mobile, tablet, and desktop widths.
- Run the narrowest useful checks: typecheck, lint, component/unit tests, Storybook or Playwright smoke when available.
- For review tasks, fetch the latest Vercel Web Interface Guidelines before judging compliance:

```text
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

## Review Output

When reviewing UI code, lead with concrete findings:

```text
path/to/file.tsx:42 HIGH - Client component fetches data in useEffect, causing a loading waterfall. Move the fetch to the server route/page and pass the resolved data down.
path/to/card.tsx:88 LOW - Focus state is color-only. Add a visible outline or ring that meets contrast requirements.
```

Use severity only when it helps triage:

- `BLOCKER`: security, broken primary workflow, inaccessible core action, hydration crash, or severe data/performance regression.
- `HIGH`: likely user-facing defect, avoidable waterfall, large bundle regression, keyboard trap, unreadable contrast, or missing error state.
- `LOW`: polish, maintainability, minor a11y improvement, layout refinement, or local cleanup.

## Checklist

- [ ] The UI has an explicit product purpose, visual direction, and complete state model.
- [ ] React/Next.js boundaries minimize client code, waterfalls, bundle growth, and unnecessary renders.
- [ ] Accessibility, responsive layout, text fit, focus behavior, and reduced-motion behavior were checked.
- [ ] Tests or smoke checks cover the changed workflow at the appropriate risk level.

## References

- [React Development Skill](../react-dev/SKILL.md)
- [Next.js Development Skill](../nextjs-dev/SKILL.md)
- [Frontend Design Skill](../frontend-design/SKILL.md)
- [UI/UX Component Development Skill](../developing-ui-ux-components/SKILL.md)
- [Implementing Accessibility Skill](../implementing-accessibility/SKILL.md)
- [Frontend Standards Rule](../../rules/frontend-standards.instructions.md)
- [TypeScript Standards Rule](../../rules/typescript-standards.instructions.md)
