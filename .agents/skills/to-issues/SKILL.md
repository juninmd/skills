---
name: to-issues
description: |
  **PLANNING SKILL** - Break a plan or PRD into independently-grabbable GitHub issues using vertical slices (tracer bullets).
  USE FOR: converting a plan/PRD/discussion into structured GitHub issues, decomposing features into AFK/HITL slices.
  DO NOT USE FOR: triaging existing issues (use github-triage), implementing code directly.
  INVOKES: gh cli, vertical slice decomposition, issue templates.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "GitHub"
allowed-tools: [read_file, run_shell_command, invoke_agent]
---

# To Issues

Break a plan into independently-grabbable GitHub issues using vertical slices (tracer bullets).

See [process and issue template](references/to-issues-process.md) for the full workflow.

## Quick reference

### Slice types

- **AFK** — can be implemented and merged without human interaction (prefer these)
- **HITL** — requires human interaction (architectural decision, design review)

### Vertical slice rules

- Each slice delivers a narrow but COMPLETE path through every layer (schema, API, UI, tests)
- A completed slice is demoable or verifiable on its own
- Prefer many thin slices over few thick ones

### Process summary

1. Gather context from conversation (fetch issue if referenced)
2. Explore codebase to use domain vocabulary
3. Draft vertical slices with title, type (AFK/HITL), blockers, user stories
4. Quiz user on granularity and dependency relationships
5. Publish approved issues in dependency order (blockers first)

### Commands

```bash
gh issue create --title "Title" --body "$(cat body.md)" --label "ready-for-agent"
gh issue list --label "ready-for-agent"
```

Do NOT close or modify any parent issue.

## Checklist

- [ ] Context gathered from conversation and codebase.
- [ ] Domain vocabulary used in issue titles and descriptions.
- [ ] Each slice is thin, vertical, and independently demoable.
- [ ] AFK vs HITL correctly classified.
- [ ] Dependency order confirmed with user.
- [ ] Issues published in dependency order (blockers first).
- [ ] Parent issue not modified.
