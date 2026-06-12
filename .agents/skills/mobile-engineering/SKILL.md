---
name: mobile-engineering
description: "Comprehensive Mobile Engineering covering iOS, Android, React Native, and Flutter development."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "iOS, Android, React Native, Flutter"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Mobile Engineering

Expert methodology for building high-performance, native, and cross-platform mobile applications. This skill unifies native iOS (Swift/SwiftUI), native Android (Kotlin/Compose), React Native (Expo), and Flutter development.

**USE FOR:**
- Developing native iOS applications using Swift, SwiftUI, and UIKit.
- Developing native Android applications using Kotlin, Jetpack Compose, and Material 3.
- Building cross-platform apps with React Native, Expo Router, and Reanimated.
- Building cross-platform apps with Flutter 3, Dart, and Riverpod/Bloc.
- Managing mobile-specific architecture, state, and UI responsiveness.

**DO NOT USE FOR:**
- Web-only frontend development (use `frontend-engineering`).
- Backend API development (use `backend-*`).

**INVOKES:**
- `xcodebuild`, `./gradlew`, `expo cli`, `flutter cli`, native testing tools.

## Core Principles
1. **Platform Feel:** Respect platform-specific UI/UX paradigms even in cross-platform apps.
2. **Performance:** Optimize for battery life, memory constraints, and smooth 60fps+ rendering.
3. **Offline First:** Mobile apps must handle intermittent or zero network connectivity gracefully.
4. **State Management:** Use robust, platform-appropriate state management (Zustand, Riverpod, Hilt, etc.).

## Implementation Guides
Refer to these specific domains for deep-dive instructions:
- [iOS Native Development](references/ios-native.md)
- [Android Native Development](references/android-native.md)
- [React Native & Expo](references/react-native.md)
- [Flutter Development](references/flutter-dev.md)

## Checklist
- [ ] Verify that UI layouts are responsive across different screen sizes and orientations.
- [ ] Test the application's behavior in airplane mode.
- [ ] Ensure all heavy processing is moved off the main UI thread.
- [ ] Check accessibility (VoiceOver/TalkBack) labels for all interactive elements.
