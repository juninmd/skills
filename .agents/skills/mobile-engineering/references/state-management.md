# State Management Reference

Patterns for local, shared, and server state in React Native / Expo apps, plus Flutter state management with Riverpod and Bloc.

## Decision Guide

| State Type | Solution |
|------------|----------|
| Local UI state (toggle, input) | `useState` / `useReducer` |
| Shared app-wide state | Zustand or Jotai |
| Server/async data | React Query (TanStack Query) |
| Form state | React Hook Form (see forms.md) |
| Auth / session | Zustand + `expo-secure-store` |

**Avoid**: Redux for new projects (boilerplate), Context for high-frequency updates (re-render overhead).

### Flutter Decision Guide

| Use Case | Recommended |
|----------|-------------|
| Simple mutable state | Riverpod |
| Computed values | Riverpod |
| Event-driven workflows | Bloc |
| Forms, auth, wizards | Bloc |
| Feature modules with complex logic | Bloc |

## React Native / Expo

### useState / useReducer

```tsx
// Simple toggle
const [isOpen, setIsOpen] = useState(false);

// Complex local state — useReducer
type State = { count: number; status: "idle" | "loading" | "error" };
type Action = { type: "increment" } | { type: "setStatus"; payload: State["status"] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment": return { ...state, count: state.count + 1 };
    case "setStatus": return { ...state, status: action.payload };
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0, status: "idle" });
dispatch({ type: "increment" });
```

### Zustand (Shared State)

```bash
npx expo install zustand
```

```tsx
// stores/settings-store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SettingsStore {
  theme: "light" | "dark";
  locale: string;
  setTheme: (theme: "light" | "dark") => void;
  setLocale: (locale: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: "light",
      locale: "en",
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Usage
const { theme, setTheme } = useSettingsStore();
const locale = useSettingsStore((s) => s.locale); // Selector — minimizes re-renders
```

```tsx
// stores/cart-store.ts
interface CartStore {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  add: (product) => set((s) => ({
    items: [...s.items, { product, quantity: 1 }],
  })),
  remove: (id) => set((s) => ({
    items: s.items.filter((i) => i.product.id !== id),
  })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}));
```

### Jotai (Atomic State)

```bash
npx expo install jotai
```

```tsx
// atoms/user-atoms.ts
import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storage = createJSONStorage(() => AsyncStorage);

export const userAtom = atom<User | null>(null);
export const themeAtom = atomWithStorage<"light" | "dark">("theme", "light", storage);

// Derived atom — computed from others
export const isAdminAtom = atom((get) => get(userAtom)?.role === "admin");
```

```tsx
// Usage — component only re-renders when its atoms change
import { useAtom, useAtomValue, useSetAtom } from "jotai";

function Header() {
  const user = useAtomValue(userAtom);         // read-only
  const setTheme = useSetAtom(themeAtom);      // write-only
  const [theme, setThemeRW] = useAtom(themeAtom); // read + write
  return <Text>{user?.name}</Text>;
}
```

**Zustand vs Jotai**:
- **Zustand** — store-based, better for related state with actions (auth, cart)
- **Jotai** — atom-based, better for independent values, fine-grained subscriptions, avoids re-renders

### React Query (Server State)

See [networking.md](networking.md) for full reference. Key patterns:

```tsx
// Queries — read
const { data, isLoading } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });

// Mutations — write
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
});

// Optimistic update
const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (newUser) => {
    await queryClient.cancelQueries({ queryKey: ["user", newUser.id] });
    const prev = queryClient.getQueryData(["user", newUser.id]);
    queryClient.setQueryData(["user", newUser.id], newUser);
    return { prev };
  },
  onError: (_err, variables, context) => {
    queryClient.setQueryData(["user", variables.id], context?.prev);
  },
});
```

### Minimize Re-renders

#### Zustand Selectors

```tsx
// ✗ Wrong — re-renders on any store change
const store = useAuthStore();

// ✓ Correct — re-renders only when user changes
const user = useAuthStore((s) => s.user);
const logout = useAuthStore((s) => s.logout); // Actions are stable references
```

#### Dispatcher Pattern

