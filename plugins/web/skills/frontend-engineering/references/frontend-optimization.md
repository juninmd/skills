# React and Next.js Optimization Patterns

## Contents
- Priority order
- 1. Server Actions are public endpoints (CRITICAL)
- 2. Kill request waterfalls (CRITICAL)
- 3. Bundle size: barrels and dynamic imports (CRITICAL)
- 4. The server/client boundary (HIGH)
- 5. Re-renders: derived state and memoization (MEDIUM)
- 6. Non-urgent updates and hoisting (MEDIUM)

Open this for slow UI, a heavy bundle, or any Server Action. Fix from the top of the priority list down: one removed waterfall outweighs a hundred memoized callbacks. For App Router semantics (caching, revalidation, async request APIs) see [nextjs-app-router](nextjs-app-router.md); for measuring Core Web Vitals hand off to `performance-engineering`.

## Priority order

| Priority | Rule | Symptom that sends you here |
|---|---|---|
| CRITICAL | Authenticate and authorize inside every Server Action | a `'use server'` function mutates data |
| CRITICAL | Start independent requests together | sequential `await`s on unrelated data |
| CRITICAL | Import directly, not through barrels | dev boot or cold start slow; an icon import pulls a whole library |
| CRITICAL | Load heavy client components on demand | editor, chart, or map in the initial chunk |
| HIGH | Pass only the fields the client uses | large RSC payload, whole records in props |
| MEDIUM | Derive during render; memoize only measured pressure | effect-driven state, `useMemo` everywhere |
| MEDIUM | Mark non-urgent updates; hoist constants | typing lags while a list re-filters |

## 1. Server Actions are public endpoints (CRITICAL)

A `'use server'` function is reachable by a direct POST from anyone, not only from the form that renders it. Layout and page checks do not run for that call, and a middleware matcher may not cover it, so do not rely on them. Every action validates input, authenticates, and authorizes on its own, then mutates.

```ts
// Wrong: anyone who can reach the endpoint deletes any project
'use server'
export async function deleteProject(id: string) {
  await db.project.delete({ where: { id } })
}
```

```ts
// Right: validate, authenticate, authorize, then mutate
'use server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSession } from '@/lib/auth'   // the project's own session helper

export async function deleteProject(input: unknown) {
  const { id } = z.object({ id: z.string().uuid() }).parse(input)
  const session = await getSession()
  if (!session) return { error: 'Sign in to delete projects.' }
  const project = await db.project.findUnique({ where: { id } })
  if (project?.ownerId !== session.userId) return { error: 'Only the owner can delete this project.' }
  await db.project.delete({ where: { id } })
  revalidatePath('/projects')
}
```

- Never trust IDs, roles, or prices sent from the client; look them up server-side.
- Return expected failures as data for `useActionState`; throw only for the unexpected.
- The same rule applies to Route Handlers and any API route.

## 2. Kill request waterfalls (CRITICAL)

Each sequential `await` on independent data adds a full round trip.

```ts
// Wrong: three round trips
const user = await getUser(id)
const orders = await getOrders(id)
const plan = await getPlan(id)
```

```ts
// Right: one round trip
const [user, orders, plan] = await Promise.all([getUser(id), getOrders(id), getPlan(id)])
```

- Start a promise as early as its inputs exist; `await` it where the value is needed.
- Dependent data: fetch the parent, then fan out the children with `Promise.all(ids.map(getItem))`, never a `for … await` loop.
- In the App Router, sibling Server Components fetch in parallel. Wrap a slow one in `<Suspense>` so it streams instead of blocking the page:

```tsx
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <>
      <Header id={id} />
      <Suspense fallback={<OrdersSkeleton />}>
        <Orders id={id} />   {/* slow query streams in later */}
      </Suspense>
    </>
  )
}
```

- `Promise.all` rejects on the first failure. Use `Promise.allSettled` when the page should render the parts that succeeded (the partial state in [ui-state-design](ui-state-design.md)).

