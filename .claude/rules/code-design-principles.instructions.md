---
name: code-design-principles
description: "Use when refactoring for Clean Code, SOLID, DRY, KISS, YAGNI, and file or function size limits in TypeScript/React/Node.js. Triggers: clean code, SOLID, DRY, KISS, YAGNI, refactor."
applyTo: '**/*.{ts,tsx,js,jsx}'
paths:
  - "**/*.{ts,tsx,js,jsx}"
trigger: glob
globs: "**/*.{ts,tsx,js,jsx}"
---

# Rule: Code Design Principles

> **Mission:** Simple is best. Small files. Single responsibility. No premature optimization.

## Mandatory Principles

| Principle | Definition | When to Apply |
|-----------|------------|---------------|
| **KISS** | Keep It Simple, Stupid | Always — prefer obvious over clever |
| **DRY** | Don't Repeat Yourself | When repeated 3+ times |
| **YAGNI** | You Aren't Gonna Need It | Never add "just in case" code |
| **SOLID** | Single Responsibility | Every module/function has one reason to change |
| **Clean Code** | Readable without comments | Intent revealed by naming |

## Practical Rules

### 1. File Size Limits (ENFORCED)

| File Type | Max Lines |
|-----------|-----------|
| Source files | 200 lines |
| Functions/Methods | 25 lines |
| Test files | 100 lines per `describe` block |

**Why?** Files >200 lines are harder to test, review, and understand. Split by feature or responsibility.

### 2. Nesting Depth (MAX 3 LEVELS)

```typescript
// ❌ 4+ nesting levels
function processOrder(order: Order) {
  if (order.isValid) {
    for (const item of order.items) {
      if (item.inStock) {
        if (item.quantity > 0) {
          // Deep nesting - extract this
        }
      }
    }
  }
}

// ✅ Guard clauses + early returns = max 2 levels
function processOrder(order: Order) {
  if (!order.isValid) return;

  for (const item of order.items) {
    if (!item.inStock || item.quantity <= 0) continue;
    processItem(item);
  }
}
```

### 3. Function Parameters (MAX 5)

```typescript
// ❌ 6+ parameters
function createUser(
  name: string,
  email: string,
  age: number,
  role: string,
  avatar: string,
  preferences: Preferences
) {}

// ✅ Typed object for many params
function createUser(input: CreateUserInput) {}

interface CreateUserInput {
  name: string;
  email: string;
  age: number;
  role: string;
  avatar: string;
  preferences: Preferences;
}
```

### 4. Feature Slices (Colocation)

```
features/
├── checkout/
│   ├── checkout-page.tsx       # 50 lines
│   ├── checkout-service.ts     # 80 lines
│   ├── checkout-types.ts       # 30 lines
│   ├── use-checkout.ts         # 25 lines
│   └── checkout.test.ts        # 100 lines
```

**NOT:** `components/checkout-button.tsx`, `hooks/use-checkout.ts`, `services/checkout-api.ts`

### 5. Clean Architecture Layers

```
src/
├── features/           # Business logic (use-cases, entities)
├── lib/               # Application-wide utilities
├── components/        # Shared UI (dumb components)
├── hooks/             # Shared stateful logic
└── stores/            # Global state
```

**Rule:** Dependencies flow inward. Inner layers know nothing about outer layers.

## Anti-Patterns

- ❌ `utils/`, `helpers/`, `common/` without domain context
- ❌ `index.ts` files that re-export everything
- ❌ Inheritance for simple composition (use `extend` or `mixin` pattern instead)
- ❌ Business logic in React components (extract to hooks/services)
- ❌ API calls directly in components (use service layer)

## Refactoring Triggers

| Symptom | Action |
|---------|--------|
| File > 200 lines | Split by feature/responsibility |
| Function > 25 lines | Extract intention-revealing helpers |
| Nesting > 3 levels | Guard clauses, early returns, extract function |
| 3+ similar functions | Extract shared utility |
| Component with > 5 props | Consider compound components |

## SOLID Quick Reference

- **S**: One responsibility per class/function
- **O**: Open for extension, closed for modification
- **L**: Subtypes substitutable for base types
- **I**: Small, focused interfaces
- **D**: Depend on abstractions, not concretions
