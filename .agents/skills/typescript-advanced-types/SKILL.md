---
name: typescript-advanced-types
description: "TypeScript Advanced Types for Designing generic, Building type-safe, Implementing type-level via validating-typescript, developing-typescript."
license: MIT
metadata:
  version: 1.0.0
  token_budget_exception: "Slight overage preserves advanced type examples and constraints."
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# TypeScript Advanced Types

Expert-level type system techniques for building robust, type-safe abstractions. Covers generics, type inference, conditional types, and gradual typing strategies.

**USE FOR:**
- Designing generic abstractions with proper constraints.
- Building type-safe APIs using utility types and branded types.
- Implementing type-level computations (conditional types, mapped types).
- Improving type inference and reducing `any` usage.
- Creating strongly-typed Redux, GraphQL, or form solutions.
- Extracting and transforming types at compile-time.
- Gradual typing: migrating large codebases from `any` → strict.
- Debugging type errors and understanding type distributions.

**DO NOT USE FOR:**
- Basic TypeScript config or tooling (use `validating-typescript`).
- Runtime JavaScript optimization (use `developing-node`).
- Testing strategies (use `test-driven-development`).

**INVOKES:**
- `validating-typescript` for linting and config.
- `developing-typescript` for day-to-day patterns.
- `test-driven-development` for type-level validation.

## Core Techniques

1. **Generics with Constraints**
   ```typescript
   // Restrict what types can be passed
   function merge<T extends object, U extends object>(a: T, b: U): T & U { ... }
   
   // Require specific properties
   function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] { ... }
   ```

2. **Conditional Types (Type-Level If/Else)**
   ```typescript
   type IsString<T> = T extends string ? true : false;
   type Flatten<T> = T extends Array<infer U> ? U : T;
   type Prettify<T> = { [K in keyof T]: T[K] };
   ```

3. **Mapped Types (Transform Property Types)**
   ```typescript
   type Readonly<T> = { readonly [K in keyof T]: T[K] };
   type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
   ```

4. **Type Inference with `infer`**
   - Extract return types: `ReturnType<T>`.
   - Extract parameter types: `Parameters<T>`.
   - Extract Promise resolve types: `Awaited<T>`.

5. **Branded/Opaque Types (Compile-Time Safety)**
   ```typescript
   type UserId = string & { readonly __brand: 'UserId' };
   const id = 'abc' as UserId; // Must explicitly cast
   ```

6. **Recursive & Self-Referencing Types**
   - JSON structures, tree nodes, linked lists.
   - Use `extends` to limit recursion depth and prevent infinite types.

## Checklist

- [ ] All generic functions have constraints (`T extends ...`); no unconstrained `T`.
- [ ] Type inference is maximized: avoid explicit type args where possible (`T = T extends ? : `).
- [ ] Utility types (Pick, Omit, Record, Partial) are used instead of manual re-typing.
- [ ] `any` is eliminated or justified with comments (legacy code, external types).
- [ ] Complex types are extracted to named type aliases for readability.
- [ ] Conditional types are used for computed/computed type transformations.
- [ ] Branded types protect invariants (UserId vs string, etc.).
- [ ] Type errors are readable: consider `as const` for literal inference.
- [ ] Recursive types have explicit depth limits (no `[T extends X ? U : T]` without bound).
