---
name: accessibility
description: |
  Build and audit interfaces usable by keyboard, screen reader, and assistive technology. Use for WCAG conformance, semantic HTML, ARIA, focus management, color contrast, reduced motion, accessible forms, and a11y regression tests.
---

# Accessibility

## Preflight
Establish the target before auditing anything.

```bash
rg -n "role=|aria-" src/ | head -20        # how much ARIA is already load-bearing
rg -l "eslint-plugin-jsx-a11y|jest-axe|@axe-core" package.json
```

Name the conformance level (usually WCAG 2.2 AA), the journeys in scope, and the assistive technology you will actually test with. "Make it accessible" is not a target.

## Workflow
1. Name the critical user journeys and the conformance target — usually WCAG 2.2 level AA. "Make it accessible" is not a target; "checkout completes with keyboard and NVDA at AA" is.
2. Fix structure first: landmarks, one `h1` per view, ordered headings, labeled controls, logical DOM order. Most reported problems are structure problems wearing an ARIA costume.
3. Walk each journey with the keyboard only. Every interactive element reachable, operable, and visibly focused.
4. Verify names, roles, and states in the accessibility tree, then confirm one journey with a real screen reader.
5. Check the sensory layer: contrast, text resize to 200%, target size, reduced motion.
6. Lock it in with automated checks so the fix cannot silently regress.

## The Keyboard Pass
No tooling required, and it finds more than any scanner.

| Key | Must do | Common failure |
|---|---|---|
| `Tab` | reach every control in visual order | custom `div` buttons skipped; positive `tabindex` scrambling order |
| `Shift+Tab` | walk back the same way | focus jumps to the top after a modal |
| `Enter` / `Space` | activate the focused control | `div` with a click handler ignores both |
| `Esc` | close dialog, menu, popover | trapped forever in a modal |
| Arrows | move within a composite (menu, tabs, grid) | every option is a separate tab stop |

Then scroll to the middle of a long page and keep tabbing: a focused element hidden behind a sticky header or cookie bar fails WCAG 2.2 SC 2.4.11.

## Automated Checks

```bash
npx @axe-core/cli https://localhost:3000            # one-off page audit
npx pa11y-ci --sitemap https://example.com/sitemap.xml
```

```js
// In the suite, so the fixed journey stays fixed
import { axe } from 'jest-axe';
expect(await axe(container)).toHaveNoViolations();
```

Add `eslint-plugin-jsx-a11y` to lint. Scanners catch roughly a third of real issues — they prove nothing about a journey, only that a page has no obvious markup faults.

## Contrast

| Content | Minimum |
|---|---|
| Body text | 4.5:1 |
| Large text (≥ 24px, or ≥ 19px bold) | 3:1 |
| UI boundaries, icons, focus rings | 3:1 |

Where the repository has design tokens, fix contrast in the tokens — a per-component override fixes one screen and leaves the system wrong.

## Stop
- A journey cannot be completed with the keyboard alone. Report it; do not ship the visual fix and call it done.
- Contrast fails and the fix belongs in tokens you do not own. Route it to `design-systems` rather than overriding per component.
- A third-party component is inaccessible and cannot be wrapped. Record it as debt with an owner; never ship it silently.

## Rules
- Native elements before ARIA. A `button` beats a `div` with `role` and key handlers; ARIA adds semantics, never behavior. The first rule of ARIA is not to use ARIA.
- Every input needs a programmatic label. Placeholder text is not a label — it disappears exactly when the user needs it.
- Never remove a focus outline without replacing it with a visible indicator that meets 3:1.
- Move focus deliberately on route change, dialog open, and dialog close; trap it only inside modals.
- Announce async state through a live region, and the `aria-live` container must already sit **empty** in the DOM before content lands in it. A region rendered together with its message announces nothing.
- Do not encode meaning in color alone. Pair it with text, shape, or an icon.
- Respect `prefers-reduced-motion`: replace movement with a fade or nothing, never just shorten it.
- An inaccessible third-party component gets wrapped to add the missing semantics, replaced, or recorded as debt with an owner — never shipped silently.
- Component implementation belongs to `frontend-engineering` and the shared library contract to `design-systems`; the conformance bar is set here.

## Checklist
- [ ] Journeys and conformance target named before auditing.
- [ ] Structure correct: landmarks, heading order, labeled controls, logical DOM order.
- [ ] Every journey completes with keyboard only, focus always visible and never obscured.
- [ ] Names, roles, and states verified in the accessibility tree; one journey confirmed with a screen reader.
- [ ] Contrast, 200% resize, target size, and reduced motion checked.
- [ ] An automated a11y assertion guards the fixed journey.
