# Motion Design Principles

Foundational guidelines for purposeful UI animation, timing, physics, and polish in web applications.

## Contents
- Core Philosophy
- The Motion Decision Framework
- Duration and Timing Budgets
- Spring Physics vs Easing Curves
- Transform and Clip-Path Discipline
- State Interruptibility
- Code Review Format

## Core Philosophy

Motion in software is functional communication, not decoration. When an interface moves well:
- **Spatial continuity is preserved:** Users understand where elements originated and where they traveled.
- **Physical plausibility builds trust:** Objects feel like they have mass, friction, and responsive reactivity.
- **Unseen details compound:** Polish is the cumulative effect of invisible correctness—settling curves that match interaction speed, absence of layout shifts, and predictable state changes.

Beauty and fluidity provide distinct leverage: software that feels tactile and responsive reduces cognitive load and creates an immediate sense of craft.

## The Motion Decision Framework

Before writing an animation or transition, evaluate the interaction against three criteria:

| Criterion | Question | Guidance |
|---|---|---|
| **Purpose** | Does this motion explain spatial hierarchy, confirm an action, or orient the user? | If an animation exists solely to call attention to itself, omit it. |
| **Frequency** | How often does the user trigger this action per session? | High-frequency interactions (typing, hovering lists, clicking tabs) require near-instant transitions (<150ms). Low-frequency actions (opening modals, completing checkouts) can afford richer choreography (200–350ms). |
| **Direct Manipulation** | Is the user dragging, swiping, or directly touching the element? | Direct interactions require continuous 1:1 spring physics with momentum preservation, never static duration easings. |

## Duration and Timing Budgets

Set animation durations based on the physical distance traveled and interaction scale:

| Scale | Target Duration | Appropriate Scenarios |
|---|---|---|
| **Micro** | 100ms – 150ms | Button active press, hover highlights, checkbox toggles, icon micro-rotations. |
| **Component** | 180ms – 260ms | Dropdown menus, tooltips, toast entries, accordion panels, popovers. |
| **Macro / Container** | 250ms – 360ms | Dialog overlays, slide-over drawer sheets, full-page route transitions. |
| **Sluggish (>400ms)** | Avoid | Any transition exceeding 400ms feels laggy and blocks user momentum unless tied to active physics gestures. |

## Spring Physics vs Easing Curves

Choose timing models based on whether the transition is autonomous or interactive:

### Spring Physics (Interactive / Responsive)
Springs calculate motion from velocity, stiffness, and damping. Use springs when:
- An interaction can be interrupted mid-flight.
- The user imparts initial velocity through a drag or swipe release.
- Elements should settle naturally without arbitrary millisecond duration timers.

```typescript
// Typical Framer Motion spring configurations
const snappySpring = { type: "spring", stiffness: 400, damping: 30 }; // High responsiveness, zero bounce
const gentleSpring = { type: "spring", stiffness: 200, damping: 24 }; // Natural floating reveal
const bouncySpring = { type: "spring", stiffness: 350, damping: 18 }; // Playful accents only (badges, hearts)
```

### Easing Curves (Autonomous / System-Driven)
Use cubic-bezier easing for predetermined system state transitions:
- **Ease-out (Entry):** Fast start, gradual deceleration. `cubic-bezier(0.16, 1, 0.3, 1)` or `ease-out`. Elements entering the viewport should appear quickly and glide into place.
- **Ease-in (Exit):** Slow start, accelerating exit. `cubic-bezier(0.7, 0, 0.84, 0)` or `ease-in`. Elements departing should leave rapidly.
- **Symmetric ease-in-out:** Reserve for looping animations or state changes where the element stays visible throughout (e.g. rotating progress wheels).

## Transform and Clip-Path Discipline

Animate only properties handled on the compositor thread:

- **Strictly Allowed:** `transform` (`translate3d`, `scale`, `rotate`) and `opacity`.
- **Prohibited for Motion:** `width`, `height`, `top`, `left`, `margin`, `padding`, `border-width`. These force browser layout recalculation and paint cycles, causing frame drops.
- **Reveals and Expansions:** Use `clip-path` (e.g. `inset(0 0 100% 0)` to `inset(0 0 0% 0)`) or modern CSS `grid-template-rows: 0fr` to `1fr` instead of animating `height: auto`.

## State Interruptibility

Animations must never lock the interface or restart abruptly if another event arrives while in flight:
- Clicking a closing dropdown must reverse its trajectory smoothly without jumping to the start frame.
- In spring physics, pass current velocity into the new spring target.
- Avoid unconditional `animation-fill-mode: forwards` hacks that break synchronization between DOM layout and visual representation.

## Code Review Format

When evaluating motion in code reviews, present observations using this structured comparison:

| Before | After | Operational Impact |
|---|---|---|
| `transition: all 0.3s ease;` | `transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms ease;` | Prevents layout thrashing on color/dimension changes; eliminates sluggish delay. |
| `animate({ height: 'auto' })` | Animate CSS Grid `grid-template-rows` or `transform: scaleY()` with masked content. | Keeps frame rate at 60/120fps by avoiding forced reflows. |
| Modal pops in with 500ms bounce | Modal enters with 220ms ease-out, scale `0.97 -> 1.0`, opacity `0 -> 1`. | Removes visual distraction and allows immediate user interaction. |
