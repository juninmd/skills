---
name: naming-conventions
description: "Use when naming files, components, hooks, stores, routes, or other source artifacts in TypeScript, React, and Node.js. Triggers: naming convention, file naming, hook naming, component naming, route naming."
applyTo: '**/*.{ts,tsx,js,jsx,json,md}'
paths:
  - "**/*.{ts,tsx,js,jsx,json,md}"
trigger: glob
globs: "**/*.{ts,tsx,js,jsx,json,md}"
---

# Rule: Naming Conventions

> **Mission:** Intent-revealing names. Consistent patterns. Zero ambiguity.

## Files & Directories

| Type | Convention | Example |
|---|---|---|
| React Components | `kebab-case.tsx` | `user-profile.tsx` |
| Hooks | `use-kebab-case.ts` | `use-auth-session.ts` |
| Services / Utilities | `kebab-case.ts` | `format-currency.ts` |
| Types / Interfaces | `kebab-case.ts` | `api-response.ts` |
| Constants | `kebab-case.ts` | `http-status.ts` |
| Test Files | `.test.ts` suffix | `use-auth.test.ts` |
| Directories | `kebab-case/` | `user-profile/` |

## TypeScript Identifiers

```typescript
// Components: PascalCase export
export function UserProfile() {}
export function UserProfileCard() {}

// Hooks: always `use` prefix
export function useAuthSession() {}
export function useCheckoutForm() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT_MS = 5000;

// Booleans: is/has/can/should prefix
const isLoading = false;
const hasPermission = true;
const canRetry = false;

// Event handlers: on prefix; implementations: handle prefix
<button onClick={onSubmit} />
function handleSubmit() {}
```

## State Stores (Zustand)

```typescript
// File: src/stores/cart-store.ts
export const useCartStore = create<CartState>()(...);

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
}
```

## REST API Routes

```
GET    /api/users        → getUsers()
GET    /api/users/:id    → getUserById(id)
POST   /api/users        → createUser(data)
PUT    /api/users/:id    → updateUser(id, data)
DELETE /api/users/:id    → deleteUser(id)
```

## Environment Variables

```bash
DATABASE_URL=postgresql://...
API_SECRET_KEY=...
NEXT_PUBLIC_API_URL=https://api.example.com
```

Always `UPPER_SNAKE_CASE`. Public browser variables prefixed with `NEXT_PUBLIC_` / `VITE_`.

## Anti-Patterns

- ❌ `utils/`, `helpers/`, `common/` without domain context
- ❌ `Component1.tsx`, `test.tsx`, `module.ts`
- ❌ `data`, `info`, `stuff`, `temp` as variable names
- ❌ Mixing naming conventions within the same file
- ❌ Underscores in file names (`user_profile.tsx`)

## Rules

1. No underscores in file names — use `kebab-case`
2. PascalCase for component exports and types only
3. `use` prefix mandatory for all hooks
4. `on` prefix for event handler props; `handle` for implementations
5. Always define types/interfaces — avoid `any`
