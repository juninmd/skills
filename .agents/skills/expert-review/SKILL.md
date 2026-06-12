---
name: expert-review
description: "Expert Review sessions using Socratic questioning and AI diff analysis."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Expert Review & Socratic Dialogue

Expert methodology for validating designs and auditing code via adversarial questioning and AI-assisted diff analysis. This skill unifies Socratic "Grill-me" sessions and automated code quality reviews.

**USE FOR:**
- Stress-testing plans, designs, or ideas via adversarial questioning.
- Validating implementation plans against domain language and documentation.
- Identifying bugs, style violations, and architectural drift in code diffs.
- Surfacing hidden assumptions and edge cases in a proposal.

**DO NOT USE FOR:**
- Direct implementation of features (use the relevant technical skill).
- Initial requirement gathering (use `project-lifecycle`).

**INVOKES:**
- Socratic questioning, diff analysis, documentation cross-referencing.

## Core Principles
1. **Tough Questions:** One question at a time to force precision.
2. **Adversarial Thinking:** Play devil's advocate to find failure modes early.
3. **No Assumptions:** Surface and validate every "given" in a plan.
4. **Holistic Review:** Analyze not just the lines changed, but the impact on the system.

## Checklist
- [ ] Define the scope of the review or dialogue clearly.
- [ ] Ensure documentation is accessible for grounded questioning.
- [ ] Flag architectural deviations as high-priority findings.
- [ ] Conclude with a summary of validated points and remaining risks.
