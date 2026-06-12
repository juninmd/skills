# UI/UX Best Practices and Stack

Guidelines for building modern, accessible, and reusable web components.

## 1. Stack Selection
- Preserve the repository framework, bundler, styling system, package manager, and test runner.
- For new projects, verify maintained versions and choose the smallest stack that meets accessibility, browser, and deployment requirements.
- Add component catalogs or design-system tooling only when multiple consumers justify them.

## 2. Core Principles
- **Atomic Design:** Build atoms before molecules and organisms.
- **A11y by Default:** Prefer native elements over ARIA; ensure visible focus and correct tab order.
- **State Separation:** Keep business logic in `domain/` or hooks; keep components "thin".
- **Naming:** kebab-case for files, `PascalCase` for components, `use*` for hooks.

## 3. Implementation Rules
- **Props:** Use strict TypeScript interfaces for all component contracts.
- **Composition:** Prefer component composition over deep prop drilling.
- **Isolation:** Components must be self-contained and side-effect free.
