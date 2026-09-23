# Migration Checklist

Comprehensive checklist for migrating Python projects to modern tooling.

## Entry Points

**From pip / requirements.txt**
1. `uv init --bare`
2. `grep -v '^#' requirements.txt | xargs -n 1 uv add`
3. Delete `requirements.txt` and the old `.venv/`
4. Commit `uv.lock`

**From setup.py**
1. `uv init --bare`
2. Map each `install_requires` entry with `uv add`
3. Delete `setup.py`, `setup.cfg`, `MANIFEST.in`

| Command | Action |
|---------|--------|
| `uv init` | New project |
| `uv add <pkg>` | Add dependency |
| `uv sync` | Install everything |
| `uv run <cmd>` | Run in the venv |
| `uv run --with <pkg>` | Ad-hoc execution |
| `uv build` | Package for distribution |

Ad-hoc example: `uv run --with requests python -c "import requests; print(requests.get('https://api.github.com').status_code)"`

## Before Migration

- [ ] **Determine layout**: `src/` or flat? Configure `[tool.uv.build-backend]` if flat
- [ ] **Decide uv.lock strategy**: app (commit) vs library (.gitignore)
- [ ] **Backup current state**: Create a branch or tag before starting

## Cleanup Old Artifacts

Find and remove legacy linter comments:

```bash
# Find files with old linter pragmas
rg "# pylint:|# noqa:|# type: ignore" --files-with-matches

# Find missing __init__.py files
uv run ruff check --select=INP001 .
```

Remove these files after migration:
- [ ] `requirements.txt`, `requirements-dev.txt`
- [ ] `setup.py`, `setup.cfg`, `MANIFEST.in`
- [ ] `.flake8`, `mypy.ini`, `pyrightconfig.json`
- [ ] `tox.ini` (if not needed)
- [ ] `Pipfile`, `Pipfile.lock`
- [ ] Old virtual environments (`venv/`, `.venv/`)

## .gitignore Updates

Add these entries:

```gitignore
# Python
__pycache__/
*.py[cod]
.venv/

# Tools
.ruff_cache/
.ty/

# uv (for libraries only - apps should commit uv.lock)
# uv.lock
```

## pyproject.toml Sections to Remove

- [ ] `[tool.black]`
- [ ] `[tool.isort]`
- [ ] `[tool.mypy]`
- [ ] `[tool.pyright]`
- [ ] `[tool.pylint]`
- [ ] `[tool.flake8]` (if present)

## Post-Migration Easy Wins

Run these to modernize code automatically:

```bash
# Pyupgrade modernization (typing, syntax)
uv run ruff check --select=UP --fix .

# Unnecessary variable assignments before return
uv run ruff check --select=RET504 --fix .

# Simplifications (conditionals, comprehensions)
uv run ruff check --select=SIM --fix .

# Remove commented-out code
uv run ruff check --select=ERA --fix .
```

## CI Cleanup

- [ ] Remove scheduled CI triggers (activity without progress is theater)
- [ ] Update CI to use `uv sync` and `uv run`
- [ ] Pin GitHub Actions to SHA hashes
- [ ] Set up security tooling (see [security-setup.md](./security-setup.md))

## Gradual ty Adoption

For legacy codebases with many type errors, start lenient:

```toml
[tool.ty.terminal]
error-on-warning = true

[tool.ty.environment]
python-version = "3.11"

[tool.ty.rules]
# Start with these ignored for legacy codebases
possibly-missing-attribute = "ignore"
unresolved-import = "ignore"
invalid-argument-type = "ignore"
not-subscriptable = "ignore"
unresolved-attribute = "ignore"
```

Remove rules as you fix errors. Track progress:

```bash
# Count remaining issues
uv run ty check src/ 2>&1 | grep -c "error"
```

## Supply Chain Security

- [ ] Add pip-audit to dependency groups
- [ ] Configure Dependabot with 7-day cooldown
- [ ] Pin exact versions in production (`==` not `>=`)

See [security-setup.md](./security-setup.md) for pip-audit and Dependabot configuration.

## Verification

After migration, verify everything works:

```bash
# Install all dependencies
uv sync --all-groups

# Run linting
uv run ruff check .
uv run ruff format --check .

# Run type checking
uv run ty check src/

# Run tests
uv run pytest

# Security audit
uv run pip-audit

# Build package (if distributable)
uv build
```
