---
name: auditing-code
description: |
  **AUDIT SKILL** - Run static analysis, linting, and security scans for Python and JS/TS.
  USE FOR: linting code, formatting, type checking, security scans (Bandit/npm audit), cyclomatic complexity.
  DO NOT USE FOR: refactoring logic (use applying-design-principles), runtime bugs (use diagnosing-bugs), dependency upgrades.
  INVOKES: ruff, mypy, bandit, biome, tsc, pnpm audit.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [run_shell_command, read_file]
---

# Code Auditor and Linter

Ensure code quality and security through standardized static analysis and automated linting procedures.

**USE FOR:**
- Running ultra-fast linting and formatting using `ruff` (Python) and `biome` (JS/TS).
- Performing static type checking with `mypy` or `tsc`.
- Executing security audits using `bandit` or `pnpm audit`.
- Analyzing cyclomatic complexity to identify refactoring candidates.
- Applying automated fixes for stylistic and trivial code issues.

**DO NOT USE FOR:**
- Complex logic refactoring beyond stylistic fixes.
- Debugging runtime execution errors or race conditions.
- Upgrading major dependency versions or migrating frameworks.

**INVOKES:**
- `ruff`, `biome`, `mypy`, `tsc`, `bandit` shell commands.

## Instructions
Refer to [Linting and Static Analysis Guide](references/linting-guides.md) for tool-specific commands, complexity targets, and troubleshooting tips.

## Core Rules
1. **Fix First:** Always run tools with auto-fix flags (`--fix`, `--write`) before reporting results.
2. **Context Detection:** Automatically detect project language and select the appropriate toolset.
3. **Complexity Limit:** Flag functions with Cyclomatic Complexity > 10 for mandatory refactoring.

## Checklist
- [ ] Confirm target language and config files before running analysis.
- [ ] Prioritize security and maintainability risks over stylistic churn.
- [ ] Re-run analysis after remediation to verify the fix.
