---
name: frontend-design
description: |
  Design distinctive, production-grade interfaces with a strong visual system. Use for layout, picking a color palette and type scale, typography, spacing, visual hierarchy, motion, and avoiding generic AI slop.
---

# Frontend Design

## Preflight
```bash
rg -n '--color|--space|--text|--radius' src/**/*.css | head   # is a system already defined?
rg -no '#[0-9a-fA-F]{3,6}' src/ | wc -l                       # how much is hard-coded today
```

Name the visual goal, the audience, and a reference quality bar. Without a reference, the output regresses to the default.

## Workflow
1. Define the visual goal, the audience, and the reference quality bar **before** writing markup. Without a reference, output regresses to the default.
2. Decide the system as real numbers (below). Every later decision reads from it.
3. Emit the system as code — CSS custom properties or theme config — before any component. Never leave a raw hex, px, or duration literal in markup.
4. Sketch the layout hierarchy on a grid and push visual weight toward the primary action.
5. Choose at most two typefaces, with clear contrast in scale and weight.
6. Enumerate every state with `ui-state-design`, then verify each one visually beside the happy path.
7. Add motion only where it communicates state or sequence.

## The System, as Numbers

| Axis | Decide |
|---|---|
| Type scale | ratio 1.2 (dense UI) or 1.25 (editorial), from a 16px base |
| Line height | 1.5–1.6 body · 1.3–1.4 subhead · 1.05–1.2 display |
| Letter spacing | leave alone below ~32px; tighten slightly above it |
| Spacing | one rhythm — 4px or 8px — and nothing off-grid |
| Color | 2–3 hues plus a neutral ramp; accents scarce enough to stay signals |
| Radius | two or three steps, applied by role, not uniformly |
| Elevation | two or three steps; shadow is depth, not decoration |
| Motion | 120–200ms hover and small state · 200–300ms panels and page transitions |

```css
:root {
  --text-base: 1rem;  --text-lg: 1.25rem;  --text-xl: 1.563rem;   /* 1.25 ratio */
  --space-2: .5rem;   --space-4: 1rem;     --space-8: 2rem;        /* 8px rhythm */
  --color-action: oklch(58% .18 255);
  --radius-sm: 4px;   --radius-lg: 12px;
  --ease-out: cubic-bezier(.2,0,0,1);      --dur-fast: 160ms;
}
```

Motion over 400ms feels broken. Ease-out entering, ease-in exiting — the reverse reads as sluggish.

## Anti-Slop Tells
If it looks like every other AI mockup, no system was decided.

| Tell | Instead |
|---|---|
| Purple/indigo hero gradient | one committed hue, earned by the brand |
| Default glassmorphism everywhere | one surface treatment, used with intent |
| Uniform large radius + heavy shadow on every card | radius and elevation vary **by role** |
| Centered hero with a pill badge above the headline | asymmetry, and a real hierarchy |
| Pastel-circle icon row | typography carrying the structure |
| One ubiquitous default sans | a typeface pairing chosen deliberately |
| Everything centered | a grid with a real alignment spine |

## Hierarchy
Rank the elements on the screen before styling any of them. Exactly one primary action per view; everything else is secondary or tertiary, and it should be obvious at a squint. If two things compete for attention, neither has it.

## Stop
- The system has not been decided as numbers. Stop — every later choice would be arbitrary.
- Contrast falls below 4.5:1 body or 3:1 UI. Not a style preference; fix it before proceeding.
- The result carries an anti-slop tell. That means no system was chosen; go back and choose one.

## Rules
- Contrast minimums are non-negotiable: 4.5:1 body text, 3:1 large text, UI boundaries, and focus rings. Delegate the audit and reduced-motion detail to `accessibility`.
- Use color for state and meaning, not decoration. An accent used everywhere is not an accent.
- Prefer asymmetry and whitespace over ornament. Whitespace is the cheapest quality signal there is.
- Design for text expansion: layouts pinned to English string widths break on translation — German runs ~35% longer.
- Design the empty and error states with the same care as the populated one. Users meet the empty state first.
- Tokens for a library other teams consume belong to `design-systems`; implementation to `frontend-engineering`; the rendering cost of what you chose to `web-performance`.

## Checklist
- [ ] Type scale, color roles, spacing rhythm, radius, elevation, and motion durations are explicit numbers.
- [ ] The system exists as custom properties or theme config; no loose hex, px, or ms in markup.
- [ ] One primary action per view; hierarchy holds at a squint.
- [ ] No anti-slop tell present — the design reads as chosen, not defaulted.
- [ ] Empty, loading, and error states designed, not left to the framework.
- [ ] Contrast and motion verified; layout survives longer strings.
