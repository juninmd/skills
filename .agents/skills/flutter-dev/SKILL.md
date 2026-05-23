---
name: flutter-dev
description: |
  **DEVELOPMENT SKILL** - Build mobile apps with Flutter 3 and Dart.
  USE FOR: Flutter, Riverpod, Bloc, GoRouter, responsive UI, mobile performance.
  DO NOT USE FOR: native-only, pure web, React Native.
  INVOKES: flutter cli, dart, devtools.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "iOS, Android, Web, Desktop"
allowed-tools: [run_shell_command, read_file, write_file]
---

# Flutter Development Guide

Expert guide for building high-performance cross-platform apps with Flutter 3 and Dart.

**USE FOR:**
- Designing UIs with Material 3 and Cupertino.
- Implementing state with Riverpod or Bloc.
- Configuring routing using GoRouter.
- Optimizing rebuild cycles and app performance.
- Integrating native features via platform channels.

**DO NOT USE FOR:**
- Low-level system driver development.
- Non-Dart backend services.

**INVOKES:**
- `flutter build`, `flutter test` CLI commands.

## Methodology
Refer to these modules:
1. [Best Practices](references/flutter-best-practices.md) | [Checklist](references/flutter-checklist.md)
2. [Riverpod](references/riverpod-state.md) | [Bloc](references/bloc-state.md) | [GoRouter](references/gorouter-navigation.md)
3. [Animations](references/animations.md) | [Networking](references/networking.md) | [Forms](references/forms.md)
4. [A11y](references/testing.md) | [Perf](references/performance.md) | [Structure](references/project-structure.md) | [Platform](references/platform-specific.md) | [L10n](references/localization.md) | [Patterns](references/widget-patterns.md)

## Principles
1. **Efficiency:** Use `const` and granular `select` rebuilds.
2. **Safety:** Explicitly handle loading, error, and empty states.
3. **Architecture:** Use feature-based folder structures.

## Checklist
- [ ] Verify static widgets use `const`.
- [ ] Ensure explicit error/loading states for async work.
- [ ] Validate responsiveness across screen sizes.
- [ ] Run test suite before submitting changes.
