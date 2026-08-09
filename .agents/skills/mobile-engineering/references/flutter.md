# Flutter Standards

Best practices, patterns, and verification checklists for building modern, high-performance Flutter applications.

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

## 4. Implementation Checklist

### Widgets
- [ ] `const` constructors on all static widgets.
- [ ] Proper `Key` usage on list items.
- [ ] Reusable widgets extracted to separate files.

### State
- [ ] Immutable state objects enforced.
- [ ] Granular rebuilds using `select()`.
- [ ] Loading and error states handled in UI.

### Navigation & Networking
- [ ] GoRouter with typed routes and auth guards.
- [ ] Deep linking support configured.
- [ ] Dio/Networking with global error interceptors.

### Testing
- [ ] Unit tests for business logic (Bloc/Notifiers).
- [ ] Widget tests for UI components.
- [ ] Integration tests for critical user flows.
