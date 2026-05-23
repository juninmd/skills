# Native Android Best Practices (2026)

Guidelines for building modern, high-performance Android apps with Kotlin and Compose.

## 1. Core Principles
- **Idiomatic Kotlin:** Use Scope Functions, Extension Functions, and Sealed Classes for readability and safety.
- **Modern UI:** Use **Jetpack Compose** exclusively for new screens. Follow Atomic Design and State Hoisting.
- **Async & Reactivity:** Use **Coroutines** and **Flow**. Heavy operations MUST run on `Dispatchers.IO` or `Default`.
- **Architecture:** MVVM/MVI + Clean Architecture. Separate layers into Data, Domain, and Presentation.
- **DI:** Use **Dagger Hilt** (recommended) or Koin for dependency management.

## 2. Storage & Networking
- **Persistence:** **Room** for local DB, **DataStore** for preferences.
- **Networking:** **Retrofit** + **OkHttp** with logging interceptors.
- **Image Loading:** **Coil** for Compose-first image loading.

## 3. Code Examples

### State Hoisting in Compose
```kotlin
@Composable
fun UserScreen(viewModel: UserViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    UserContent(uiState = uiState, onRefresh = { viewModel.refresh() })
}
```

### Repository with Coroutines
```kotlin
suspend fun fetchUser(id: String): Result<User> = withContext(Dispatchers.IO) {
    try { Result.success(api.getUser(id).toDomain()) }
    catch (e: Exception) { Result.failure(e) }
}
```

## 4. Performance Checklist (Jank/FPS)
- Avoid heavy calculations in `@Composable`.
- Use stable, unique keys in `LazyColumn`.
- Use `remember` to prevent object reallocation during recomposition.

## 5. Recommended Stack
Retrofit, OkHttp, Coroutines, Flow, Dagger Hilt, Jetpack Compose, Material 3, Coil, Room, DataStore, Voyager/Compose Navigation.
