# Modern Python Setup and Configuration

Procedures for initializing and configuring high-quality Python projects.

## 1. Project Initialization
```bash
# Minimal multi-file project
uv init myproject && cd myproject
uv add requests rich
uv add --group dev pytest ruff ty

# Full reusable package
uv init --package myproject
uvx cookiecutter gh:trailofbits/cookiecutter-python
```

## 2. pyproject.toml Configuration
Key sections for a standardized project:
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

## 3. Execution
Use `uv run` or a `Makefile` to standardize tasks:
- `uv run ruff check .`
- `uv run ty check src/`
- `uv run pytest`

For existing repositories, run the configured checker instead of adding `ty` casually.
