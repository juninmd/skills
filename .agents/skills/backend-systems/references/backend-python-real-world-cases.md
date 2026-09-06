# Backend Python Real-World Cases

Use this first for Python service changes, FastAPI endpoints, migrations, and quality-gate work.

## FastAPI Endpoint
- Read route, dependency chain, request/response model, auth, service, database access, and tests.
- Validate input with Pydantic at the edge; keep business logic framework-light.
- Test valid request, validation error, unauthorized/forbidden, dependency failure, timeout, and rollback.
- Smoke import/startup because dependency injection and settings often fail before tests hit them.

## Async or I/O Bug
- Follow the whole call chain before changing `async`.
- Do not call sync database/network clients in async request paths.
- Propagate cancellation and timeout behavior to external calls.
- Test cancellation, timeout, and cleanup if the path owns resources.

## Ruff or Formatting Migration
- Preserve existing target Python and line length unless the task is modernization.
- Run `ruff check` before `ruff format` when separating logic fixes from mechanical churn matters.
- Do not enable preview or all rules in a legacy repo without staged adoption.

## Type Checking
- Use the repository's current checker when one exists.
- For new projects, prefer the stack already chosen in repo templates; document if using `ty`, Pyright, or mypy.
- Treat type ignores as debt: require scope, reason, and removal trigger.
