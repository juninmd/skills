---
name: operating-shell
description: Operações fundamentais de sistema e segurança no terminal Linux/Unix.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[command/script] [options]"
disable-model-invocation: true
---

# Shell Core & Safety

Esta skill gerencia a navegação, manipulação de arquivos e execução de comandos no sistema operacional, priorizando segurança e eficiência.

## Workflow

### 1. Construct Command
- **Chaining:** Use pipes `|` para conectar comandos (ex: `grep | sort`).
- **Redirection:** Use `>` para salvar output em arquivos temporários e evitar flood no terminal.
- **Background:** Use `&` para processos de longa duração, mas monitore o PID.

### 2. Safety Review (Dry Run)
- **Destructive Commands:** Antes de `rm`, `mv` ou `dd`, verifique o alvo duas vezes.
- **Simulation:** Sempre que possível, use flags de "dry run" (ex: `rsync --dry-run`, `make --dry-run`).
- **Sudo:** Evite `sudo` implícito. Se necessário, explique o motivo.

### 3. Execution & Troubleshooting
- **Exit Codes:** Verifique `$?` após execução (0 = sucesso).
- **Efficiency:** Use flags silenciosas (`-q`, `--quiet`) em comandos verbosos para economizar tokens.

## Common Tools
- **Find:** `find . -name "*.log" -type f` (Localização precisa).
- **Grep:** `grep -r "pattern" .` (Busca de conteúdo).
- **Process:** `ps aux | grep <name>` e `kill <PID>` (Gestão de processos).
- **Network:** `curl -v <url>` (Debug de conectividade).

## Best Practices
- **Token Efficiency:** Redirecione outputs longos para arquivos (`cmd > /tmp/log.txt`) e leia apenas o necessário (`head -n 20 /tmp/log.txt`).
- **Security:** Nunca hardcode senhas ou chaves de API nos comandos. Use variáveis de ambiente (`$MY_SECRET`).
- **Cleanliness:** Remova arquivos temporários após o uso.