---
name: git-guardrails
description: |
  **SAFETY SKILL** - Install hooks that block destructive git operations before they run.
  USE FOR: when user wants to prevent Claude from accidentally running git push, reset --hard, clean, branch -D, or checkout/restore destructive forms.
  DO NOT USE FOR: general git workflow, code review, branch management.
  INVOKES: PreToolUse hooks, settings.json configuration.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, run_shell_command]
---

# Git Guardrails

Install hooks that intercept and block dangerous git operations before they execute.

## Commands blocked

- `git push` (all variants including `--force`)
- `git reset --hard`
- `git clean` (all variants)
- `git branch -D`
- `git checkout .` / `git restore .`

## Setup process

### Step 1 — Determine scope

Ask: should this apply to the **current project** (`.claude/settings.json`) or **globally** (`~/.claude/settings.json`)?

### Step 2 — Install the guard script

**Project scope:**
```bash
mkdir -p .claude/hooks
cat > .claude/hooks/block-dangerous-git.sh << 'EOF'
#!/usr/bin/env bash
# Block dangerous git operations in Claude Code
TOOL_INPUT="$1"

DANGEROUS_PATTERNS=(
  "git push"
  "git reset --hard"
  "git clean"
  "git branch -D"
  "git checkout \."
  "git restore \."
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$TOOL_INPUT" | grep -qE "$pattern"; then
    echo "BLOCKED: Dangerous git operation detected: $pattern"
    echo "Confirm with the user before running this command manually."
    exit 2
  fi
done
EOF
chmod +x .claude/hooks/block-dangerous-git.sh
```

**Global scope:** Use `~/.claude/hooks/block-dangerous-git.sh` instead.

### Step 3 — Configure settings.json

Add to the appropriate `settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

If settings already exist, **merge** the hook into the existing configuration — do not replace it.

### Step 4 — Customize (optional)

Ask if the user wants to modify which patterns are blocked.

### Step 5 — Verify

```bash
# Should exit with code 2 and print a BLOCKED message
echo "git push origin main" | .claude/hooks/block-dangerous-git.sh
```

Confirm the hook blocks dangerous commands and exits with code 2.

## Checklist

- [ ] Scope confirmed (project vs global).
- [ ] Guard script installed and made executable.
- [ ] settings.json updated (merged, not replaced).
- [ ] Blocked patterns customized if user requested.
- [ ] Verification test run and confirmed exit code 2.
