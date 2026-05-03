---
name: mobile-react-native-standards
description: React Native coding standards focusing on performance, platform specifics, and offline support.
applyTo: '**/*.tsx,**/*.jsx'
paths:
  - "**/*.tsx"
  - "**/*.jsx"
trigger: glob
globs: "**/*.tsx,**/*.jsx"
---

# Rule: Mobile React Native Standards

## 1. Performance First
- **Avoid unnecessary re-renders**: Memoize callbacks and expensive calculations (`React.memo`, `useMemo`, `useCallback`) — especially in `FlatList`. Target < 16ms per frame in interactions.
- **FlatList over ScrollView**: Use `FlatList` (virtualized) for lists; set `initialNumToRender={10}` and `windowSize={5}` to limit memory.
- **Images**: Prefer `expo-image` (or `FastImage`) for aggressive caching and better performance over the default `<Image>`.

## 2. Platform Nuances
- **Platform specifics**: Apply OS-specific adjustments with `Platform.select({ ios: ..., android: ... })` to respect each OS convention (e.g., hardware back button on Android, swipe back on iOS).
- **Safe Areas**: Ensure that UI components are responsive and handle different screen sizes safely (e.g., using `SafeAreaView` to avoid notches and home indicators).

## 3. Resilience
- **Offline Support**: Always handle network unavailability via `NetInfo`. The app MUST NOT crash offline — implement graceful degradation or offline cache.
