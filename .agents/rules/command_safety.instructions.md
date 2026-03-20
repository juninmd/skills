---
trigger: model_decision
applyTo: '**/*.sh, **/Makefile, **/.gitlab-ci.yml, **/Dockerfile, **/docker-compose*.yml'
description: Regras críticas de segurança para execução de comandos destrutivos.
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
    - **Sinais**: Sugira `pkill` ou `kill` apenas se o processo estiver travado, preferindo sinais suaves (SIGTERM) antes de forçar (SIGKILL).
4.  `mv <src> <dest>`:
    - **Move/Rename Guard**: Ao sugerir `mv` em diretórios com muitos arquivos, valide o destino para evitar sobrescritas acidentais.
5.  `chmod 777` ou `-R 777`:
    - **Nunca** utilize permissões abertas como paliativo para problemas de acesso. Aplique privilégios mínimos (ex: `755` ou `644`).
6.  `git push --force`:
    - **Alerta Máximo**: Nunca faça force push na branch `main`/`master` ou branches compartilhadas. Restrinja a force pushes apenas em suas branches em dev.

## Confirmation Protocol
- Para comandos destrutivos em lote (`xargs rm`, `find -delete`), sempre faça um `dry-run` (echo) primeiro.
- **Protocolo de Resposta**: Se o comando for perigoso, mostre-o em um bloco de código separado com um aviso de 🚨 **ALERTA DE SEGURANÇA**.