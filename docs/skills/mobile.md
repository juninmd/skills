# Mobile Skills

Skills for iOS, Android, and cross-platform mobile development.

## `flutter-dev`

**Invoke:** `/flutter-dev`

Flutter 3 + Dart for cross-platform mobile.

**Stack:**
- State management: Riverpod 2 (code generation)
- Navigation: GoRouter
- HTTP: Dio + Retrofit
- Local storage: Hive / Isar
- DI: get_it / injectable

**Performance targets:**
- 60fps minimum, 120fps capable
- Frame time: <16ms
- Cold start: <2s

**Covers:** Riverpod providers, GoRouter named routes, widget testing, integration testing, golden tests, platform channels, flavor configuration, CI/CD with Fastlane.

---

## `react-native-dev`

**Invoke:** `/react-native-dev`

React Native + Expo for iOS and Android.

**Stack:**
- Expo SDK (managed or bare workflow)
- Navigation: React Navigation 7
- State: Zustand or Jotai
- Styling: NativeWind (Tailwind for RN)

**Covers:** Expo Router file-based routing, EAS Build and Submit, OTA updates, native modules, gesture handling, animations with Reanimated 3, deep linking.

---

## `android-native-dev`

**Invoke:** `/android-native-dev`

Native Android with Kotlin + Jetpack Compose.

**Stack:**
- Language: Kotlin
- UI: Jetpack Compose + Material 3
- Architecture: MVVM + clean architecture
- Async: Coroutines + Flow
- DI: Hilt
- Navigation: Compose Navigation

**Covers:** Composable lifecycle, state hoisting, side effects, ViewModel scoping, Room database, WorkManager, ProGuard/R8 configuration.

---

## `ios-application-dev`

**Invoke:** `/ios-application-dev`

Native iOS with Swift + SwiftUI.

**Stack:**
- Language: Swift
- UI: SwiftUI
- Architecture: MVVM or TCA
- Async: Swift Concurrency (async/await, actors)
- Persistence: SwiftData / Core Data

**Covers:** SwiftUI data flow, @Observable macro, Swift concurrency patterns, App Store submission, TestFlight distribution, XCTest and XCUITest.
