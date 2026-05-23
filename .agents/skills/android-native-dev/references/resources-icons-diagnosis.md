# Resources, Icons, and Error Diagnosis

Standards for app assets and troubleshooting build issues.

## 1. App Icons
- Provide multi-resolution icons (mdpi to xxxhdpi).
- Use **Adaptive Icons** (Android 8+) with background/foreground layers.

## 2. Naming Conventions
- **Layouts:** `layout_` prefix.
- **Drawables:** `ic_`, `img_`, `bg_` prefixes.
- **Colors:** `color_` prefix.
- **CRITICAL:** Avoid Android reserved names (e.g., `background`, `icon`, `white`, `app`).

## 3. Build Error Diagnosis
- `Unresolved reference`: Check imports/dependencies.
- `Duplicate class`: Check for dependency conflicts using `./gradlew :app:dependencies`.
- `AAPT: error`: Check XML syntax.

## 4. Debugging Commands
- `./gradlew clean assembleDebug`
- `./gradlew :app:dependencies`
- `./gradlew assembleDebug --stacktrace`
- `./gradlew --refresh-dependencies`