```tsx
// ✗ Wrong — passes callbacks that recreate on every render
function Parent() {
  const [count, setCount] = useState(0);
  return <Child onIncrement={() => setCount(c => c + 1)} />;
}

// ✓ Correct — dispatcher reference is stable
function Parent() {
  const [count, dispatch] = useReducer(reducer, 0);
  return <Child dispatch={dispatch} />;
}
```

#### React Compiler (SDK 54+)

With React Compiler enabled, `memo`, `useCallback`, and `useMemo` are often unnecessary:

```json
// app.json
{ "expo": { "experiments": { "reactCompiler": true } } }
```

### Context (Use Sparingly)

Context is suitable for infrequently-changing values (theme, locale, auth status). **Avoid** for high-frequency updates like scroll position or form input.

```tsx
const ThemeContext = createContext<"light" | "dark">("light");

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return <ThemeContext value={theme}>{children}</ThemeContext>; // React 19+
}

// Consume
const theme = use(ThemeContext); // React 19+
```

### Fallback on First Render

```tsx
// ✓ Always show fallback while async state loads
function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({ queryKey: ["user", userId], queryFn: () => fetchUser(userId) });
  if (isLoading) return <UserProfileSkeleton />;
  if (!data) return null;
  return <Profile user={data} />;
}
```

## Riverpod (Flutter)

Riverpod 2.0 state management guide covering provider types, notifier patterns, and widget integration.

### Provider Types

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Simple computed value
final greetingProvider = Provider<String>((ref) {
  final name = ref.watch(userNameProvider);
  return 'Hello, $name';
});

// Simple mutable state
final counterProvider = StateProvider<int>((ref) => 0);

// Async state (API calls)
final usersProvider = FutureProvider<List<User>>((ref) async {
  final api = ref.read(apiProvider);
  return api.getUsers();
});

// Stream state (real-time)
final messagesProvider = StreamProvider<List<Message>>((ref) {
  return ref.read(chatServiceProvider).messagesStream;
});
```

#### Provider Type Reference

| Provider | Use Case |
|----------|----------|
| `Provider` | Computed/derived values, dependency injection |
| `StateProvider` | Simple mutable state (counter, toggle) |
| `FutureProvider` | Async operations (one-time fetch) |
| `StreamProvider` | Real-time data streams |
| `NotifierProvider` | Complex state with methods |
| `AsyncNotifierProvider` | Async state with methods |

### Notifier Pattern (Riverpod 2.0)

#### Synchronous Notifier

```dart
@riverpod
class TodoList extends _$TodoList {
  @override
  List<Todo> build() => [];

  void add(Todo todo) {
    state = [...state, todo];
  }

  void toggle(String id) {
    state = [
      for (final todo in state)
        if (todo.id == id) 
          todo.copyWith(completed: !todo.completed) 
        else 
          todo,
    ];
  }

  void remove(String id) {
    state = state.where((t) => t.id != id).toList();
  }
}
```

#### Async Notifier

```dart
@riverpod
class UserProfile extends _$UserProfile {
  @override
  Future<User> build() async {
    return ref.read(apiProvider).getCurrentUser();
  }

  Future<void> updateName(String name) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final updated = await ref.read(apiProvider).updateUser(name: name);
      return updated;
    });
  }

  Future<void> refresh() async {
    ref.invalidateSelf();
    await future;
  }
}
```

### Usage in Widgets

#### ConsumerWidget (Recommended)

```dart
class TodoScreen extends ConsumerWidget {
  const TodoScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final todos = ref.watch(todoListProvider);

    return ListView.builder(
      itemCount: todos.length,
      itemBuilder: (context, index) {
        final todo = todos[index];
        return ListTile(
          key: ValueKey(todo.id),
          title: Text(todo.title),
          leading: Checkbox(
            value: todo.completed,
            onChanged: (_) => ref.read(todoListProvider.notifier).toggle(todo.id),
          ),
        );
      },
    );
  }
}
```

#### Selective Rebuilds with select

```dart
class UserAvatar extends ConsumerWidget {
  const UserAvatar({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Only rebuilds when avatarUrl changes
    final avatarUrl = ref.watch(userProvider.select((u) => u?.avatarUrl));

    return CircleAvatar(
      backgroundImage: avatarUrl != null ? NetworkImage(avatarUrl) : null,
    );
  }
}
```

#### Async State Handling

```dart
class UserProfileScreen extends ConsumerWidget {
  const UserProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userProfileProvider);

