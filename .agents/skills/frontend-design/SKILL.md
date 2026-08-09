---
name: frontend-design
description: |
  Design distinctive, production-grade interfaces with a strong visual system. Use for layout, typography, color, spacing, visual hierarchy, motion, and avoiding generic AI slop.
---

# Frontend Design

## Workflow
1. Define the visual goal, audience, and reference quality bar before writing markup.
2. Establish a small design system first: type scale, color roles, spacing rhythm, radius, elevation, and motion durations.
3. Sketch the layout hierarchy on a grid; distribute visual weight toward the primary action.
4. Choose at most two typefaces with clear contrast in scale and weight.
5. Verify contrast, spacing rhythm, alignment, and empty and loading states visually.
6. Add motion only when it communicates state or sequence; respect reduced-motion.

## Rules
- No generic defaults: no default gray-on-white without a deliberate palette.
- Use a consistent spacing rhythm (4px or 8px base); avoid arbitrary pixel values.
- Limit the palette to 2-3 hues plus neutrals; use color for state, not decoration.
- Prefer asymmetry and whitespace over decoration.
- Never let visual polish hide broken states or inaccessible controls.

## Checklist
- [ ] Design system (type, color, space) is explicit.
- [ ] Layout hierarchy and primary action are clear.
- [ ] Contrast, states, and reduced-motion verified.
