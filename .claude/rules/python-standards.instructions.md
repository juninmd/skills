---
name: python-standards
description: Python coding standards including type hints, Pydantic, and documentation.
applyTo: '**/*.py'
paths:
  - "**/*.py"
trigger: glob
globs: "**/*.py"
---

# Rule: Python Standards

## 1. Type Hints
- **Mandatory Typing**: All functions, methods, and variables should use explicit type hints (`typing` module or native collections).
- **Return Types**: Always annotate return types, including `-> None` for functions that do not return a value.

## 2. Validation & Modeling
- **Pydantic**: Use Pydantic models (v2) for data validation, serialization, and settings management instead of plain dictionaries or dataclasses where validation is required.
- **Immutability**: Prefer immutable configurations where possible.

## 3. Documentation
- **Docstrings**: Provide Google-style docstrings or PEP 257 compliant docstrings for modules, classes, and public functions.
- Describe arguments, return values, and any exceptions raised.

## 4. Modern Python
- Favor modern features like f-strings for formatting, `match`/`case` for structural pattern matching, and pathlib for file paths.
