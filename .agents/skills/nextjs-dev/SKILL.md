---
name: nextjs-dev
description: "Next.js Development for Implementing route-based, Managing asynchronous, Leveraging React via next dev."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "React 19, Next.js 15/16"
allowed-tools: [read_file, write_file, replace]
---

# Next.js Development (16+)

Expert methodology for building high-performance web applications using Next.js 16, React 19, and the App Router architecture.

**USE FOR:**
- Implementing route-based layouts and nested segments.
- Managing asynchronous params, headers, and cookies in Server Components.
- Leveraging React 19 features like `useActionState` and Server Actions.
- Optimizing data fetching with explicit caching strategies.
- Configuring fast development environments with Turbopack.

**DO NOT USE FOR:**
- Maintenance of legacy `pages/` directory projects.
- Static sites without a React requirement.

**INVOKES:**
- `next dev`, `next build`, `next start` CLI tools.

## Methodology and Guidelines
Implementation details for core principles, async APIs, and patterns are documented in:
1. [Core Principles & Async APIs](references/nextjs-core.md)
2. [Caching & Form Patterns](references/nextjs-patterns.md)

## Core Principles
1. **RSC First:** Default to Server Components to minimize client bundle size.
2. **Async Integrity:** Always await request-based APIs (`cookies`, `headers`, `params`).
3. **Explicit Caching:** Opt-in to `force-cache` for data that should persist.

## Checklist
- [ ] Ensure all request APIs (`params`, `cookies`) are correctly awaited.
- [ ] Use `useActionState` for all client-side form handling.
- [ ] Verify that data fetching is happening in Server Components where possible.
- [ ] Validate responsive layouts and accessibility across primary routes.
