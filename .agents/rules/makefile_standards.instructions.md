---
name: makefile-standards
description: Makefile standards and automation targets for project builds and CI workflows.
applyTo: '**/Makefile'
---

# Rule: Makefile Standards

## Requirements
- For Python projects, ensure a `Makefile` exists at repository root.
- If it does not exist, create one with at least these targets:
  - `run`: execute the app locally.
  - `coverage`: run tests with coverage and generate an HTML report.
- **Important**: add `SHELL := /bin/bash` at the top to support `source`.
- Commands should activate `.venv` or directly use `.venv` binaries and set `PYTHONPATH` when needed.

## Example Structure

```makefile
.PHONY: coverage run server clean

SHELL := /bin/bash

# Detect operating system
OS := $(shell uname)

# Virtual environment paths
VENV_BIN := .venv/bin
PYTHON := $(VENV_BIN)/python
UVICORN := $(VENV_BIN)/uvicorn
PYTEST := $(VENV_BIN)/pytest

# Local execution (web) with explicit PYTHONPATH
run:
 @export PYTHONPATH=$(PWD) &&
 $(UVICORN) app.main:app --host 0.0.0.0 --port 5000 --reload

# Server-like execution
server:
 @$(UVICORN) app.main:app --host 0.0.0.0 --port 5000 --reload

# Cleanup
clean:
 @rm -rf coverage .pytest_cache .venv
 @find . -name "*.pyc" -delete

# Tests and coverage
coverage:
 @export PYTHONPATH=$(PWD) &&
 PYTHONWARNINGS=ignore $(VENV_BIN)/coverage run -m pytest tests/ -v &&
 $(VENV_BIN)/coverage xml &&
 rm -rf ./coverage &&
 $(VENV_BIN)/coverage html --directory=./coverage &&
 echo "Coverage report generated at ./coverage/index.html"
```

