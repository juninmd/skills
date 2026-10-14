# Motion Vocabulary

Standard terminology and definitions for describing UI movement, animation physics, and choreographic timing.

## Contents
- Physical Dynamics and Parameters
- Choreography and Continuity
- Perceptual Quality Descriptors
- Artifacts and Degradation

## Physical Dynamics and Parameters

| Term | Definition | Impact on Interface |
|---|---|---|
| **Stiffness (Tension)** | The strength of the simulated spring pulling the object toward its target. | Higher stiffness accelerates initial movement; lower stiffness creates lazy, floating transitions. |
| **Damping** | The frictional force resisting spring motion and dissipating energy over time. | **Critical damping:** Stops at target with zero overshoot.<br>**Under-damping:** Bounces past target before resting.<br>**Over-damping:** Sluggish approach without bounce. |
| **Mass** | The simulated weight and inertia of the animated object. | Higher mass increases resistance to acceleration and deceleration; heavier objects feel larger and deliberate. |
| **Initial Velocity** | The momentum imparted into an element at the moment of touch release or drag throw. | Preserving gesture velocity into spring deceleration prevents unnatural jarring halts. |
| **Settling Time** | The elapsed time until an animated value stays within an imperceptible distance (epsilon threshold) from the target. | Animations must complete layout and event-dispatching once settled to release thread resources. |

## Choreography and Continuity

| Term | Definition | Application |
|---|---|---|
| **Spatial Continuity** | Maintaining consistent geometric origin and destination across view updates. | If a card expands into a full dialog, it animates from its initial bounding box rather than appearing from viewport center. |
| **Stagger** | Introducing a slight, sequential delay between neighboring elements in a collection. | Guides the eye through content hierarchically. Target 20ms–50ms offsets; cap total stagger under 250ms. |
| **Lead and Follow** | Primary elements begin moving before secondary elements follow. | A container expands first, then its inner child icons settle into their slots. |
| **Anticipation** | A subtle, brief movement in the opposite direction before the primary action. | Indicates an impending energetic state change (e.g. slight compression before a badge pops). Use sparingly. |
| **Overshoot** | Traveling momentarily past the target value before springing back. | Gives mechanical tactility to toggles and badges. Keep overshoot amplitude under 5% to avoid cartoonish feel. |

## Perceptual Quality Descriptors

| Descriptor | Physical Characteristic | How to Achieve |
|---|---|---|
| **Snappy** | Fast initial impulse, quick critical settle, zero lingering bounce. | High stiffness (350–500), high damping ratio (30–38), mass <= 0.8. |
| **Gentle** | Smooth acceleration, prolonged soft deceleration. | Moderate stiffness (180–240), critical damping (24–28), cubic-bezier(0.16, 1, 0.3, 1). |
| **Crisp** | Linear or cubic onset with sharp arrival. | Short duration (120ms–180ms), ease-out curve, minimal travel distance (<= 8px). |
| **Rubber Banding** | Logarithmic or exponential resistance when dragging past boundaries. | Displacement = $\Delta x \cdot (1 - \frac{1}{\frac{\Delta x \cdot c}{d} + 1})$. |

## Artifacts and Degradation

| Defect | Root Cause | Remedy |
|---|---|---|
| **Jank** | Dropped frames caused by JavaScript blocking the main thread or expensive repaints during animation. | Move transitions to compositor thread (`transform`, `opacity`); profile with performance timeline. |
| **Layout Thrashing** | Repeatedly interleaving DOM reads (`offsetHeight`) and DOM writes (`style.width`) in a single frame. | Batch reads first, then writes; prefer CSS transform scale over width/height manipulation. |
| **State Drift / Pop-in** | Elements snapping instantly to default state when an animation promise finishes or unmounts abruptly. | Coordinate state transitions via exit animations (`AnimatePresence`) and matching initial values. |
| **Sticky Hover** | Mobile browser applying `:hover` styles on touch tap that persist until the user taps elsewhere. | Wrap hover selectors inside `@media (hover: hover) and (pointer: fine)`. |
