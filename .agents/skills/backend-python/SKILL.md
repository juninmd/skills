---
name: backend-python
description: |
  Build modern Python applications and FastAPI services. Use for uv and pyproject setup, Ruff, typed Python, Pydantic v2, async boundaries, pytest, and Alembic integration.
---

# Backend Python

## Workflow
1. Inspect `pyproject.toml`, lockfiles, Python constraint, source layout, and existing quality scripts.
2. Preserve the chosen environment manager and framework conventions; prefer `uv` for new projects.
3. Model external data with Pydantic/dataclasses, keep I/O async only where the dependency chain is async, and isolate side effects.
4. Test valid input, validation failure, dependency failure, timeout, cancellation, and transaction rollback.
5. Run Ruff, the repository type checker, focused pytest targets, and an import/startup smoke.

## Reference Routing
- Real Python service cases: [real-world-cases.md](references/real-world-cases.md)
- New environment and stack: [python-setup.md](references/python-setup.md), [modern-python-setup.md](references/modern-python-setup.md)
- Migration and patterns: [modern-python-migration.md](references/modern-python-migration.md), [migration-checklist.md](references/migration-checklist.md), [modern-python-patterns.md](references/modern-python-patterns.md)
- Single-file scripts (PEP 723): [pep723-scripts.md](references/pep723-scripts.md)
- FastAPI: [fastapi-best-practices.md](references/fastapi-best-practices.md)
- Quality gates: [python-operations.md](references/python-operations.md), [testing.md](references/testing.md)
- Configuration details: [pyproject.md](references/pyproject.md), [ruff-config.md](references/ruff-config.md), [uv-commands.md](references/uv-commands.md)

## Rules
- Do not mix sync database clients into async request paths.
- Validate configuration at startup and redact secrets from logs and exceptions.
- Keep migrations backward compatible; coordinate schema changes with `data-engineering`.
- Prefer explicit dependency injection over module-level mutable state.

## Checklist
- [ ] Boundaries, configuration, and errors are typed.
- [ ] Validation and dependency failures are tested.
- [ ] Ruff, typecheck, pytest, and startup pass.
