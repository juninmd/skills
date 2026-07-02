---
name: code-design-principles
description: Always-on design principles for maintainable software (Clean Code, Clean Architecture, KISS, DRY, YAGNI, SOLID).
applyTo: '**/*.{py,ts,tsx,js,jsx,go,java,kt,cs,rb,php}'
---

# Rule: Code Design Principles

## Mandatory Principles
- **KISS**: prioritize the simplest solution that solves the current requirement.
- **DRY**: remove duplication when behavior is repeated in 3 or more places.
- **YAGNI**: do not add abstractions or extensibility "just in case".
- **SOLID**: every module should have a single clear responsibility.
- **Clean Code**: code must be readable without external explanation.
- **Clean Architecture**: isolate domain rules from framework and infrastructure details.

## Practical Criteria
- Name modules by business intent, not by technical generic buckets.
- Prefer composition over inheritance for new designs.
- Keep side effects at boundaries (I/O, network, database).
- Public interfaces should be small and stable.

## Anti-Patterns
- Generic folders like `utils`, `helpers`, or `common` without domain context.
- Deep inheritance trees for simple behavior composition.
- Business logic coupled directly to controllers, views, or ORM models.

