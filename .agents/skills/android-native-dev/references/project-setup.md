# Project Setup and Configuration

Guidelines for assessing, initializing, and configuring Android projects.

## 1. Project Scenario Assessment

| Scenario | Characteristics | Approach |
|----------|-----------------|----------|
| **Empty Directory** | No files present | Full initialization required, including Gradle Wrapper |
| **Has Gradle Wrapper** | `gradlew` and `gradle/wrapper/` exist | Use `./gradlew` directly for builds |
| **Android Studio Project** | Complete project structure, may lack wrapper | Check wrapper, run `gradle wrapper` if needed |
| **Incomplete Project** | Partial files present | Check missing files, complete configuration |

### 1.1 Required Files Checklist
Refer to the standard Android project structure (root `build.gradle.kts`, `settings.gradle.kts`, `gradle.properties`, and the `app/` module).

## 2. Project Configuration

### 2.1 gradle.properties
Essential settings for AndroidX, Jetifier, and build performance (parallel execution, JVM memory).

### 2.2 Dependency Standards
Guidelines for using Compose BOM and managing Activity/ViewModel dependencies.

### 2.3 Build Variants & Product Flavors
Detailed configuration for `flavorDimensions`, `productFlavors` (dev, staging, prod), and `buildTypes` (debug, release). Includes `BuildConfig` generation and flavor-specific source sets.

## 3. Build Commands
- `./gradlew tasks --group="build"`
- `./gradlew assemble{Flavor}{Type}`
- `./gradlew install{Flavor}{Type}`
- `adb shell am start -n {package}/.MainActivity`
