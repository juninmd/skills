---
name: reviewing-skills
description: |
  **MAINTENANCE SKILL** - Audit and improve agent skills for compliance and clarity.
  USE FOR: skill frontmatter audit, YAML validation, improving skill descriptions, standardizing instructions, auditing .agents/skills/ directory.
  DO NOT USE FOR: implementing actual skill logic, general code linting (use auditing-code), project architecture (use improving-codebase-architecture).
  INVOKES: waza, yaml-lint, frontmatter validation.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Reviewing Skills

Expert methodology for auditing and improving agent skills in the `.agents/skills/` directory with a focus on spec compliance, actionability, and token efficiency.

**USE FOR:**
- Auditing skill frontmatter for required fields (`name`, `description`, `license`).
- Standardizing skill instructions to use active voice and objective phrasing.
- Verifying the presence and correctness of practical CLI/bash examples.
- Detecting and resolving duplication or contradiction across different skills.
- Validating the Plan -> Execute -> Validate operational flow.

**DO NOT USE FOR:**
- General source code auditing unrelated to agent skills.
- Managing repository-wide git workflows.

**INVOKES:**
- `waza check` and YAML validation logic.

## Methodology and Guidelines
1. **Compliance:** Ensure frontmatter adheres strictly to the `agentskills.io` specification.
2. **Clarity:** Replace passive voice with direct, executable instructions.
3. **Standards:** Maintain consistent terminology and directory naming across the workspace.

## Review Checklist
- [ ] Verify that the skill name and directory match exactly.
- [ ] Confirm `description` explains both purpose and routing signals (USE FOR).
- [ ] Ensure all file paths use `/` and maintain consistent references.
- [ ] Validate that practical CLI/bash examples are provided for common tasks.
- [ ] Check that the skill is under the 500-token limit.

## Correction Process
- Identify issues by severity (e.g., Spec Violation > Clarity > Polish).
- Correct frontmatter and instructions directly.
- Validate improvements using `waza check`.
