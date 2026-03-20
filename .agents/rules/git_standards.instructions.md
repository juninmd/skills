---
name: git-workflow-standards
description: Padronização para operações de versionamento, garantindo sincronia com repositórios remotos sem conflitos.
applyTo: '**/*.{ts,js,py,go,java}, **/package.json, **/pyproject.toml, **/.gitignore, **/.gitlab-ci.yml'
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Git Workflow

## Descrição
Padronização para operações de versionamento, garantindo sincronia com repositórios remotos sem conflitos.

## Fluxo de Trabalho Obrigatório
Sempre que iniciar uma tarefa de desenvolvimento, garanta:

1. **Configuração do Repositório**:
    - Existe arquivo `.gitignore` adequado ao ecossistema (ex: ignorando `.env`, `.venv`, `node_modules`, `coverage.xml`).
    - Dependências instaladas (ex: `.venv` para Python, `npm install`/`pnpm install` para JS/TS).
    - Arquivo `Makefile` ou de scripts (ex: `package.json`) presente e funcional.

2. **Commits e Versionamento**:
    - **Commits**: Toda alteração deve gerar um commit local com uma mensagem clara sobre o que foi feito seguindo o padrão **Conventional Commits**:
      - `feat:` — nova funcionalidade
      - `fix:` — correção de bug
      - `docs:` — documentação
      - `chore:` — tarefas de manutenção
      - `refactor:` — refatoração
      - `test:` — testes
      - `ci:` — pipeline
    - **Versão**: Sempre que tiver alteração nos arquivos do Android, backend ou frontend, deve-se incrementar a versão nos labels existentes na interface web e também na pagina principal do android.
    Não ultrapassar 73 caracteres na mensagem do commit para garantir legibilidade.
    - **Branches**: Sempre trabalhe com branches e siga o padrão `tipo/descricao` em kebab-case, minúsculas e sem espaços:
      - `feat/<descricao>`
      - `fix/<descricao>`
      - `chore/<descricao>`
      - `hotfix/<descricao>`
      Exemplo: `feat/add-telemetry-endpoint`
    - **Merge**: Evite fazer commits diretamente na master/main. Mantenha uma versão estável antes de realizar o merge.
    - **Persistência**: Sempre faça commits semânticos e push ao fim do dia. Não retenha código na máquina (risco de corrupção ou roubo), mas solicite permissão ao usuário antes.
    - **MRs**: Não faça merge requests enormes com muitas alterações; isso dificulta a análise de código.

3. **Code Review e Merge**:
    - Valide se seu código está funcionando, crie testes unitários, verifique se a cobertura se manteve ou aumentou.
    - Descreva as alterações para que outros colaboradores possam entender.
    - Aprovação requer ao menos duas pessoas (Você não conta).

## Padrões Detectados (Legado)
- **Branch Principal**: O padrão é `main`. Repositórios legados podem usar `master`; migre quando possível.
- **Sincronia**: Sempre faça `git pull origin main` antes de iniciar.

## Regras Gerais
1. **Pull Before Work**: Sempre sugira `git pull` antes de sugerir a criação de uma nova branch.
2. **Branch Check**: Verifique a branch atual antes de push/merge.
3. **Submódulos**: Se houver submódulos, lembre de `git submodule update --init --recursive`.

## Anti-Patterns
- **Nunca** faça push direto em `main`/`master` sem branch e MR aprovado.
- **Nunca** faça commit sem mensagem clara seguindo Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).
- **Nunca** faça push com falhas de segurança, cobertura abaixo de 90% ou erros conhecidos em logs.
