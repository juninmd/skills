---
name: post-command-hook
description: Hook executado após cada comando no Gemini CLI para logging e monitoramento de performance.
metadata:
    works_on: [gemini_cli]
---

# Post-Command Hook

Este hook é executado **após** cada comando gerado pela IA ser executado no Gemini CLI.

## Funcionalidades

### Command Logging
Registra a execução de todos os comandos executados via Gemini CLI em um arquivo de log (`.gemini_command_log`), incluindo:

- **Timestamp**: Data e hora de execução
- **Command**: Comando executado
- **Duration**: Tempo de execução em segundos
- **Status**: SUCCESS ou FAILURE (baseado no exit code)

### Performance Monitoring
Ajuda a identificar comandos lentos que podem necessitar otimização.

### Audit Trail
Mantém um histórico de todas as operações realizadas, útil para:
- Debug de problemas
- Auditoria de segurança
- Análise de produtividade
- Post-mortem de incidentes

## Arquivo de Implementação

`post-command.py` - Script Python executado automaticamente pelo Gemini CLI.

## Como Instalar

Configure o caminho no seu arquivo `~/.gemini/settings.json`:

```json
{
  "hooks": {
    "post_command": "/path/to/padrao-labs-agents/.agents/hooks/post-command.py"
  }
}
```

Ou passe a flag ao executar comandos:

```bash
gemini --hooks-dir /path/to/padrao-labs-agents/.agents/hooks/
```

## Exemplo de Log

```
[2026-02-13 14:30:45] CMD: 'npm install' | DURATION: 12.34s | STATUS: SUCCESS
[2026-02-13 14:31:02] CMD: 'pytest tests/' | DURATION: 3.21s | STATUS: SUCCESS
[2026-02-13 14:32:15] CMD: 'kubectl apply -f deploy.yaml' | DURATION: 1.87s | STATUS: FAILURE
```

## Documentação Oficial

- [Gemini CLI Hooks](https://geminicli.com/docs/hooks/)
- [Writing Hooks](https://geminicli.com/docs/hooks/writing-hooks/)
