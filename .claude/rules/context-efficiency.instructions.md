---
name: context-efficiency
description: "Use when gathering context, searching code, navigating workspace, or reducing prompt bloat with targeted reads and cache hygiene. Triggers: context efficiency, targeted search, prompt hygiene, token usage, workspace navigation, file structure."
applyTo: '**/*'
paths:
  - "**"
trigger: always_on
---

# Rule: Context Efficiency

> **Mission:** Maximize signal, minimize tokens. Think in layers.

## Retrieval Order

1. **File names + status** — start light before reading content
2. **Exact identifier search** — before broad keyword searches
3. **Bounded slices** — read only the relevant section of a file
4. **Expand context** — only when evidence is insufficient

## Efficient Commands

```bash
# Fast file discovery (exclude noise)
rg --files -g '!node_modules' -g '!dist' -g '!coverage' | head -100

# Precise symbol search
rg -n "exactSymbol|errorText" src tests --max-count=60

# Git status at a glance
git status --short
git diff --name-only

# Bounded file reading
head -100 path/to/file
tail -80 path/to/file
sed -n '50,100p' path/to/file
```

## Prompt-Cache Hygiene

- **Stable instructions first** — global rules early in context stay cached
- **Volatile data last** — logs, diffs, user input at the end of the prompt
- **Never rewrite rules** for one-off preferences — use inline overrides
- **Reference paths** over copying large content into context

## Avoid by Default

- Recursive directory dumps without depth limit
- Full log files, lockfile contents, coverage reports pasted wholesale
- Broad searches for common words (`get`, `data`, `error`)
- Reading every skill/rule when one targeted file suffices

## Reporting

- Summarize output instead of pasting raw content
- Include only the files/lines/failures that affect the decision
- Use file:line references for precision, not block quotes

## Workspace Navigation

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

**Narrowest scope first.** Skip generated/vendor/build/coverage/lock/minified/sourcemap.

**Cap large output:** `| head -n N` or `| Select-Object -First N`.
