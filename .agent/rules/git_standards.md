---
name: git-workflow-standards
description: Padronização para operações de versionamento, garantindo sincronia com repositórios remotos sem conflitos.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Git Workflow

## Descrição
Padronização para operações de versionamento, garantindo sincronia com repositórios remotos sem conflitos.

## Fluxo de Trabalho Obrigatório
Sempre que iniciar uma tarefa de desenvolvimento, garanta:

1. **Configuração do Repositório**:
    - Existe arquivo `.gitignore` ignorando `.env`, `__pycache__`, `coverage.xml`, `.venv`.
    - Ambiente virtual `.venv` criado e dependências (`requirements.txt`) instaladas.
    - Arquivo `Makefile` presente e funcional.

2. **Commits e Versionamento**:
    - **Commits**: Toda alteração deve gerar um commit local com uma mensagem clara sobre o que foi feito (ex: `feat: add new telemetry field`).
    - **Versão**: Sempre que tiver alteração nos arquivos do Android, backend ou frontend, deve-se incrementar a versão nos labels existentes na interface web e também na pagina principal do android.
    - **Branches**: Sempre trabalhe com branches, evite fazer commits diretamente na master/main. Mantenha uma versão estável antes de realizar o merge.
    - **Persistência**: Sempre faça commits semânticos e push ao fim do dia. Não retenha código na máquina (risco de corrupção ou roubo), mas solicite permissão ao usuário antes.
    - **MRs**: Não faça merge requests enormes com muitas alterações; isso dificulta a análise de código.

3. **Code Review e Merge**:
    - Valide se seu código está funcionando, crie testes unitários, verifique se a cobertura se manteve ou aumentou.
    - Descreva as alterações para que outros colaboradores possam entender.
    - Aprovação requer ao menos duas pessoas (Você não conta).

## Padrões Detectados (Legado)
- **Branch Principal**: Alternância entre `master` e `main`.
- **Sincronia**: Uso frequente de `git pull origin <branch>` antes de iniciar.

## Regras Gerais
1. **Pull Before Work**: Sempre sugira `git pull` antes de sugerir a criação de uma nova branch.
2. **Branch Check**: Verifique a branch atual antes de push/merge.
3. **Submódulos**: Se houver submódulos, lembre de `git submodule update --init --recursive`.
