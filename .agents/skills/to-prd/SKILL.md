---
name: to-prd
description: |
  **PLANNING SKILL** - Synthesize current conversation context into a Product Requirements Document (PRD) without user interviews.
  USE FOR: converting discussions and codebase understanding into a structured PRD for the issue tracker.
  DO NOT USE FOR: trivial tasks, direct implementation, when requirements are already fully specified.
  INVOKES: codebase exploration, domain glossary, PRD template, gh cli.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "GitHub"
allowed-tools: [read_file, run_shell_command]
---

# To PRD

Synthesize current conversation context into a structured Product Requirements Document without interviewing the user.

**Do NOT interview the user — just synthesize what you already know** from the conversation context.

## Process

### 1. Explore the codebase

Understand current state. Apply domain vocabulary from `CONTEXT.md` and respect existing ADRs. Use the project's own terminology in the PRD.

### 2. Identify testing seams

Prefer existing test seams. Propose new seams at the highest architectural level that still catches the behavior.

Validate the seam approach with the user before proceeding to write the PRD.

### 3. Generate and publish the PRD

Use the template below and publish to the issue tracker with a `ready-for-agent` label.

## PRD Template

```markdown
## Problem Statement

[User-perspective description of the problem. What is broken or missing? Who is affected?]

## Solution

[User-perspective description of what we're building. Not how — what it does for the user.]

## User Stories

1. As a [persona], I want [goal] so that [outcome].
2. As a [persona], I want [goal] so that [outcome].
[continue as needed]

## Implementation Decisions

### Modules involved
- [Module/component and its role in this change]

### Key interfaces
- [Type or function signature that must change or be created]

### Architectural choices
- [Decision and brief rationale — avoid file paths unless prototype-derived]

## Testing Decisions

- Focus on external behavior, not implementation details.
- [Test seam description and what it covers]
- [Reference to prior art test patterns in the codebase, if any]

## Out of Scope

- [Explicitly excluded feature or concern]
- [Adjacent capability that will NOT be addressed]

## Further Notes

[Any constraints, dependencies, open questions, or links to relevant ADRs]
```

## Publishing

```bash
gh issue create \
  --title "PRD: [Feature Name]" \
  --body "$(cat prd.md)" \
  --label "ready-for-agent"
```

## Checklist

- [ ] Codebase explored; domain vocabulary applied throughout.
- [ ] Testing seams identified and validated with user before writing.
- [ ] PRD does not ask questions — synthesizes what is already known.
- [ ] All template sections complete (problem, solution, stories, implementation, testing, out of scope).
- [ ] Published to issue tracker with `ready-for-agent` label.
