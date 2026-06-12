---
name: backend-python
description: "Comprehensive Python Backend Development covering modern tooling (uv, Ruff) and FastAPI."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Python 3.11+"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Backend Python Engineering

Expert methodology for building modern, high-performance Python applications and APIs. This skill unifies modern Python toolchain management (uv, Ruff, Pyright) and FastAPI backend development.

**USE FOR:**
- Setting up modern Python projects using `uv` and `pyproject.toml`.
- Building REST APIs and async services with FastAPI and Pydantic v2.
- Implementing strict type checking with Pyright/mypy.
- Managing database interactions with SQLAlchemy 2 (async) and Alembic.
- Enforcing code quality with Ruff.

**DO NOT USE FOR:**
- Legacy Python 2.x or pre-3.11 environments.
- Frontend or Node.js development (use `backend-node` or `frontend-engineering`).

**INVOKES:**
- `uv`, `ruff`, `pytest`, `fastapi`, `uvicorn`, `alembic`.

## Core Principles
1. **Modern Tooling:** Use `uv` for lightning-fast dependency management and `ruff` for linting/formatting.
2. **Strict Typing:** Python is dynamic, but your codebase shouldn't be. Enforce strict type hints.
3. **Async First:** Leverage `asyncio` for I/O bound operations, especially in FastAPI.
4. **Validation:** Push validation to the edges using Pydantic models.

## Implementation Guides
Refer to these specific domains for deep-dive instructions:
- [Modern Python Toolchain](references/python-toolchain.md)
- [FastAPI Architecture](references/fastapi-arch.md)
- [Data Validation & Pydantic](references/pydantic-validation.md)

## Checklist
- [ ] Ensure `uv` is used for environment and dependency management.
- [ ] Verify that `ruff check .` passes before committing.
- [ ] Confirm that all FastAPI endpoints have defined Pydantic request and response models.
- [ ] Use `pytest` for all unit and integration testing.
