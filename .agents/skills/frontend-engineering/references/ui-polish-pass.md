# UI Polish Pass

Use when asked to polish, standardize, or "make the UI perfect" across an existing project. A polish pass converges many components on one design system, fixes defects, and proves it with before/after screenshots. For one new component use [ui-components](ui-components.md); for a read-only audit use [frontend-review](frontend-review.md).

## Preflight

```bash
git status --short                                   # baseline; preserve unrelated work
rg -n --hidden -g '!node_modules' -g '!*.lock' -e '#[0-9a-fA-F]{3,8}\b' src app components | head -40   # hardcoded colors
rg -n -g '!node_modules' -e '\b(w|h|p|m|gap)-\[[0-9]+px\]' -e 'z-\[[0-9]+\]' src app components | head -40  # arbitrary values
```

Find the existing token source (`@theme`, `tokens.css`, `theme.ts`, `components.json`) and the component library. Extend it; never start a second one.

## Workflow
1. **Baseline.** Capture before-screenshots of key routes at 375, 768, and 1280 px, light and dark, following [screenshot-capture](screenshot-capture.md) and [playwright-recipes](playwright-recipes.md). Record console errors and the lint/test status.
2. **Inventory.** List repeated shapes (buttons, inputs, cards, badges, modals, tables) and how many near-duplicates exist. Build a table: shape, variants found, target variant.
3. **Tokens first.** Fill gaps in the token layers from [design-systems](design-systems.md) and [frontend-design](frontend-design.md): color, type scale, spacing, radius, elevation, motion. Replace hardcoded values with semantic tokens.
4. **Consolidate components.** Merge near-duplicates into one component with intent-named variants; migrate callers; delete the dead copies. One concern per commit.
5. **Fix defects** using the table below.
6. **Raise UX.** Every interactive element gets default, hover, focus-visible, active, disabled, and loading states; every data view gets loading, empty, and error ([ui-state-design](ui-state-design.md)); run [accessibility](accessibility.md); keep motion within [motion-design-principles](motion-design-principles.md).
7. **Prove.** Re-capture the same routes with the same determinism, diff against the baseline, run lint, tests, and the production build, and attach the pairs.

## Defect Table

| Symptom | Likely cause | Fix |
|---|---|---|
| Misaligned rows or columns | mixed `margin` and `gap`, inconsistent line-height, ad hoc `px` values | one spacing scale; `gap` on flex/grid parents |
| Horizontal scroll on mobile | fixed widths, `100vw`, unwrapped long text | `max-width: 100%`, `min-width: 0` on flex children, `overflow-wrap: anywhere` |
| Clipped or overlapping text | fixed heights, absolute positioning | `min-height`, intrinsic sizing, truncate with a title |
| Layout shift on load | images or fonts without reserved space | `width`/`height` or `aspect-ratio`; `font-display` with a metric fallback |
| Broken CSS | dead selectors, specificity wars, `!important`, invalid values | `@layer` ordering, remove the override source, lint with stylelint if present |
| Dark mode islands | hardcoded colors | semantic tokens re-tuned per theme |
| Inconsistent focus or hover | per-component styles | one `:focus-visible` ring token; hover only under `@media (hover: hover)` |
| Mobile viewport jump | `100vh` | `100dvh` ([mobile-web-polish](mobile-web-polish.md)) |
| Stacking bugs | scattered `z-index` | a named z-index scale |

## Stop
- No token source can be found and the design intent is unclear: propose a minimal token set and get a decision before migrating.
- A consolidation would change a public component API: apply the breaking-change discipline in [design-systems](design-systems.md) first.
- Screenshots cannot be captured (no runnable frontend): report it; do not claim visual verification.

## Rules
- Scope the pass to what was asked; list out-of-scope findings instead of fixing them.
- Visual diffs must be explained: every changed region maps to a token, a merged component, or a named defect.
- Fix the cause, not the symptom: no `!important`, magic offsets, or `overflow: hidden` to hide a layout bug.
- Keep behavior unchanged unless the change is a listed UX improvement; run the existing tests before and after.

## Checklist
- [ ] Before and after screenshots at 375, 768, and 1280 px, both themes, attached.
- [ ] No hardcoded color or arbitrary spacing left in touched files; tokens used.
- [ ] Near-duplicate components merged; dead copies deleted; callers migrated.
- [ ] Interactive states and data states present; keyboard and contrast pass.
- [ ] No horizontal scroll, clipped text, or console errors; lint, tests, and production build green.
