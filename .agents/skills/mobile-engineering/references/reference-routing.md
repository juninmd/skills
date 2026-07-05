# Mobile Reference Routing

Use this before opening large mobile reference files. Prefer searching headings with `rg -n "^##|^###|<term>" references/<file>.md`, then read only the relevant section.

## Large Files

| File | Use for | Search first |
|---|---|---|
| `swiftui-design-guidelines.md` | iOS visual design, navigation, Dynamic Type, Liquid Glass, forms, loading states | `Liquid Glass`, `Navigation`, `Dynamic Type`, `Accessibility`, `Loading`, `Modality` |
| `testing.md` | Android/iOS/RN/Flutter test layers and examples | `Unit`, `Integration`, `Compose`, `Activity`, `Maestro`, `Widget`, `E2E` |
| `forms.md` | Mobile form validation, keyboard behavior, errors, submission | `Validation`, `Keyboard`, `Error`, `Submit`, `React Hook Form` |
| `swift-coding-standards.md` | Swift naming, async, memory, errors, protocols | `Concurrency`, `Error`, `Memory`, `Protocol`, `Testing` |
| `engineering.md` | Delivery process, quality gates, requirements, release readiness | `Requirements`, `Quality`, `Release`, `Checklist` |
| `networking.md` | API clients, retries, auth refresh, offline behavior | `Retry`, `Timeout`, `Offline`, `Auth`, `Cache` |
| `animations.md` | Motion timing, transitions, gesture animation | `Reduce Motion`, `Gesture`, `Timing`, `Spring` |
| `localization.md` | i18n, plurals, RTL, placeholders | `Plural`, `RTL`, `Placeholder`, `Locale` |
| `platform-specific.md` | Native bridges and platform branching | `MethodChannel`, `Native Module`, `Platform`, `Permissions` |

## Current Platform Checks

- iOS: verify Apple HIG when using Liquid Glass, app icons, materials, layout, or new platform controls.
- Expo/RN: verify Expo docs for SDK-specific behavior before changing New Architecture, React Compiler, native modules, or build properties.
- Android: verify AndroidX/Compose/Kotlin versions from the app's Gradle files before using newer APIs.
- Flutter: verify the app's Flutter/Dart SDK constraints before adopting new widget or language features.

## Reading Rule

Load full large files only when the task spans multiple sections or the first section search is inconclusive. Keep copied guidance out of `SKILL.md`; add new decision rules here or in `real-world-cases.md`.
