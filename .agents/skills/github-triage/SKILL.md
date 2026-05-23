---
name: github-triage
description: |
  **MAINTENANCE SKILL** - Triage GitHub issues using a label-based state machine.
  USE FOR: classification (bug/enhancement), state (needs-triage/ready-for-agent), bug reproduction, agent briefs, out-of-scope.
  DO NOT USE FOR: remote branch management (use git-cleanup), repository config, implementing fixes.
  INVOKES: gh cli, bug reproduction, agent brief templates.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "GitHub"
allowed-tools: [run_shell_command, read_file, invoke_agent]
---

# GitHub Issue Triage

Expert methodology for managing the issue lifecycle using a structured state machine and the `gh` CLI.

**USE FOR:**
- Presenting grouped overviews of issues needing attention.
- Evaluating issue validity and categorizing as `bug` or `enhancement`.
- Attempting deterministic reproductions to confirm symptoms.
- Building durable agent briefs for `ready-for-agent` tasks.
- Managing maintainer overrides.

**DO NOT USE FOR:**
- General repository maintenance tasks.
- Committing code fixes directly.

**INVOKES:**
- `gh issue list`, `gh issue comment`, `gh issue edit`.

## Methodology
Implementation details are documented in:
1. [Logic & Labels](references/triage-logic.md) | [Workflow](references/triage-workflow.md)
2. [Triage Standards](references/triage-standards.md) | [Agent Briefs](references/AGENT-BRIEF.md)
3. [Out-of-Scope Policy](references/OUT-OF-SCOPE.md)

## Core Principles
1. **Disclaimer:** Public comments must include the AI disclaimer.
2. **State Integrity:** Maintain exactly one state and category label.
3. **Safety:** Reproduction attempts must be non-destructive.

## Checklist
- [ ] Read all prior triage notes before proposing steps.
- [ ] Provide clear recommendations for the maintainer.
- [ ] Confirm all label changes and comments.
- [ ] Ensure agent briefs follow standard structures.
