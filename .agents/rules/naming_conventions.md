---
name: naming-conventions
description: Padrões de nomenclatura para sistemas e arquivos.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Naming Conventions
# Id: naming_conventions

## Sistemas
- Definir nomes de sistemas não é um problema, desde que seja utilizado internamente e não seja complexo.
- **Acessibilidade**: Usuários externos não podem acessar sistemas com nomes fictícios ou apenas em inglês; deve ser acessível.
- **Sufixos**: Sugere-se utilizar sufixos para identificar a natureza do sistema:
  - `-api`
  - `-worker`
  - `-cron`
  - `-frontend`

