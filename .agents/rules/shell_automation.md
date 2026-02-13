---
name: shell-automation
description: Padronização para a criação e execução de scripts de automação rápida no terminal (one-liners).
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Automation Standards
# Identificador: shell_automation

## Descrição
Padronização para a criação e execução de scripts de automação rápida no terminal (one-liners).

## Padrões Detectados
- **Loops**: Uso frequente de `for i in ...; do ...; done`.
- **Condicionais**: Uso de `if ...; then ...; fi`.
- **Ambiente**: Uso constante de `source` para carregar variáveis ou ativar venvs.

## Regras
1. **Verificação de Variáveis**: Sempre sugira verificar se uma variável está definida antes de usá-la em um loop destrutivo (ex: `rm $VAR`).
2. **Shebang & Permissões**: Se o usuário criar um arquivo `.sh`, lembre-o de adicionar `#!/bin/bash` e rodar `chmod +x`.
3. **Logging**: Para scripts que rodam em background, sugira redirecionar saída para um log local: `command > /tmp/out.log 2>&1 &`.
4. **Idempotência**: Sugira comandos que podem ser rodados múltiplas vezes sem erro (ex: `mkdir -p`, `rm -f`).

## Protocolo
- Ao sugerir um loop `for` complexo, forneça primeiro uma versão com `echo` (dry-run) para o usuário validar o que será afetado.
