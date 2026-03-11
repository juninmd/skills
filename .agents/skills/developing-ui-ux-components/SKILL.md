---
name: developing-ui-ux-components
description: Design, implement, and document reusable, accessible frontend UI components for web applications
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# UI/UX Component Developer Skill

## Description
This skill enables the agent to design, implement, and document reusable frontend UI components. It focuses on creating modular, accessible, and styled components for web applications using modern frameworks, with React + TypeScript + Vite as the preferred baseline for new web projects.

## Recommended Baseline
- Prefer Vite for scaffolding, local development, and bundling in new web frontends.
- Prefer React with TypeScript for shared typing, safer refactors, and clearer component contracts.
- Use local component state first; introduce Zustand only when state must be shared across screens or distant branches.
- Keep UI rendering separate from business rules, integration code, and domain policies.

## Workflow

### 1. Analyze Requirements
- Review design specs (Figma, Sketch) or user stories.
- Identify the component's purpose, states (hover, active, disabled), and props.
- Determine accessibility requirements, including keyboard behavior, focus handling, and accessible naming.

### 2. Implement Component
- Write the component code with explicit props, strong typing, and semantic HTML.
- Apply styling (CSS, SASS, Tailwind) without coupling style decisions to domain logic.
- Keep rendering concerns in the component and move orchestration to hooks, services, or domain modules.
- Ensure responsiveness across different screen sizes.

### 3. Test & Validate
- Write unit and interaction tests with Vitest and React Testing Library when working in React/Vite projects.
- Visually test the component in a sandbox (e.g., Storybook) when the repository maintains a component catalog.
- Verify accessibility compliance, including tab order, visible focus, and accessible names.

### 4. Document
- Document component props, usage examples, interaction states, and accessibility constraints.
- Update the component library or style guide.

## Best Practices
- **Atomic Design:** Build small atoms (buttons, inputs) first, then combine them into molecules and organisms.
- **Prop Drilling:** Avoid excessive prop drilling; use composition or context where appropriate.
- **Isolation:** Ensure components are self-contained and don't rely on global state or styles.
- **Thin UI Layer:** Keep components focused on rendering and interaction. Move calculations, permission rules, payload assembly, and cross-cutting policies to `domain/`, `services/`, or dedicated hooks.
- **A11y by Default:** Prefer native elements before ARIA roles. Use `aria-label` only when visible text is not enough. Avoid positive `tabIndex` values.
- **Naming:** Use kebab-case for folders and files, `PascalCase` for exported React components, and `use*` prefixes for hooks.
- **State Boundaries:** Prefer local state. Use Zustand for lightweight shared state, but keep business invariants outside store definitions whenever possible.
