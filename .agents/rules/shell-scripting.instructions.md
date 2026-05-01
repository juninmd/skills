---
name: shell-scripting
description: "Use when writing shell scripts, package scripts, or CI commands with safe flags and idempotent patterns. Triggers: shell script, bash script, package script, CI script, idempotent command."
applyTo: '**/*.sh, **/package.json, **/Makefile, **/.github/workflows/*.yml'
---

# Rule: Shell Scripting

> **Mission:** Idempotent scripts. Explicit errors. Least surprise.

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

# ✅ Background with logging
command > /tmp/app.log 2>&1 &

# ✅ Validate before destructive ops
[[ -z "$TARGET" ]] && { echo "TARGET is required"; exit 1; }
```

## Package Manager Scripts (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "biome check src",
    "lint:fix": "biome check src --apply",
    "typecheck": "tsc --noEmit",
    "prepare": "husky"
  }
}
```

## Package Manager Commands

```bash
# pnpm (preferred for new projects)
pnpm install --frozen-lockfile
pnpm add <package>
pnpm add -D <package>

# bun
bun install --frozen-lockfile
bun add <package>
bunx <package>          # run without global install

# npm
npm ci                  # CI-safe install
npm run <script>
```

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

## Dry-Run Protocol

For destructive operations, always provide echo dry-run first:

```bash
# DRY RUN — verify targets
for file in *.log; do echo "Would delete: $file"; done

# REAL — execute after confirmation
for file in *.log; do rm "$file"; done
```
