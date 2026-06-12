---
name: security-ops
description: "Comprehensive Security Operations covering Vulnerability Scanning, Zero-Trust Architecture, Secret Management, and Code Auditing."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Security Operations & Auditing

Expert methodology for implementing security controls, vulnerability scanning, and code auditing. This skill unifies dependency scanning, zero-trust infrastructure principles, secret detection/remediation (gitleaks), and AI-assisted code reviews for security compliance.

**USE FOR:**
- Implementing vulnerability scanning (CVEs), SBOM generation, and license compliance.
- Designing zero-trust infrastructure (secret rotation, workload identity, audit trails).
- Triaging and remediating secret leaks (Gitleaks, git-filter-repo).
- Performing automated and AI-assisted code reviews for security and style violations.
- Building ultra-granular context for deep security audits.

**DO NOT USE FOR:**
- Setting up general CI/CD pipelines (use `cloud-devops`).
- LLM prompt injection defenses (use `agent-engineering`).

**INVOKES:**
- `trivy`, `gitleaks`, `git-filter-repo`, static analysis tools.

## Core Principles
1. **Zero Trust:** Never trust, always verify. Apply least-privilege access universally.
2. **Shift Left:** Detect vulnerabilities and secrets before they are committed or built.
3. **Immutable History:** Purge leaked secrets from history, do not just delete them in the next commit.
4. **Contextual Audits:** Understand the systemic invariants before hunting for logic flaws.

## Implementation Guides
Refer to these specific domains for deep-dive instructions:
- [Security Scanning & SBOMs](references/security-scanning.md)
- [Zero-Trust Architecture](references/zero-trust.md)
- [Secret Remediation (Gitleaks)](references/secret-remediation.md)
- [Code Auditing & Review](references/code-auditing.md)

## Checklist
- [ ] Ensure `.gitleaksignore` is correctly configured and pre-commit hooks are active.
- [ ] Validate that all external dependencies are scanned for CVEs before deployment.
- [ ] Confirm secrets are managed via a secure vault, not environment variables.
- [ ] Review code diffs specifically for broken access control or injection vulnerabilities.
