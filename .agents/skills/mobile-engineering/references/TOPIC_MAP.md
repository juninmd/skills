# mobile-engineering Reference Map

Read only the files needed for the current task. Native Apple-platform files (Swift, SwiftUI, UIKit, Metal, iOS system integration) moved to `ios-engineering`'s reference map.

| Reference | Topic / Description |
|---|---|
| `accessibility.md` | An Android screen fails a contrast, touch-target, or TalkBack check, or you need contentDescription/hint conventions |
| `adaptive-screens.md` | The app must support tablets, foldables, or multi-window/desktop mode and you need Google's adaptive quality tier requirements |
| `android-standards.md` | Setting up or configuring a new Android project (Gradle wrapper, flavors, build variants) or need Kotlin naming/style rules |
| `animations.md` | Implementing a Hero/page transition or GPU-side animation and need Flutter/iOS animation code plus Material Design 3 motion timing specs |
| `animate-expo/animate-expo.md` | React Native or Expo motion (Emil Kowalski, MIT): UI-thread Reanimated, Gesture Handler hand-off, springs vs timing, sheets, screen transitions, haptics, stutter on device; recipes in `animate-expo/animate-expo-recipes.md` |
| `components.md` | Picking an Expo/RN component for images, lists, safe areas, or other native UI/media/storage needs |
| `design-style.md` | Choosing colors, typography, spacing, elevation, or shape specs that match the app's category and audience |
| `engineering.md` | Laying out an Expo Router project structure, or configuring EAS builds, releases, and platform integration |
| `flutter.md` | Need a general Flutter best-practices sweep — widget optimization, state management choice, performance targets — before finishing a feature |
| `forms.md` | Building or validating a Flutter form — FormField patterns, input formatting, submission/error state |
| `functional-requirements.md` | Implementing Android audio focus, background playback, or notification/MediaSession behavior requirements |
| `localization.md` | Adding or debugging Flutter i18n — ARB files, flutter_localizations/intl setup, plurals, RTL |
| `native-capabilities.md` | Wiring up Expo/RN camera, location, notifications, haptics, or biometrics and their permission hooks |
| `navigation.md` | Implementing or debugging routing — Expo Router file conventions, GoRouter, or UIKit navigation patterns |
| `networking.md` | Configuring Flutter networking — Dio setup, interceptors (auth/retry/logging), error handling, caching |
| `performance.md` | Chasing dropped frames/jank in Flutter, or investigating Android vitals — startup, ANR, memory, battery |
| `platform-specific.md` | Branching Flutter code per platform — adaptive widgets or platform channels for iOS/Android/Web/Desktop |
| `privacy-security.md` | Implementing or auditing Android permission requests — least privilege, rationale, denied/re-prompt flow, sensitive data handling |
| `project-structure.md` | Scaffolding or reorganizing a Flutter project's feature-based folder structure and entry point |
| `react-native.md` | Initializing a new Expo/RN project, or need the component-preference/shipping checklist before release |
| `real-world-cases.md` | Starting mobile UI/lifecycle/permissions/offline-sync work — read first for scenario checklists and conflict-resolution patterns |
| `reference-routing.md` | Unsure which large reference file covers a topic, or need heading search terms before reading a big file in full |
| `state-management.md` | Choosing a state solution — Zustand/Jotai/React Query for RN, or Riverpod vs Bloc for Flutter |
| `testing.md` | Choosing or writing an Android test layer — JUnit/Robolectric unit tests, Espresso, Compose UI tests, Gradle managed devices |
| `widget-patterns.md` | Structuring Flutter widgets for const-optimization, responsive layout, hooks, or sliver lists |
