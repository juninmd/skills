---
name: git-workflow-standards
description: Standardization for version control operations, ensuring sync with remote repositories and fewer conflicts.
applyTo: '**/*.{ts,js,py,go,java}, **/package.json, **/pyproject.toml, **/.gitignore, **/.gitlab-ci.yml'
---

# Rule: Git Workflow

## Description
Standardization for version control operations to keep local and remote repositories synchronized with minimal conflicts.

## Mandatory Workflow
Whenever starting a development task, ensure:

1. **Repository Setup**:
  - A proper `.gitignore` exists for the stack (for example: `.env`, `.venv`, `node_modules`, `coverage.xml`).
  - Dependencies are installed (for example: `.venv` for Python, `npm install`/`pnpm install` for JS/TS).
  - `Makefile` or script entry points (`package.json`) are present and functional.

2. **Commits and Versioning**:
  - **Commits**: every meaningful change must generate a local commit with a clear message following **Conventional Commits**:
      - `feat:` — new feature
      - `fix:` — bug fix
      - `docs:` — documentation
      - `chore:` — maintenance tasks
      - `refactor:` — refactoring
      - `test:` — tests
      - `ci:` — pipeline
  - **Version Labels**: when there are Android, backend, or frontend changes, update visible version labels in the web interface and Android main page when applicable.
  - Keep commit subject lines at or below 73 characters for readability.
  - **Branches**: always work in branches and follow `type/description` in lowercase kebab-case:
      - `feat/<description>`
      - `fix/<description>`
      - `chore/<description>`
      - `hotfix/<description>`
      Example: `feat/add-telemetry-endpoint`
  - **Merge**: avoid direct commits on `main`/`master`. Keep a stable integration flow through merge requests.
  - **Persistence**: commit semantically and push by end of day to reduce local-only risk; request user permission before pushing.
  - **MR Size**: avoid oversized merge requests; smaller changes improve review quality.

3. **Code Review and Merge**:
  - Validate that code works, add unit tests, and ensure coverage is maintained or improved.
  - Describe changes clearly for reviewers.
  - Approval requires at least two reviewers (you are not counted).

## Legacy Patterns
- **Default Branch**: `main` is preferred. Legacy repositories may still use `master`; migrate when possible.
- **Sync**: run `git pull origin main` before starting work.

## General Rules
1. **Pull Before Work**: suggest `git pull` before creating a new branch.
2. **Branch Check**: verify current branch before push/merge.
3. **Submodules**: when submodules exist, run `git submodule update --init --recursive`.

## Anti-Patterns
- **Never** push directly to `main`/`master` without an approved branch and MR.
- **Never** commit without a clear Conventional Commit message (`feat:`, `fix:`, `chore:`, etc.).
- **Never** push with unresolved security failures, coverage below 90%, or known runtime errors.
