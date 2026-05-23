# Next.js 16+ Core Principles and Async APIs

Foundational rules for modern Next.js development using the App Router.

## 1. Core Principles
- **App Router Only:** Use the `app/` directory exclusively; Pages router is legacy.
- **React 19 Native:** Utilize `useActionState`, `useFormStatus`, and `use()`.
- **Uncached by Default:** Explicitly opt-in to caching for fetch and GET handlers.
- **Turbopack:** Recommended for development performance.

## 2. Asynchronous Request APIs (Breaking Change)
APIs depending on the request (cookies, headers, params) are now async.

```typescript
// Server Component
export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const cookieStore = await cookies();
  return <div>{params.slug}</div>;
}

// Client Component
export default function ClientPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params); // Unwrap with use()
  return <div>{params.slug}</div>;
}
```