    return userAsync.when(
      data: (user) => UserProfileContent(user: user),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, stack) => ErrorView(
        message: err.toString(),
        onRetry: () => ref.invalidate(userProfileProvider),
      ),
    );
  }
}
```

#### Consumer for Scoped Rebuilds

```dart
class MyScreen extends StatelessWidget {
  const MyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Text('Static content'),
        Consumer(
          builder: (context, ref, child) {
            final count = ref.watch(counterProvider);
            return Text('Count: $count');
          },
        ),
      ],
    );
  }
}
```

### Provider Modifiers

```dart
// Auto-dispose when no longer used
@riverpod
class AutoDisposeExample extends _$AutoDisposeExample {
  @override
  String build() => 'value';
}

// Family - parameterized providers
@riverpod
Future<User> userById(UserByIdRef ref, String id) async {
  return ref.read(apiProvider).getUser(id);
}

// Usage
final user = ref.watch(userByIdProvider('123'));
```

### Best Practices

| Do | Don't |
|----|-------|
| Use `ref.watch()` in build | Use `ref.watch()` in callbacks |
| Use `ref.read()` in callbacks | Use `ref.read()` in build |
| Use `select()` for granular rebuilds | Watch entire state unnecessarily |
| Create new state instances | Mutate state directly |
| Use `AsyncValue.guard()` for errors | Catch errors manually |

### Quick Reference

| Method | When to Use |
|--------|-------------|
| `ref.watch()` | In build method, rebuilds on change |
| `ref.read()` | In callbacks, one-time read |
| `ref.listen()` | Side effects on change |
| `ref.invalidate()` | Force provider refresh |
| `ref.refresh()` | Invalidate and get new value |

## Bloc (Flutter)

Bloc state management guide covering events, states, Cubit, and widget integration for complex business logic.

### When to Use Bloc

Use **Bloc/Cubit** when you need:
- Explicit event → state transitions
- Complex business logic with multiple events
- Predictable, testable state flows
- Clear separation between UI and logic

### Core Concepts

| Concept | Description |
|---------|-------------|
| Event | User or system input that triggers state change |
| State | Immutable representation of UI state |
| Bloc | Maps events to new states |
| Cubit | Simplified Bloc without events |

### Cubit (Recommended for Simpler Logic)

```dart
import 'package:flutter_bloc/flutter_bloc.dart';

class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);

  void increment() => emit(state + 1);
  void decrement() => emit(state - 1);
  void reset() => emit(0);
}
```

### Full Bloc Setup

#### Event Definition

```dart
sealed class CounterEvent {}

final class CounterIncremented extends CounterEvent {}
final class CounterDecremented extends CounterEvent {}
final class CounterReset extends CounterEvent {}
```

#### State Definition

```dart
class CounterState {
  final int value;
  final bool isLoading;

  const CounterState({
    required this.value,
    this.isLoading = false,
  });

