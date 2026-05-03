---
name: error-handling
description: "Use when designing typed errors, result patterns, or graceful degradation. Triggers: error handling, typed error, result pattern."
applyTo: '**/*.{ts,tsx,js}'
paths:
  - "**/*.{ts,tsx,js}"
trigger: glob
globs: "**/*.{ts,tsx,js}"
---

# Rule: Error Handling

**Typed errors (mandatory):**
```typescript
export class AppError extends Error {
  constructor(message, code, statusCode = 500, context?: Record<string, unknown>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
  }
}
```

**Preserve cause:**
```typescript
// ✅ Good
throw new AppError('Failed', 'FAILED', 500, { cause: err instanceof Error ? err.message : String(err) });

// ❌ Bad — context lost
throw new Error('Failed');
```

**Result pattern for expected failures:**
```typescript
type Result<T, E = AppError> = { success: true; data: T } | { success: false; error: E };
```

**Anti-patterns:**
- `catch (e) {}` — silent swallowing
- `throw new Error('string')` without code/context
- `any` in catch blocks — use `unknown`

**Rules:**
1. Never swallow exceptions
2. Include correlation IDs in error context
3. Log once at boundaries
4. Retry with circuit breaker for transient failures