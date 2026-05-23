---
name: developing-fastapi
description: |
  **DEVELOPMENT SKILL** - Build modern APIs with FastAPI and Pydantic v2.
  USE FOR: REST APIs, Pydantic validation, SQLAlchemy 2 async, Alembic migrations, async programming, FastAPI routers.
  DO NOT USE FOR: synchronous-only Python apps, frontend development, data processing scripts without API context.
  INVOKES: fastapi, pydantic, sqlalchemy, alembic, uvicorn.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Python 3.10+"
allowed-tools: [read_file, write_file]
---

# FastAPI Development

Expert methodology for building high-performance, type-safe APIs with FastAPI and the modern Python data stack.

**USE FOR:**
- Creating modular REST APIs with FastAPI routers and dependency injection.
- Implementing request/response validation using Pydantic v2.
- Configuring asynchronous database access with SQLAlchemy 2 and Alembic.
- Managing application settings with `pydantic-settings`.
- Writing asynchronous integration tests with `pytest-asyncio` and `httpx`.

**DO NOT USE FOR:**
- Legacy Python 2.x projects or early Pydantic v1 codebases.
- Heavy data science workloads better suited for standalone scripts.

**INVOKES:**
- `uvicorn`, `pytest`, `alembic` CLI tools.

## Architecture and Standards
Refer to these specialized modules for implementation details:
- [FastAPI Best Practices and Structure](references/fastapi-best-practices.md)

## Core Principles
1. **Async Correctness:** Use `async def` only when using `await`; otherwise use `def`.
2. **Schema Safety:** Enforce Pydantic v2 for all request and response models.
3. **Configuration:** Use `BaseSettings` for environment-aware configuration.

## Checklist
- [ ] Pydantic v2 used for all models.
- [ ] `async def` used appropriately (no blocking work in async functions).
- [ ] Custom exceptions used for structured error responses.
- [ ] Integration tests verify the full request/response cycle.
