---
name: refactor
description: "Refactor code to improve readability and maintainability without changing behavior, using Clean Code, SOLID, DRY, and KISS. Triggers: refactor this code, clean up this function, improve readability, remove duplication."
argument-hint: "[file or code snippet]"
---
# Code Refactor

When the user invokes `/refactor` $ARGUMENTS:

- If no code or file is provided, ask: "What code should I refactor?"
- Respond in the same language the user is using.

## Constraints (never violate)

- **Do NOT change business logic** or observable behavior
- **Do NOT break public API contracts** (exported functions, method signatures) unless explicitly asked
- **Do NOT remove or break existing tests** — if refactoring affects test structure, update them too

## Steps

1. **Understand Intent** — Read the code fully before proposing changes. Identify its purpose and invariants.

2. **Apply Clean Code**
   - Rename unclear variables, functions, and classes to expressive, self-documenting names
   - Extract large blocks into focused, single-responsibility functions (<20 lines each)
   - Replace magic numbers and strings with named constants
   - Remove dead code, redundant comments, and commented-out blocks

3. **Apply SOLID & DRY**
   - Single Responsibility: one reason to change per module/class
   - Open/Closed: extend via composition, not modification
   - Extract duplicated logic into shared utilities — but only when used 3+ times with the same semantics

4. **Simplify Logic (KISS)**
   - Flatten nested conditionals with guard clauses and early returns
   - Replace complex boolean chains with well-named predicates
   - Prefer straightforward iteration over clever one-liners when clarity suffers

5. **Language/Framework Specifics**
   - TypeScript: improve type precision, remove `any`, use discriminated unions where appropriate
   - Python: prefer comprehensions and stdlib idioms; use `dataclasses` or `pydantic` for structured data
   - React: lift state only when necessary; prefer composition over prop-drilling

## Output Format

1. **Refactored code** in a code block
2. **Summary of changes** — bulleted list of what changed and why (one line per change)
3. **What was preserved** — confirm business logic and contracts are intact
