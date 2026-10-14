# React Native and Expo Motion Implementation Recipes

Open when building specific mobile motion components (drag-to-dismiss sheets, swipe actions, collapsing headers, press states, toast notifications) using Reanimated and Gesture Handler.

## Contents

- Shared Tooling Setup
- Interactive Drag-to-Dismiss Bottom Sheet
- Swipe-to-Delete List Rows
- Scroll-Driven Collapsing Header
- Immediate Press Feedback
- Keyboard-Synchronized View Offsets

## Shared Tooling Setup

Install packages via Expo CLI to guarantee SDK version alignment:

```bash
npx expo install react-native-reanimated react-native-gesture-handler expo-haptics
```

Verify that `GestureHandlerRootView` wraps the top-level app component:

```jsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack />
    </GestureHandlerRootView>
  );
}
```

## Interactive Drag-to-Dismiss Bottom Sheet

A draggable modal sheet that tracks vertical pan gestures and springs closed when pulled past a threshold or flicked with downward velocity:

```jsx
import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DISMISS_THRESHOLD = 150;

export function BottomSheetModal({ isOpen, onClose, children }) {
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      // Prevent upward dragging past top rest position
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (translateY.value > DISMISS_THRESHOLD || event.velocityY > 500) {
        // Dismiss sheet
        translateY.value = withSpring(SCREEN_HEIGHT, { velocity: event.velocityY }, () => {
          runOnJS(onClose)();
        });
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      } else {
        // Snap back to open position
        translateY.value = withSpring(0, { velocity: event.velocityY, damping: 20, stiffness: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isOpen) return null;

  return (
    <View style={styles.backdrop}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sheet, animatedStyle]}>
          <View style={styles.dragHandle} />
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, minHeight: 300, padding: 16 },
  dragHandle: { width: 40, height: 5, borderRadius: 3, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: 12 },
});
```

## Swipe-to-Delete List Rows

Tracks horizontal swipe displacement and exposes a background deletion action:

```jsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';

export function SwipeableRow({ onDelete, children }) {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onChange((e) => {
      // Only allow swiping to the left
      translateX.value = Math.min(0, e.translationX);
    })
    .onEnd((e) => {
      if (translateX.value < -100) {
        translateX.value = withSpring(-100);
        runOnJS(onDelete)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={rowStyle}>{children}</Animated.View>
    </GestureDetector>
  );
}
```

## Scroll-Driven Collapsing Header

Interpolate scroll offsets directly into header dimensions using `useAnimatedScrollHandler`:

```jsx
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';

export function CollapsingHeaderView({ children }) {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 80], [1, 0], Extrapolation.CLAMP);
    const height = interpolate(scrollY.value, [0, 80], [120, 60], Extrapolation.CLAMP);
    return { opacity, height };
  });

  return (
    <>
      <Animated.View style={headerStyle} />
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
        {children}
      </Animated.ScrollView>
    </>
  );
}
```

## Immediate Press Feedback

For buttons touched hundreds of times daily, use lightweight scale transitions:

```jsx
import { Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export function ScaleButton({ onPress, children }) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(0.96, { damping: 15, stiffness: 350 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 15, stiffness: 350 }))}
      onPress={onPress}
    >
      <Animated.View style={style}>{children}</Animated.View>
    </Pressable>
  );
}
```

## Keyboard-Synchronized View Offsets

When inputs require precise alignment with the software keyboard, inspect `react-native-keyboard-controller` for frame-accurate keyboard tracking without layout stutter.
