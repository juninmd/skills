---
name: generating-design-docs
description: Generate design docs from code with explicit hypotheses, security analysis, observability checks, and implementation plans.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[component/feature] [options]"
---

# Generating Design Docs

## Objective
Produce a complete, consistent Design Doc based on repository evidence.

## Rules
- Explain in English (en-US), unless otherwise requested.
- Do not invent approvals, integrations, or non-evidenced guarantees.
- Where evidence is lacking, record a hypothesis or open question.

## Flow
1. Map technical scope and impacted components.
2. Describe current architecture and limitations.
3. Propose target architecture with a migration strategy.
4. Cover security, privacy, observability, and quality.
5. Deliver the final complete document in Markdown.

## Minimum Checks
- Health/readiness/liveness.
- API contracts (OpenAPI/Swagger where applicable).
- `dependency.yaml` and catalog metadata.
- Logs, metrics, and tracing.
- Authentication/authorization model and secrets management.
