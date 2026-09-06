
# Backend Python

## Preflight

```bash
cat pyproject.toml            # deps, tool config, requires-python
ls uv.lock poetry.lock requirements*.txt 2>/dev/null   # which manager owns this
python -c 'import sys; print(sys.version)'
ls src/ 2>/dev/null || ls */__init__.py                # src-layout or flat
```

Preserve the environment manager already in use. Prefer `uv` for a new project; do not migrate an existing one unless asked.

## Workflow
1. Model external data with Pydantic or dataclasses at the boundary. Inside the domain, work with typed objects, never raw dicts.
2. Go async only where the whole dependency chain is async. A sync database driver inside an `async def` is worse than a sync endpoint.
3. Isolate side effects behind explicitly injected dependencies rather than module-level state.
4. Cover valid input, validation failure, dependency failure, timeout, cancellation, and rollback; delegate the case matrix to `test-engineering`.
5. Run Ruff, the repository's type checker, focused pytest targets, and an import/startup smoke.

```bash
uv sync --frozen
uv run ruff check --fix . && uv run ruff format .
uv run mypy src/          # or pyright, whichever the repo uses
uv run pytest -x -q tests/test_thing.py::test_case
uv run python -c 'import app.main'      # startup smoke: catches import-time failures
```

## The Blocking-Call Trap
FastAPI runs `async def` endpoints on the event loop. One blocking call there stalls **every** concurrent request, and the symptom is latency everywhere rather than an error anywhere.

| Blocking call | Fix |
|---|---|
| `time.sleep()` | `await asyncio.sleep()` |
| `requests.get()` | `httpx.AsyncClient` |
| sync SQLAlchemy session | async engine, or `asyncio.to_thread` |
| CPU-bound work (parsing, crypto, image) | `run_in_executor`, or a worker process |

Declaring the endpoint `def` instead of `async def` is a legitimate fix: the framework runs it in a threadpool. Mixing them per-route is fine; hiding a blocking call inside `async def` is not.

## Pydantic v2 Differences That Bite

| v1 | v2 |
|---|---|
| `class Config:` | `model_config = ConfigDict(...)` |
| `@validator` | `@field_validator` with explicit `mode="before"`/`"after"` |
| `@root_validator` | `@model_validator(mode=...)` |
| `.dict()` / `.json()` | `.model_dump()` / `.model_dump_json()` |
| `parse_obj` | `model_validate` |

`model_validate` is not free. Re-validating the same payload in a hot loop is a measurable cost — validate once at the boundary and pass the model down.

## Reference Routing
- Real Python service cases: [backend-python-real-world-cases.md](backend-python-real-world-cases.md)
- Environment, pyproject, and tasks: [python-setup.md](python-setup.md)
- Migration and patterns: [migration-checklist.md](migration-checklist.md), [modern-python-patterns.md](modern-python-patterns.md)
- Single-file scripts (PEP 723): [pep723-scripts.md](pep723-scripts.md)
- FastAPI: [fastapi-best-practices.md](fastapi-best-practices.md)
- Quality gates: [python-operations.md](python-operations.md), [testing.md](testing.md)
- Configuration details: [pyproject.md](pyproject.md), [ruff-config.md](ruff-config.md), [uv-commands.md](uv-commands.md)

## Stop
- A blocking call is inside an `async def`. Fix it or make the endpoint `def`; it stalls every concurrent request.
- A bare `except Exception` swallows a domain error. Type it and map it at the boundary before shipping.
- Configuration is missing at startup and the service boots anyway. Make it fail loudly first.

## Rules
- Validate configuration at startup and fail loudly. A service that boots with a missing setting fails later, in production, on a code path nobody was watching.
- Redact secrets from logs *and* from exception messages — a `ValidationError` will happily print the payload it rejected.
- Never swallow bare `Exception` in domain code. Define typed domain exceptions and map them at the boundary; a catch-all belongs only at the process edge, logging and re-raising.
- Mutable default arguments (`def f(x=[])`) are shared across calls. Use `None` and build inside.
- Organize new modules by domain feature, not technical layer; in existing code, follow the layout already there.
- Keep migrations backward compatible and run them through Alembic, never by hand; schema rollout belongs to `migration-engineering` and database operation to `data-engineering`.

## Checklist
- [ ] Environment manager and Python constraint read before changing dependencies.
- [ ] Boundaries, configuration, and errors are typed; no bare `except Exception` in the domain.
- [ ] No blocking call on the event loop.
- [ ] Validation and dependency failures tested, including cancellation and rollback.
- [ ] Ruff, type check, pytest, and an import/startup smoke all pass.
