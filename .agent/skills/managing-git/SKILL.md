---
name: managing-git
description: Gestão de repositórios, versionamento e fluxos de trabalho colaborativos com Git seguindo o padrão Sênior Luizalabs.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Version Control (Git) Sênior

Esta skill padroniza o fluxo de desenvolvimento, garantindo um histórico limpo, linear e rastreável.

## Instructions
1.  **Conventional Commits:** Todas as mensagens de commit DEVEM seguir o padrão [Conventional Commits](https://www.conventionalcommits.org/).
    *   **Format:** `<type>(<scope>): <description>`
    *   **Types:** `feat` (nova feature), `fix` (correção de bug), `docs` (documentação), `style` (formatação), `refactor` (sem mudança funcional), `test` (testes), `chore` (build/deps), `ci` (pipelines).
    *   **Example:** `feat(checkout): add payment validation logic`
2.  **Linear History:** Prefira `git rebase` a `git merge` para atualizar sua branch com a `main`.
    *   **Reasoning:** Facilita `git bisect` e code review.
3.  **Pre-Push Checklist:** Antes de enviar código (`git push`):
    *   Execute linters (`npm run lint` / `ruff check`).
    *   Rode os testes unitários (`npm test` / `pytest`).
    *   Verifique se não há secrets (`git diff`).

4.  **Merge Requests (MR/PR):**
    *   **Strategy:** Prefira "Squash and Merge" para features pequenas (1 commit na main). Para features complexas, garanta que cada commit na branch seja atômico e buildável.
    *   **Description:** Descreva O QUE mudou e POR QUE mudou. Linke a issue/ticket (Jira/GitLab).
    *   **Review:** NUNCA aprove seu próprio PR. Code Review é obrigatório.

## Common Tasks
*   **Start Feature:** `git checkout -b feat/my-new-feature`
*   **Sync with Main:** `git fetch origin && git rebase origin/main`
*   **Amend Last Commit:** `git commit --amend --no-edit` (Use apenas se não tiver feito push).
*   **Undo Last Commit (Keep Changes):** `git reset --soft HEAD~1`
*   **Push Feature:** `git push -u origin feat/my-new-feature`

## Troubleshooting
*   **Conflict:** Se houver conflito no rebase, resolva os arquivos, use `git add <file>` e `git rebase --continue`. NUNCA use `git rebase --skip` a menos que saiba exatamente o que está fazendo.