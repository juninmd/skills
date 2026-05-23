# Android Testing Standards

Layered testing strategies using JUnit, Robolectric, Espresso, and Compose Test.

## 1. Test Dependencies
- Align `kotlinx-coroutines-test` with the project's coroutines version.
- Use `Compose BOM` for UI test dependencies.
- Match `mockk` with the project's Kotlin version.

## 2. Testing Layers
- **Unit (JUnit):** `src/test/`. Logic, ViewModels, Repositories.
- **Robolectric:** `src/test/`. Logic needing Android Context or resources.
- **Espresso:** `src/androidTest/`. View-based UI and integration.
- **Compose UI:** `src/androidTest/` (device) or `src/test/` (Robolectric).

## 3. Test Options
Enable Robolectric support:
```kotlin
android {
    testOptions {
        unitTests.isIncludeAndroidResources = true
    }
}
```

## 4. Commands
- `./gradlew test` (Local)
- `./gradlew connectedDebugAndroidTest` (Device)
- `./gradlew :app:testDebugUnitTest --tests "ClassName"`
