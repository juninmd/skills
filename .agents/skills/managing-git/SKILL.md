---
name: managing-git
description: Repository management, versioning, and collaborative workflows with Git following the MyProject Senior standard.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[repo/file] [options]"
---

# Version Control (Git) Senior

This skill standardizes the development workflow, ensuring a clean, linear, and traceable history.

## Instructions
1.  **Conventional Commits:** All commit messages MUST follow the [Conventional Commits](https://www.conventionalcommits.org/) standard.
    *   **Format:** `<type>(<scope>): <description>`
    *   **Types:** `feat` (new feature), `fix` (bug fix), `docs` (documentation), `style` (formatting), `refactor` (no functional change), `test` (tests), `chore` (build/deps), `ci` (pipelines).
    *   **Example:** `feat(checkout): add payment validation logic`
2.  **Linear History:** Prefer `git rebase` over `git merge` to update your branch with `main`.
    *   **Rationale:** Facilitates `git bisect` and code review.
3.  **Pre-Push Checklist:** Before sending code (`git push`):
    *   Run linters (`npm run lint` / `ruff check`).
    *   Run unit tests (`npm test` / `pytest`).
    *   Check for secrets (`git diff`).

4.  **Merge Requests (MR/PR):**
    *   **Strategy:** Prefer "Squash and Merge" for small features (1 commit to main). For complex features, ensure each commit in the branch is atomic and buildable.
    *   **Description:** Describe WHAT changed and WHY it changed. Link the issue/ticket (Jira/GitLab).
    *   **Review:** NEVER approve your own PR. Code Review is mandatory.

## Common Tasks
*   **Start Feature:** `git checkout -b feat/my-new-feature`
*   **Sync with Main:** `git fetch origin && git rebase origin/main`
*   **Amend Last Commit:** `git commit --amend --no-edit` (Use only if you haven't pushed).
*   **Undo Last Commit (Keep Changes):** `git reset --soft HEAD~1`
*   **Push Feature:** `git push -u origin feat/my-new-feature`

## Troubleshooting
*   **Conflict:** If there is a rebase conflict, resolve the files, use `git add <file>`, and `git rebase --continue`. NEVER use `git rebase --skip` unless you know exactly what you are doing.

