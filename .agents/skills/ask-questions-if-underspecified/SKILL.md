---
name: ask-questions-if-underspecified
description: |
  **UTILITY SKILL** - Pause and ask clarifying questions when a request is ambiguous.
  USE FOR: unclear requirements, missing scope, ambiguous objectives, underspecified tasks, need clarification.
  DO NOT USE FOR: requests that are already clear, gaps that can be answered by reading local files/configs.
  INVOKES: conversation and multiple-choice options.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [ask_user]
---

# Ask Questions If Underspecified

Ensure successful task execution by resolving ambiguities early through targeted, low-friction clarifying questions.

**USE FOR:**
- Requests with multiple plausible interpretations or unclear objectives.
- Tasks where scope, constraints (performance, style, deps), or environment are missing.
- Situations where safety or reversibility (data migrations, rollouts) is unclear.
- Preventing "wrong work" by blocking implementation until must-have details are confirmed.

**DO NOT USE FOR:**
- Asking questions that can be answered by a quick, low-risk discovery read (e.g., reading `package.json`).
- Interrupting the user when the task is well-defined according to project conventions.

**INVOKES:**
- `ask_user` with structured multiple-choice options or yes/no prompts.

## Workflow and Guidelines
Implementation details for identifying ambiguity and structuring questions are documented in:
- [Clarification Workflow and Templates](references/clarification-guidelines.md)

## Behavior: Pause Before Acting
Until must-have answers arrive:
- Do not run destructive commands or produce detailed plans.
- Only perform low-risk discovery steps that do not commit you to a direction.
- If proceeding with assumptions, state them as a numbered list and wait for explicit confirmation.

## Checklist
- [ ] Resolve every ambiguity possible with a fast local read before asking the user.
- [ ] Ask only the smallest set of questions that materially changes implementation.
- [ ] Prefer bounded multiple-choice or yes/no questions over broad freeform prompts.
