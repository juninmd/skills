# Toast Notification Architecture and Physics

Design, stacking geometry, gesture physics, and accessibility for high-craft toast notification systems.

## Contents
- Stacking Geometry and Layering
- Dynamic Height Measurement and Interpolation
- Swipe-to-Dismiss Gesture
- Promise and Asynchronous State Lifecycle
- Accessibility and Live Announcements

## Stacking Geometry and Layering

Stacking prevents multiple alerts from cluttering the viewport while keeping previous notifications accessible:

| Card Position | Scale | Y-Offset (Bottom Stack) | Opacity |
|---|---|---|---|
| **Front (Index 0)** | 1.00 | `0px` | 1.0 |
| **Middle (Index 1)** | 0.94 | `-14px` | 0.8 |
| **Back (Index 2)** | 0.88 | `-28px` | 0.6 |
| **Overflow (>2)** | 0.82 | `-36px` | 0.0 (Hidden) |

### Hover Expansion
When the user hovers over any card in the stack, transition the stack into an expanded list:
- Cancel scale reductions (`scale = 1.0` for all cards).
- Translate each card by its true measured height plus a consistent gap (e.g. `12px`).
- Collapse back into the geometric stack when mouse departs.

## Dynamic Height Measurement and Interpolation

Toast messages vary unpredictably in content length (single line vs multi-line error details). Never clip or abruptly pop container dimensions:

```tsx
// Measuring container height dynamically
import { useLayoutEffect, useRef, useState } from "react";

export function useToastHeight() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (elementRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setHeight(entry.borderBoxSize[0].blockSize);
        }
      });
      resizeObserver.observe(elementRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  return { elementRef, height };
}
```

## Swipe-to-Dismiss Gesture

Allow users to flick toasts away naturally with distance and velocity thresholds:

```tsx
import { motion } from "framer-motion";

export function SwipeableToast({ onDismiss, children }) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0.8, right: 0.8 }}
      onDragEnd={(_, info) => {
        // Dismiss if dragged past 80px or flicked with velocity > 400px/s
        if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 400) {
          onDismiss();
        }
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </motion.div>
  );
}
```

## Promise and Asynchronous State Lifecycle

Coordinate multi-state network operations within a single toast instance rather than dismissing and spawning disconnected toasts:

```typescript
import { toast } from "sonner";

export async function handleFileExport(exportTask: () => Promise<void>) {
  toast.promise(exportTask(), {
    loading: "Generating financial report...",
    success: () => "Report exported successfully.",
    error: (err) => `Export failed: ${err.message}`,
  });
}
```

The toast container animates size and swaps icons (spinner to checkmark) smoothly without flickering or remounting DOM roots.

## Accessibility and Live Announcements

- **Live Regions:** Wrap toast containers in an accessible live region:
  - `role="status"` with `aria-live="polite"` for non-disruptive feedback (success, info).
  - `role="alert"` with `aria-live="assertive"` for destructive or error notifications.
- **Auto-Dismiss Timers:** Standard duration is 4000ms–5000ms. Pause timers automatically when user hovers over the toast or moves keyboard focus into it.
- **Keyboard Traversal:** Provide a global keyboard shortcut (e.g. `F8` or `Alt+T`) to jump focus directly into active toasts to review action buttons.
