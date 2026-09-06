# Python Environment and Project Setup

Initializing and configuring a modern Python project with `uv`.

## 1. Environment and Initialization

```bash
uv init myproject && cd myproject      # multi-file project
uv init --package myproject            # reusable/distributable package
uvx cookiecutter gh:trailofbits/cookiecutter-python   # full template: CI, docs, publishing
uv init --bare                         # add uv to an existing repo
uv venv                                # create .venv explicitly
uv add fastapi uvicorn                 # updates pyproject.toml and uv.lock
uv add --group dev pytest ruff ty
uv sync                                # install everything from the lockfile
uv run <command>                       # execute inside the environment
```

Commit `uv.lock` for applications; gitignore it for libraries.

## 2. pyproject.toml

Always pin the interpreter floor and keep tool config in one file:

```toml
[project]
requires-python = ">=3.11"
dependencies = ["fastapi"]

[dependency-groups]
dev = ["ruff", "ty"]
test = ["pytest", "pytest-cov"]

[tool.ruff]
target-version = "py311"
lint.select = ["ALL"]

[tool.pytest]
addopts = ["--cov=myproject", "--cov-fail-under=80"]
```

Add a type checker section matching the one the repository already uses
(`[tool.pyright] typeCheckingMode = "strict"` or `[tool.ty]`). For a new project,
target the newest interpreter the deployment platform supports and keep
`requires-python`, `target-version`, and the CI matrix in agreement.

## 3. Typing

Enable postponed annotation evaluation and type every public boundary:

```python
from __future__ import annotations

def get_data(id: int) -> dict[str, str] | None: ...
```

## 4. Standardized Tasks

Drive everything through `uv run` (or a thin `Makefile`) so local and CI runs match:

- `uv run ruff check .`
- `uv run ruff format --check .`
- `uv run ty check src/` — in an existing repo, run the checker already configured
  rather than introducing a second one.
- `uv run pytest`
