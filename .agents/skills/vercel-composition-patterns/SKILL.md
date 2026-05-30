---
name: vercel-composition-patterns
description: |
  **FRAMEWORK SKILL** - Master React component composition in Next.js and Vercel deployments.
  USE FOR: server vs. client components, component composition, streaming patterns, data fetching, server actions, React 19+ patterns.
  DO NOT USE FOR: basic React (use react-dev), frontend design (use frontend-design), performance optimization (use frontend-craftsmanship).
  INVOKES: react-dev, nextjs-dev, frontend-craftsmanship, vercel-react-best-practices.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "web"
allowed-tools: [read_file, write_file]
---

# Vercel Composition Patterns

Advanced techniques for composing React components in Next.js applications, with focus on Server Components, streaming, and the Next.js app router paradigm.

**USE FOR:**
- Designing Server Components vs. Client Components architecture.
- Implementing Server Actions and form handling patterns.
- Building streaming layouts and progressive rendering.
- Data fetching at the component level (async components).
- Client-side interactivity with use client boundaries.
- Error boundaries, suspense, and loading states.
- Composing components across server/client boundaries.
- Optimizing Largest Contentful Paint (LCP) with streaming.

**DO NOT USE FOR:**
- Basic React fundamentals (use `react-dev`).
- Visual design and UI aesthetics (use `frontend-design`).
- Performance metrics and optimization (use `frontend-craftsmanship`).
- CSS and styling (use language/framework skills).

**INVOKES:**
- `react-dev` for component basics.
- `nextjs-dev` for Next.js framework specifics.
- `frontend-craftsmanship` for performance validation.

## Core Patterns

1. **Server vs. Client Component Boundaries**
   - Server Components (default): fetch data, access databases, keep secrets.
   - Client Components (`'use client'`): interactivity, hooks, event handlers.
   - Rule: minimize `'use client'` boundary to leaf components.

2. **Async Server Components**
   ```typescript
   // Server component can be async
   export default async function BlogPost({ id }) {
     const post = await db.posts.findById(id);
     return <article>{post.content}</article>;
   }
   ```

3. **Streaming and Suspense**
   - Return `<Suspense>` boundaries for loading states.
   - Enable incremental rendering of large pages.
   - Define fallbacks for each Suspense block.

4. **Server Actions for Forms**
   - Use `'use server'` to define mutations.
   - Automatic re-validation and form reset.
   - Type-safe client→server communication.

5. **Client-Side Interactivity**
   - Compose small `'use client'` components inside Server Components.
   - Share context from server to client via props.
   - Use `useTransition` and `useOptimistic` for better UX.

6. **Error Boundaries and Error Handling**
   - `error.js` catches component-level errors.
   - `not-found.js` for 404 responses.
   - Granular error UI per route segment.

## Checklist

- [ ] Server Components used by default; `'use client'` only where needed (buttons, forms, hooks).
- [ ] Data fetching is co-located with the component that uses it.
- [ ] `<Suspense>` boundaries defined for slow data fetches with meaningful fallbacks.
- [ ] Server Actions handle form submissions and mutations.
- [ ] Error boundaries (`error.js`) catch failures gracefully.
- [ ] No data fetching in client components; use Server Actions instead.
- [ ] Props passed from server to client are serializable (no functions, dates as strings).
- [ ] Layout streaming enables LCP optimization (critical content first).
- [ ] Form validation happens on both server and client.
