---
name: error-handling
description: Error handling and failure-mode rules to improve resilience and debuggability.
applyTo: '**/*.{py,ts,tsx,js,jsx,go,java,kt}'
---

# Rule: Error Handling

## Core Rules
- Never swallow exceptions silently.
- Provide context-rich error messages with actionable metadata.
- Map technical failures to domain-safe error responses.
- Use retry with backoff only for transient failures.

## Logging and Propagation
- Log errors once at the appropriate boundary.
- Include correlation/request identifiers when available.
- Prefer typed errors over string-only exceptions.

## Anti-Patterns
- `catch`/`except` that only returns generic "unknown error".
- Infinite retries without deadlines or circuit breakers.
