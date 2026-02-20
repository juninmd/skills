---
name: makefile-standards
description: Padrões para o arquivo Makefile em projetos Python.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Makefile Standards

## Requisitos
- Verifique a existência de um arquivo `Makefile` na raiz do projeto.
- Caso não exista, crie-o com os seguintes targets:
  - `run`: Para executar a aplicação localmente.
  - `coverage`: Para executar testes com cobertura e gerar relatório HTML.
- **Importante**: Adicionar `SHELL := /bin/bash` no início do arquivo para suportar `source`.
- Os comandos devem ativar o ambiente virtual `.venv` e configurar `PYTHONPATH`.

## Exemplo de Estrutura

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

# Execução Local (Web) - Garante PYTHONPATH correto
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
