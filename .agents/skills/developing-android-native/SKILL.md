---
name: developing-android-native
description: "Native Android architecture and implementation with Kotlin, Jetpack Compose, coroutines, Flow, and Hilt. Triggers: android architecture, jetpack compose, coroutines, hilt, kotlin android."
argument-hint: "[file/module] [options]"
---

# Native Android Developer (Kotlin)

This skill enables the agent to create, optimize, and debug native Android applications using best practices, modern libraries, and recommended architectures.

## Instructions

1.  **Kotlin First (Idiomatic Kotlin):** Use modern Kotlin features (Scope Functions, Extension Functions, Data Classes, Sealed Classes).
    *   **Rationale:** Idiomatic code is more readable, less verbose, and reduces the chance of null errors (NullPointerException).
2.  **Modern UI (Jetpack Compose):** For new projects or new screens, the UI must be declarative using Jetpack Compose, moving away from legacy XML.
    *   **Best Practice:** Separate `@Composable` functions into small, reusable components (Atomic Design). Maintain *State Hoisting*.
3.  **Asynchronous Programming (Coroutines & Flow):** Never block the Main Thread (UI Thread).
    *   **Rationale:** Heavy operations (Network, Database) must run on `Dispatchers.IO` or `Dispatchers.Default` using `suspend functions` and `StateFlow`/`SharedFlow` for reactivity.
4.  **Architecture (MVVM / MVI + Clean Architecture):** Use ViewModel (Jetpack `ViewModel`) to manage UI state reactively in a way that survives configuration changes.
    *   **Separation of Concerns:** Separate layers into Data (Repository/API), Domain (UseCases/Models), and Presentation (UI/ViewModel).
5.  **Dependency Injection (DI):** Use Hilt (Google's recommendation) or Koin to manage dependency injection and facilitate testing.
6.  **Local Storage and Caching:** For local caching, use **Room** (abstracted SQLite) or **DataStore** (to replace legacy SharedPreferences).
7.  **Networking:** Use **Retrofit** with **OkHttp** for API calls, applying interceptors for logging and token injection.

## Examples

### Valid Example of State Hoisting and MVVM with Compose
```kotlin
@Composable
fun UserScreen(
    viewModel: UserViewModel = hiltViewModel()
) {
    // Collecting StateFlow from ViewModel
    val uiState by viewModel.uiState.collectAsState()

    UserContent(
        uiState = uiState,
        onRefresh = { viewModel.refreshUser() }
    )
}

@Composable
fun UserContent(
    uiState: UserUiState,
    onRefresh: () -> Unit
) {
    if (uiState.isLoading) {
        CircularProgressIndicator()
    } else {
        Column {
            Text(text = uiState.user.name)
            Button(onClick = onRefresh) {
                Text("Refresh")
            }
        }
    }
}
```

### Valid Example of Using Coroutines in Repository
```kotlin
class UserRepository @Inject constructor(
    private val api: UserApi,
    private val defaultDispatcher: CoroutineDispatcher = Dispatchers.IO
) {
    suspend fun fetchUser(id: String): Result<User> = withContext(defaultDispatcher) {
        try {
            val response = api.getUser(id)
            Result.success(response.toDomain())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
```

## 🧱 Recommended Stack 2026
- **Networking:** Retrofit, OkHttp (with HttpLoggingInterceptor)
- **Asynchrony / Reactive:** Kotlin Coroutines, Kotlin Flow
- **Dependency Injection:** Dagger Hilt (or Koin)
- **UI:** Jetpack Compose, Material Design 3
- **Image Loading:** Coil
- **Local Database:** Room Database
- **Preferences:** Preferences DataStore
- **Navigation:** Compose Navigation (or Type-Safe Navigation library, e.g., Voyager)
- **Testing:** JUnit4/5, MockK, Coroutines Test, Turbine (for Flow)

## Scenario: Performance Optimization (Jank / Dropped Frames)
If the UI is stuttering during Scroll (Jank):
1. Check if heavy calculations are happening inside `@Composable` functions.
2. In `LazyColumn`, ensure the item key is unique and stable.
3. Avoid unnecessarily allocating new objects in each recomposition. Use `remember`.
4. In debug, enable Android Studio's Layout Inspector to check Recomposition Counts.

## Checklist

- [ ] Align architecture, state ownership, and navigation boundaries before implementing screens.
- [ ] Keep blocking work off the main thread and verify lifecycle-aware collection for async flows.
- [ ] Validate with targeted unit, UI, or instrumentation tests for the affected slice.

## References

- [Android App Architecture Guide](https://developer.android.com/topic/architecture)
- [Jetpack Compose Documentation](https://developer.android.com/develop/ui/compose)

