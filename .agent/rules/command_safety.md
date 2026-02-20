---
name: command-safety
description: Regras críticas de segurança para execução de comandos destrutivos.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Command Safety
# Priority: CRITICAL
# Description: Prevenção de perda de dados e comandos perigosos.

## Restricted Commands
1.  `rm -rf <path>`:
    - **Nunca** execute sem confirmar o caminho completo.
    - **Atenção**: Evite variáveis não expandidas (`rm -rf $VAR/`).
2.  `sudo <cmd>`:
    - Use apenas se permissão negada ou instalação de sistema (`apt`).
    - **Nunca** use `sudo pip` (quebra o sistema).
3.  `pkill <name>`:
    - **Cuidado**: Pode matar processos importantes com nomes similares.
    - Prefira `kill <pid>` após verificar com `ps`.
    - **Alternativa**: `pkill -f <pattern>` com cautela.

## Confirmation Protocol
- Para comandos destrutivos em lote (`xargs rm`, `find -delete`), sempre faça um `dry-run` (echo) primeiro.
