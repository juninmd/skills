# Jetpack Compose Standards

Rules for @Composable context, state management, and common patterns.

## 1. Context Rules
- Only call `@Composable` functions from other `@Composable` functions.
- Use `LaunchedEffect` for side effects and suspend calls.

## 2. State Management
- **remember:** Persist state across recomposition.
- **derivedStateOf:** Optimize redundant computations.
- **rememberSaveable:** Persist state across configuration changes.
- **ViewModel:** Use `MutableStateFlow` and `asStateFlow()` for UI state.

## 3. Common Patterns
- Inject ViewModels into top-level screen Composables using `viewModel()`.
- Keep Composables stateless (state hoisting) where possible for testability.
