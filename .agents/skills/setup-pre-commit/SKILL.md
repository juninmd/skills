---
name: setup-pre-commit
description: |
  **TOOLING SKILL** - Configure pre-commit hooks with Husky, lint-staged, and Prettier in a JavaScript/TypeScript project.
  USE FOR: adding pre-commit hooks to a JS/TS project, enforcing formatting and type checks before commits.
  DO NOT USE FOR: Python projects (use pre-commit.ci), non-JS projects, CI/CD pipeline setup.
  INVOKES: package manager detection, husky init, lint-staged config, prettier config.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, run_shell_command]
---

# Setup Pre-Commit

Configure pre-commit hooks using Husky, lint-staged, and Prettier in a JavaScript/TypeScript project.

## Step 1 — Detect package manager

Check for lock files:
```bash
# Check which lock file exists
ls package-lock.json pnpm-lock.yaml yarn.lock bun.lockb 2>/dev/null
```

Use the corresponding package manager for all commands below.

## Step 2 — Install dependencies

```bash
# npm
npm install --save-dev husky lint-staged prettier

# pnpm
pnpm add -D husky lint-staged prettier

# yarn
yarn add -D husky lint-staged prettier

# bun
bun add -D husky lint-staged prettier
```

## Step 3 — Initialize Husky

```bash
npx husky init
```

This creates `.husky/` and adds a `prepare` script to `package.json`.

## Step 4 — Configure the pre-commit hook

Replace `.husky/pre-commit` with:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
npx tsc --noEmit
```

Add tests only if a test script exists and runs quickly (< 30s):
```bash
# Optional — add if fast test suite exists
npm test -- --passWithNoTests
```

## Step 5 — Configure lint-staged

Add to `package.json`:
```json
{
  "lint-staged": {
    "**/*": "prettier --write --ignore-unknown"
  }
}
```

## Step 6 — Create .prettierrc (if missing)

```bash
# Only create if .prettierrc / .prettierrc.json / prettier.config.js don't exist
test -f .prettierrc || cat > .prettierrc << 'EOF'
{
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all"
}
EOF
```

## Step 7 — Verify

```bash
# Hook file must exist and be executable
ls -la .husky/pre-commit

# Dry run lint-staged on staged files
git add -A && npx lint-staged --dry-run
```

Confirm the hook file exists, configs are in place, and lint-staged runs without error.

## Checklist

- [ ] Package manager detected from lock files.
- [ ] husky, lint-staged, and prettier installed as devDependencies.
- [ ] Husky initialized (`.husky/` directory exists).
- [ ] Pre-commit hook runs lint-staged and tsc.
- [ ] lint-staged config added to package.json.
- [ ] `.prettierrc` created only if one didn't already exist.
- [ ] Hook file is executable and dry-run passes.
