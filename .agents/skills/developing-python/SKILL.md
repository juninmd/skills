---
name: developing-python
description: Gerenciamento de ambientes virtuais e dependências Python de alta performance. Use para instalar pacotes, criar venvs e gerenciar requirements.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[file/module] [options]"
---

# Python Development

Esta skill otimiza o fluxo de desenvolvimento Python utilizando `uv` para alta performance e segurança.

## Instructions
1.  **Environment Manager:** Utilize `uv` para criação de ambientes e gerenciamento de dependências.
    *   **Reasoning:** `uv` é extremamente rápido (substitui pip, pip-tools e venv) e garante builds reprodutíveis com `pyproject.toml`.
    *   **Verification:** Verifique a presença de `uv.lock` ou `requirements.txt` gerado por `uv pip compile`.
2.  **Virtual Environment:** Sempre trabalhe dentro de um `.venv`. Nunca instale dependências globais.
3.  **Dependency Sync:** Mantenha o ambiente sincronizado com o lockfile.
    *   **Command:** `uv pip sync requirements.txt` (ou `uv sync` se usar pyproject.toml).

## Common Tasks
*   **Create Venv:** `uv venv` (Cria `.venv` localmente).
*   **Activate Venv:** `source .venv/bin/activate` (Linux/Mac) ou `.venv\Scripts\activate` (Windows).
*   **Install Dependencies:** `uv pip install -r requirements.txt`.
*   **Add Package:** `uv pip install <package>` e adicione ao `requirements.in` ou `pyproject.toml`.
*   **Compile Lockfile:** `uv pip compile requirements.in -o requirements.txt` (Fixa versões).

## Scripts
- `scripts/create_venv.sh`: Automação completa de setup (cria venv, ativa, instala deps).

## Troubleshooting
- **Erro `ModuleNotFoundError`:** Verifique se o ambiente virtual está ativado (`which python` deve apontar para `.venv/bin/python`).
- **Conflito de Versões:** Apague o `.venv` e recrie do zero: `rm -rf .venv && uv venv && uv pip sync ...`.