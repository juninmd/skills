# Flutter Best Practices and Patterns

Guidelines for building modern, high-performance Flutter applications.

## 1. Widget Optimization
- **Const Constructors:** Use `const` wherever possible to prevent rebuilds.
- **Keys:** Use `ValueKey` or `ObjectKey` for list items and dynamic children.
- **ConsumerWidget:** Prefer `ConsumerWidget` (Riverpod) over `StatefulWidget` for state access.

## 2. State Management
- **Riverpod:** Preferred for dependency injection and simple state (Providers, Notifiers).
- **Bloc/Cubit:** Use for complex, event-driven workflows and cross-cutting logic.
- **Immutability:** Never mutate state directly; always create new instances.
- **Granularity:** Use `select()` to minimize rebuilds to specific fields.

## 3. Performance and Layout
- **Target:** Maintain < 16ms frame time for 60fps responsiveness.
- **RepaintBoundary:** Isolate complex animations to prevent broad repaints.
- **Lazy Loading:** Use `ListView.builder` for long lists.
- **Isolates:** Offload heavy CPU work using `compute()`.
- **Spacing:** Follow an 8pt increment grid (8, 16, 24, 32).
