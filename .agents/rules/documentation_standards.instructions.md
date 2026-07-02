---
name: documentation-standards
description: Standards for project documentation (README, Design Docs, GMUD).
applyTo: '**/*.md'
---

# Rule: Documentation Standards

## README.md
- Must exist at the repository root.
- Must include: app description, features, architecture, usage instructions, environment variables, and run commands.
- Must be updated for every significant change.
- Keep Release Notes up to date without deleting information from previous versions.

## Design Docs & ADRs
- Essential for architectural success.
- Must be created and approved by the Tech Lead.
- **ADR (Architecture Decision Record)**: use to document important technical decisions (for example, database migration or adopting a core library).
- Serves as reference material for new developers and requirement traceability.

## GMUD (Change Management)
- For every production-facing app implementation, a GMUD must be generated.
- Living document including changelog, app links, test evidence, Sonar, and Fortify results.
- Generation via CI-Knife pipeline (Documentation repository).
- Required environment variables:
  - `GMUD_RISK`: Low
  - `GMUD_TESTS`: Unit and integration tests
  - `GMUD_UNAVAILABILITY`: No
- **Automatic Approval Gates**:
  - No critical Snyk issues.
  - Coverage >= 90%.
  - Duplication < 3%.
  - Rating A in maintainability, reliability, security, and security review.

## Issues in GitLab
- Production change requests must be created as GitLab issues using approved templates.
- For new apps, use the label `Projeto_Novo`.

