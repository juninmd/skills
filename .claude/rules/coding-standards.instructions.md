---
name: coding-standards
description: "Coding standards for Go, Java, Kotlin, C#, Ruby, and PHP — size limits, design principles, naming, and error handling for languages without dedicated rules. Triggers: go, java, kotlin, c#, ruby, php standards."
applyTo: '**/*.go,**/*.java,**/*.kt,**/*.cs,**/*.rb,**/*.php'
paths:
  - "**/*.go"
  - "**/*.java"
  - "**/*.kt"
  - "**/*.cs"
  - "**/*.rb"
  - "**/*.php"
trigger: glob
globs: "**/*.go,**/*.java,**/*.kt,**/*.cs,**/*.rb,**/*.php"
---

# Rule: Coding Standards (Go / Java / Kotlin / C# / Ruby / PHP)

> **Mission:** Consistent quality across polyglot codebases.

## Design Principles
- **KISS**: Simplest solution wins. Prefer obvious over clever.
- **DRY**: Remove duplication when it occurs 3+ times.
- **YAGNI**: No abstractions "just in case".
- **SOLID**: Single responsibility per module; depend on abstractions.
- **Meaningful Names**: Expressive names. No `data`, `info`, `manager`, single-letter vars.
- **No Magic Numbers**: Replace literals with named constants.
- **Comments**: Explain *why*, not *what*. Code should be self-explanatory.

## Size Limits (Cognitive Load)

| Metric | Limit |
|--------|-------|
| File lines | 200 max |
| Function lines | 25 max |
| Nesting depth | 3 levels max |
| Function parameters | 5 max (use typed objects for more) |

## Naming Conventions by Language

| Language | Variables/Functions | Classes | Constants |
|----------|--------------------|---------|-----------|
| Go | `camelCase` | `PascalCase` | `ALL_CAPS` or `PascalCase` |
| Java/Kotlin | `camelCase` | `PascalCase` | `UPPER_SNAKE_CASE` |
| C# | `camelCase` (local), `PascalCase` (public) | `PascalCase` | `PascalCase` |
| Ruby | `snake_case` | `PascalCase` | `UPPER_SNAKE_CASE` |
| PHP | `camelCase` (methods), `snake_case` (vars) | `PascalCase` | `UPPER_SNAKE_CASE` |

## Error Handling
- **Never swallow exceptions silently**.
- Provide context-rich error messages with actionable metadata.
- Map technical failures to domain-safe responses.
- Log errors once at the appropriate boundary.

## Anti-Patterns
- Generic buckets like `utils` or `helpers` without domain context.
- Business logic in controllers, HTTP handlers, or ORM models.
- Deep inheritance hierarchies — prefer composition.
