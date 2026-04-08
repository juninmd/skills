---
name: reviewing-skills
description: Review and strengthen existing skills for compliance with agentskills.io, LLM instruction quality, and content consistency in English.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Reviewing Skills

## Objective
Audit and improve skills in `.agents/skills/` with a focus on clarity, standardization, and actionability.

## Mandatory Rules
1. Maintain valid frontmatter compliant with the specification.
2. Ensure short, objective, and executable instructions.
3. Preserve consistency in terminology and executable examples.

## Review Checklist
1. Name and directory must match exactly.
2. `description` must explain what the skill does and when to use it.
3. Avoid duplication, contradiction, and prolix text.
4. Require a clear operational flow: Plan -> Execute -> Validate.
5. Ensure paths with `/` and consistent file references.

## Correction Process
1. Identify problems by severity.
2. Correct directly when within scope.
3. Validate with repository lint/build.
4. Report what was adjusted and remaining risks.
