---
name: handoff
description: |
  **CONTINUITY SKILL** - Compact current conversation into a transferable handoff document for the next agent or session.
  USE FOR: agent-to-agent continuity, ending a long session, preparing context for another developer or AI to continue.
  DO NOT USE FOR: internal session notes, permanent documentation, implementation tasks.
  INVOKES: temp file creation, context summarization.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Handoff

Create a compact handoff document for agent-to-agent or session-to-session continuity.

## Storage

Save to the OS temp directory, **not** the current workspace:
- Windows: `%TEMP%\handoff-[slug].md`
- Unix: `/tmp/handoff-[slug].md`

Use any user-provided arguments as context for focusing the next session's goals.

## Document structure

```markdown
# Handoff: [Project / Feature Name]

**Date:** [ISO date]
**From:** [current session / agent]
**Goal for next session:** [one sentence — what should be completed next]

## Context

[2–4 sentence summary of what was accomplished and what state things are in.
Link to existing artifacts rather than duplicating them.]

## Artifacts

- PRD: [link or path]
- Plan / spec: [link or path]
- ADRs: [link or path]
- Relevant issues: [gh issue URL]
- Recent commits: [git log --oneline -5 output]
- Open diff: [git diff --stat output]

## Current state

- [x] Completed task 1
- [x] Completed task 2
- [ ] In-progress task 3 — [brief state]
- [ ] Blocked task 4 — [blocker description]

## Suggested skills for next session

- `/[skill-name]` — [why it's relevant]
- `/[skill-name]` — [why it's relevant]

## Open questions

- [Question that needs resolution before proceeding]

## Known risks / watch-outs

- [Anything the next agent should be careful about]
```

## Rules

- **Link, don't duplicate.** Reference existing PRDs, plans, ADRs, issues, commits, and diffs — do not copy their content into the handoff.
- **Redact sensitive data.** Remove API keys, passwords, PII, and any secrets before writing.
- **Be specific about the next goal.** "Continue the work" is not a goal. "Implement the `UserRepository.findByEmail` method and wire it into the auth flow" is a goal.
- **Suggested skills section is required.** Always include at least one skill recommendation for the next agent.

## After writing

Report the full file path to the user so they can pass it to the next session.

## Checklist

- [ ] Saved to OS temp directory, not the workspace.
- [ ] Links to artifacts instead of duplicating content.
- [ ] Sensitive data redacted (keys, passwords, PII).
- [ ] Next goal is specific and actionable.
- [ ] Suggested skills section included.
- [ ] File path reported to user.
