---
name: motion-design
description: |
  Design, audit, and tune UI motion on the web. Use for easing and duration budgets, springs, enter/exit and layout animation, gestures and sheets, reduced motion, jank and compositor-only properties, motion audits. Trigger on 'add an ease-out animation', 'this feels janky', 'audit our motion', 'make the sheet draggable'. Not rendered video (motion-video).
---

# Motion Design

Motion explains a state change; it never decorates. Every animation needs a stated job, a duration budget, and a reduced-motion path.

**Not this skill:** building the page or its states (`frontend-engineering`), rendering video files (`motion-video`), 3D scenes (`threejs`), native mobile motion (`mobile-engineering`, `ios-engineering`), Core Web Vitals (`vitals-and-cost`).

## Preflight
```bash
rg -n "transition:\s*all|will-change|@keyframes|framer-motion|motion/react|prefers-reduced-motion" src | head -30
jq '.dependencies | with_entries(select(.key|test("motion|gsap|spring|lottie")))' package.json
```
Find the animation library already in use and any reduced-motion handling before adding a second.

## Workflow
1. **Name the job:** feedback, orientation, continuity, or attention. No job, no animation.
2. **Pick the mechanism:** CSS for state changes, a spring for interruptible or gesture-driven motion, a library only if the repo already has one.
3. **Set the budget** from [motion-design-principles](references/motion-design-principles.md): 100-350 ms, ease-out for entering, ease-in for leaving.
4. **Animate compositor-only** `transform` and `opacity` ([animation-performance](references/animation-performance.md)); never `transition: all` or layout properties.
5. **Write the reduced-motion path** in the same change: replace movement with fade or instant.
6. **Verify:** interrupt it mid-flight, throttle CPU 4x, and run with `prefers-reduced-motion: reduce`.

## Decision table
| Task | Open |
|---|---|
| Choose duration, easing, spring vs curve | [motion-design-principles](references/motion-design-principles.md) |
| Accordion, dialog, stagger, shared indicator | [web-animation-recipes](references/web-animation-recipes.md) |
| Drag, swipe, sheet, rubber-band | [fluid-gestures](references/fluid-gestures.md) |
| Janky or dropping frames | [animation-performance](references/animation-performance.md) |
| Review a diff's motion | [motion-code-review](references/motion-code-review.md) |
| Score or audit existing motion | [motion-audit](references/motion-audit.md) |
| Compare feels (snappy vs gentle) | [prototype-variants](references/prototype-variants.md) |
| Unsure of a term (damping, settle) | [motion-vocabulary](references/motion-vocabulary.md) |

## Stop
- A change animates `width`, `height`, `top`, `left`, or uses `transition: all`: switch to transform/opacity or the grid-rows technique.
- No reduced-motion path exists for new movement.
- The animation blocks input or cannot be interrupted.

## Rules
- Hand page structure, states, and accessibility to `frontend-engineering`; do not restate them.
- Motion over 350 ms on a frequent action is a defect; keep entrances longer than exits.
- Do not add an animation library when CSS or the existing one does the job.
- Verify on a throttled CPU, not only a fast laptop.

## Checklist
- [ ] Each animation has a named job and a duration inside its budget.
- [ ] Only compositor-friendly properties animate; no `transition: all`.
- [ ] Interruptible mid-flight without a jump.
- [ ] `prefers-reduced-motion: reduce` tested.
- [ ] Checked at 4x CPU throttle.

## Reference Routing
Open a file only when its trigger matches.
- Foundations, budgets, springs: [motion-design-principles.md](references/motion-design-principles.md)
- Copy-ready recipes: [web-animation-recipes.md](references/web-animation-recipes.md)
- Gestures and sheets: [fluid-gestures.md](references/fluid-gestures.md)
- Frame cost: [animation-performance.md](references/animation-performance.md)
- Review and audit: [motion-code-review.md](references/motion-code-review.md), [motion-audit.md](references/motion-audit.md)
- Everything else: [Reference Map](references/TOPIC_MAP.md)
