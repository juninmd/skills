---
name: developing-react-native
description: "React Native architecture and Expo delivery with Expo Router, EAS, TanStack Query, and Zustand. Triggers: react native architecture, expo, expo router, eas, mobile app."

argument-hint: "[file/module] [options]"
---

# Development with React Native

## Description
This skill guides the development of cross-platform mobile applications with React Native, seeking a native experience for iOS and Android from a single codebase.

## 🧱 Recommended Stack 2026
- Runtime/App: Expo SDK + EAS Build/Update.
- Navigation: Expo Router (file-based) as default.
- Server State: TanStack Query.
- Client State: Zustand (Redux Toolkit only when strictly necessary).
- UI: NativeWind or Tamagui.
- Testing: Jest + React Native Testing Library + Maestro/Detox.
- Observability: Sentry + Crashlytics (when applicable).

## Flow

### 1. Project Setup
- **Framework:** Prefer **Expo** (managed workflow) for fast development and OTA.
- **Routing:** Use **Expo Router** (file-based) or **React Navigation**.

### 2. Architecture and State
- **Server State:** Use **TanStack Query** for API calls, caching, and loading.
- **Client State:** Use **Zustand** for lightweight global state (theme/preferences).

### 3. UI Implementation
- **Styling:** Use **NativeWind** (Tailwind for RN) or **Tamagui**.
- **Lists:** Prefer `FlatList` (virtualized) over `ScrollView`.

### 4. Testing and Debugging
- **Unit/Integration:** `Jest` + `React Native Testing Library`.
- **E2E:** `Maestro` (simple YAML flows) or `Detox` (grey-box).
- **Debugger:** Flipper or React Native Debugger.

## Best Practices
- **Performance:** Memoize expensive calculations and callbacks (`useMemo`, `useCallback`).
- **Images:** Use `expo-image` for aggressive caching and better performance.
- **Platform:** Apply OS-specific adjustments with `Platform.select({ ios: ..., android: ... })`.

## Checklist

- [ ] Confirm whether the project is plain React Native or Expo before choosing setup steps.
- [ ] Keep navigation, data fetching, and native capability integration isolated behind clear module boundaries.
- [ ] Validate the affected flow on the target platform emulator or device before finishing.

## References

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)

