---
name: workspace-nav
description: "Use when exploring codebase structure. Triggers: workspace, codebase navigation, file structure."
applyTo: '**/*'
---

# Rule: Workspace Navigation

**Never read blindly.**

- Unknown size → `wc -l <file>` first
- ≤50 lines → `cat`. >50 lines → `sed -n 'A,Bp'`, `head -n N`, `tail -n N`
- Search first, read second. Prefer `rg` over `grep`. Always `-n`.

```bash
rg -n "pattern" .
rg -n -C 2 "pattern" <file>
git status --short
git diff --name-only
```

**Narrowest scope first.** Skip generated/vendor/build/coverage/lock/minified/sourcemap unless relevant.

**Cap large output:** `| head -n N` or `| Select-Object -First N`.