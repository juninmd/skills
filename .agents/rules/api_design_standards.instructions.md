---
name: api-design-standards
description: API contract and endpoint design rules for consistency and backward compatibility.
applyTo: '**/*.{py,ts,js,go,java,kt}, **/openapi*.{yml,yaml,json}, **/swagger*.{yml,yaml,json}'
---

# Rule: API Design Standards

## Contract Rules
- Version public APIs in path or header strategy consistently.
- Use stable, explicit response envelopes for success and errors.
- Return semantically correct HTTP status codes.
- Validate all request inputs at the edge.

## Error Format
- Error responses should include at least: `code`, `message`, and optional `details`.
- Do not leak internal stack traces to clients.

## Compatibility
- Additive changes are preferred over breaking removals.
- Deprecations must include migration guidance and timeline.
