---
name: security-ops
description: |
  Audit and harden code, dependencies, secrets, access boundaries, and extensions. Use for end-to-end vulnerability audits, pen tests, CVE scans, Gitleaks remediation, zero-trust reviews, plugin vetting, least privilege, threat modeling, and third-party extension safety.
---

# Security Operations

**Not this skill:** general defect review with no trust-boundary angle (`code-review`), or infrastructure rollout (`cloud-devops`).

## Preflight

```bash
git status --short
rg --files -g '*lock*' -g '*requirements*' -g '*gitleaks*' -g '*Dockerfile*' -g '*permissions*'
gitleaks version
```

Establish scope, permitted targets, repository visibility and installed scanner versions. Run only relevant tools. Prefer redacted file reports and bounded summaries; remote URLs, manifests and scanner findings can contain secrets. Never put a secret fragment in command arguments or shell history.

## Workflow

1. Identify assets, trust boundaries, attacker capability and data sensitivity. Select code, dependency, authorization or plugin assessment; use the matching reference below.
2. Run non-destructive scans and inspect changed paths in context. Preserve exit codes: findings, unsupported inputs and scanner failure are different outcomes.
3. Triage evidence by exposure, exploit preconditions, privilege, reachability and confidence. Unknown reachability is not proof that a vulnerability is harmless.
4. For a suspected live credential, report redacted evidence and prepare revocation/rotation using the incident owner's process. Use existing authority or request it before credential or infrastructure mutations; history rewriting cannot revoke an exposed credential.
5. Remediate the control failure with scoped patches, then exercise the original exploit path and relevant denial cases against an isolated environment.
6. Report blocking findings, deferred findings with reason/owner, and verification gaps. Hand delivery to `finishing-dev` after the relevant security gate passes.

## Scan Selection

| Target | Command / decision | Trap |
|---|---|---|
| Git history | `gitleaks git --redact --no-banner .` | Confirm installed CLI syntax with `gitleaks git --help`; do not hide its failure exit code |
| Working files | `gitleaks dir --redact --no-banner .` | Includes untracked exposure that a commit-only scan misses |
| Node package lock | `npm audit --audit-level=high` or `pnpm audit` for its lockfile | Include build dependencies when they run in privileged CI |
| Python requirements | `pip-audit -r requirements.txt -f json` | pip list JSON is not pip-audit requirements input |
| uv locked project | `uv export --frozen --no-dev --no-emit-project --format requirements-txt --output-file audit-requirements.txt`, then `uvx pip-audit -r audit-requirements.txt -f json` | Use an untracked temporary path; audit dev dependencies separately when relevant |
| Rust dependencies | `cargo audit` when installed | Scanner availability/version and advisory database freshness matter |
| Image | `trivy image --severity HIGH,CRITICAL <image>` | Unfixed findings can still require containment; do not hide them by default |
| SBOM | `syft <target> -o cyclonedx-json` | Generate from the actual artifact and retain provenance |

Audit tools may resolve dependencies or invoke package metadata processing. Inspect untrusted manifests first and use an isolated environment without ambient credentials; scanning is not permission to execute an unknown package's build hooks.

## Finding Decisions

| Evidence | Action |
|---|---|
| Live secret or active exploitation | Contain through authorized incident response; `observability` assists evidence capture |
| Reachable attacker-controlled vulnerability | Block affected delivery until fixed or an approved compensating control is verified |
| No upstream fix | Assess containment and exposure; absence of a patch does not make a finding nonblocking |
| Demonstrably unreachable legacy issue | Record evidence, owner and review date; re-evaluate if the changed path exposes it |
| Scanner failure / uncertain reachability | Report incomplete assessment; do not mark clean |

## Reference Routing

- Secret exposure and history cleanup: [gitleaks.md](references/gitleaks.md).
- Dependency, container and SBOM investigation: [supply-chain.md](references/supply-chain.md).
- Route-by-role authorization and ownership tests: [api-authorization.md](references/api-authorization.md).
- Third-party skill, plugin or MCP installation assessment: [plugin-vetting.md](references/plugin-vetting.md).
- Prior examples: [real-world-cases.md](references/real-world-cases.md).
- Codebase audit or pen test: [audit-workflow.md](references/security-audit/audit-workflow.md).

## Stop

- A live credential or suspected active breach needs containment beyond current authority: report immediately, preserve evidence and request the precise action needed.
- A scanner cannot run, a source revision cannot be verified, or the proposed exception has no exploitability evidence.
- Tests or scans target a live database, infrastructure, or credentials without authorization. A database name ending in test is not proof of isolation.

## Rules

- CI hardening belongs to `cloud-devops`; service fixes to `backend-systems`; agent tool boundaries to `agent-engineering`; broad code review to `code-review`.
- Never print discovered secrets. Use type, location and redacted evidence, including in reports and subprocess arguments.
- Prefer short-lived scoped identity. Coordinate containment with the owner; avoid blanket cleanup that destroys evidence or breaks unrelated workloads.
- Suppress findings only with a recorded reason, responsible owner and expiry. Preserve severity when no fix is available.

## Excuses

| Excuse | Why it is false |
|---|---|
| The secret is in a test file | A committed secret is live until rotated, wherever it sits |
| The CVE is not reachable | Exploitability needs evidence; suppress only with owner, reason, and expiry |
| The database name says test | A name is not proof of isolation; verify the target before scanning |
| Printing it makes the report clearer | Secrets are never printed; use type, location, and redacted evidence |

See [Reference Map](references/TOPIC_MAP.md) for scanner recipes and vetting procedures.

## Checklist

- [ ] Assets, authorization and trust boundaries established.
- [ ] Relevant scans completed with exit status and coverage limitations recorded.
- [ ] Findings include evidence, exploitability, action and ownership.
- [ ] Remediation verified through the affected path without exposing secrets.
