---
name: design-systems
description: |
  Build and maintain a shared component library other teams depend on. Use for design tokens, theming and dark mode, component API and variant design, composition over configuration, Figma-to-code parity, library documentation, and versioning a published UI package.
---

# Design Systems

## Workflow
1. Start from the tokens: color, spacing, type scale, radius, shadow, motion. Every component reads them, never raw values.
2. Inventory what product teams already built and promote the repeated shapes; do not invent components nobody asked for.
3. Design each component API around what a consumer must decide, and expose the rest through composition.
4. Name variants by intent, not appearance: `variant="danger"`, never `variant="red"`.
5. Publish with a documented usage example, the accessibility contract, and a changeset describing the API impact.
6. Ship breaking changes with a codemod or a deprecation window; consumers cannot all migrate on your schedule.

## Rules
- Tokens are the theming boundary. A component that hard-codes a hex value cannot be themed and will not survive dark mode.
- Prefer composition to configuration. A component with fifteen boolean props is a layout engine with a bad interface.
- Always forward `className`, `ref`, and the underlying element props; a component consumers cannot escape gets forked instead of used.
- Accessibility is part of the component contract, not the consumer's problem: label association, focus, roles, and keyboard behavior ship with it.
- Every component needs a documented empty, loading, disabled, and error appearance or teams will invent their own.
- Design-tool parity means shared token names, not pixel matching. Sync the names first.
- The system serves products. When a product needs an escape hatch, give it one instead of blocking the release.

## Checklist
- [ ] Components consume tokens and expose intent-named variants.
- [ ] APIs favor composition and forward element props and refs.
- [ ] Accessibility, states, and the migration path are documented.
