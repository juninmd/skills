---
name: frontend-standards
description: Frontend coding standards including accessibility, semantic HTML, and styling practices.
applyTo: '**/*.tsx,**/*.jsx,**/*.vue,**/*.css'
paths:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.vue"
  - "**/*.css"
trigger: glob
globs: "**/*.tsx,**/*.jsx,**/*.vue,**/*.css"
---

# Rule: Frontend Standards

## 1. Accessibility (A11y)
- **ARIA Attributes**: Always provide `aria-label` or `aria-labelledby` for interactive elements without visible text (e.g., icon buttons).
- **Alt Text**: All `<img>` tags must have a meaningful `alt` attribute, or `alt=""` if decorative.
- **Keyboard Navigation**: Ensure all interactive elements (buttons, links, form fields) are focusable and usable via keyboard. Use `button` for actions, `a` for navigation.

## 2. Semantic HTML
- **Document Structure**: Use semantic HTML5 tags (`<main>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<article>`) instead of generic `<div>` containers.
- **Headings**: Maintain a logical heading hierarchy (`h1` to `h6`) without skipping levels.

## 3. Styling
- **No Inline CSS**: Do not use inline `style={{ ... }}` blocks. Prefer utility-first frameworks (like Tailwind), CSS Modules, or Styled Components.
- **Responsiveness**: Ensure components are responsive by default, using relative units (rem, em) and mobile-first media queries.
