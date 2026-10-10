# Next.js App Router

Open this when the repo has an `app/` directory (App Router). For a `pages/` directory only, the server/client split below does not apply — data fetching goes through `getServerSideProps` / `getStaticProps` instead.

## 1. Server vs client boundaries
- Every file under `app/` is a **Server Component** by default. `"use client"` at the top of a file marks that file and everything it imports as client code.
- The directive is a boundary, not a per-component switch: a client file cannot import a server component, but it can *render* one passed through `children` or another prop. Use that to keep a server-rendered subtree inside a client shell.
- Push `"use client"` down the tree. Marking the layout or page client-side drags the whole subtree into the bundle.
- Server Components can be `async` and may read the database, filesystem, or secrets directly. Client Components cannot — anything referenced there ships to the browser.
- Only serializable values cross the boundary. Functions, class instances, `Date` methods, and symbols passed as props from a server to a client component fail at render time. Server Actions are the exception: they are passed as references, not code.

## 2. How server components change data flow
- Fetch where the data is used, not at the top and drilled down. Requests deduplicate within a render pass, so two components fetching the same resource cost one call.
- There is no client-side loading state for server-fetched data. Streaming replaces it: wrap the slow subtree in `<Suspense>` or add `loading.tsx` for the route segment.
- `error.tsx` must be a Client Component; it catches render errors for its segment. `not-found.tsx` handles `notFound()`.
- Request APIs are async in Next.js 16: `await params`, `await searchParams`, `await cookies()`, `await headers()`. Sync access is removed; migrate with `npx @next/codemod@canary next-async-request-api .`
- Check `cacheComponents` in `next.config` first. On (enabled by the recommended `create-next-app` defaults): data is dynamic by default; cache with `use cache` plus `cacheLife()`; wrap uncached reads in `<Suspense>`. Off: `fetch` is uncached by default; opt in with `cache: 'force-cache'` or `next.revalidate`, or segment `dynamic`/`revalidate`. Only when off does reading `cookies()` or `searchParams` make the route dynamic.
- Mutations go through Server Actions, followed by `revalidatePath`, `revalidateTag(tag, 'max')`, or `updateTag(tag)` (Server Actions only, for read-your-writes). The one-argument `revalidateTag(tag)` is deprecated. Without a revalidate or update call the UI keeps showing cached data.
- Client state (context, stores) does not exist during the server render. Provider components need `"use client"` and belong as high as possible while still being client-only.

## 3. Route conventions worth checking
- `layout.tsx` persists across navigations and does not re-run; per-navigation work belongs in `page.tsx` or `template.tsx`.
- Route groups `(name)` organize without affecting the URL. Parallel routes `@slot` and intercepting routes `(.)` change what a layout receives.
- Metadata is exported (`metadata` or `generateMetadata`), never set by mutating the document.
