# React Native and Expo Motion Engineering

Open when designing, implementing, or optimizing animations and gestures in React Native or Expo using Reanimated and Gesture Handler.

## Contents

- Runtime Boundaries: JS Thread vs. UI Thread Worklets
- Animation Gating: When to Animate
- Gesture Velocity Handoff and Interruption
- Spring Physics vs. Easing Curves
- Reduced Motion and Device Accessibility
- Performance Guardrails and 120 FPS Targets

## Runtime Boundaries: JS Thread vs. UI Thread Worklets

Mobile devices have distinct execution runtimes. Keeping animations fluid requires maintaining execution strictly on the UI thread:

1. **JavaScript Thread:** React reconciliation, component renders, network responses, and business logic. An animation driving styles across the asynchronous bridge will drop frames the moment the app processes data.
2. **UI Thread (Worklets):** Synchronous frame loop executing native transforms and gesture calculations at display refresh rates (60Hz / 120Hz ProMotion).
3. **Core Rule:** Use `react-native-reanimated` worklets and `react-native-gesture-handler`. Never animate layout dimensions (`width`, `height`, `top`, `left`, `margin`) or state values (`setState` per frame). Animate only hardware-accelerated transforms (`transform: [{ translateX }, { scale }]`) and `opacity`.

```jsx
// Always use animated styles driven by shared values
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function PulsingCard() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.card, animatedStyle]} />;
}
```

## Animation Gating: When to Animate

Before authoring motion, evaluate the interaction frequency:

| Interaction Frequency | Motion Policy | Implementation |
|---|---|---|
| **High Frequency (100+ daily):** Tab switching, keyboard toggles, list scrolling | Zero custom animation | Use default platform navigation transitions or instant state switches |
| **Medium Frequency (10-50 daily):** Sheet expansion, modal dialogs, pull-to-refresh | Bounded, subtle spring or fast ease-out (`150ms` - `250ms`) | Direct Reanimated spring with low bounciness |
| **Low Frequency (<10 daily):** Success states, purchase completion, onboarding | Expressive motion allowed (`300ms` - `450ms`) | Multi-element staged spring transition |

## Gesture Velocity Handoff and Interruption

Touch gestures must maintain physical continuity. When a user releases a dragging finger, the animation must inherit the gesture's release velocity:

```jsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { withSpring, useSharedValue } from 'react-native-reanimated';

const translateY = useSharedValue(0);

const panGesture = Gesture.Pan()
  .onChange((event) => {
    translateY.value = event.translationY;
  })
  .onEnd((event) => {
    // Preserve finger release velocity into the spring simulation
    translateY.value = withSpring(0, {
      velocity: event.velocityY,
      damping: 18,
      stiffness: 150,
    });
  });
```

## Spring Physics vs. Easing Curves

- **Spatial Movements (Position, Scale, Sheet):** Use physical springs (`withSpring`). Springs are inherently interruptible; if a user catches a moving sheet mid-flight, a spring absorbs the new vector without velocity snaps.
- **Color Fades and Opacity:** Use cubic bezier timing curves (`withTiming`). Springs applied to color values feel unnatural.

| Curve Intent | Configuration |
|---|---|
| Natural UI Exit/Entry | `Easing.bezier(0.23, 1, 0.32, 1)` (Fast out, soft settle) |
| Standard Sheet Spring | `{ damping: 20, stiffness: 180, mass: 1 }` |
| Crisp Button Tap Spring | `{ damping: 15, stiffness: 300, mass: 0.8 }` |

## Reduced Motion and Device Accessibility

Always inspect accessibility preferences. If the user enabled system-level reduced motion, eliminate positional translation animations and fall back to subtle cross-fades:

```jsx
import { useReducedMotion } from 'react-native-reanimated';

const shouldReduceMotion = useReducedMotion();

const transition = shouldReduceMotion
  ? withTiming(targetOpacity, { duration: 150 })
  : withSpring(targetOffset);
```

## Performance Guardrails and 120 FPS Targets

- Wrap the app root in `<GestureHandlerRootView style={{ flex: 1 }}>`.
- Verify behavior on release builds running on mid-tier physical Android hardware, not flagship simulators.
- Avoid rendering shadows on animated elements without `renderToHardwareTextureAndroid` or static rasterization.
- For concrete implementation patterns (bottom sheets, swipe rows, collapsing headers), see [react-native-motion-recipes.md](react-native-motion-recipes.md).
