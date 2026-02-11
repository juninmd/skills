# Skill: Python Environment Manager

## Description
This skill specializes in managing Python development environments, ensuring isolation, dependency resolution, and compatibility. It handles virtual environment creation, package installation, and version locking using tools like `venv`, `pip`, `poetry`, and `uv`.

## Capabilities
- Create and activate Python virtual environments.
- Manage dependencies via `requirements.txt`, `pyproject.toml`, or `Pipfile`.
- Install, update, and remove Python packages.
- Diagnose and resolve dependency conflicts.
- Automate environment setup for new projects.

## Usage
1. **Assess:** Check for existing environment configuration (`pyproject.toml`, `requirements.txt`).
2. **Create:** Initialize a virtual environment if one doesn't exist.
3. **Install:** Install required packages into the active environment.
4. **Lock:** Generate lock files to ensure reproducible builds.

## Constraints
- Always prefer using a virtual environment over global installation.
- Respect existing configuration files (don't mix `poetry` with `pip` if not necessary).
- Check for `uv` usage as a modern alternative for faster operations.
