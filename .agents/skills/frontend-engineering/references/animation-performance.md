# Animation Performance and Frame Budgeting

Technical guidelines for profiling, optimizing, and maintaining 60fps and 120fps UI animations.

## Contents
- Frame Budgets and the Browser Pipeline
- Compositor vs Paint vs Layout Properties
- GPU Acceleration and `will-change` Discipline
- Eliminating Layout Thrashing
- DevTools Profiling and Inspection

## Frame Budgets and the Browser Pipeline

To deliver smooth visual motion, every frame must complete within a strict temporal budget:

| Target Refresh Rate | Budget Per Frame | Typical Main-Thread Allotment |
|---|---|---|
| **60 Hz** (Standard Displays) | 16.6 ms | ~10 ms (Leaves margin for OS and GC) |
| **120 Hz** (ProMotion / Mobile) | 8.33 ms | ~5 ms |

If JavaScript execution, style calculations, or layout work exceed this budget, the browser drops frames, resulting in noticeable stutter (jank).

## Compositor vs Paint vs Layout Properties

Modern browsers divide rendering into three distinct stages:

```
[ JavaScript / DOM ] ──> [ Layout (Reflow) ] ──> [ Paint ] ──> [ Composite ]
```

| Pipeline Stage | Triggers | Cost | Recommendation |
|---|---|---|---|
| **Layout (Reflow)** | `width`, `height`, `top`, `left`, `margin`, `padding`, `font-size`, `display` | **Highest** | **Never animate.** Forces recalculation of geometric positions across the DOM tree. |
| **Paint** | `color`, `background-color`, `box-shadow`, `border-color`, `outline` | **Medium** | Avoid rapid animations. Renders pixels into layers on the CPU. |
| **Composite** | `transform` (`translate3d`, `scale`, `rotate`), `opacity` | **Lowest** | **Strict standard.** Executed directly on GPU threads with zero CPU layout overhead. |

## GPU Acceleration and `will-change` Discipline

The CSS `will-change` property informs the browser to promote an element to its own GPU compositor layer in advance:

```css
/* Apply only to elements actively undergoing transform or opacity transitions */
.smooth-dialog {
  will-change: transform, opacity;
}
```

### Critical Rules for `will-change`
1. **Never apply globally:** `* { will-change: transform; }` allocates dedicated GPU textures for thousands of nodes, rapidly exhausting mobile VRAM and crashing browser tabs.
2. **Remove after completion:** For dynamic elements, toggle `will-change` via JavaScript on hover or touch-start, and remove it when the exit transition settles.
3. **Prefer 3D transforms:** Using `translate3d(x, y, 0)` automatically promotes elements to hardware acceleration without legacy hacks.

## Eliminating Layout Thrashing

Layout thrashing occurs when JavaScript repeatedly interleaves DOM dimension reads with style writes, forcing synchronous browser reflows:

```typescript
// DEFECTIVE: Forces multiple synchronous reflows within a loop
elements.forEach((el) => {
  const height = el.offsetHeight; // READ (Forces reflow)
  el.style.height = `${height * 1.2}px`; // WRITE (Invalidates layout)
});

// CORRECT: Batch all reads first, then execute all writes
const heights = elements.map((el) => el.offsetHeight); // Batch READs
elements.forEach((el, index) => {
  el.style.height = `${heights[index] * 1.2}px`; // Batch WRITEs
});
```

Whenever possible, avoid reading geometric dimensions in animation loops altogether. Measure layout once before launching spring animations.

## DevTools Profiling and Inspection

Validate motion performance using Chrome/Edge DevTools:

1. **Rendering Tab:**
   - Enable **Paint Flashing**: Green highlights indicate repaints. During pure spatial motion, no green flashes should appear.
   - Enable **Layout Shift Regions**: Blue highlights indicate unplanned reflows.
2. **Performance Panel:**
   - Record an interaction for 3–5 seconds while triggering the animation.
   - Inspect the **Frames** timeline. Verify that frame bars remain solid green without red "Long Frame" indicators.
   - Inspect the **Summary** tab: CPU time should be dominated by Compositing, not Layout or Rendering.
