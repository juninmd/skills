# UI Design and Composition Guidelines

Principles for building visually intentional and domain-appropriate interfaces.

## 1. Establishing the UI Contract
- **Workflows:** Identify primary tasks and viewport constraints.
- **Direction:** Choose a visual tone that fits the domain (avoid generic SaaS aesthetics).
- **States:** Define all required states: loading, empty, error, disabled, hover, focus, selected, and optimistic.

## 2. Design with Intent
- **Typography:** Match font scale to context (compact for tools, expressive for marketing).
- **Color:** Use a systematic palette (neutral base, semantic states, purposeful accents).
- **Hierarchy:** Make strong compositional decisions regarding density and rhythm.
- **Motion:** Use short, interruptible animations to clarify state changes; respect `prefers-reduced-motion`.
- **Cues:** Use domain-specific visual cues instead of decorative-only elements.

## 3. Accessibility (A11y)
- **ARIA Attributes**: Always provide `aria-label` or `aria-labelledby` for interactive elements without visible text (e.g., icon buttons).
- **Alt Text**: All `<img>` tags must have a meaningful `alt` attribute, or `alt=""` if decorative.
- **Keyboard Navigation**: Ensure all interactive elements (buttons, links, form fields) are focusable and usable via keyboard. Use `button` for actions, `a` for navigation.

## 4. Semantic HTML
- **Document Structure**: Use semantic HTML5 tags (`<main>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<article>`) instead of generic `<div>` containers.
- **Headings**: Maintain a logical heading hierarchy (`h1` to `h6`) without skipping levels.

## 5. Styling
- **No Inline CSS**: Do not use inline `style={{ ... }}` blocks. Prefer utility-first frameworks (like Tailwind), CSS Modules, or Styled Components.
- **Responsiveness**: Ensure components are responsive by default, using relative units (rem, em) and mobile-first media queries.
