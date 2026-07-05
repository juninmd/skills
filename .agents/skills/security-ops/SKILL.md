---
name: security-ops
description: |
  Audit and harden code, dependencies, secrets, identities, pipelines, and infrastructure. Use for CVE or SBOM scans, Gitleaks findings, secret rotation, access control, injection risk, least privilege, and zero-trust reviews.
---

# Security Operations

## Workflow
1. Define assets, trust boundaries, attacker capability, data sensitivity, and compliance constraints.
2. Collect evidence with non-destructive scans; redact secret values and sensitive paths from output.
3. Triage findings by exploitability, exposure, privilege, business impact, and confidence.
4. Fix the root control failure: rotate exposed credentials, narrow permissions, validate input, patch dependencies, or isolate execution.
5. Add regression checks and verify the control in the same path where the weakness existed.

## Reference Routing
- Practical security cases: [real-world-cases.md](references/real-world-cases.md)
- Gitleaks collection and triage: [gitleaks-setup.md](references/gitleaks-setup.md), [gitleaks-triage.md](references/gitleaks-triage.md)
- Remediation execution: [gitleaks-actions.md](references/gitleaks-actions.md)
- Completion criteria: [gitleaks-criteria.md](references/gitleaks-criteria.md)

## Rules
- Never print or commit a discovered secret; show only type, location, and redacted evidence.
- Revocation/rotation comes before history cleanup.
- Do not suppress a scanner finding until exploitability and provenance are understood.
- Require explicit approval before history rewriting, credential mutation, or infrastructure changes.
- Prefer short-lived identity and least privilege over stored credentials.

## Checklist
- [ ] Assets and trust boundaries are identified.
- [ ] Findings are prioritized by real risk.
- [ ] Remediation and regression checks are verified.
