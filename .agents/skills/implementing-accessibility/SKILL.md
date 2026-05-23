---
name: implementing-accessibility
description: |
  **FRONTEND SKILL** - Implement and audit web accessibility (a11y) standards.
  USE FOR: semantic HTML, keyboard navigation, ARIA patterns, WCAG compliance, color contrast, focus management, screen reader optimization.
  DO NOT USE FOR: visual design (use frontend-design), backend implementation, non-web UI platforms (unless specifically web-view based).
  INVOKES: accessibility linters, contrast checkers, keyboard flow verification.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Web, Browser"
allowed-tools: [read_file, write_file, replace]
---

# Implementing Accessibility

Expert methodology for ensuring digital content is navigable and perceivable by all users through strict adherence to semantic standards and interaction patterns.

**USE FOR:**
- Auditing UI components for accessibility flaws using WCAG 2.2 standards.
- Replacing generic `div`/`span` elements with semantic HTML5 tags.
- Implementing robust keyboard navigation and focus trap management.
- Applying appropriate ARIA roles and attributes when native elements are insufficient.
- Verifying and correcting color contrast ratios and alt text.

**DO NOT USE FOR:**
- General CSS styling unrelated to accessibility or visibility.
- Implementing complex business logic or data transformations.

**INVOKES:**
- Semantic HTML tags, WAI-ARIA attributes, and keyboard interaction patterns.

## Methodology and Guidelines
1. **Semantic HTML:** Use inherent meaning tags over generic containers.
2. **Keyboard Flow:** Ensure all interactive elements are focusable and operable via `Tab`, `Enter`, and `Space`.
3. **ARIA Patterns:** Use only when native semantics fall short; manage state (expanded, hidden) dynamically.
4. **Perception:** Maintain WCAG contrast ratios (4.5:1 for normal text) and provide descriptive `alt` text.

## Checklist
- [ ] Audit semantics, focus order, and keyboard behavior before implementation.
- [ ] Prefer native HTML elements over custom ARIA-heavy widgets.
- [ ] Validate implementation with keyboard-only navigation and contrast checkers.
- [ ] Ensure all form inputs have associated, descriptive labels.
