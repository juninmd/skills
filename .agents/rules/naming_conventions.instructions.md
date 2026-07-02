---
name: naming-conventions
description: Naming standards for systems and files.
applyTo: '**/*.{py,js,ts,tsx,sh,go,java,kt,md}'
---

# Rule: Naming Conventions

## Systems
- System names should be simple, accessible, and easy to understand across teams.
- **Mandatory suffixes** to identify service type:
  - `-api` — REST/GraphQL services
  - `-worker` — async processing/queue consumers
  - `-cron` — scheduled jobs
  - `-frontend` — web interface

## Code
- **Python**: `snake_case` for variables and functions; `PascalCase` for classes; `UPPER_SNAKE_CASE` for constants.
- **JavaScript/TypeScript**: `camelCase` for variables and functions; `PascalCase` for components/classes.
- **Frontend Web (files and folders)**: use `kebab-case` for directories and file names (`checkout-form.tsx`, `user-menu.tsx`, `auth-store.ts`).
- **Frontend Web (components)**: export React components in `PascalCase`, even when the file name is `kebab-case`.
- **Hooks**: mandatory `use` prefix in `camelCase` (`useCheckoutForm`, `useAuthSession`).
- **Stores**: explicit naming with `-store` suffix for files and `Store` suffix for types/interfaces when needed (`cart-store.ts`, `AuthStore`).
- **Features**: align feature name, route, and folder whenever possible (`billing-history/`, `/billing-history`, `BillingHistoryPage`).
- **Avoid generic names**: do not create directories or modules like `utils`, `helpers`, `common`, or `misc` without explicit domain context.
- **Environment variables**: always `UPPER_SNAKE_CASE` (for example, `DATABASE_URL`, `SONAR_TOKEN`).


