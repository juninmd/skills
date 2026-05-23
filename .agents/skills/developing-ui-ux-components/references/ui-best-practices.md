# UI/UX Best Practices and Stack

Guidelines for building modern, accessible, and reusable web components.

## 1. Recommended 2026 Stack
- **Build:** Vite 8 + SWC.
- **Framework:** React + TypeScript.
- **Primitives:** Radix UI + Tailwind CSS.
- **Catalog:** Storybook.
- **Quality:** Biome (lint/format), Vitest, React Testing Library.

## 2. Core Principles
- **Atomic Design:** Build atoms before molecules and organisms.
- **A11y by Default:** Prefer native elements over ARIA; ensure visible focus and correct tab order.
- **State Separation:** Keep business logic in `domain/` or hooks; keep components "thin".
- **Naming:** kebab-case for files, `PascalCase` for components, `use*` for hooks.

## 3. Implementation Rules
- **Props:** Use strict TypeScript interfaces for all component contracts.
- **Composition:** Prefer component composition over deep prop drilling.
- **Isolation:** Components must be self-contained and side-effect free.
