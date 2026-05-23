# Modern Python Migration and Commands

Guidelines for moving from legacy tooling to the `uv` ecosystem.

## 1. Migration from pip/requirements.txt
1. Run `uv init --bare`.
2. Import dependencies: `grep -v '^#' requirements.txt | xargs -n 1 uv add`.
3. Delete `requirements.txt` and old `.venv/`.
4. Commit `uv.lock`.

## 2. Migration from setup.py
1. Run `uv init --bare`.
2. Map `install_requires` to `dependencies` via `uv add`.
3. Delete `setup.py`, `setup.cfg`, and `MANIFEST.in`.

## 3. Command Reference

| Command | Action |
|---------|--------|
| `uv init` | New project |
| `uv add <pkg>` | Add dependency |
| `uv sync` | Install everything |
| `uv run <cmd>` | Run in venv |
| `uv run --with <pkg>` | Ad-hoc execution |
| `uv build` | Package for distribution |

## 4. Ad-hoc execution example
`uv run --with requests python -c "import requests; ..."`
