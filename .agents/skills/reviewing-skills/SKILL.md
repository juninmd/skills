---
name: reviewing-skills
description: "Frontmatter audit, YAML validation. Triggers: frontmatter."
argument-hint: "[context] [options]"
---
---

# Reviewing Skills

## Objective
Audit and improve skills in `.agents/skills/` with a focus on clarity, standardization, and actionability.

## Mandatory Rules
1. Maintain valid frontmatter compliant with the specification (`name`, `description`, `argument-hint`).
2. Ensure short, objective, and executable instructions using active voice.
3. Preserve consistency in terminology and executable examples.
4. Always include practical bash/CLI examples where applicable.

## Review Checklist
1. Name and directory must match exactly.
2. Frontmatter must contain `name`, `description`, and `argument-hint`.
3. `description` must explain what the skill does and when to use it clearly.
4. Avoid duplication, contradiction, and prolix text.
5. Require a clear operational flow: Plan -> Execute -> Validate.
6. Ensure paths use `/` and maintain consistent file references.
7. Verify that practical CLI/bash examples are provided for common tasks.

## Correction Process
1. Identify problems by severity.
2. Correct directly when within scope.
3. Validate with repository lint/build.
4. Report what was adjusted and remaining risks.

## References

- [Workspace Agent Conventions](../../../AGENTS.md)
- [GitHub CLI Manual](https://cli.github.com/manual/)

