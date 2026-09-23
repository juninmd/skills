
# Accessibility

## Contents

- Preflight
- Workflow
- The Keyboard Pass
- Focus Management on Route Change
- Form Error Association
- Automated Checks
- Contrast
- Reduced Motion
- Stop
- Rules
- Checklist

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

## Focus Management on Route Change
A client-side router swaps the DOM but never moves focus — it stays on the link that was clicked, or resets to `<body>`, and a screen reader announces nothing happened. Steve Krug's usability rule in "Don't Make Me Think" — never leave the user guessing whether their action did anything — applies literally here.

| Symptom | Fix |
|---|---|
| Focus stays on the clicked link after navigation | move focus to the new view's `h1` or a `tabindex="-1"` main landmark on mount |
| Screen reader stays silent on navigation | update `document.title` and push the new page name into an already-mounted polite live region |
| Focus resets to `<body>`, keyboard user loses their place | never rely on the default; set focus programmatically in the route-change effect |
| Skip-link target no longer exists on the new route | verify the skip link's target survives every route, not just the one it was built against |

```jsx
// Run once per successful navigation, not on every render
useEffect(() => {
  document.title = pageTitle;
  headingRef.current?.focus();   // tabindex="-1" on the view's <h1> or main landmark
  announce(pageTitle);           // pushes into the already-mounted aria-live region
}, [pathname]);
```

A framework router (Next.js App Router, Remix) still leaves this to you — route transitions are not announced automatically. Test it with the mouse unplugged: if you cannot tell a route changed with your eyes closed, neither can a screen-reader user.

## Form Error Association
A message that sits visually next to a field is not connected to it for assistive technology unless the markup says so. Validation *timing* (inline vs. on-submit) belongs to [state-recipes](state-recipes.md); this is the wiring that makes either timing announce correctly.

```html
<label for="email">Email</label>
<input id="email" aria-invalid="true" aria-describedby="email-error" />
<p id="email-error" role="alert">Enter a valid email address.</p>
```

`aria-describedby` must point at an element that exists in the DOM before or at the same time the error appears — pointing at an id that renders a beat later leaves some screen readers silent. On submit failure, move focus to the first invalid field or to an error summary that links to each one; the field with `aria-invalid="true"` is not enough on its own if focus never reaches it.

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

WCAG's contrast success criterion (1.4.3) exempts inert, truly disabled controls — but placeholder text is not exempt when it is the only description of the field, and a commonly missed gap is styling placeholder and disabled text at the same faint gray. Keep placeholder text at 4.5:1 unless the field also has a visible label, and give disabled controls a state that reads as disabled through more than low contrast (reduced opacity plus a cursor and, ideally, an explanation of why) so a passing scanner does not hide a real readability failure.

## Reduced Motion
`prefers-reduced-motion: reduce` means the user asked the OS to remove non-essential motion — not "make it faster."

```css
.panel { transition: transform 240ms var(--ease-out); }

@media (prefers-reduced-motion: reduce) {
  .panel { transition: opacity 120ms linear; }   /* swap the effect, don't just shorten it */
}
```

```js
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) player.autoplay = false;   // parallax, autoplaying video, large transforms follow the same rule
```

Motion that carries meaning (a spinner, a progress bar, a drag preview) stays; motion that is purely decorative (parallax, hero entrances, bouncing reveals) is what the setting turns off.

## Stop
- A journey cannot be completed with the keyboard alone. Report it; do not ship the visual fix and call it done.
- Contrast fails and the fix belongs in tokens you do not own. Route it to [design-systems](design-systems.md) rather than overriding per component.
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
- Component implementation belongs to `frontend-engineering` and the shared library contract to [design-systems](design-systems.md); the conformance bar is set here.

## Checklist
- [ ] Journeys and conformance target named before auditing.
- [ ] Structure correct: landmarks, heading order, labeled controls, logical DOM order.
- [ ] Every journey completes with keyboard only, focus always visible and never obscured.
- [ ] Names, roles, and states verified in the accessibility tree; one journey confirmed with a screen reader.
- [ ] Contrast, 200% resize, target size, and reduced motion checked.
- [ ] An automated a11y assertion guards the fixed journey.
