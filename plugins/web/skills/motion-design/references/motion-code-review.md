# Motion Code Review Standards

Adversarial review criteria and verification checklist for UI motion, animation, and interaction code.

## Contents
- Review Checklist and Mandatory Gates
- Critical Anti-Patterns
- Easing and Physics Evaluation
- Reduced Motion and Accessibility
- Output Format for Review Findings

## Review Checklist and Mandatory Gates

Evaluate motion pull requests against these mandatory gates:

| Gate | Check | Action if Failed |
|---|---|---|
| **Property Gate** | Does the transition touch anything other than `transform`, `opacity`, or `clip-path`? | **Reject.** Animate transforms or CSS Grid rows instead of layout dimensions. |
| **Blanket Rule** | Does code contain `transition: all`? | **Reject.** Require explicit property enumeration (e.g. `transition: transform 150ms ease, opacity 120ms ease`). |
| **Duration Gate** | Does an interactive transition exceed 350ms without gesture physics? | **Flag.** Shorten duration to 150ms–250ms to maintain interface responsiveness. |
| **Accessibility Gate** | Is there a fallback for `prefers-reduced-motion`? | **Reject.** Provide reduced motion override or zero-duration transition. |
| **Hover Gate** | Are hover transitions applied to touch devices? | **Flag.** Scope hover states inside `@media (hover: hover) and (pointer: fine)`. |
| **Interruptibility Gate** | Can the user click away or trigger reverse state mid-flight without snapping? | **Flag.** Ensure spring physics or exit handlers preserve current velocity and progress. |

## Critical Anti-Patterns

### 1. Animating Geometric Layout Properties
```css
/* REJECT: Causes layout reflow on every single frame */
.drawer {
  transition: width 300ms ease, left 300ms ease;
  width: 320px;
  left: 0;
}

/* ACCEPT: Compositor-only translation */
.drawer {
  transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
  transform: translate3d(0, 0, 0);
  will-change: transform;
}
```

### 2. The `transition: all` Trap
`transition: all` inadvertently animates properties like `color`, `background-color`, `border-color`, and `display`, causing unintended delays during theme toggles or dynamic DOM mutations:

```css
/* REJECT */
.button {
  transition: all 0.2s ease;
}

/* ACCEPT */
.button {
  transition: transform 120ms cubic-bezier(0.16, 1, 0.3, 1), background-color 150ms ease;
}
```

### 3. Asymmetric Sluggish Exits
Elements leaving the screen should exit faster than they entered. Users want to proceed to the next task:
- Entry: 240ms ease-out or responsive spring.
- Exit: 140ms–180ms ease-in or snappy spring.

## Easing and Physics Evaluation

- **Linear Easing on UI Movement:** Never use `transition-timing-function: linear` for spatial motion. Linear movement looks mechanical and robotic. Reserve linear only for continuous spinners or opacity fades.
- **Ease-in on Entrance:** Never use standard `ease-in` for elements entering the viewport. It causes a sluggish delay before the user sees content. Entrances must start fast with `ease-out` or high-stiffness springs.

## Reduced Motion and Accessibility

Ensure animations do not trigger vestibular discomfort:
- Disable parallax scrolling, full-screen zooms, and rotational spins when reduced motion is requested.
- Simple fades (`opacity`) are acceptable if needed to convey state changes without sudden visual flicker.

```tsx
// React / Framer Motion pattern
import { useReducedMotion } from "framer-motion";

export function AnimatedCard({ children }) {
  const shouldReduceMotion = useReducedMotion();

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 350, damping: 28 };

  return (
    <motion.div animate={{ scale: 1, opacity: 1 }} transition={transition}>
      {children}
    </motion.div>
  );
}
```

## Output Format for Review Findings

Report motion code review findings in a structured diff table with file locations:

| Location | Before | Proposed Fix | Rationale / Impact |
|---|---|---|---|
| `src/components/Sheet.tsx:42` | `transition: height 0.4s` | Use CSS Grid row animation or `transform: translateY()` | Eliminates CPU layout thrashing during sheet expansion. |
| `src/styles/button.css:12` | `transition: all 0.25s ease-in` | `transition: transform 100ms ease-out` | Eliminates sluggish click latency and hover stickiness on touch. |
| `src/components/Modal.tsx:18` | No reduced motion check | Wrap with `useReducedMotion()` fallback | Prevents vestibular disorientation for users with motion sensitivity. |
