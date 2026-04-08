---
name: developing-python
description: Modern Python development with uv, pyproject.toml, type hints, pytest, and quality best practices (ruff, pyright, black). Use for environment setup, project structure, testing, and full Python toolchain.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[file/module] [options]"
---

# Development with Python

This skill standardizes modern Python development using `uv` as the environment/package manager, `pyproject.toml` as the single source of truth, exhaustive type hints, and a high-level quality toolset.

## 🧱 Recommended Stack 2026
- **Runtime:** Python 3.13+
- **Management:** `uv` + `pyproject.toml`
- **Quality:** `ruff` + `pyright`
- **Testing:** `pytest` + `pytest-asyncio` + `pytest-cov`
- **APIs:** FastAPI + Pydantic v2 + SQLAlchemy async

## Recommended Baseline

- Python **3.13+** with `from __future__ import annotations` for forward refs.
- Package management exclusively via **`uv`** (replaces pip, pip-tools, and venv).
- `pyproject.toml` as the central configuration file (PEP 517/518/621).
- Type hints on **all** parameters and returns. Never use `Any` without justification.
- Formatting with **`ruff format`**, linting with **`ruff check`**, and static typing with **`pyright`**.
- Testing with **`pytest`** + `pytest-asyncio` for async code. Minimum coverage: **90%**.

## Instructions

### 1. Environment Setup

```bash
# Create a new project
uv init my-project && cd my-project

# Create an explicit venv (mandatory name: .venv)
uv venv

# Activate
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

# Install dependencies from pyproject.toml
uv sync

# Add dependency (updates pyproject.toml and uv.lock)
uv add fastapi uvicorn[standard]
uv add --dev pytest pytest-asyncio ruff pyright
```

*   **Rationale:** `uv` is 10-100x faster than pip and ensures reproducible builds via `uv.lock`.
*   **Validation:** `which python` must point to `.venv/bin/python`.

### 2. `pyproject.toml` Structure

```toml
[project]
name = "my-project"
version = "0.1.0"
requires-python = ">=3.13"
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.34.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.24.0",
    "pytest-cov>=6.0.0",
    "ruff>=0.9.0",
    "pyright>=1.1.0",
    "httpx>=0.27.0",
]

[tool.ruff]
line-length = 88
target-version = "py313"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "UP", "S", "B", "A", "C4", "PT", "RUF"]
ignore = ["S101"]  # allow assert in tests

[tool.ruff.format]
quote-style = "double"

[tool.pyright]
pythonVersion = "3.13"
typeCheckingMode = "strict"
venvPath = "."
venv = ".venv"

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
addopts = "--cov=src --cov-report=term-missing --cov-fail-under=90"

[tool.coverage.run]
source = ["src"]
omit = ["tests/*", "**/__init__.py"]
```

### 3. Type Hints — Mandatory

```python
from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from collections.abc import Sequence

# ✅ Correct: explicit type hints
def get_user(user_id: int) -> dict[str, str] | None:
    ...

async def fetch_items(limit: int = 10, offset: int = 0) -> list[dict[str, str]]:
    ...

# ❌ Incorrect: no type hints
def get_user(user_id):
    ...
```

### 4. Project Structure (Standard)

```text
my-project/
├── src/
│   └── my_project/
│       ├── __init__.py
│       ├── main.py
│       ├── config.py          # Pydantic BaseSettings
│       ├── models.py          # SQLAlchemy / Pydantic models
│       ├── exceptions.py      # Domain exceptions
│       └── modules/
│           └── users/
│               ├── router.py
│               ├── schemas.py
│               ├── service.py
│               ├── models.py
│               └── dependencies.py
├── tests/
│   ├── conftest.py
│   ├── unit/
│   └── integration/
├── pyproject.toml
├── uv.lock
├── Makefile
└── .gitignore
```

### 5. Mandatory Makefile

```makefile
SHELL := /bin/bash

.PHONY: run coverage clean lint typecheck

run:
	PYTHONPATH=src uv run uvicorn src.my_project.main:app --reload

coverage:
	uv run pytest --cov=src --cov-report=html --cov-report=term-missing

lint:
	uv run ruff check src tests
	uv run ruff format --check src tests

typecheck:
	uv run pyright src

clean:
	rm -rf .coverage htmlcov .pytest_cache __pycache__ dist build
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null; true
```

### 6. Testing Patterns

```python
# tests/conftest.py
import pytest
from httpx import AsyncClient, ASGITransport
from src.my_project.main import app

@pytest.fixture
async def client() -> AsyncClient:
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac
```

```python
# tests/unit/test_user_service.py
from unittest.mock import AsyncMock, MagicMock
import pytest
from src.my_project.modules.users.service import UserService

@pytest.mark.asyncio
async def test_get_user_returns_none_when_not_found() -> None:
    # Arrange
    mock_repo = MagicMock()
    mock_repo.get_by_id = AsyncMock(return_value=None)
    service = UserService(repo=mock_repo)

    # Act
    result = await service.get_user(user_id=999)

    # Assert
    assert result is None
    mock_repo.get_by_id.assert_awaited_once_with(999)
```

### 7. Quality Gates

| Tool | Command | Purpose |
|---|---|---|
| `ruff check` | `uv run ruff check src` | Linting (E, F, I, B, S rules) |
| `ruff format` | `uv run ruff format src` | Formatting (replaces black) |
| `pyright` | `uv run pyright src` | Strict static typing |
| `pytest --cov` | `make coverage` | Coverage ≥ 90% |

## Common Tasks

*   **Create Venv:** `uv venv` (names it `.venv` — mandatory).
*   **Install all dependencies:** `uv sync --all-extras`.
*   **Add package:** `uv add <package>` (updates `pyproject.toml` + `uv.lock`).
*   **Add development dependency:** `uv add --dev <package>`.
*   **Run script:** `uv run python script.py` (without activating venv).
*   **Update everything:** `uv lock --upgrade && uv sync`.
*   **Compile lockfile (legacy):** `uv pip compile requirements.in -o requirements.txt`.

## Troubleshooting

- **`ModuleNotFoundError`:** Check `which python` → must point to `.venv/bin/python`. Run `uv sync`.
- **Wrong import in tests:** Ensure `PYTHONPATH=src` is in the `Makefile run` and in `pyproject.toml [tool.pytest.ini_options]`.
- **Version conflict:** `rm -rf .venv uv.lock && uv venv && uv sync`.
- **Pyright `reportMissingTypeStubs`:** Install stubs or add `# type: ignore` with a justifying comment.
