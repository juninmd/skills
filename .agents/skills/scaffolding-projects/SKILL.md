---
name: scaffolding-projects
description: Project structure standardization (Makefile, Dockerfile, README, Sonar, Hangar) following the Luizalabs Senior protocol.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
disable-model-invocation: true
---

# Senior Project Scaffolding

This skill ensures that every project follows the Luizalabs "Golden Path", ensuring governance, observability, and quality from "Day 1".

## Principles for Simple and Clean Code
- **Non-Developer Friendly:** Focus on clear documentation and simple, descriptive naming.
- **KISS (Keep It Simple, Stupid):** Code should be direct and easy to read. Avoid complex abstractions that non-devs cannot maintain.
- **Zero Bugs:** Never deliver code with known bugs or syntax errors.
- **Linter Ready:** All delivered code must pass the project's linter (e.g., `ruff` for Python, `biome` for JS/TS).

## Mandatory Files
1.  **`hangar-info.yaml` (Backstage):** MANDATORY for cataloging. Use `cataloging-backstage` skill for this.
2.  **`sonar-project.properties` (Quality Gate):** Defines the project key and coverage exclusions.
3.  **`Makefile` (Automation):** Standard interface for any language.
4.  **`Dockerfile` (Container):** Must use Multi-stage builds and MUST NOT run as root.

## Instructions
1.  **Zero-Tolerance Linter:** Before delivering code, run `make lint`. If it fails, fix all errors. No exceptions.
2.  **Mandatory Testing:** Every new feature or fix must include unit tests.
    *   **Coverage:** Aim for 80%+ coverage.
    *   **Scenarios:** Test the "happy path", but also "edge cases" (missing files, empty inputs, invalid types).
3.  **Validation Steps:**
    *   **Check Hangar:** Ensure the project exists in the catalog.
    *   **Check Sonar:** Verify that metrics are being collected.
    *   **Check Makefile:** Ensure all standard targets (`test`, `lint`, `run`) are functional.

## Alternate Scenario Testing
Always validate scenarios such as:
- **Missing Dependencies:** Does the setup target handle missing tools gracefully?
- **Empty Configurations:** Does the app crash or provide a clear error message?
- **Incorrect Environment:** Does the code validate required environment variables before starting?

## Example: Robust Makefile
```makefile
.PHONY: setup test lint run

setup:
	@echo "Installing dependencies..."
	@command -v uv >/dev/null 2>&1 || (echo "Error: 'uv' is not installed. Visit https://github.com/astral-sh/uv" && exit 1)
	uv pip sync requirements.txt

test:
	pytest --cov=src --cov-report=xml tests/

lint:
	ruff check src/ tests/
	ruff format --check src/ tests/
```