## 3. Bundle size: barrels and dynamic imports (CRITICAL)

A barrel (`index.ts` that re-exports a package or folder) makes the bundler load every module it names, even the ones you do not use.

```tsx
// Wrong: internal barrel drags every component into this route
import { DatePicker } from '@/components'
```

```tsx
// Right: import the file
import { DatePicker } from '@/components/date-picker'
```

For third-party barrels in Next.js, keep the normal import and list the package in `next.config` under `experimental.optimizePackageImports`; Next.js already applies it to a default set of popular libraries. Outside Next.js, use the package's documented subpath imports, and confirm the subpath ships types before relying on it.

```ts
// next.config.ts
export default { experimental: { optimizePackageImports: ['@acme/icons'] } }
```

Load heavy, non-critical client components on demand:

```tsx
// Wrong: the editor ships in the route's initial chunk
import { CodeEditor } from './code-editor'
```

```tsx
// Right (Next.js, inside a Client Component): loaded when rendered
'use client'
import dynamic from 'next/dynamic'
const CodeEditor = dynamic(() => import('./code-editor').then((m) => m.CodeEditor), {
  ssr: false,
  loading: () => <EditorSkeleton />,
})
```

- `ssr: false` is only allowed in Client Components. In a Server Component, move the `dynamic()` call into a small client wrapper.
- Plain React or Vite: `const CodeEditor = lazy(() => import('./code-editor'))` inside `<Suspense>`.
- Preload on intent (`onPointerEnter={() => void import('./code-editor')}`) so the click does not wait.
- Defer analytics and chat widgets until after hydration; they never belong in the critical path.

## 4. The server/client boundary (HIGH)

Everything passed from a Server Component to a Client Component is serialized into the page payload. Pass only what the client renders.

```tsx
// Wrong: 40 fields serialized to render one
const user = await getUser(id)
return <Avatar user={user} />
```

```tsx
// Right: one field crosses the boundary
const user = await getUser(id)
return <Avatar name={user.name} src={user.avatarUrl} />
```

- Push `'use client'` to the leaf that needs interactivity; render server content through `children`.
- Do not pass the same large object to several client components; pass it once or derive it on the server.
- Mark modules that read secrets with `import 'server-only'` so an accidental client import fails the build.

## 5. Re-renders: derived state and memoization (MEDIUM)

```tsx
// Wrong: extra render, and a frame where the two disagree
const [visible, setVisible] = useState<Item[]>([])
useEffect(() => setVisible(items.filter((i) => i.done === showDone)), [items, showDone])
```

```tsx
// Right: derive during render
const visible = items.filter((i) => i.done === showDone)
```

- Reset state when an identity changes with `key={id}`, not an effect that copies props into state.
- Do not wrap cheap expressions with a primitive result in `useMemo`; the dependency check costs more than the work.
- Memoize (`memo`, `useMemo`, `useCallback`) only for a measured slow render or a referentially stable prop that a memoized child or effect depends on.
- If React Compiler is enabled in the build, it memoizes automatically; check the config before adding manual memoization.
- Update from previous state with the functional form `setCount((c) => c + 1)`; pass expensive initial state as a function, `useState(() => parse(raw))`.
- Never define a component inside another component's body; it remounts on every render and loses its state.

## 6. Non-urgent updates and hoisting (MEDIUM)

```tsx
// Right: typing stays responsive; the list catches up
const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)
const results = useMemo(() => search(index, deferredQuery), [index, deferredQuery])
```

- Wrap state changes that trigger heavy renders (tab switches, filters) in `startTransition`; read `isPending` from `useTransition` for an inline indicator instead of a blocking spinner.
- Hoist static JSX, regular expressions, and lookup tables to module scope so they are not rebuilt each render.
- Validate untrusted input with the project's schema library (for example Zod) at the boundary, once.

Adapted in part from vercel-labs/agent-skills/react-best-practices (MIT, © Vercel).
