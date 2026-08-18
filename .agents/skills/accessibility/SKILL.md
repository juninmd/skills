---
name: accessibility
description: |
  Build and audit interfaces usable by keyboard, screen reader, and assistive technology. Use for WCAG conformance, semantic HTML, ARIA, focus management, color contrast, reduced motion, accessible forms, and a11y regression tests.
---

# Accessibility

## Workflow
1. Identify the critical user journeys and the conformance target (usually WCAG 2.2 level AA).
2. Fix structure first: landmarks, one h1 per view, ordered headings, labelled controls, and a logical DOM order.
3. Walk each journey with the keyboard only; every interactive element must be reachable, operable, and visibly focused.
4. Verify names, roles, and states in the accessibility tree, then confirm with a real screen reader on one journey.
5. Check the sensory layer: contrast ratios, text resizing to 200%, target sizes, and reduced-motion behavior.
6. Lock the fix in with an automated a11y assertion in the component or end-to-end suite.

## Rules
- Native elements before ARIA. A button element beats a div with role and key handlers; ARIA adds semantics, never behavior.
- Every input needs a programmatic label; placeholder text is not a label.
- Never remove focus outlines without replacing them with a visible indicator that meets contrast.
- Move focus deliberately on route change, dialog open, and dialog close, and trap it only inside modals.
- Announce async state changes through a live region; a spinner alone is silent to a screen reader.
- Do not encode meaning in color alone; pair it with text, shape, or an icon.
- Automated scanners catch roughly a third of real issues; keyboard and screen-reader passes are not optional.

## Checklist
- [ ] Critical journeys complete with keyboard only and visible focus.
- [ ] Names, roles, states, and contrast verified against the target level.
- [ ] An automated a11y check guards the fixed journey.
