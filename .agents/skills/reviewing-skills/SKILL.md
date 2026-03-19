---
name: reviewing-skills
description: Revisar e auditar Agent Skills existentes para garantir estrita conformidade com as melhores práticas da Anthropic e a especificação agentskills.io. Todas as skills devem ser revisadas e mantidas em inglês.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Reviewing Skills

This skill empowers the agent to act as a strict reviewer and auditor for Agent Skills. Its purpose is to analyze existing skills within the `.agents/skills/` directory and ensure they adhere to the highest standards of quality, performance, and specification compliance.

## Core Mandates

1.  **Language Policy:** ALL skills (including titles, descriptions, instructions, and comments) MUST be written in **English**. If a skill is found in another language (e.g., Portuguese), your primary task is to translate and adapt it to professional technical English.
2.  **Specification Compliance:** Skills must strictly follow the `agentskills.io/specification` format (YAML frontmatter + Markdown body).
3.  **Anthropic Best Practices:** Skills must be optimized for Large Language Model (LLM) context windows, utilizing progressive disclosure, gerund naming conventions, and concise phrasing.

## Review Checklist & Workflow

When asked to review a skill or a directory of skills, execute the following checks systematically:

### 1. Directory & Naming Validation
*   **Action-Oriented Naming (Gerund Form):** The skill directory and the `name` field in the frontmatter MUST use the gerund form of a verb (e.g., `auditing-code`, `managing-k8s`, `researching-web`). Reject names based on personas (e.g., `code-auditor`, `k8s-manager`).
*   **Format:** The name must be lowercase alphanumeric with hyphens, 1-64 characters, and exactly match the parent directory name. No consecutive hyphens.

### 2. Frontmatter Validation
*   **`name`:** Must match the directory name perfectly.
*   **`description`:** Must be in the third person, concise (1-1024 characters), and clearly state *what* the skill does and *when* to trigger it. It must include relevant keywords for semantic routing.

### 3. Content & Structure Analysis (SKILL.md)
*   **Language:** Verify the entire content is in English. Translate if necessary while preserving technical jargon appropriately.
*   **Length Limit:** The `SKILL.md` file should ideally be under 500 lines.
*   **Progressive Disclosure:** Are complex templates, reference lists, or scripts cluttering the main file? Move them to `assets/`, `references/`, or `scripts/` directories and link to them using relative paths (e.g., `See [Reference](references/REFERENCE.md)`).
*   **Avoid Deep Nesting:** Ensure references are only one level deep from `SKILL.md`.
*   **Terminology Consistency:** Ensure consistent use of technical terms throughout the document (e.g., don't mix "API endpoint" and "URL" interchangeably if they mean the same thing).

### 4. Workflow & Executable Code Checks
*   **Actionable Instructions:** Instructions should be clear, sequential steps. For complex tasks, ensure there's a feedback loop (e.g., "Plan -> Execute -> Validate").
*   **Solve, Don't Punt:** If the skill includes executable scripts (`scripts/`), ensure the scripts handle errors gracefully rather than relying on the LLM to figure out why a script failed.
*   **Pathing:** Ensure all file paths mentioned in the skill use forward slashes (`/`), avoiding Windows-style backslashes.

## Remediation Process

If you detect violations during your review:
1.  **Identify:** List the specific violations found.
2.  **Propose:** Show the user the proposed corrections (e.g., the English translation, the renamed directory, or the refactored Markdown).
3.  **Execute:** If authorized by the user, use the `replace`, `write_file`, or `run_shell_command` tools to fix the skill.
4.  **Validate:** After making changes, ALWAYS run the skill linter (`pnpm lint:skills` or `node scripts/lint-skills.mjs`) to ensure technical compliance.
