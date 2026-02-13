---
name: git-workflow-standards
description: Padronização para operações de versionamento, garantindo sincronia com repositórios remotos sem conflitos.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Rule: Git Workflow
# Identificador: git_standards

## Descrição
Padronização para operações de versionamento, garantindo sincronia com repositórios remotos sem conflitos.

## Padrões Detectados
- **Branch Principal**: Alternância entre `master` e `main` dependendo do projeto.
- **Sincronia**: Uso frequente de `git pull origin <branch>` antes de iniciar trabalhos.
- **Integração**: Uso de `code .` logo após o pull para iniciar o desenvolvimento.

## Regras
1. **Pull Before Work**: Sempre sugira `git pull` antes de sugerir a criação de uma nova branch ou edição de arquivos.
2. **Branch Check**: Verifique em qual branch o usuário está (`git branch --show-current`) antes de sugerir comandos de push ou merge.
3. **Commit Messages**: Encoraje mensagens de commit concisas e explicativas, evitando mensagens genéricas como "update" ou "fix".
4. **Submódulos**: Se o repositório contiver submódulos, lembre o usuário de rodar `git submodule update --init --recursive`.

## Protocolo de Conflito
- Se detectar conflitos de merge, sugira o uso de `git status` para listar os arquivos e recomende o VS Code (`code .`) para resolução visual.
