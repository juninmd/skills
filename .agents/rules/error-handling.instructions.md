---
name: error-handling
description: "Use when designing typed errors, error propagation, fallback behavior, or graceful degradation in TypeScript and Node.js. Triggers: error handling, typed error, result pattern, graceful degradation, fallback."
applyTo: '**/*.{ts,tsx,js,jsx}'
---

# Rule: Error Handling

> **Mission:** Fail fast with context. Never swallow errors. Log once at boundaries.

## Typed Application Errors (MANDATORY)

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 500,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, context);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404, { resource, id });
  }
}
```

## Error Propagation — Preserve the Causal Chain

```typescript
// ✅ Preserve cause and context
try {
  await userService.createUser(data);
} catch (error) {
  throw new AppError('Failed to create user', 'USER_CREATE_FAILED', 500, {
    cause: error instanceof Error ? error.message : String(error),
    email: data.email,
  });
}

// ❌ Context lost
try {
  await userService.createUser(data);
} catch {
  throw new Error('Failed to create user');
}
```

## Result Pattern (for expected failures)

```typescript
type Result<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await db.users.findUnique({ where: { id } });
    if (!user) return { success: false, error: new NotFoundError('User', id) };
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: new AppError('Fetch failed', 'FETCH_ERROR') };
  }
}
```

## API Error Responses

```typescript
app.post('/api/users', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: { code: error.code, message: error.message } });
    } else {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } });
    }
  }
});
```

## Anti-Patterns

- ❌ `catch (e) {}` — silent swallowing
- ❌ `throw new Error('string')` without code or context
- ❌ Logging errors at every level — log once at the boundary
- ❌ `any` in catch blocks — always type as `unknown`
- ❌ Retry without circuit breaker for transient failures

## Rules

1. Never swallow exceptions — always rethrow or handle explicitly
2. Include correlation IDs in error context (request/session ID)
3. Typed errors over string exceptions — create specific error classes
4. Retry with exponential backoff for transient failures only
5. Circuit breaker pattern to prevent cascading failures
