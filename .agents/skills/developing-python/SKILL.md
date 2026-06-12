---
name: developing-python
description: "Python Development for Managing Python, Implementing ultra-fast, Enforcing strict via uv."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Windows, Linux, macOS"
allowed-tools: [run_shell_command, read_file, write_file]
---

# Python Development

Expert methodology for building high-performance, type-safe Python applications using the modern `uv` toolchain and strict quality standards.

**USE FOR:**
- Managing Python projects and dependencies with `uv`.
- Implementing ultra-fast linting and formatting with Ruff.
- Enforcing strict static type checking with Pyright.
- Building asynchronous APIs with FastAPI and `pytest-asyncio`.
- Configuring standardized `pyproject.toml` settings.
- Migrating legacy projects to the `uv` ecosystem.

**DO NOT USE FOR:**
- Data science notebooks (unless exporting to production scripts).
- Non-Python backend services.
- Python older than 3.11 or manual venv management.

**INVOKES:**
- `uv`, `ruff`, `pyright`, `pytest`, `ty` CLI tools.

## Methodology and Guidelines
Implementation details for setup, quality gates, migration, and testing are documented in:
1. [Python Environment and Configuration](references/python-setup.md) | [Pyproject](references/pyproject.md) | [Commands](references/uv-commands.md)
2. [Python Quality Gates and Testing](references/python-operations.md) | [Ruff Config](references/ruff-config.md) | [Testing Details](references/testing.md)
3. [Modern Patterns](references/modern-python-patterns.md) | [Setup Patterns](references/modern-python-setup.md) | [Migration](references/modern-python-migration.md)
4. [PEP 723 Scripts](references/pep723-scripts.md) | [Prek](references/prek.md) | [Security Setup](references/security-setup.md) | [Dependabot](references/dependabot.md) | [Checklist](references/migration-checklist.md)

## Core Principles
1. **Type Safety:** Mandatory type hints on all function parameters and return values.
2. **Modernity:** Use `from __future__ import annotations` and target Python 3.13+.
3. **Efficiency:** Use `uv run` to ensure deterministic execution without manual venv management.

## Development Standards
1. **Type Hints:**
   - **Mandatory Typing:** All functions, methods, and variables should use explicit type hints (`typing` module or native collections).
   - **Return Types:** Always annotate return types, including `-> None` for functions that do not return a value.
2. **Validation & Modeling:**
   - **Pydantic:** Use Pydantic models (v2) for data validation, serialization, and settings management instead of plain dictionaries or dataclasses where validation is required.
   - **Immutability:** Prefer immutable configurations where possible.
3. **Documentation:**
   - **Docstrings:** Provide Google-style docstrings or PEP 257 compliant docstrings for modules, classes, and public functions.
   - Describe arguments, return values, and any exceptions raised.
4. **Modern Python:**
   - Favor modern features like f-strings for formatting, `match`/`case` for structural pattern matching, and `pathlib` for file paths.

## Checklist
- [ ] Ensure `from __future__ import annotations` is at the top of every file.
- [ ] Verify that all functions have explicit type hints.
- [ ] Run `ruff check` and `pyright` before submitting code.
- [ ] Maintain test coverage ≥ 90% for new business logic.
