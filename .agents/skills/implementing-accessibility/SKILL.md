---
name: implementing-accessibility
description: "Audit and implement web accessibility (a11y) standards. Triggers: accessibility, a11y."
argument-hint: "[file/module] [options]"
---

# Implementing Accessibility

## Concept
Accessibility (a11y) ensures that digital content can be navigated and understood by everyone, regardless of visual, auditory, motor, or cognitive disabilities.

## Guidelines
1. **Semantic HTML:** Use proper HTML tags (`<nav>`, `<main>`, `<article>`, `<button>`, `<a>`) instead of generic `<div>` or `<span>` elements. Semantic tags provide inherent meaning to screen readers.
2. **Keyboard Navigation:** All interactive elements must be focusable and operable using only the keyboard (`Tab`, `Enter`, `Space`). Manage focus properly in modals and custom widgets.
3. **ARIA Roles & Attributes:** Use Accessible Rich Internet Applications (ARIA) attributes only when semantic HTML falls short. Ensure state (e.g., `aria-expanded`, `aria-hidden`) is updated correctly.
4. **Color Contrast:** Maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text. Do not rely solely on color to convey information.
5. **Alt Text:** Provide descriptive `alt` attributes for images. If an image is purely decorative, use `alt=""`.
6. **Forms & Labels:** Every input must have an associated `<label>` (either wrapping the input or using `htmlFor`/`for`).

## Execution
- Audit the target UI component for accessibility flaws.
- Add necessary semantic tags, ARIA attributes, and keyboard event handlers.
- Verify focus management and contrast requirements if applicable.

## Checklist

- [ ] Audit semantics, focus order, keyboard behavior, and announcements before making changes.
- [ ] Prefer native HTML and only add ARIA where semantics alone are insufficient.
- [ ] Re-test the affected flow with keyboard navigation and accessible names after the fix.

## References

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
