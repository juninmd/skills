---
name: auditing-code
description: "Python and JS/TS linting with ruff and biome. Triggers: ruff, biome."
argument-hint: "[file/module] [options]"
---
---

# Code Auditor and Linter

This skill standardizes static code analysis to ensure quality and security before code review.

## Instructions
1.  **Context Detection:** Identify the language (Python vs Node) and use the appropriate tool.
    *   **Python:** Use `ruff` (linter + formatter) and `mypy` (type checking).
    *   **Node.js/TS:** Use `biome` (replaces eslint and prettier for ultra-fast linting and formatting) and `tsc` for type checking.
2.  **Fix First:** Run tools with the auto-fix flag before reporting errors.
    *   **Rationale:** Automating trivial fixes (spacing, imports) saves human review time.
3.  **Security Scan:** Use `bandit` (Python) or `npm audit` (Node) for known vulnerabilities in dependencies.
    *   **Validation:** The output must be "No issues found" or similar.
4.  **Complexity Check:** Monitor Cyclomatic Complexity. Functions with a complexity > 10 should be refactored.

## Common Tasks
### Python
*   **Lint & Fix:** `ruff check --fix .`
*   **Formatting:** `ruff format .`
*   **Type Checking:** `mypy .`
*   **Security:** `bandit -r . -c "bandit.yaml"`

### Node.js / TypeScript
*   **Lint & Formatting & Fix:** `biome check --write .`
*   **Type Checking:** `tsc --noEmit`
*   **Security:** `pnpm audit`

## Examples
### Refactoring Trigger
If the linter reports:
`C901 'process_data' is too complex (15)`
**Action:** Break the `process_data` function into smaller sub-functions (`_validate_input`, `_transform_data`, `_save_result`).

## Troubleshooting
- **Configuration Conflicts:** If migrating, remove `.eslintrc` and `.prettierrc` and rely solely on `biome.json`.
- **Ignored Files:** Always respect `.gitignore` and `.ruffignore`/`biome.json` ignore arrays to avoid analyzing generated/build files.

## Checklist

- [ ] Confirm the target language, linter, and config files before running analysis.
- [ ] Prioritize real defects, security issues, and maintainability risks over stylistic churn.
- [ ] Re-run the exact analysis command after each remediation to prove the issue is closed.

## References

- [Ruff Documentation](https://docs.astral.sh/ruff/)
- [Biome Documentation](https://biomejs.dev/)

