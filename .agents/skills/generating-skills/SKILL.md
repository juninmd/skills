---
name: generating-skills
description: Generate new skills compliant with agentskills.io with valid frontmatter, objective instructions, and reliable semantic routing.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[component/feature] [options]"
---

# Generating Skills

## Objective
Create production-ready skills with high semantic signal and low ambiguity.

## Instructions
1. Understand the purpose and trigger for using the skill.
2. Produce responses in English (en-US), unless otherwise requested.
3. Validate `name`:
   - 1 to 64 characters.
   - Only lowercase letters, numbers, and hyphens.
   - No hyphen at the beginning/end and no `--`.
   - Must match the folder name.
4. Write a clear `description` with scope and when to use.
5. Create `.agents/skills/<name>/SKILL.md` with valid frontmatter.
6. Structure the body with sections: Objective, When to Use, Flow, Validation.
7. Create `references/`, `scripts/`, and `assets/` only when necessary.
8. Validate with the repository's linters/build.
