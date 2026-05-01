---
name: nextjs-dev
description: "Async params, cookies(), turbopack. Triggers: turbopack."
argument-hint: "[context] [options]"
---

# Next.js Development (16+)

> React 19. App Router. Turbopack. Asynchronous APIs. Uncached by Default.
>
> Verified against Next.js 16.2.4 official docs on 2026-05-01.

## Core Principles

1.  **App Router Only**: Use the `app/` directory. The Pages router is considered legacy.
2.  **React 19 Native**: Fully leverage React 19 features including `useActionState`, `useFormStatus`, and `use()`.
3.  **Uncached by Default**: Fetch requests, GET route handlers, and client navigations are no longer cached by default in Next.js 15. Explicitly opt-in to caching where needed.
4.  **Asynchronous Request APIs**: APIs that depend on the request (like `cookies`, `headers`, `params`, `searchParams`) are now asynchronous and must be `await`ed.
5.  **Turbopack**: Used by default for faster development builds (`next dev --turbopack`).

## Current Guidance for Next.js 16

### Async Request APIs (Breaking Change)
Previously synchronous APIs are now async and must be awaited.

```typescript
// ✅ Correct (Next.js 16+)
import { cookies, headers } from 'next/headers';

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  // Await the params
  const params = await props.params;
  const slug = params.slug;

  // Await cookies and headers
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  const headersList = await headers();
  const userAgent = headersList.get('user-agent');

  return <div>{slug}</div>;
}
```

If used in a synchronous component (e.g., a Client Component), use React's `use()` hook to unwrap the Promise:

```typescript
'use client';
import { use } from 'react';

export default function ClientPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  return <div>{params.slug}</div>;
}
```

### Caching Changes

In Next.js 15, `fetch` requests and `GET` Route Handlers are **uncached by default**.

```typescript
// ❌ Uncached by default
const res = await fetch('https://api.example.com/data');

// ✅ Opt-in to caching
const res = await fetch('https://api.example.com/data', { cache: 'force-cache' });
```

For Route Handlers, use the segment config to opt-in:

```typescript
// app/api/route.ts
export const dynamic = 'force-static'; // Opt-in to caching

export async function GET() {
  return Response.json({ data: 'cached' });
}
```

### React 19 Forms

Use `useActionState` (replacing `useFormState`) for handling form actions and server responses.

```typescript
'use client';
import { useActionState } from 'react';
import { createPost } from '@/app/actions';

export function CreatePostForm() {
  const [state, action, isPending] = useActionState(createPost, null);

  return (
    <form action={action}>
      <input type="text" name="title" />
      <button disabled={isPending}>Submit</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}
```

## Routing and Architecture

| Concept | Pattern |
|---------|---------|
| Layouts | `layout.tsx` (Wraps pages, state preserved on navigation) |
| Pages | `page.tsx` (Unique UI for a route) |
| Loading | `loading.tsx` (React Suspense boundary) |
| Error | `error.tsx` (React Error boundary) |
| API | `route.ts` (Next.js Route Handlers) |

## Performance Checklist

- [ ] Fetch data in Server Components where possible.
- [ ] Explicitly opt-in to caching (`force-cache`) for static data.
- [ ] Use `<Image>` (`next/image`) for optimized images.
- [ ] Use `<Link>` (`next/link`) for client-side navigation.
- [ ] Ensure all `params`, `searchParams`, `cookies`, and `headers` are correctly awaited.
- [ ] Use Server Actions for data mutations instead of manual API routes.

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19)
