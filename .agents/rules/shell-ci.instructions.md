---
name: shell-ci
description: "Use when writing shell scripts, Makefiles, CI/CD pipelines, or running destructive commands. Triggers: shell script, bash script, CI script, rm -rf, package scripts, idempotent command, destructive command."
applyTo: '**/*.sh,**/Makefile,**/.github/workflows/*.yml,**/.gitlab-ci.yml,**/Dockerfile'
paths:
  - "**/*.sh"
  - "**/Makefile"
  - "**/.github/workflows/*.yml"
  - "**/.gitlab-ci.yml"
  - "**/Dockerfile"
trigger: glob
globs: "**/*.sh,**/Makefile,**/.github/workflows/*.yml,**/.gitlab-ci.yml,**/Dockerfile"
---

# Rule: Shell, CI/CD & Automation

> **Mission:** Idempotent scripts. Dry-run first. Least privilege. No surprises.

## Bash Safety (MANDATORY)

```bash
#!/usr/bin/env bash
set -euo pipefail   # exit on error, unset var, or pipe failure

# ✅ Always quote variables
if [[ -f "$FILE" ]]; then rm "$FILE"; fi

# ✅ Idempotent operations
mkdir -p "$DIR"
rm -f "$FILE"
cp -n src dst   # no overwrite

# ✅ Validate before destructive loops
[[ -z "$TARGET" ]] && { echo "TARGET is required"; exit 1; }

# ✅ Use $() over backticks
OUTPUT=$(command)
```

## Destructive Command Safety

### rm -rf (MAXIMUM DANGER)

```bash
# ❌ NEVER with unexpanded variables
rm -rf $DIR/
rm -rf ${VAR}/

# ✅ Full path validation first
if [[ -d "/safe/path" ]]; then
  rm -rf /safe/path
fi

# ✅ DRY RUN before executing
echo "Would delete:"; find . -name "*.log" -type f
```

### sudo (Use Sparingly)

```bash
# ✅ Only for system packages
sudo apt-get install -y nginx

# ❌ NEVER for npm/pip/bun (breaks system env)
sudo npm install -g <package>
```

### chmod (Least Privilege)

```bash
# ❌ NEVER 777
chmod 777 file

# ✅ Least privilege
chmod 644 file      # regular files
chmod 755 dir       # executable directories
chmod 600 .env      # secrets
chmod 400 *.key     # private keys
```

### git push --force (ALERT: MAXIMUM)

```bash
# ❌ NEVER on main/master/shared branches
git push --force origin main

# ✅ Only on personal dev branches, prefer --force-with-lease
git push --force-with-lease origin feature/my-branch
```

## Dry-Run Protocol

```bash
# DRY RUN — verify targets first
for file in *.log; do echo "Would delete: $file"; done

# Real execution after confirmation
read -p "Proceed? (y/n) " -n 1 -r
[[ $REPLY =~ ^[Yy]$ ]] && find . -name "*.log" -type f -delete
```

## Makefile Standards

```makefile
SHELL := /bin/bash

.PHONY: run test coverage clean

run:
	.venv/bin/python -m app

coverage:
	.venv/bin/pytest --cov=src --cov-report=term-missing

clean:
	rm -rf dist/ .coverage __pycache__
```

- Mandatory for Python projects at root
- Standard targets: `run`, `test`, `coverage`, `clean`
- Always reference `.venv/bin/` binaries to avoid system Python

## CI/CD (GitHub Actions)

```yaml
- uses: pnpm/action-setup@v4
  with: { version: latest }

- name: Install
  run: pnpm install --frozen-lockfile

- name: Typecheck
  run: pnpm typecheck

- name: Test
  run: pnpm test:coverage

- name: Build
  run: pnpm build
```

## PowerShell Safety (Windows)

```powershell
# ✅ Validate path before deletion
if (Test-Path $dir) { Remove-Item -Recurse -Force $dir }

# ✅ Dry-run with -WhatIf
Remove-Item -Recurse -Force $dir -WhatIf

# ❌ NEVER with unvalidated variable expansion
Remove-Item -Recurse -Force "$env:VARIABLE"
```

## Checklist

- [ ] `#!/usr/bin/env bash` + `set -euo pipefail` in every script
- [ ] All variables quoted
- [ ] Destructive ops have dry-run or confirmation guard
- [ ] No `chmod 777` anywhere
- [ ] No `sudo pip/npm/bun`
- [ ] `--force` push only on personal branches
