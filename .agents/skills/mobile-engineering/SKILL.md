---
name: mobile-engineering
description: |
  Build and review native iOS, native Android, React Native or Expo, and Flutter applications. Use for mobile UI, lifecycle, navigation, permissions, offline behavior, accessibility, device integration, tests, and builds.
---

# Mobile Engineering

## Workflow
1. Identify platform, framework/version, minimum OS, architecture, state/navigation, and build variants.
2. Define lifecycle, permissions, offline behavior, deep links, accessibility, and device constraints.
3. Keep heavy work off the UI thread and make cancellation/retry behavior explicit.
4. Test loading, empty, error, denied permission, offline, background/foreground, rotation/resizing, and process restoration.
5. Run formatter/analyzer, focused tests, build, and a simulator/device smoke.

## Reference Routing
- Start with the [topic map](references/TOPIC_MAP.md) when platform or concern selection is unclear.
- For large mobile references, use [reference-routing.md](references/reference-routing.md) to choose sections before reading full files.
- Practical mobile cases: [real-world-cases.md](references/real-world-cases.md)
- iOS: [ios-guide.md](references/ios-guide.md), [swift-coding-standards.md](references/swift-coding-standards.md), [swiftui-design-guidelines.md](references/swiftui-design-guidelines.md)
- Android: [android-standards.md](references/android-standards.md), [project-structure.md](references/project-structure.md)
- React Native/Expo: [react-native.md](references/react-native.md)
- Flutter: [flutter.md](references/flutter.md), [widget-patterns.md](references/widget-patterns.md)
- Cross-platform concerns: [accessibility.md](references/accessibility.md), [networking.md](references/networking.md), [performance.md](references/performance.md)

Read only the platform references required for the task; this directory intentionally contains detailed platform material.

## Checklist
- [ ] Lifecycle, offline, and permission states work.
- [ ] Accessibility and UI-thread constraints are verified.
- [ ] Tests, build, and device smoke pass.
