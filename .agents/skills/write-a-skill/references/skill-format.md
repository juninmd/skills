# Skill Format

## Directory structure

```
.agents/skills/[skill-name]/
  SKILL.md              # required — main skill file
  references/           # optional — supporting reference files
    [reference].md
  examples/             # optional — example inputs/outputs
    [example].md
```

## SKILL.md frontmatter

```markdown
---
name: [kebab-case-name]
description: |
  **[CATEGORY] SKILL** - [One sentence what it does.]
  USE FOR: [specific triggers, phrases, contexts — be concrete]
  DO NOT USE FOR: [explicit exclusions]
  INVOKES: [tools, templates, or sub-skills it uses]
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "[any | GitHub | specific platform]"
allowed-tools: [read_file, write_file, run_shell_command, invoke_agent]
---
```

## Body guidelines

- If a section exceeds 100 lines, split into a separate file in `references/`
- Scripts handle deterministic operations to save tokens
- All references should be one level deep (no nested subdirectories in references)
- Include concrete examples throughout
- Always end with a `## Checklist` section

## Category labels

Use one of these in the description's bold prefix:
- `DIAGNOSTIC SKILL` — debugging, investigation, analysis
- `PLANNING SKILL` — design, decomposition, specification
- `STRATEGY SKILL` — high-level approach, architecture, direction
- `MAINTENANCE SKILL` — triage, cleanup, operations
- `TOOLING SKILL` — setup, configuration, scaffolding
- `WRITING SKILL` — documentation, articles, communication
- `INTERVIEWING SKILL` — questioning, validation, exploration
- `SAFETY SKILL` — security, guardrails, protection
- `META SKILL` — skills about skills, tooling about tooling
- `ARCHITECTURE SKILL` — system design, module mapping
- `CONTINUITY SKILL` — handoffs, context transfer
- `EXPLORATION SKILL` — prototyping, spike work
