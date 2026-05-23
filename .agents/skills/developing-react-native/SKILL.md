---
name: developing-react-native
description: |
  **DEVELOPMENT SKILL** - Build cross-platform mobile apps with React Native and Expo.
  USE FOR: React Native development, Expo SDK, Expo Router, TanStack Query integration, Zustand state management, mobile UI styling (NativeWind).
  DO NOT USE FOR: native-only iOS/Android development (use ios-application-dev/android-native-dev), pure web development, Flutter apps.
  INVOKES: expo cli, eas build, react-native commands.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "iOS, Android, Expo"
allowed-tools: [read_file, write_file, replace]
---

# Development with React Native

Expert methodology for building high-performance cross-platform mobile applications with a single codebase and native user experience.

**USE FOR:**
- Initializing and configuring projects using the Expo managed workflow.
- Implementing file-based routing with Expo Router.
- Managing asynchronous server state with TanStack Query.
- Styling responsive mobile UIs with NativeWind or Tamagui.
- Configuring EAS Build and EAS Update pipelines.

**DO NOT USE FOR:**
- Hybrid apps using Cordova or Capacitor.
- High-performance 3D games (use Unity or Unreal).

**INVOKES:**
- `npx expo`, `eas`, `jest` CLI tools.

## Methodology and Guidelines
Implementation details for architecture, stack, and mobile-specific patterns are documented in:
- [React Native Best Practices and Stack](references/react-native-best-practices.md)

## Core Principles
1. **Efficiency:** Prefer Expo managed workflow for rapid development and over-the-air (OTA) updates.
2. **Determinism:** Use virtualized lists (`FlatList`) over `ScrollView` for large datasets.
3. **Platform Integrity:** Ensure touch targets are 44-48dp+ and follow iOS/Android platform-specific UI conventions.

## Checklist
- [ ] Confirm Expo vs. Bare React Native project type before implementation.
- [ ] Isolate navigation and data-fetching logic behind clear hook boundaries.
- [ ] Verify functionality on both iOS and Android emulators/devices.
- [ ] Ensure all images use `expo-image` for optimized caching and performance.
