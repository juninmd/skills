---
name: android-native-dev
description: |
  **DEVELOPMENT SKILL** - Build native Android apps (Kotlin/Compose).
  USE FOR: project init, Gradle, Coroutines, Hilt, Compose, Material 3.
  DO NOT USE FOR: cross-platform, iOS, non-Android Kotlin.
  INVOKES: ./gradlew, adb.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Android Studio, terminal"
allowed-tools: [run_shell_command, read_file]
---

# Android Native Developer

Expert guide for building native Android apps with Kotlin and Compose.

**USE FOR:**
- Initializing Android projects and Gradle.
- Configuring variants and build files.
- Implementing Kotlin, Coroutines, and Hilt.
- Designing UIs with Compose and Material 3.
- Troubleshooting build errors.
- Setting up Unit and UI tests.

**DO NOT USE FOR:**
- Hybrid/cross-platform (Flutter, RN).
- Legacy View projects (unless requested).

**INVOKES:**
- `./gradlew`, `adb` CLI tools.

## Standards
Modules:
1. [Setup/Build](references/project-setup.md) | [Kotlin/Threading](references/kotlin-standards.md)
2. [Compose UI](references/compose-standards.md) | [Resources/Diagnosis](references/resources-icons-diagnosis.md)
3. [Testing Strategy](references/testing-standards.md) | [Detailed Tests](references/testing.md)

## Design & Security
[M3](references/visual-design.md) & [Adaptive](references/adaptive-screens.md).
[Style](references/design-style-guide.md), [Motion](references/motion-system.md), [A11y](references/accessibility.md), [Perf](references/performance-stability.md), [Privacy/Security](references/privacy-security.md), [Func Req](references/functional-requirements.md).

## Checklist
- [ ] `./gradlew assembleDebug` succeeds first.
- [ ] All server response fields are nullable.
- [ ] Correct Coroutine Dispatchers used.
- [ ] No Android reserved names used.
- [ ] Touch targets 48dp+; 8dp grid spacing.
- [ ] contentDescription on interactive elements.
