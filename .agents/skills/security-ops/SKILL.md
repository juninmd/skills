---
name: security-ops
description: |
  Audit and harden code, dependencies, secrets, identities, pipelines, and infrastructure. Use for CVE or SBOM scans, rotating a leaked credential Gitleaks found, access control, injection risk, least privilege, and zero-trust reviews.
---

# Security Operations

## Preflight
```bash
git remote -v && gh repo view --json visibility,isFork,forkCount 2>/dev/null
gitleaks detect --redact --no-banner --exit-code 0 | tail -20
```

Repository visibility decides everything about a leaked secret. Public or forked means the credential is already compromised — that is a revocation, not a rotation.

## Workflow
1. Define assets, trust boundaries, attacker capability, data sensitivity, and compliance constraints. A finding has no severity until you know what it reaches.
2. Collect evidence with non-destructive scans; redact secret values and sensitive paths from every output you surface.
3. On a leaked secret, establish blast radius **before** touching anything. Then triage by reachability, exposure, exploit preconditions, privilege, and confidence.
4. Fix the root control failure: rotate exposed credentials, narrow permissions, validate input, patch dependencies, or isolate execution.
5. Add a regression check and verify the control in the same path where the weakness existed.

## Leaked Secret — Blast Radius First
Revocation order is not negotiable: **revoke, then rotate, then clean history.** Rewriting history never un-leaks a credential someone already cloned.

| Question | How to answer | Verdict |
|---|---|---|
| Is the repo public or mirrored? | repo visibility, forks, mirrors | public → assume compromised, revoke now |
| Was it ever pushed? | `git log --all -S'<fragment>' --oneline` | never pushed → local rotation, no history purge |
| How long was it live? | first and last commit touching it | longer than an hour on a public repo → treat as used |
| What can it reach? | the credential's own scopes | scope decides whether this is an incident |

Then purge history (`git filter-repo`), force-push with a lease, and require every clone to re-clone — a stale clone still holds the blob.

## Scan Commands

| Target | Command |
|---|---|
| Secrets in history | `gitleaks detect --redact --source .` |
| Secrets in the staged diff | `gitleaks protect --staged --redact` |
| Node dependencies | `npm audit --audit-level=high` · `pnpm audit --prod` |
| Python dependencies | `uv pip list --format=json \| pip-audit -f json` |
| Go modules | `govulncheck ./...` |
| Container image | `trivy image --severity HIGH,CRITICAL <image>` |
| SBOM | `syft <target> -o cyclonedx-json` |

Never paste raw scan output into context; extract type, location, and redacted evidence.

## Reference Routing
- Secret scanning end to end — blast radius, triage, rotation, history purge, exit criteria: [gitleaks.md](references/gitleaks.md)
- Dependency and container scans, SBOM, CVE triage by reachability: [supply-chain.md](references/supply-chain.md)
- Route enumeration, ownership checks, route-by-role credential matrix: [api-authorization.md](references/api-authorization.md)
- Practical security cases: [real-world-cases.md](references/real-world-cases.md)

## Merge Gate
Blocking a merge on everything is how scanners get switched off. Split deliberately:

- **Blocks:** a reachable, attacker-exposed weakness in the changed code; any live secret; a control this change removes or weakens; a new dependency with a critical CVE that has a fix.
- **Becomes a tracked issue:** unreachable or unexposed CVEs, findings with no upstream fix, pre-existing debt this change did not touch.

## Stop
- A live secret is present. Revoke first — before rotation, before history cleanup, before anything else.
- A finding is about to be suppressed without understanding exploitability and provenance. Do not suppress it.
- History rewriting, credential mutation, or an infrastructure change is about to happen without explicit approval. Stop.

## Rules
- Never print or commit a discovered secret; show only type, location, and redacted evidence.
- Do not suppress a scanner finding until exploitability and provenance are understood; record the reason next to the suppression, with an expiry.
- An unreachable CVE is scheduled work. A reachable one on a request path is not. Reachability outranks CVSS.
- Require explicit approval before history rewriting, credential mutation, or infrastructure changes.
- Prefer short-lived identity (OIDC, workload identity) over stored credentials; a rotated long-lived secret is still a long-lived secret.
- A live breach runs through `incident-response` first — a fast rollback destroys the evidence. Pipeline and infrastructure changes land through `cloud-devops`.

## Excuses

| Excuse | Why it is false |
|---|---|
| "It is a private repo" | Private today; forked, mirrored, or cloned yesterday. Check visibility before deciding anything |
| "That key is low privilege" | Privilege is what the credential reaches, not what it was named for. Blast radius first |
| "I will rewrite history and it is gone" | Everyone who already cloned still has it. Revoke, then rotate, then clean |
| "It is only in a test fixture" | A credential in a fixture is a credential |
| "The scanner rated it low" | Severity without reachability is a guess, in either direction |

## Checklist
- [ ] Assets and trust boundaries identified before anything was rated.
- [ ] Leaked-secret blast radius established, then revoke → rotate → purge, in that order.
- [ ] Findings prioritized by reachability and exposure, split into blocking versus tracked.
- [ ] Remediation verified in the path where the weakness lived, with a regression check.
