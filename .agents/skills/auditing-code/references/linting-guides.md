# Linting and Static Analysis Guide

Engine-specific commands and examples for code auditing.

## Common Tasks

### Python (Ruff/Mypy/Bandit)
- **Lint & Fix:** `ruff check --fix .`
- **Formatting:** `ruff format .`
- **Type Checking:** `mypy .`
- **Security:** `bandit -r . -c "bandit.yaml"`

### Node.js / TypeScript (Biome/TSC)
- **Lint & Fix:** `biome check --write .`
- **Type Checking:** `tsc --noEmit`
- **Security Audit:** `pnpm audit`

## Examples
### Refactoring for Complexity
If the linter reports a complexity violation (e.g., `C901 'process_data' is too complex (15)`):
**Action:** Extract logic into focused helper functions like `_validate_input`, `_transform_data`, and `_save_result` to bring complexity below 10.

## Troubleshooting
- **Config Conflicts:** When using Biome, remove legacy `.eslintrc` and `.prettierrc` to avoid tool confusion.
- **Ignore Patterns:** Always ensure tools respect `.gitignore` and native ignore files (e.g., `biome.json` ignore arrays) to avoid noise from build artifacts.
