---
name: database-access-patterns
description: Safe and performant database query and migration patterns.
applyTo: '**/*.{py,ts,js,go,java,kt,sql}, **/migrations/**/*'
---

# Rule: Database Access Patterns

## Query Rules
- Avoid N+1 query patterns.
- Use explicit column selection for hot paths.
- Add indexes for high-cardinality filters and join keys.

## Transaction Rules
- Keep transactions short and bounded.
- Ensure idempotency for retryable write operations.
- Use optimistic/pessimistic locking intentionally and document rationale.

## Migration Rules
- Prefer backward-compatible migrations.
- Split destructive changes into multiple deploy-safe steps.
- Validate migration rollback strategy before production rollout.

