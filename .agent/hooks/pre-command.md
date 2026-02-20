---
name: pre-command-hook
description: Hook executado antes de cada comando gerado pela IA no Gemini CLI, fornecendo camada de segurança.
metadata:
    works_on: [gemini_cli]
---

# Pre-Command Hook

Este hook é executado **antes** de cada comando gerado pela IA ser executado no Gemini CLI. Ele serve como uma camada final de segurança.

## Funcionalidades

### Git Protection
Detecta e alerta se você estiver prestes a fazer `git push` ou `git commit` diretamente nas branches:
- `main`
- `master`
- `production`
- `release`

### Kubernetes Awareness
Exibe o contexto atual do cluster (`kubectl config current-context`) sempre que um comando `kubectl` for sugerido, evitando deploys acidentais em produção.

### Python Environment
Verifica se existe um ambiente virtual (`.venv`) no diretório mas não está ativo, sugerindo o comando de ativação.

## Arquivo de Implementação

`pre-command.py` - Script Python executado automaticamente pelo Gemini CLI.

## Como Instalar

Configure o caminho no seu arquivo `~/.gemini/settings.json`:

```json
{
  "hooks": {
    "pre_command": "/path/to/padrao-labs-agents/.agent/hooks/pre-command.py"
  }
}
```

Ou passe a flag ao executar comandos:

```bash
gemini --hooks-dir /path/to/padrao-labs-agents/.agent/hooks/
```

## Documentação Oficial

- [Gemini CLI Hooks](https://geminicli.com/docs/hooks/)
- [Writing Hooks](https://geminicli.com/docs/hooks/writing-hooks/)
