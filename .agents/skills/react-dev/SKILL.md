---
name: react-dev
description: |
  **FRONTEND SKILL** - Build modern web apps with React 19 and Server Components.
  USE FOR: React functional components, Server Components (RSC), React 19 hooks (use, useActionState, useOptimistic), Server Actions, Zustand state management, strict TS props.
  DO NOT USE FOR: legacy Class components, non-React frameworks, React versions older than 18.
  INVOKES: react, react-dom, zustand, typescript compiler.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "React 19+, TypeScript"
allowed-tools: [read_file, write_file, replace]
---

# React Development (React 19+)

Expert methodology for building high-performance, type-safe web applications using React 19's server-first architecture and modern hook patterns.

**USE FOR:**
- Implementing async data fetching with Server Components and the `use()` hook.
- Managing complex form states and transitions with `useActionState`.
- Designing optimistic UI updates with `useOptimistic`.
- Configuring modular client state with Zustand.
- Enforcing strict TypeScript standards for component interfaces.

**DO NOT USE FOR:**
- Purely static sites without interaction (consider Next.js static export).
- Projects requiring legacy Redux or Context-heavy state without a proven need.

**INVOKES:**
- `react`, `react-dom`, `typescript`, `vitest` tools.

## Methodology and Guidelines
Implementation details for principles, standards, and state are documented in:
1. [Core Principles & RSC](references/react-core.md)
2. [Standards & State Management](references/react-standards.md)

## Core Principles
1. **Server First:** Default to RSC; minimize the client bundle size.
2. **Functional Purity:** Keep components functional, immutable, and typed.
3. **Small Surface:** Maintain components under 100 lines to ensure maintainability.

## Checklist
- [ ] Component is functional and strictly typed (no `any`).
- [ ] Data fetching utilizes Server Components or the `use()` hook.
- [ ] Form mutations are implemented via Server Actions.
- [ ] UI provides explicit loading states through Suspense boundaries.
- [ ] Logic is sharded if component exceeds the 100-line guideline.
