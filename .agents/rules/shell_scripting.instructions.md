---
name: shell-scripting
description: Shell automation standards for loop/conditional syntax and safe, idempotent scripts.
applyTo: '**/*.sh, **/Makefile'
---

# Rule: Shell Scripting

## Essential Syntax

### Loops
- `for i in *; do echo $i; done` - file iteration.
- `while true; do ...; sleep 1; done` - continuous execution (always use `sleep` to avoid CPU lock).

### Conditionals
- `if [[ -f <file> ]]; then ...; fi` - file existence checks (prefer `[[ ]]` over `[ ]`).
- `command1 && command2` - execute second command only on success.
- `command || echo "Failed"` - basic error fallback.

### Syntax Best Practices
- Use `${VAR}` to avoid interpolation ambiguity.
- Use `set -e` in long scripts to stop on errors.
- Prefer `$()` over backticks for command substitution.

## Rules for Safe Scripts

1. **Variable Checks**: before using variables in destructive loops (for example, `rm $VAR`), validate they are defined: `[[ -z "$VAR" ]] && exit 1`.
2. **Shebang and Permissions**: every `.sh` file must have `#!/bin/bash` on the first line and `chmod +x` applied.
3. **Background Logging**: background scripts must redirect output: `command > /tmp/app.log 2>&1 &`.
4. **Idempotency**: prefer commands that can run multiple times safely - `mkdir -p`, `rm -f`, `cp -n`.
5. **Dry-Run First**: for complex or destructive `for` loops, provide an `echo` dry-run version first.

## Python Virtual Environment

- Always activate using `source .venv/bin/activate` or directly reference binaries (`.venv/bin/python`).
- Use `source` with `SHELL := /bin/bash` in Makefiles.
