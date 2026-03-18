---
name: shell-scripting
description: Padrões de automação shell — sintaxe de loops/condicionais e regras para scripts seguros e idempotentes.
applyTo: ['**/*.sh', '**/Makefile']
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Shell Scripting

## Sintaxe Essencial

### Loops
- `for i in *; do echo $i; done` — iteração de arquivos.
- `while true; do ...; sleep 1; done` — execução contínua (sempre use `sleep` para não travar CPU).

### Condicionais
- `if [[ -f <file> ]]; then ...; fi` — validação de existência de arquivo (prefira `[[ ]]` a `[ ]`).
- `command1 && command2` — execução condicional de sucesso.
- `command || echo "Failed"` — tratamento de erro básico.

### Boas Práticas de Sintaxe
- Use `${VAR}` com chaves para evitar erros de interpolação.
- Use `set -e` em scripts longos para parar em erro.
- Prefira `$()` a backticks para substituição de comandos.

## Regras para Scripts Seguros

1. **Verificação de Variáveis**: Antes de usar variável em loop destrutivo (ex: `rm $VAR`), valide se está definida: `[[ -z "$VAR" ]] && exit 1`.
2. **Shebang & Permissões**: Todo arquivo `.sh` deve ter `#!/bin/bash` na primeira linha e `chmod +x` aplicado.
3. **Logging em Background**: Scripts em background devem redirecionar saída: `command > /tmp/app.log 2>&1 &`.
4. **Idempotência**: Prefira comandos que podem ser rodados múltiplas vezes sem erro — `mkdir -p`, `rm -f`, `cp -n`.
5. **Dry-Run First**: Ao sugerir loop `for` complexo ou destrutivo, forneça primeiro uma versão com `echo` para o usuário validar.

## Ambiente Virtual (Python)

- Sempre ative via `source .venv/bin/activate` ou referencie os binários diretamente (`.venv/bin/python`).
- Use `source` em conjunto com `SHELL := /bin/bash` no Makefile.
