# Reference: Scaffolding Templates

## Makefile Template
```makefile
.PHONY: coverage run server clean
SHELL := /bin/bash

# Venv paths
VENV_BIN := .venv/bin
PYTHON := $(VENV_BIN)/python
UVICORN := $(VENV_BIN)/uvicorn

run:
	@export PYTHONPATH=$(PWD) && $(UVICORN) app.main:app --host 0.0.0.0 --port 5000 --reload

coverage:
	@export PYTHONPATH=$(PWD) && 
	$(VENV_BIN)/coverage run -m pytest tests/ -v && 
	$(VENV_BIN)/coverage xml && 
	$(VENV_BIN)/coverage html --directory=./coverage
```

## Dockerfile Pattern
```dockerfile
FROM python:3.12-bullseye
RUN apt-get update && apt-get install -y make
...
```
