# Code Simplification

Open when refactoring working code for clarity and maintainability without altering observable behavior, inputs, outputs, error conditions, or performance.

## Contents

- Invariant Principles of Simplification
- Triage: When to Simplify vs. When to Leave Intact
- Concrete Complexity Patterns and Refactors
- Step-by-Step Simplification Loop
- Traps and Over-Simplification Warnings
- Verification Gate

## Invariant Principles of Simplification

Simplification improves legibility, maintainability, and debuggability for future engineers. It is not an exercise in golf-style line-count reduction:

1. **Exact Behavioral Equivalence:** All return values, error types, thrown exceptions, side effects, I/O sequencing, and edge cases must remain strictly identical.
2. **Respect Codebase Idioms:** Conform to existing project conventions (`AGENTS.md`, linter settings, directory patterns). Never introduce bespoke personal idioms.
3. **Local Comprehension:** A function or module is genuinely simplified if an engineer unfamiliar with the code grasps its purpose and flow faster than in the original version.
4. **Isolated Increments:** Refactor in single, focused atomic steps verified by tests. Never combine semantic bug fixes or new features with simplification passes.

## Triage: When to Simplify vs. When to Leave Intact

| Signal | Action | Rationale |
|---|---|---|
| Deeply nested `if`/`else` trees (3+ levels) | Simplify via guard clauses / early returns | Linear code paths reduce cyclomatic cognitive load |
| Long function doing multiple lifecycle jobs | Extract single-responsibility helpers | Isolates side effects from pure calculations |
| Redundant intermediate state variables | Inline or eliminate temporary assignments | Reduces variable scope tracking |
| Hot path with verified benchmark constraints | Leave intact | Compiler or runtime optimizations often depend on specific shapes |
| Code scheduled for near-term deletion/replacement | Leave intact | Avoid spending review cycles on throwaway components |
| Unclear or uncharacterized legacy logic | Add characterization tests first | Never simplify code whose contracts you do not fully comprehend |

## Concrete Complexity Patterns and Refactors

### Guard Clauses over Nested Conditionals

```typescript
// Before: deeply nested indentation
function processOrder(order: Order, user: User) {
  if (user.isActive) {
    if (order.items.length > 0) {
      if (!order.isProcessed) {
        return execute(order);
      } else {
        throw new Error("Already processed");
      }
    } else {
      throw new Error("Empty order");
    }
  } else {
    throw new Error("Inactive user");
  }
}

// After: linear early exits
function processOrder(order: Order, user: User) {
  if (!user.isActive) throw new Error("Inactive user");
  if (order.items.length === 0) throw new Error("Empty order");
  if (order.isProcessed) throw new Error("Already processed");

  return execute(order);
}
```

### Clarifying Boolean Expressions

Decompose compound, impenetrable boolean conditions into descriptively named variables:

```typescript
// Before: opaque condition
if (user.role === 'admin' && user.permissions.includes('billing') && !account.isFrozen && (account.balance > 0 || account.hasOverdraft)) {
  // ...
}

// After: self-documenting intent
const canAuthorizeBilling = user.role === 'admin' && user.permissions.includes('billing');
const isAccountCallable = !account.isFrozen && (account.balance > 0 || account.hasOverdraft);

if (canAuthorizeBilling && isAccountCallable) {
  // ...
}
```

### Table Dispatch over Repetitive Switch/Else Branches

Replace sprawling `switch` or `else if` ladders that map inputs directly to handlers with structured lookup tables or Maps:

```typescript
// Replace repeated case branching with a mapped registry
const ACTION_HANDLERS: Record<string, (payload: EventPayload) => Promise<void>> = {
  created: handleCreated,
  updated: handleUpdated,
  archived: handleArchived,
};

const handler = ACTION_HANDLERS[event.type];
if (handler) {
  await handler(event.payload);
}
```

## Step-by-Step Simplification Loop

1. **Verify Baseline Tests:** Ensure all unit and integration tests covering the target file pass before touching code (`pnpm test <file>`).
2. **Identify One Target Complexity:** Choose one specific function, branch, or naming problem.
3. **Apply Minimal Surgical Edit:** Restructure only the targeted lines. Avoid adjacent opportunistic refactoring.
4. **Execute Verification:** Run the scoped test suite immediately. Confirm no regressions.
5. **Inspect the Diff:** Ensure no unintended semantic changes, dropped log lines, or altered exception messages were introduced.

## Traps and Over-Simplification Warnings

- **Clever One-Liners:** Replacing a 4-line readable loop with an inscrutable chained `.reduce()` or regex is not simplification.
- **Accidental Type Broadening:** Converting strict types to loose types (`any` or wide unions) to make code "simpler" breaks compile-time safety.
- **Swallowed Error Specificity:** Merging distinct catch blocks into a generic `catch (e)` obscures failure triage and root-cause investigation.

## Verification Gate

- [ ] All pre-existing unit and integration tests pass without modifying test assertions.
- [ ] No public function, class, or method signature was broken or modified.
- [ ] Error messages, HTTP status codes, and exception classes remain strictly identical.
- [ ] Linter and typechecker run clean without added suppression comments.
