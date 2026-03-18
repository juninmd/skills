---
name: scaffolding-projects
description: Padronização de estrutura de projetos (Makefile, Dockerfile, README, Sonar, Hangar) seguindo o protocolo Sênior Luizalabs.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[context] [options]"
disable-model-invocation: true
---

# Project Scaffolding Sênior

Esta skill garante que todo projeto siga o "Golden Path" da Luizalabs, assegurando governança, observabilidade e qualidade desde o "Day 1".

## Mandatory Files
1.  **`hangar-info.yaml` (Backstage):** OBRIGATÓRIO para catalogação.
    *   **Fields:** `metadata.name`, `spec.owner` (formato `group:squad-name`), `spec.lifecycle` (`production` / `experimental`).
2.  **`sonar.properties` (Quality Gate):** Define a chave do projeto e exclusões de cobertura.
    *   **Standard:** `sonar.python.coverage.reportPaths=coverage.xml` / `sonar.javascript.lcov.reportPaths=coverage/lcov.info`.
3.  **`Makefile` (Automation):** Interface padrão para qualquer linguagem.
    *   **Targets:** `setup`, `run`, `test`, `lint`, `build`, `clean`.
4.  **`Dockerfile` (Container):** Deve usar Multi-stage builds para reduzir tamanho final e NÃO rodar como root (`USER node` / `USER app`).

## Verification Steps
*   **Check Hangar:** `grep "spec.owner" hangar-info.yaml` (Se falhar, o projeto é "fantasma").
*   **Check Sonar:** `test -f sonar.properties` (Sem isso, o pipeline falha).
*   **Check Makefile:** `make --dry-run test` (Deve existir o target test).

## Example: Standard Makefile
```makefile
.PHONY: setup test lint run

setup:
	@echo "Installing dependencies..."
	uv pip sync requirements.txt # Python Example

test:
	pytest --cov=src --cov-report=xml

lint:
	ruff check .

run:
	uv run uvicorn src.main:app --reload
```