  CounterState copyWith({int? value, bool? isLoading}) {
    return CounterState(
      value: value ?? this.value,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}
```

#### Bloc Implementation

```dart
class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(const CounterState(value: 0)) {
    on<CounterIncremented>(_onIncremented);
    on<CounterDecremented>(_onDecremented);
    on<CounterReset>(_onReset);
  }

  void _onIncremented(CounterIncremented event, Emitter<CounterState> emit) {
    emit(state.copyWith(value: state.value + 1));
  }

  void _onDecremented(CounterDecremented event, Emitter<CounterState> emit) {
    emit(state.copyWith(value: state.value - 1));
  }

  void _onReset(CounterReset event, Emitter<CounterState> emit) {
    emit(const CounterState(value: 0));
  }
}
```

### Providing Bloc to Widget Tree

```dart
// Single bloc
BlocProvider(
  create: (_) => CounterBloc(),
  child: const CounterScreen(),
);

// Multiple blocs
MultiBlocProvider(
  providers: [
    BlocProvider(create: (_) => AuthBloc()),
    BlocProvider(create: (_) => ProfileBloc()),
    BlocProvider(create: (_) => SettingsBloc()),
  ],
  child: const AppRoot(),
);
```

### Using Bloc in Widgets

#### BlocBuilder (UI Rebuilds)

```dart
class CounterScreen extends StatelessWidget {
  const CounterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<CounterBloc, CounterState>(
      buildWhen: (prev, curr) => prev.value != curr.value,
      builder: (context, state) {
        return Text(
          state.value.toString(),
          style: Theme.of(context).textTheme.displayLarge,
        );
      },
    );
  }
}
```

#### BlocListener (Side Effects)

```dart
BlocListener<AuthBloc, AuthState>(
  listenWhen: (prev, curr) => prev.status != curr.status,
  listener: (context, state) {
    if (state.status == AuthStatus.failure) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(state.errorMessage ?? 'Error')),
      );
    }
    if (state.status == AuthStatus.authenticated) {
      context.go('/home');
    }
  },
  child: const LoginForm(),
);
```

#### BlocConsumer (Builder + Listener)

```dart
BlocConsumer<FormBloc, FormState>(
  listenWhen: (prev, curr) => prev.status != curr.status,
  listener: (context, state) {
    if (state.status == FormStatus.success) {
      context.pop();
    }
  },
  buildWhen: (prev, curr) => prev.isValid != curr.isValid,
  builder: (context, state) {
    return ElevatedButton(
      onPressed: state.isValid
          ? () => context.read<FormBloc>().add(FormSubmitted())
          : null,
      child: const Text('Submit'),
    );
  },
);
```

#### BlocSelector (Granular Rebuilds)

```dart
BlocSelector<UserBloc, UserState, String>(
  selector: (state) => state.user.name,
  builder: (context, name) {
    return Text('Hello, $name');
  },
);
```

### Async Bloc Pattern

```dart
on<UserRequested>((event, emit) async {
  emit(state.copyWith(status: UserStatus.loading));

  try {
    final user = await repository.fetchUser(event.userId);
    emit(state.copyWith(status: UserStatus.success, user: user));
  } catch (e) {
    emit(state.copyWith(status: UserStatus.failure, error: e.toString()));
  }
});
```

### Bloc + GoRouter Auth Guard

```dart
redirect: (context, state) {
  final authState = context.read<AuthBloc>().state;
  final isAuthRoute = state.matchedLocation.startsWith('/auth');

  if (authState.status != AuthStatus.authenticated && !isAuthRoute) {
    return '/auth/login';
  }
  if (authState.status == AuthStatus.authenticated && isAuthRoute) {
    return '/';
  }
  return null;
}
```

### Testing Bloc

```dart
import 'package:bloc_test/bloc_test.dart';

blocTest<CounterBloc, CounterState>(
  'emits incremented value when CounterIncremented added',
  build: () => CounterBloc(),
  act: (bloc) => bloc.add(CounterIncremented()),
  expect: () => [const CounterState(value: 1)],
);

blocTest<CounterBloc, CounterState>(
  'emits multiple states',
  build: () => CounterBloc(),
  act: (bloc) {
    bloc.add(CounterIncremented());
    bloc.add(CounterIncremented());
    bloc.add(CounterDecremented());
  },
  expect: () => [
    const CounterState(value: 1),
    const CounterState(value: 2),
    const CounterState(value: 1),
  ],
);
```

### Best Practices

| Do | Don't |
|----|-------|
| Keep states immutable | Mutate state directly |
| Use small, focused blocs | Create "god blocs" with everything |
| One feature = one bloc | Share blocs across unrelated features |
| Use Cubit for simple cases | Overcomplicate with Bloc unnecessarily |
| Test all state transitions | Skip bloc testing |
| Use `buildWhen`/`listenWhen` | Rebuild on every state change |

### Widget Reference

| Widget | Purpose |
|--------|---------|
| `BlocBuilder` | UI rebuilds based on state |
| `BlocListener` | Side effects (navigation, snackbar) |
| `BlocConsumer` | Both builder and listener |
| `BlocSelector` | Granular state selection |
| `BlocProvider` | Dependency injection |
| `MultiBlocProvider` | Multiple bloc injection |
| `RepositoryProvider` | Repository injection |

---

*Riverpod is an open-source state management library by Remi Rousselet.*

*Bloc is an open-source state management library by Felix Angelov.*
