---
name: developing-ui-ux-components
description: |
  **FRONTEND SKILL** - Build reusable and accessible web components.
  USE FOR: React components, accessible UI (a11y), design system implementation, Radix UI, Tailwind styling, Storybook catalogs.
  DO NOT USE FOR: backend logic, native mobile UI (use developing-react-native), heavy data processing.
  INVOKES: vite, storybook, vitest, radix-ui.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Web, Browser"
allowed-tools: [read_file, write_file, replace]
---

# UI/UX Component Development

Expert methodology for designing, implementing, and documenting reusable, accessible, and consistent components for modern web applications.

**USE FOR:**
- Creating declarative React components with strong typing.
- Implementing accessible UI patterns following WAI-ARIA standards.
- Developing component catalogs and design system libraries.
- Styling responsive interfaces with Tailwind CSS and CSS modules.
- Writing interaction tests for UI components.

**DO NOT USE FOR:**
- Core business logic or domain modeling (keep components thin).
- Server-side database or API implementation.

**INVOKES:**
- `vite`, `storybook`, `vitest` CLI tools.

## Methodology and Guidelines
Implementation details for architecture, stack, and development flow are documented in:
1. [UI/UX Best Practices and Stack](references/ui-best-practices.md)
2. [Component Development Flow](references/ui-flow.md)

## Core principles
1. **Accessibility First:** Ensure every component is usable via keyboard and screen readers by default.
2. **Predictability:** Components should be self-contained and strictly follow their prop contracts.
3. **Performance:** Utilize Vite 8 and SWC for fast development and optimized builds.

## Checklist
- [ ] Define the component API and accessibility contract before implementation.
- [ ] Separate styling, interaction, and data responsibilities.
- [ ] Validate keyboard navigation, focus management, and responsiveness.
- [ ] Add the component to Storybook for visual documentation.
