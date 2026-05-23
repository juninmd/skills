---
name: developing-python
description: |
  **DEVELOPMENT SKILL** - Build modern Python applications using uv and Ruff.
  USE FOR: Python 3.13+, uv package management, Ruff linting/formatting, Pyright type checking, pytest-asyncio, FastAPI.
  DO NOT USE FOR: Python 2.x, legacy pip-only workflows (without uv), heavy frontend development.
  INVOKES: uv, ruff, pyright, pytest.
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

**DO NOT USE FOR:**
- Data science notebooks (unless exporting to production scripts).
- Non-Python backend services.

**INVOKES:**
- `uv`, `ruff`, `pyright`, `pytest` CLI tools.

## Methodology and Guidelines
Implementation details for setup, quality gates, and testing are documented in:
1. [Python Environment and Configuration](references/python-setup.md)
2. [Python Quality Gates and Testing](references/python-operations.md)

## Core Principles
1. **Type Safety:** Mandatory type hints on all function parameters and return values.
2. **Modernity:** Use `from __future__ import annotations` and target Python 3.13+.
3. **Efficiency:** Use `uv run` to ensure deterministic execution without manual venv management.

## Checklist
- [ ] Ensure `from __future__ import annotations` is at the top of every file.
- [ ] Verify that all functions have explicit type hints.
- [ ] Run `ruff check` and `pyright` before submitting code.
- [ ] Maintain test coverage ≥ 90% for new business logic.
