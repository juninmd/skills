---
name: developing-android-native
description: Desenvolver aplicativos nativos para Android utilizando Kotlin, Jetpack Compose, Coroutines e arquitetura moderna recomendada pelo Google.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[file/module] [options]"
---

# Android Native Developer (Kotlin)

Esta skill capacita o agente a criar, otimizar e debugar aplicações Android nativas utilizando as melhores práticas, bibliotecas modernas e arquiteturas recomendadas.

## Instructions

1.  **Kotlin-First (Idiomatic Kotlin):** Utilize recursos modernos do Kotlin (Scope Functions, Extension Functions, Data Classes, Sealed Classes).
    *   **Reasoning:** Código idiomático é mais legível, menos verboso e reduz a chance de erros nulos (NullPointerException).
2.  **Modern UI (Jetpack Compose):** Para novos projetos ou novas telas, a UI deve ser declarativa usando Jetpack Compose, abandonando o XML legado.
    *   **Best Practice:** Separe funções `@Composable` em componentes pequenos e reutilizáveis (Atomic Design). Mantenha o *State Hoisting* (elevação de estado).
3.  **Asynchronous Programming (Coroutines & Flow):** Nunca bloqueie a Main Thread (UI Thread).
    *   **Reasoning:** Operações pesadas (Network, Database) devem rodar em `Dispatchers.IO` ou `Dispatchers.Default` utilizando `suspend functions` e `StateFlow`/`SharedFlow` para reatividade.
4.  **Architecture (MVVM / MVI + Clean Architecture):** Use ViewModel (`ViewModel` do Jetpack) para gerenciar o estado da UI de forma reativa que sobreviva a mudanças de configuração.
    *   **Separation of Concerns:** Separe as camadas em Data (Repository/API), Domain (UseCases/Models) e Presentation (UI/ViewModel).
5.  **Dependency Injection (DI):** Utilize Hilt (recomendado do Google) ou Koin para gerenciar a injeção de dependências e facilitar os testes.
6.  **Local Storage & Caching:** Para cache local, utilize **Room** (SQLite abstraído) ou **DataStore** (para substituir o SharedPreferences legacy).
7.  **Networking:** Utilize **Retrofit** com **OkHttp** para chamadas de API, aplicando interceptors para logging e injeção de tokens.

## Examples

### Valid Compose State Hoisting & MVVM
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

### Valid Coroutine usage in Repository
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

## Recommended Libraries Stack
- **Networking:** Retrofit, OkHttp (com HttpLoggingInterceptor)
- **Asynchrony / Reactive:** Kotlin Coroutines, Kotlin Flow
- **Dependency Injection:** Dagger Hilt (ou Koin)
- **UI:** Jetpack Compose, Material Design 3
- **Image Loading:** Coil
- **Local Database:** Room Database
- **Preferences:** Preferences DataStore
- **Navigation:** Compose Navigation (ou biblioteca de Navigation Type-Safe, ex: Voyager)
- **Testing:** JUnit4/5, MockK, Coroutines Test, Turbine (para Flow)

## Scenario: Performance Optimization (Jank / Dropped Frames)
Se a UI estiver travando no Scroll (Jank):
1. Verifique se cálculos pesados não estão acontecendo dentro de funções `@Composable`.
2. Em `LazyColumn`, certifique-se de que a chave (key) dos itens é única e estável.
3. Evite alocar objetos novos desnecessariamente em cada recomposição. Use `remember`.
4. Em debug, ative o Layout Inspector do Android Studio para verificar número de recomposições (Recomposition Counts).