---
name: coding-standards
description: Unified coding standards including design principles, size limits, naming, and error handling.
applyTo: '**/*.py,**/*.ts,**/*.tsx,**/*.js,**/*.jsx,**/*.go,**/*.java,**/*.kt,**/*.cs,**/*.rb,**/*.php,**/*.sh'
---

# Rule: Coding Standards

## 1. Design Principles
- **KISS**: Prioritize the simplest solution.
- **DRY**: Remove duplication (3+ occurrences).
- **YAGNI**: No abstractions "just in case".
- **SOLID**: Single responsibility per module.
- **Clean Architecture**: Isolate domain rules from infrastructure.
- **Meaningful Names**: Use expressive names. Avoid generic names (`data`, `info`, `manager`) and single-letter variables.
- **No Magic Numbers**: Replace literals with named constants.
- **Comments**: Explain *why*, not *what*. Code should be self-explanatory.

## 2. Size Limits (Cognitive Load)
- **Files**: Max 180 non-empty lines.
- **Functions**: Max 25 non-empty lines.
- **Nesting**: Max 3 levels (`if/for/while/try`).
- **Parameters**: Max 5 per function (prefer typed objects for more).

## 3. Naming Conventions
- **Systems**: Use suffixes `-api`, `-worker`, `-cron`, `-frontend`.
- **Code**:
    - Python: `snake_case` (vars/funcs), `PascalCase` (classes), `UPPER_SNAKE_CASE` (consts).
    - JS/TS: `camelCase` (vars/funcs), `PascalCase` (components/classes).
    - Frontend: `kebab-case` for files/folders; `use` prefix for hooks.

## 4. Error Handling
- **Never swallow exceptions silently**.
- Provide context-rich error messages with actionable metadata.
- Map technical failures to domain-safe responses.
- **Logging**: Log errors once at the appropriate boundary. Prefer typed errors.

## 5. Anti-Patterns
- Generic buckets like `utils` or `helpers` without domain context.
- Business logic coupled to controllers or ORM models.


## 6. Engineering Culture (Kaizen & Ownership)
- **Hands-On & Ownership**: Assume responsibility for stability and quality. Investigate root causes in logs/ADB and propose concrete fixes.
- **Continuous Improvement (Kaizen)**: Follow the scout rule; leave the repository better than you found it.
- **DORA Mindset**: Focus on pipeline stability and deployment frequency. Adhere to established quality floors to reduce failure rates.
- **Lower Cognitive Load**: Write code for humans. Use semantic naming and keep it simple.
