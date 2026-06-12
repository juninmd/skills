# Kotlin Development Standards

Naming conventions, null safety, exception handling, and threading best practices for Android development.

## 1. Naming Conventions
- **Classes/Interfaces:** PascalCase
- **Functions/Variables:** camelCase
- **Constants:** SCREAMING_SNAKE
- **Composables:** PascalCase

## 2. Code Standards
- **Null Safety:** Prefer safe calls `?.` and Elvis operator `?:` over non-null assertions `!!`.
- **Exception Handling:** Use `Result<T>` or `runCatching` in ViewModels instead of swallowing exceptions.
- **Server Responses:** All fields in data classes representing server responses MUST be nullable.

## 3. Threading & Coroutines (Critical)
- **Dispatchers.Main:** UI updates.
- **Dispatchers.IO:** Network, File I/O, Database.
- **Dispatchers.Default:** CPU-intensive work (JSON parsing, sorting).
- **Rule:** Suspend functions in repositories should be main-safe (use `withContext`).

## 4. Visibility & Lifecycle
- Use `private`, `internal`, and `public` correctly.
- Manage lifecycle resources (add/remove observers) in paired methods like `onAttachedToWindow` / `onDetachedFromWindow`.

## 5. Logging
- `Log.i`: Normal checkpoints.
- `Log.w`: Recoverable issues.
- `Log.e`: Failures/Errors.
