# Makefile Template (Repository Standard)

```makefile
.PHONY: coverage run server clean

SHELL := /bin/bash

# Detecta sistema operacional
OS := $(shell uname)

# Caminhos do ambiente virtual
VENV_BIN := .venv/bin
PYTHON := $(VENV_BIN)/python
UVICORN := $(VENV_BIN)/uvicorn
PYTEST := $(VENV_BIN)/pytest

# Execução Local (Web)
run:
	@export PYTHONPATH=$(PWD) && 
	$(UVICORN) app.main:app --host 0.0.0.0 --port 5000 --reload

# Execução Server (Prod-like)
server:
	@$(UVICORN) app.main:app --host 0.0.0.0 --port 5000 --reload

# Limpeza
clean:
	@rm -rf coverage .pytest_cache .venv
	@find . -name "*.pyc" -delete

# Tests e Cobertura
coverage:
	@export PYTHONPATH=$(PWD) && 
	PYTHONWARNINGS=ignore $(VENV_BIN)/coverage run -m pytest tests/ -v && 
	$(VENV_BIN)/coverage xml && 
	rm -rf ./coverage && 
	$(VENV_BIN)/coverage html --directory=./coverage && 
	echo "✅ Relatório gerado em ./coverage/index.html"
```

