---
name: expert-review
description: |
  Review code, diffs, plans, and designs for defects, regressions, hidden assumptions, and missing proof. Use for pull-request review, design review, plan stress-testing, risk analysis, and evidence-based findings.
---

# Expert Review

## Workflow
1. Define the review artifact, intended behavior, constraints, and acceptance criteria.
2. Read the changed path, callers, contracts, tests, and relevant documentation.
3. Look first for correctness, security, data loss, compatibility, concurrency, and operational failure.
4. Reproduce or prove each finding; separate confirmed defects from questions and residual risk.
5. Report findings by severity with file/line, impact, evidence, and the smallest remediation.

For interactive Socratic review, ask one decision-relevant question at a time. Stop questioning when evidence is sufficient to recommend a path.

## Reference Routing
- Use [doc-formats.md](references/doc-formats.md) when reviewing PRDs, specs, ADRs, plans, or other structured documents.

## Rules
- Findings lead; summary comes after them.
- Do not report style preferences as defects.
- Do not infer a bug from a diff alone when runtime or contract evidence is available.
- If no defect is found, say so and state remaining test gaps.

## Checklist
- [ ] Scope and expected behavior are explicit.
- [ ] Findings include severity, evidence, and impact.
- [ ] Questions and residual risks are separate.
