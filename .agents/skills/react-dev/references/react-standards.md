# React Development Standards and State

Guidelines for state management, TypeScript, and performance.

## 1. State Management Strategy
- **Server State:** RSC + `cache()`.
- **Client Local:** `useState`.
- **Client Global:** Zustand (modular slices).
- **Forms:** `useActionState` + Server Actions.

## 2. TypeScript Rules
- **No `any`:** Use `unknown` or explicit types.
- **Strict Params:** All function parameters must have explicit types.
- **Callback Returns:** Use `void` for callback return types, never `any`.
- **Interfaces:** Prefer `interface` over `type` for props.

## 3. Performance
- **Profiling:** Use the React Profiler before adding manual memoization.
- **Code Splitting:** `React.lazy` + `Suspense` at logical boundaries.
- **Server Offloading:** Move heavy computation to Server Components.

## 4. Components Layout
Keep components < 100 lines. Shard logic into `.client.tsx` or hooks if limits are exceeded.
