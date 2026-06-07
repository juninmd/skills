---
name: write-a-skill
description: |
  **META SKILL** - Write a new agent skill with proper structure, description, and supporting files.
  USE FOR: creating new skills, when user describes a repeatable workflow to encode, when a gap in the skill catalog is identified.
  DO NOT USE FOR: modifying existing skills (edit them directly), one-off tasks that don't recur.
  INVOKES: SKILL.md authoring, optional reference file creation.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Write a Skill

Create a new agent skill with proper structure and documentation.

See [skill structure and format details](references/skill-format.md).

## Before writing

Ask (one at a time if unclear):
1. What task does this skill perform?
2. When should an agent trigger it? (specific phrases, user requests, contexts)
3. What should it explicitly NOT do?
4. Are there multi-step workflows, reference materials, or example outputs needed?

## Critical rule: the description field

The description is the **only** information agents see when deciding which skill to load. It must:

- Stay under 1,024 characters
- Use third person ("Use when the user asks...")
- State explicit trigger phrases ("Use when user says X / Y / Z")
- State explicit exclusions ("DO NOT USE FOR: ...")
- Be specific enough to distinguish from similar skills

A vague description means the skill never gets loaded.

## Review checklist before saving

- [ ] Description under 1,024 characters with explicit triggers
- [ ] Clear USE FOR / DO NOT USE FOR boundaries
- [ ] Instructions actionable without further clarification
- [ ] Content over 100 lines moved to `references/` files
- [ ] Skill name is kebab-case and descriptive
- [ ] Draft reviewed with user

Show the draft to the user for review before saving.

## Checklist

- [ ] Requirements gathered: task, triggers, exclusions, supporting materials.
- [ ] Description under 1,024 characters with explicit USE FOR / DO NOT USE FOR.
- [ ] Instructions are actionable without further clarification.
- [ ] Content over 100 lines moved to `references/` files.
- [ ] Skill name is kebab-case and descriptive.
- [ ] Draft reviewed with user before saving.
