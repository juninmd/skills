# Python Environment and Configuration

Guidelines for setting up a modern Python 3.13+ development environment.

## 1. Environment Setup (uv)
- **Initialization:** `uv init <project>`.
- **Virtual Environment:** `uv venv` (creates `.venv`).
- **Syncing:** `uv sync` (installs from `pyproject.toml`).
- **Adding Packages:** `uv add <package>` (updates `pyproject.toml` and `uv.lock`).
- **Execution:** Use `uv run <command>` to execute tools within the environment.

## 2. pyproject.toml Configuration
Always define the required Python version and dependencies:
```toml
[project]
requires-python = ">=3.13"
dependencies = ["fastapi", "uvicorn"]

[tool.ruff]
target-version = "py313"

[tool.pyright]
typeCheckingMode = "strict"
```

## 3. Mandatory Type Hints
Enable postponed evaluation of annotations and use strict typing:
```python
from __future__ import annotations
def get_data(id: int) -> dict[str, str] | None: ...
```
