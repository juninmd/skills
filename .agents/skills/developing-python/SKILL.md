---
name: developing-python
description: Desenvolvimento Python moderno com uv, pyproject.toml, type hints, pytest e boas práticas de qualidade (ruff, pyright, black). Use para setup de ambiente, estrutura de projeto, testes e toolchain Python completo.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[file/module] [options]"
---

# Python Development

Esta skill padroniza o desenvolvimento Python moderno usando `uv` como gerenciador de ambientes/pacotes, `pyproject.toml` como fonte da verdade, type hints exaustivos, e ferramental de qualidade de alto nível.

## Recommended Baseline

- Python **3.13+** com `from __future__ import annotations` para forward refs.
- Gerenciamento de pacotes exclusivamente via **`uv`** (substitui pip, pip-tools e venv).
- `pyproject.toml` como arquivo central de configuração (PEP 517/518/621).
- Type hints em **todos** os parâmetros e retornos. Nunca use `Any` sem justificativa.
- Formatação com **`ruff format`**, linting com **`ruff check`** e tipagem estática com **`pyright`**.
- Testes com **`pytest`** + `pytest-asyncio` para código async. Cobertura mínima: **90%**.

## Instructions

### 1. Environment Setup

```bash
# Criar projeto novo
uv init my-project && cd my-project

# Criar venv explícito (nome obrigatório: .venv)
uv venv

# Ativar
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

# Instalar deps do pyproject.toml
uv sync

# Adicionar dependência (atualiza pyproject.toml e uv.lock)
uv add fastapi uvicorn[standard]
uv add --dev pytest pytest-asyncio ruff pyright
```

*   **Reasoning:** `uv` é 10-100x mais rápido que pip e garante builds reprodutíveis via `uv.lock`.
*   **Verification:** `which python` deve apontar para `.venv/bin/python`.

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

### 3. Type Hints — Obrigatório

```python
from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from collections.abc import Sequence

# ✅ Correto: type hints explícitos
def get_user(user_id: int) -> dict[str, str] | None:
    ...

async def fetch_items(limit: int = 10, offset: int = 0) -> list[dict[str, str]]:
    ...

# ❌ Errado: sem type hints
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

### 5. Makefile Mandatório

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
| `ruff format` | `uv run ruff format src` | Formatação (substitui black) |
| `pyright` | `uv run pyright src` | Tipagem estática strict |
| `pytest --cov` | `make coverage` | Cobertura ≥ 90% |

## Common Tasks

*   **Create Venv:** `uv venv` (nomeia `.venv` — obrigatório).
*   **Install all deps:** `uv sync --all-extras`.
*   **Add package:** `uv add <package>` (atualiza `pyproject.toml` + `uv.lock`).
*   **Add dev dep:** `uv add --dev <package>`.
*   **Run script:** `uv run python script.py` (sem ativar venv).
*   **Upgrade all:** `uv lock --upgrade && uv sync`.
*   **Compile lockfile (legacy):** `uv pip compile requirements.in -o requirements.txt`.

## Troubleshooting

- **`ModuleNotFoundError`:** Verifique `which python` → deve apontar para `.venv/bin/python`. Execute `uv sync`.
- **Import errado em testes:** Certifique que `PYTHONPATH=src` está no `Makefile run` e no `pyproject.toml [tool.pytest.ini_options]`.
- **Conflito de versões:** `rm -rf .venv uv.lock && uv venv && uv sync`.
- **Pyright `reportMissingTypeStubs`:** Instale stubs ou adicione `# type: ignore` com comentário justificando.