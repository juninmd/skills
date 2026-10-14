# Fluid Gestures and Direct Manipulation

Implementation patterns for physics-based, velocity-aware touch and drag interactions in web interfaces.

## Contents
- Principles of Direct Manipulation
- Velocity Tracking and Momentum Preservation
- Rubber Banding and Resistance Physics
- Gesture-Driven Sheet Dismissal
- Pointer Event Discipline and Browser Conflicts

## Principles of Direct Manipulation

Direct manipulation interfaces create the illusion that the user is touching physical objects:
1. **1:1 Finger Tracking:** An element must follow the cursor or finger with zero lag or artificial smoothing while the contact is active.
2. **Velocity Continuity:** When contact ends, the element must inherit the release velocity of the touch. Snapping immediately to a static animation curve breaks the physical illusion.
3. **Interruptibility:** At any point while an element is in flight, a new touch must catch it instantly at its current position and momentum.

## Velocity Tracking and Momentum Preservation

Calculate release velocity over the trailing 100ms window rather than the lifetime of the drag:

```typescript
interface VelocityTracker {
  lastPosition: number;
  lastTimestamp: number;
  currentVelocity: number;
}

export function updateVelocity(tracker: VelocityTracker, newPosition: number): void {
  const now = performance.now();
  const dt = now - tracker.lastTimestamp;
  if (dt > 0) {
    // Pixels per millisecond
    tracker.currentVelocity = (newPosition - tracker.lastPosition) / dt;
    tracker.lastPosition = newPosition;
    tracker.lastTimestamp = now;
  }
}
```

When passing velocity into a spring solver (e.g. Framer Motion):
```tsx
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  onDragEnd={(_, info) => {
    // info.velocity.y is pixels per second
    const releaseVelocity = info.velocity.y;
    // Spring starts with existing kinetic energy
  }}
/>
```

## Rubber Banding and Resistance Physics

When an element is dragged past its bounds, apply progressive resistance rather than a hard stop:

$$d = \Delta x \cdot \left(1 - \frac{1}{\frac{\Delta x \cdot c}{D} + 1}\right)$$

Where:
- $\Delta x$ is raw drag distance past the boundary.
- $D$ is the dimension of the container (e.g. screen height or width).
- $c$ is the resistance coefficient (standard value: `0.55`).

```typescript
export function calculateRubberBand(offset: number, maxDimension: number, coefficient = 0.55): number {
  if (offset <= 0) return offset;
  return (offset * coefficient * maxDimension) / (maxDimension + coefficient * offset);
}
```

## Gesture-Driven Sheet Dismissal

Dismissible bottom sheets evaluate both displacement and flick velocity:

```tsx
import { motion, useMotionValue, useTransform } from "framer-motion";

export function DismissibleSheet({ onClose, children }) {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0]);

  const handleDragEnd = (_, info) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;

    // Dismiss if dragged down > 120px OR flicked downward fast (> 500px/s)
    if (offset > 120 || velocity > 500) {
      onClose();
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0 }}
      dragElastic={{ top: 0, bottom: 0.5 }}
      style={{ y, opacity }}
      onDragEnd={handleDragEnd}
      className="fixed bottom-0 left-0 right-0 rounded-t-2xl bg-background p-6 shadow-2xl"
    >
      <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
      {children}
    </motion.div>
  );
}
```

## Pointer Event Discipline and Browser Conflicts

Prevent native browser behaviors from stealing touch gestures:
- **`touch-action: none` / `pan-y`:** Mandatory on interactive drag zones to disable native page scrolling during gesture tracking.
- **Pointer Capture:** Use `element.setPointerCapture(event.pointerId)` so tracking continues even if the pointer momentarily drifts outside element boundaries.
- **Cancel Handling:** Always bind `onPointerCancel` to return elements safely to resting state if the OS takes focus (incoming call, app switch).
