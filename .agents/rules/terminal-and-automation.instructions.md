---
name: terminal-and-automation
description: Safe terminal usage, shell scripting, and Makefile automation.
applyTo: '**/*.sh,**/Makefile,**/Dockerfile,**/.gitlab-ci.yml,**/package.json,**/pyproject.toml'
---

# Rule: Terminal and Automation

## 1. Command Safety (Critical)
- **Destructive Commands**: Validate paths before `rm -rf`. Avoid unexpanded variables.
- **Permissions**: Never use `chmod 777`. Apply least privilege.
- **Sudo**: Only for system packages or permission denied. Never `sudo pip`.
- **Force Push**: Forbidden on `main/master` or shared branches.

## 2. Shell Scripting Standards
- **Syntax**: Use `#!/bin/bash`, `set -e`, and `${VAR}`. Prefer `$()` over backticks.
- **Safety**: Validate variables before destructive loops. Use `mkdir -p` and `rm -f` (idempotency).
- **Logging**: Redirect background output: `command > /tmp/app.log 2>&1 &`.

## 3. Makefile Standards
- **Requirement**: Mandatory for Python projects at root.
- **Config**: Add `SHELL := /bin/bash` at top.
- **Standard Targets**: `run`, `coverage`, `server`, `clean`.
- **Venv**: Activate `.venv` or reference `.venv/bin/` binaries.

## 4. Workspace Navigation
- **Hierarchy**: Use `tree -L 2`. Suggest `ls -F` for new projects.
- **Relative Paths**: Always show expected `pwd`.
- **VS Code**: Suggest `code .` for multi-file edits.
- **Reading**: Use `head`, `tail`, or `grep` for large files instead of `cat`.
