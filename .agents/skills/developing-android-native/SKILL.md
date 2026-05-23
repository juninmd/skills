---
name: developing-android-native
description: |
  **DEVELOPMENT SKILL** - Build native Android applications with Kotlin and Jetpack Compose.
  USE FOR: Android app development, Jetpack Compose, Kotlin coroutines, MVVM/MVI architecture, Hilt DI, Room database, Retrofit networking.
  DO NOT USE FOR: hybrid apps (use react-native-dev/flutter-dev), iOS apps (use ios-application-dev), legacy XML-based Android (use with caution).
  INVOKES: Kotlin code patterns, Android SDK best practices.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Android Studio"
allowed-tools: [read_file, write_file]
---

# Native Android Developer (Kotlin)

Expert guidance for creating, optimizing, and debugging native Android applications using modern libraries and Clean Architecture.

**USE FOR:**
- Implementing declarative UIs with Jetpack Compose and Material 3.
- Managing asynchronous flows with Kotlin Coroutines and StateFlow.
- Architecting apps with MVVM/MVI and Clean Architecture layers.
- Setting up dependency injection with Dagger Hilt.
- Implementing local persistence (Room) and networking (Retrofit).

**DO NOT USE FOR:**
- Cross-platform development (Flutter, React Native).
- Desktop or Backend Kotlin projects.

**INVOKES:**
- Modern Android development patterns and component implementation.

## Methodology and Guidelines
Implementation details for architecture, stack, and performance optimization are documented in:
- [Native Android Best Practices](references/android-best-practices.md)

## Core Standards
1. **Safety:** All server response fields must be nullable.
2. **Performance:** Keep heavy processing off the Main thread using `Dispatchers.IO`.
3. **State:** Maintain strict state hoisting in Compose components for testability.

## Checklist
- [ ] Align architecture, state ownership, and navigation before implementation.
- [ ] Ensure all async flows are collected in a lifecycle-aware manner.
- [ ] Validate implementation with unit or instrumentation tests.
