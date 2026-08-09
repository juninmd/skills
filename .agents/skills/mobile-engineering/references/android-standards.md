# Android Standards

Setup, configuration, Kotlin style, and Jetpack Compose rules for Android development.

## 1. Project Setup and Configuration

Guidelines for assessing, initializing, and configuring Android projects.

### 1.1 Project Scenario Assessment

| Scenario | Characteristics | Approach |
|----------|-----------------|----------|
| **Empty Directory** | No files present | Full initialization required, including Gradle Wrapper |
| **Has Gradle Wrapper** | `gradlew` and `gradle/wrapper/` exist | Use `./gradlew` directly for builds |
| **Android Studio Project** | Complete project structure, may lack wrapper | Check wrapper, run `gradle wrapper` if needed |
| **Incomplete Project** | Partial files present | Check missing files, complete configuration |

### 1.2 Required Files Checklist
Refer to the standard Android project structure (root `build.gradle.kts`, `settings.gradle.kts`, `gradle.properties`, and the `app/` module).

### 1.3 Project Configuration

- **gradle.properties:** Essential settings for AndroidX, Jetifier, and build performance (parallel execution, JVM memory).
- **Dependency Standards:** Guidelines for using Compose BOM and managing Activity/ViewModel dependencies.
- **Build Variants & Product Flavors:** Detailed configuration for `flavorDimensions`, `productFlavors` (dev, staging, prod), and `buildTypes` (debug, release). Includes `BuildConfig` generation and flavor-specific source sets.

### 1.4 Build Commands
- `./gradlew tasks --group="build"`
- `./gradlew assemble{Flavor}{Type}`
- `./gradlew install{Flavor}{Type}`
- `adb shell am start -n {package}/.MainActivity`

## 2. Kotlin Development Standards

Naming conventions, null safety, exception handling, and threading best practices for Android development.

### 2.1 Naming Conventions
- **Classes/Interfaces:** PascalCase
- **Functions/Variables:** camelCase
- **Constants:** SCREAMING_SNAKE
- **Composables:** PascalCase

### 2.2 Code Standards
- **Null Safety:** Prefer safe calls `?.` and Elvis operator `?:` over non-null assertions `!!`.
- **Exception Handling:** Use `Result<T>` or `runCatching` in ViewModels instead of swallowing exceptions.
- **Server Responses:** All fields in data classes representing server responses MUST be nullable.

### 2.3 Threading & Coroutines (Critical)
- **Dispatchers.Main:** UI updates.
- **Dispatchers.IO:** Network, File I/O, Database.
- **Dispatchers.Default:** CPU-intensive work (JSON parsing, sorting).
- **Rule:** Suspend functions in repositories should be main-safe (use `withContext`).

### 2.4 Visibility & Lifecycle
- Use `private`, `internal`, and `public` correctly.
- Manage lifecycle resources (add/remove observers) in paired methods like `onAttachedToWindow` / `onDetachedFromWindow`.

### 2.5 Logging
- `Log.i`: Normal checkpoints.
- `Log.w`: Recoverable issues.
- `Log.e`: Failures/Errors.

## 3. Jetpack Compose Standards

Rules for @Composable context, state management, and common patterns.

### 3.1 Context Rules
- Only call `@Composable` functions from other `@Composable` functions.
- Use `LaunchedEffect` for side effects and suspend calls.

### 3.2 State Management
- **remember:** Persist state across recomposition.
- **derivedStateOf:** Optimize redundant computations.
- **rememberSaveable:** Persist state across configuration changes.
- **ViewModel:** Use `MutableStateFlow` and `asStateFlow()` for UI state.

### 3.3 Common Patterns
- Inject ViewModels into top-level screen Composables using `viewModel()`.
- Keep Composables stateless (state hoisting) where possible for testability.
