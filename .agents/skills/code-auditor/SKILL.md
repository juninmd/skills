---
name: code-auditor
description: Execução de análise estática (linting), verificação de estilo e detecção de code smells em Python e JS/TS.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Code Auditor & Linter

Esta skill padroniza a análise estática de código para garantir qualidade e segurança antes do code review.

## Instructions
1.  **Context Detection:** Identifique a linguagem (Python vs Node) e use a ferramenta apropriada.
    *   **Python:** Use `ruff` (linter + formatter) e `mypy` (type checking).
    *   **Node.js/TS:** Use `eslint` e `prettier`.
2.  **Fix First:** Execute ferramentas com flag de auto-fix antes de reportar erros.
    *   **Reasoning:** Automatizar correções triviais (espaçamento, imports) economiza tempo de revisão humana.
3.  **Security Scan:** Utilize `bandit` (Python) ou `npm audit` (Node) para vulnerabilidades conhecidas em dependências.
    *   **Verification:** O output deve ser "No issues found" ou similar.
4.  **Complexity Check:** Monitore a Complexidade Ciclomática. Funções com complexidade > 10 devem ser refatoradas.

## Common Tasks
### Python
*   **Lint & Fix:** `ruff check --fix .`
*   **Format:** `ruff format .`
*   **Type Check:** `mypy .`
*   **Security:** `bandit -r . -c "bandit.yaml"`

### Node.js / TypeScript
*   **Lint & Fix:** `npm run lint -- --fix` (ou `eslint . --fix`)
*   **Format:** `npm run format` (ou `prettier --write .`)
*   **Security:** `npm audit` (ou `pnpm audit`)

## Examples
### Refactoring Trigger
Se o linter reportar:
`C901 'process_data' is too complex (15)`
**Ação:** Quebre a função `process_data` em sub-funções menores (`_validate_input`, `_transform_data`, `_save_result`).

## Troubleshooting
- **Config Conflicts:** Se `prettier` e `eslint` conflitarem, garanta que `eslint-config-prettier` está instalado e configurado como último extends no `.eslintrc`.
- **Ignore Files:** Respeite sempre `.gitignore`, `.eslintignore` e `.ruffignore` para evitar analisar arquivos gerados/builds.
