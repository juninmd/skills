---
name: code-size-limits
description: Limits for file and function size to reduce cognitive load and review risk.
applyTo: '**/*.{py,ts,tsx,js,jsx,go,java,kt,sh}'
---

# Rule: Code Size Limits

## Limits
- Maximum **180 non-empty lines** per source file.
- Maximum **25 non-empty lines** per function or method.
- Maximum **3 nesting levels** (`if/for/while/try` blocks).
- Maximum **5 parameters** per function. If more are needed, use a typed object.

## Exceptions
- Auto-generated files, migrations, and schema files may exceed limits when unavoidable.
- Test fixture files may exceed function size limits if split would harm readability.

## Refactoring Triggers
- If a file exceeds 180 lines, split by feature or responsibility.
- If a function exceeds 25 lines, extract intention-revealing helpers.
- If nesting exceeds 3 levels, use guard clauses and early returns.
