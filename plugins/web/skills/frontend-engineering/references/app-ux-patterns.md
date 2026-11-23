# App UX Patterns (from the owner's shipped apps)

Use when building or redesigning an app UI and the brief leaves experience decisions open. Patterns come from production apps (barbershop booking, news reader, desktop widget, repo dashboard, image viewer, mobile racing app). Check the repo's own design system first; adopt a pattern only where it fits.

## Contents
- Token architecture
- Theming
- One-tap flows
- Motion that explains
- Touch and mobile
- Keyboard and power use
- Live data and status color
- Quality gates
- Anti-patterns

## Token architecture
- Three layers: raw scales (`@theme`), semantic tokens (`--surface`, `--ink`, `--line`, `--muted`), then components using only semantic tokens. No hex in components.
- Neutrals carry a slight cool blue bias, never pure grey (porcelain, fog, ink). One accent for action and focus.
- One scarce signal color for "now/live/urgent" only (barber-pole red, breaking-news red). Only live things pulse.
- Brand color from runtime config: derive tints with `color-mix()` and compute the on-brand text color (white vs graphite) from contrast, not by hand.
- Fonts: condensed heavy display face for headings, neutral UI sans, mono for times, prices, labels, status chips.
- Radius ladder by role: controls < cards < dialogs. Shadows in named elevation steps plus one `glow`.

## Theming
- Follow `prefers-color-scheme` by default, offer Light/Dark/Auto in the account menu, store the choice, apply it before first paint (inline script or `data-theme` on `<html>`) to avoid a flash.
- Switching theme crossfades colors briefly (~400ms); the first paint is instant.
- For apps where personality sells (widgets, dashboards), ship skins as `data-skin` token sets plus a "system" skin resolving to light or dark.
- Status palettes are re-tuned per theme (darker, more saturated in light) and re-checked for 4.5:1 contrast.
- Areas that stay dark in both themes (top bar, login, hero) use fixed `--chrome` tokens.

## One-tap flows
- Count decisions: the main task takes the fewest screens possible (booking in two). Offer "repeat last", sensible defaults, and a persistent floating primary action.
- Destructive or completing actions can use swipe-to-confirm; the keyboard and screen readers activate it directly (Enter), so it is never gesture-only.
- Confirm success with a short celebration (check drawn, small confetti loaded on demand), disabled under reduced motion.
- Every list has designed empty, loading (skeleton), and error states; see [ui-state-design](ui-state-design.md).

## Motion that explains
Name each motion by the job it does, then cap it:
| Job | Treatment |
|---|---|
| Press | ~3% scale on touch |
| Arrival | fade-up, staggered ~100ms between items |
| Sheet | spring |
| Achievement | pop, drawn check |
| Live | slow pulse on the live dot only |
- Page transitions use opacity only: a `transform` on an ancestor breaks `position: fixed` children such as a mobile action bar.
- Hover lift (-4px plus border glow, ~200ms) on cards for pointer devices only.
- Everything disappears under `prefers-reduced-motion`. Details in `motion-design`.

## Touch and mobile
- Targets at least 44px, form fields at 16px (no iOS zoom), fixed bottom action bar on phones, safe-area insets as tokens (`--sat`, `--sab`).
- Big calendar cells, one-thumb reach for primary actions. More in [mobile-web-polish](mobile-web-polish.md).

## Keyboard and power use
- Command palette on Ctrl/Cmd+K that runs actions (navigate, change theme, sign out), not just search.
- Viewer-style apps: arrows to move, wheel/pinch/+/- zoom at the cursor, double-click toggles fit and 100%, shortcuts table in the README.
- Radix primitives for dialog, menu, tabs, tooltip: focus trap, Esc, return focus, ARIA come free.
- Label always visible; error tied to the field with `aria-describedby`.

## Live data and status color
- Dashboards show a status taxonomy with fixed meaning (active, maintenance, experiment, abandoned), each with color plus text or icon, never color alone.
- Give one overview visualization (constellation, grid, deck) plus switchable views of the same data, and a detail drawer instead of page navigation.
- Editorial reading apps: credibility color separate from urgency color, bias scale with a neutral midpoint, skeleton shimmer while loading.
- Widgets and desktop tools: compact density, quick-add with tokens, alerts that surface time-critical items first.

## Quality gates
- Run axe (WCAG 2.1 A/AA) in e2e on every main screen, in both themes, plus key screens at 390px. Zero violations blocks CI.
- Assert no horizontal scroll at 390px and 1440px.
- Ship a living `/design-system` page rendering real components, and keep a short `DESIGN_SYSTEM.md` (principles, tokens, components, conventions).
- Screens use the shared kit; hand-written CSS stays limited to tokens, themes, and reset.

## Anti-patterns
- Pure black/white or neon-on-dark by default, flat grey neutrals, one color for both "action" and "urgent".
- Theme flash on load; hex values in components; two component stacks.
- Gesture-only actions; motion without a reduced-motion path; transform on page wrappers.
