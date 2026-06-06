---
name: modern-python
description: |
  **DEVELOPMENT SKILL** - Build modern Python apps with uv and Ruff.
  USE FOR: Python toolchain setup, uv migration, pyproject.toml, dependency management, Ruff, and ty configuration.
  DO NOT USE FOR: application feature implementation (use developing-python), Python older than 3.11, manual venv.
  INVOKES: developing-python, uv, ruff, ty.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Windows, Linux, macOS"
allowed-tools: [run_shell_command, read_file, write_file]
---

# Modern Python

Expert guide for building Python apps using the modern `uv` toolchain and Astral quality tools.

**USE FOR:**
- Creating projects and packages with `uv init`.
- Managing dependencies without manual venv activation.
- Configuring fast linting, formatting, and type checking.
- Migrating legacy projects to the `uv` ecosystem.

**INVOKES:**
- `uv run`, `uv sync`, `ruff check`, `ty check`.

## Methodology
Implementation details are in:
1. [Patterns](references/modern-python-patterns.md) | [Setup](references/modern-python-setup.md) | [Migration](references/modern-python-migration.md)
2. [Pyproject](references/pyproject.md) | [Commands](references/uv-commands.md) | [Ruff](references/ruff-config.md)
3. [Testing](references/testing.md) | [PEP 723](references/pep723-scripts.md) | [Prek](references/prek.md)
4. [Security](references/security-setup.md) | [Dependabot](references/dependabot.md) | [Checklist](references/migration-checklist.md)

## Principles
1. **Automation:** Use `uv run` for all tool execution.
2. **Standardization:** Follow PEP 621 and PEP 735.
3. **Speed:** Prioritize Rust-native tools.

## Checklist
- [ ] Set `requires-python = ">=3.11"` in new projects.
- [ ] Use `uv add` and `uv sync` instead of manual edits.
- [ ] Configure Ruff with `select = ["ALL"]`.
- [ ] Maintain ≥ 80% test coverage.
- [ ] Add `uv.lock` to version control.
