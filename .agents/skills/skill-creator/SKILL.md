---
name: skill-creator
description: |
  Design and build high-quality agent skills. Use for SKILL.md authoring, frontmatter, workflow and checklist design, reference routing, token budgets, and validating skills against the spec.
---

# Skill Creator

## Workflow
1. Identify the task domain and the decision the agent gets wrong today without the skill.
2. Write a description that states what the skill does and when to use it; name equals the folder.
3. Keep `SKILL.md` procedural and under the word budget; put detail in `references/`.
4. Include a numbered workflow, rules, and a concise `## Checklist`.
5. Link only real local references; avoid stale URLs and duplicated content.
6. Validate with the repository validator, then trial the skill on a real task.

## Rules
- One skill per decision domain; overlapping skills waste context.
- Frontmatter contains only `name` and `description`.
- Test the skill on a real task before declaring it done.
- Track the token budget; a bloated skill is a bad skill.
- Keep references lazy-loaded: mention them, do not inline them.

## Checklist
- [ ] Description states what and when.
- [ ] Skill is under budget and has a Checklist.
- [ ] Validated and trialed on a real task.
