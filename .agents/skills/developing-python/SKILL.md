---
name: developing-python
description: "Python with uv, pyproject.toml, type hints, pytest, ruff. Triggers: python, uv."
argument-hint: "[file/module] [options]"
---

# Python Development

**Stack:** Python 3.13+, `uv` + `pyproject.toml`, `ruff` + `pyright`, `pytest` + `pytest-asyncio`.

## Environment

```bash
uv init my-project && cd my-project
uv venv           # creates .venv (mandatory name)
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows
uv sync           # install from pyproject.toml
uv add <package>  # adds to pyproject.toml + uv.lock
uv run pytest     # run without activating venv
```

## pyproject.toml

```toml
[project]
name = "my-project"
requires-python = ">=3.13"
dependencies = ["fastapi>=0.115", "uvicorn[standard]"]

[project.optional-dependencies]
dev = ["pytest>=8", "ruff>=0.9", "pyright>=1.1"]

[tool.ruff]
line-length = 88
target-version = "py313"

[tool.pyright]
pythonVersion = "3.13"
typeCheckingMode = "strict"

[tool.pytest.ini_options]
asyncio_mode = "auto"
```

## Type Hints (Mandatory)

```python
from __future__ import annotations

def get_user(user_id: int) -> dict[str, str] | None: ...
async def fetch_items(limit: int = 10) -> list[dict[str, str]]: ...
```

## Quality Gates

```bash
uv run ruff check src tests   # lint
uv run ruff format src tests   # format
uv run pyright src            # typecheck
uv run pytest --cov=src       # test + coverage ≥90%
```

## Testing

```python
from httpx import AsyncClient, ASGITransport

@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

@pytest.mark.asyncio
async def test_create_user(client):
    response = await client.post("/users", json={"email": "test@example.com"})
    assert response.status_code == 201
```

## Checklist

- [ ] `from __future__ import annotations` at top
- [ ] Type hints on all params/returns
- [ ] No `Any` without justification
- [ ] `ruff check` + `pyright` pass
- [ ] Tests with pytest-asyncio + httpx AsyncClient
- [ ] Coverage ≥90%

## References

- [Python Official Documentation](https://docs.python.org/3/)
- [uv Package Manager](https://docs.astral.sh/uv/)
- [Ruff Linter/Formatter](https://docs.astral.sh/ruff/)
- [Pyright Type Checker](https://microsoft.github.io/pyright/)
- [pytest Documentation](https://docs.pytest.org/en/stable/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
