# React Native and Expo Best Practices

Guidelines for high-performance cross-platform development.

## 1. Component Preferences

| Purpose | Use | Instead of |
|---------|-----|------------|
| Lists | `FlashList` + `memo` items | `FlatList` |
| Images | `expo-image` | RN `<Image>` |
| Press | `Pressable` | `TouchableOpacity` |
| Animations | `Reanimated 3` | RN `Animated` |
| Gestures | `Gesture Handler` | `PanResponder` |

## 2. State Management Strategy
- **Local:** `useState` / `useReducer`.
- **Global:** **Zustand** or **Jotai**.
- **Server:** **React Query** (TanStack).
- **Forms:** **React Hook Form** + **Zod**.

## 3. Performance and Animation Rules
- **Animations:** Only animate `transform` and `opacity` to ensure GPU acceleration. Target < 16ms per frame.
- **Lists:** Use `FlashList` for lists with > 20 items. For `FlatList`, set `initialNumToRender={10}` and `windowSize={5}`.
- **Imports:** Always import directly from source; avoid barrel files to prevent bundle bloat.
- **Rendering:** Use `{count > 0 && <Text />}` to avoid rendering "0" unexpectedly. Memoize callbacks and expensive calculations (`React.memo`, `useMemo`, `useCallback`) especially in lists.
- **Images:** Prefer `expo-image` (or `FastImage`) for aggressive caching and better performance over the default `<Image>`.

## 4. Platform Nuances & Resilience
- **Platform Specifics:** Apply OS-specific adjustments with `Platform.select({ ios: ..., android: ... })` to respect each OS convention (e.g., hardware back button on Android, swipe back on iOS).
- **Safe Areas:** Ensure UI components are responsive and handle different screen sizes safely (e.g., using `SafeAreaView` to avoid notches and home indicators).
- **Offline Support:** Always handle network unavailability via `NetInfo`. The app MUST NOT crash offline — implement graceful degradation or offline cache.
