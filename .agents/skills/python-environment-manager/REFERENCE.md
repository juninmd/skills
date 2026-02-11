# Reference: Python Environment Management

## Standard Commands

### venv (Standard Library)
- **Create:** `python3 -m venv .venv`
- **Activate (Linux/Mac):** `source .venv/bin/activate`
- **Activate (Windows):** `.venv\Scripts\activate`
- **Deactivate:** `deactivate`

### pip (Package Installer)
- **Install:** `pip install package_name`
- **Install from file:** `pip install -r requirements.txt`
- **Freeze:** `pip freeze > requirements.txt`

## Modern Tools

### Poetry
- **Init:** `poetry init`
- **Install:** `poetry install`
- **Add Package:** `poetry add package_name`
- **Run:** `poetry run python script.py`

### uv (Fast Python Package Installer)
- **Create venv:** `uv venv`
- **Install:** `uv pip install package_name`
- **Sync:** `uv pip sync requirements.txt`

## Best Practices
- **Isolation:** Always use a virtual environment for project dependencies.
- **Git Ignore:** Add your environment folder (e.g., `.venv/`) to `.gitignore`.
- **Lock Files:** Use lock files (`poetry.lock`, `requirements.txt`) to ensure reproducible builds.
- **Configuration:** Prefer `pyproject.toml` for project metadata and tool configuration.
