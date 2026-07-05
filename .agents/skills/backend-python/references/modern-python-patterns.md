# Modern Python Patterns and Anti-Patterns

Guidelines for leveraging the 2026 Python ecosystem and avoiding legacy pitfalls.

## 1. Anti-Patterns to Avoid

| Avoid | Use Instead |
|-------|-------------|
| `uv pip install` | `uv add` and `uv sync` |
| Manual `.venv` activation | `uv run <cmd>` |
| `setup.py` / `Poetry` | `uv` and `pyproject.toml` |
| `requirements.txt` | PEP 723 (scripts) or `pyproject.toml` (projects) |
| Unowned type-checker migration | Preserve repo checker; use `ty` for new `uv` projects |
| `pre-commit` | `prek` (Rust-native) |

## 2. Core Principles
- **Dependency Control:** Always use `uv add`/`remove` to manage `pyproject.toml` and `uv.lock`.
- **Zero Manual Env:** Never manually manage virtual environments; let `uv run` handle the ephemeral state.
- **Modern Groups:** Use `[dependency-groups]` (PEP 735) instead of optional extras for development tools.

## 3. Tool Overview
- **uv:** Replaces pip, virtualenv, pip-tools, pipx, and pyenv.
- **ruff:** Replaces flake8, black, isort, and pyupgrade.
- **ty:** Rapid type checker option for new `uv` projects; preserve Pyright or mypy when already configured.
- **prek:** Fast pre-commit hooks for secret detection and linting.
