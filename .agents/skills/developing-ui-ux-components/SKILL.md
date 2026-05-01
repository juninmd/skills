---
name: developing-ui-ux-components
description: "Reusable accessible web components. Triggers: a11y."
argument-hint: "[file/module] [options]"
---
---

# UI/UX Component Development

## Description
This skill guides the design, implementation, and documentation of reusable, accessible, and consistent components for web applications.

## 🧱 Recommended Stack 2026
- Build/dev server: **Vite 8** + **SWC**.
- Framework: React + TypeScript.
- UI primitives: Radix UI + Tailwind CSS (or internal Design System).
- Catalog: Storybook.
- Linting/Formatting: **Biome** (replaces ESLint/Prettier).
- Testing: Vitest + React Testing Library + Playwright for critical flows.
- State: local first; Zustand only for actual sharing.

## Recommended Baseline
- Prefer **Vite 8** and **SWC** for scaffolding, local development, and blazing-fast bundling.
- Prefer React + TypeScript for safer component contracts.
- Priorize local state; introduce Zustand only when necessary.
- Separate UI from business rules, integrations, and domain policies.

## Flow

### 1. Analyze Requirements
- Review design specs (Figma/Sketch) and user stories.
- Identify purpose, states (hover/active/disabled), and props.
- Define accessibility requirements (keyboard, focus, accessible name).

### 2. Implement Component
- Write components with explicit props, strong typing, and semantic HTML.
- Apply styles (CSS/SASS/Tailwind) without coupling domain logic.
- Keep rendering in the component and move orchestration to hooks/services/domain.
- Ensure responsiveness.

### 3. Test and Validate
- Write unit/interaction tests with Vitest + React Testing Library.
- Visually validate in Storybook if a catalog exists.
- Verify accessibility (tab order, visible focus, accessible names).

### 4. Document
- Document props, usage examples, interaction states, and accessibility constraints.
- Update the component library/visual guide.

## Best Practices
- **Atomic Design:** build atoms before molecules and organisms.
- **Prop Drilling:** avoid excess; prefer composition/context when necessary.
- **Isolation:** components should be self-contained and predictable.
- **Thin UI Layer:** calculations and policies should live in `domain/`, `services/`, or dedicated hooks.
- **A11y by Default:** prefer native elements over ARIA; avoid positive `tabIndex`.
- **Naming:** kebab-case for files/folders, `PascalCase` for exported components, and `use*` prefix for hooks.
- **State Boundary:** keep business invariants out of UI stores.

## Checklist

- [ ] Define the component API, states, and accessibility contract before implementation.
- [ ] Keep styling, interaction, and data responsibilities separated enough to test independently.
- [ ] Validate keyboard, focus, and responsive behavior before marking the component done.

## References

- [Implementing Accessibility Skill](../implementing-accessibility/SKILL.md)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

