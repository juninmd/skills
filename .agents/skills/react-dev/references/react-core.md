# React 19 Core Principles and Server Components

Foundational rules for modern React development.

## 1. Core Principles
- **Server-First:** All components are Server Components by default.
- **Async in Client:** Use the `use()` hook to unwrap promises in client components.
- **React Compiler:** Rely on auto-memoization; use `useMemo` sparingly.
- **Mutations:** Use Server Actions with `useActionState` and `useOptimistic`.

## 2. Server Components (RSC)
- Fetch data directly in async server components.
- Avoid `"use client"` unless needing state (`useState`), effects (`useEffect`), or browser APIs.

## 3. Client Component Patterns
```typescript
"use client";
import { use } from 'react';

function UserProfile({ promise }: { promise: Promise<User> }) {
  const user = use(promise); // Suspense-aware unwrap
  return <div>{user.name}</div>;
}
```
