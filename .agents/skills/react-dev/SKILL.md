---
name: react-dev
description: "Server Components, useActionState, use(). Triggers: suspense."
argument-hint: "[context] [options]"
applyTo: '**/*.{tsx,jsx}'
---
---

# React Development (React 19+)

> Server-First. Functional. Immutable. Typed. < 100 Lines per component.

## Core Principles

| Pattern | Default |
|---------|---------|
| **Memoization** | React Compiler (auto-memoization) |
| **Data fetching** | Server Components (no `useEffect`) |
| **Mutations** | Form Actions + `useActionState` |
| **Async in client** | `use()` hook (replaces `useEffect + useState`) |
| **Optimistic updates** | `useOptimistic()` |
| **Loading states** | `Suspense` boundaries |

## Server Components (Default)

All components are Server Components unless interactivity is strictly required.

```typescript
// ✅ Server Component — no "use client"
export default async function UsersPage() {
  const users = await db.users.findMany();
  return <UserList users={users} />;
}
```

Add `"use client"` **only** when needed: `onClick`, `useState`, `useEffect`, browser APIs.

## Client Component Patterns

```typescript
// ✅ React 19: use() hook for async data
"use client";
function UserProfile({ promise }: { promise: Promise<User> }) {
  const user = use(promise); // Suspense-aware
  return <div>{user.name}</div>;
}

// ✅ React 19: Form Actions
async function updateUser(formData: FormData) {
  "use server";
  await db.users.update({ name: formData.get('name') });
}
```

## File Structure

```
components/
  UserCard/
    UserCard.tsx        # < 100 lines — Server by default
    UserCard.client.tsx # < 100 lines — only if interactive
    UserCard.test.tsx
    index.ts
```

## State Management

| Scope | Tool |
|-------|------|
| Server state | React Server Components + `cache()` |
| Client local | `useState` |
| Client global | Zustand (< 100 lines per slice) |
| Forms | `useActionState` + Server Actions |
| Optimistic | `useOptimistic()` |

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler"
  }
}
```

**Rules:**
- ✅ Zero `any` type (use `unknown` for truly unknown values)
- ✅ Explicit types for all function parameters
- ✅ Use `void` return type for callbacks (not `any`)
- ✅ Never use boxed types (`Number`, `String`, `Boolean`)

## Performance

- **Memoize sparingly**: Profiler first, `useMemo`/`useCallback` only when proven expensive
- **Code split**: `React.lazy` + `Suspense` at route level
- **Images**: `next/image` with `loading="lazy"` + `sizes`
- **Server-render**: Move expensive computation to Server Components

## Checklist

- [ ] Component < 100 lines (shard to `.client.tsx` if needed)
- [ ] Props strictly typed with `interface` (no `any`)
- [ ] No `useEffect` for data fetching (use Server Components or `use()`)
- [ ] Form mutations use Server Actions
- [ ] Suspense boundaries around async client components
- [ ] Tests cover all user interactions

## References

- [React Official Documentation](https://react.dev)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [Server Components Guide](https://react.dev/reference/rsc/server-components)
- [useActionState Hook](https://react.dev/reference/react/useActionState)
- [use Hook](https://react.dev/reference/react/use)
