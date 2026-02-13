---
name: gemini-hooks-readme
description: Documentação de instalação e uso dos hooks do Gemini CLI.
metadata:
    works_on: [gemini_cli]
---

# Gemini CLI Hooks

Este diretório contém hooks personalizados para estender e proteger seu fluxo de trabalho no terminal. Eles seguem as melhores práticas da documentação oficial do Gemini CLI.

## Hooks Implementados

### 1. `pre-command.py` (Safety & Context)
Este hook é executado **antes** de cada comando gerado pela IA ser executado. Ele serve como uma camada final de segurança.

**Funcionalidades:**
*   **Git Protection:** Detecta e alerta se você estiver prestes a fazer `git push` ou `git commit` diretamente nas branches `main` ou `master`.
*   **Kubernetes Awareness:** Exibe o contexto atual do cluster (`kubectl config current-context`) sempre que um comando `kubectl` for sugerido, evitando deploys acidentais em produção.
*   **Python Environment:** Verifica se existe um ambiente virtual (`.venv`) no diretório mas não está ativo, sugerindo o comando de ativação.

### Como Instalar
Para que o Gemini CLI utilize estes hooks, configure o caminho no seu arquivo `config.yaml` ou passe a flag `--hooks-dir`:

```yaml
# ~/.gemini/config.yaml
hooks:
  dir: /caminho/para/este/diretorio/hooks
```

Ou via variável de ambiente:
```bash
export GEMINI_HOOKS_DIR=$(pwd)/hooks
```
