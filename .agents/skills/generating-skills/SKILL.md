---
name: generating-skills
description: Gerar novas Agent Skills que aderem estritamente ao formato agentskills.io/specification.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[component/feature] [options]"
---

# Skill Generator

This skill enables the agent to scaffold new Agent Skills that comply with the `https://agentskills.io/specification`.

## Instructions

1.  **Gather Requirements:** Ask the user for the desired `name` and `description` of the new skill if not already provided.
2.  **Validate `name` (Anthropic Best Practice):**
    *   **Convention:** Use the gerund form (e.g., `auditing-code` instead of `code-auditor`, `researching-web` instead of `web-researcher`). This describes the continuous action the skill performs.
    *   **Strict Rules:**
        *   Must be 1-64 characters long.
        *   Must contain only lowercase alphanumeric characters and hyphens (`[a-z0-9-]`).
        *   Must not start or end with a hyphen.
        *   Must not contain consecutive hyphens (`--`).
3.  **Validate `description`:**
    *   Must be 1-1024 characters long.
    *   Should clearly describe what the skill does and when to use it, including keywords.
4.  **Scaffold Directory Structure:**
    *   Create a directory under `.agents/skills/` with the exact `name` of the skill.
5.  **Create `SKILL.md`:**
    *   Create `.agents/skills/<name>/SKILL.md`.
    *   Include the required YAML frontmatter with `name` and `description`. Ensure `name` exactly matches the parent directory.
    *   Add optional metadata fields if requested (e.g., `license`, `compatibility`, `metadata`, `allowed-tools`).
    *   Include a Markdown body with basic sections: `# <Title>`, `## Description`, `## Instructions`, `## Best Practices`.
6.  **Optional Folders:** If the user requests scripts, forms, or references, create the `scripts/`, `assets/`, or `references/` subdirectories inside the skill folder.
7.  **Validation Check:** Suggest the user run the linter (`pnpm lint:skills` or `npm run lint:skills`) to ensure the newly created skill is perfectly compliant.

## Example Output Structure

```yaml
---
name: generating-skills
description: This is a brief description of what the skill does.
metadata:
    works_on: [copilot, antigravity]
---

# Example Skill Name

## Description
[Detailed description of what this skill does]

## Instructions
1. Step one.
2. Step two.
```
