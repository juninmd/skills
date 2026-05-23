# Next.js Caching and Form Patterns

Guidelines for data management and interaction in Next.js 16+.

## 1. Caching Strategy
Next.js 15+ fetch requests are uncached by default.
- **Opt-in:** `fetch(url, { cache: 'force-cache' })`.
- **Route Segment:** `export const dynamic = 'force-static'`.

## 2. React 19 Forms (useActionState)
Replace `useFormState` with `useActionState` for server actions.

```typescript
'use client';
import { useActionState } from 'react';

export function Form() {
  const [state, action, isPending] = useActionState(serverAction, null);
  return (
    <form action={action}>
      <button disabled={isPending}>Submit</button>
    </form>
  );
}
```

## 3. Routing Architecture

| File | Role |
|------|------|
| `layout.tsx` | UI shared across routes; state preserved. |
| `page.tsx` | Route-specific UI. |
| `loading.tsx` | Automatic Suspense boundary. |
| `error.tsx` | Automatic Error boundary. |
| `route.ts` | Backend Route Handlers. |
