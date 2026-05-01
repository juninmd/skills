---
name: workspace-nav
description: "Use when navigating a codebase, locating files, or reasoning about project structure efficiently. Triggers: workspace navigation, find files, project structure, codebase navigation, locate symbol."
applyTo: '**/*.{ts,tsx,js,jsx,json,md}'
---

# Rule: Workspace Navigation

> **Mission:** Orient fast. Navigate with intent. Read only what you need.

## Project Structure (Modern JS/TS)

```
src/
├── app/                    # Next.js App Router or Nuxt pages
├── components/             # Shared UI (PascalCase filenames)
│   ├── ui/                 # Primitives: Button, Input, Dialog
│   └── features/           # Feature-specific components
├── lib/                    # Utilities, clients, config
├── hooks/                  # Custom hooks (use- prefix)
├── stores/                 # State: Zustand / Pinia
├── services/               # API clients, external integrations
└── types/                  # TypeScript types/interfaces

tests/
├── unit/
├── integration/
└── e2e/
```

## Feature-Slice Colocation (Preferred)

```
features/
├── checkout/
│   ├── checkout-page.tsx
│   ├── checkout-service.ts
│   ├── checkout-types.ts
│   ├── use-checkout.ts
│   └── checkout.test.ts
└── auth/
    ├── auth-page.tsx
    ├── auth-service.ts
    └── use-auth.ts
```

Avoid spreading a feature across `components/`, `hooks/`, `services/` directories.

## Navigation Rules

1. **Show `pwd`** before suggesting commands with relative paths
2. **Limit tree depth** — `tree -L 2` to avoid massive output
3. **Validate before `mv`** — confirm destination before renaming
4. **Read bounded** — use `head`, `tail`, or line ranges for large files
5. **Search before read** — `rg` for a symbol before reading the whole file

## Efficient Search Patterns

```bash
# Find a file by name
rg --files | grep user-profile

# Find a symbol across the codebase
rg -n "useAuthSession" src --type ts

# List recently changed files
git diff --name-only HEAD~5

# Understand a module's exports
rg "^export" src/lib/auth.ts
```
