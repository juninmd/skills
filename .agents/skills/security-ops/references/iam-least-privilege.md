# Least-Privilege IAM Patterns

Concrete patterns for scoping identity and access, beyond "use IAM roles." Use when reviewing or designing service-account permissions, CI credentials, or any access grant wider than the task needs.

## Preflight

```bash
rg -n 'AdministratorAccess|roles/owner|roles/editor|"Action":\s*"\*"' -g '*.{json,yaml,yml,tf}'
rg -n 'AWS_ACCESS_KEY_ID|GOOGLE_APPLICATION_CREDENTIALS|AZURE_CLIENT_SECRET' -g '.github/workflows/*.{yml,yaml}'
```

A wildcard action or resource, or a long-lived key sitting in a workflow file, is the fastest signal that a review is needed.

## Time-boxed elevated access

Standing admin access is a standing target. Prefer access that expires by construction:

| Pattern | Mechanism | Where |
|---|---|---|
| Just-in-time elevation | Request, approve, time-limited grant, auto-revoked | AWS IAM Identity Center permission sets with a session duration; Azure PIM; short-lived `gcloud` impersonation |
| Break-glass account | Sealed credential, alerted on use, rotated after every use | Emergency admin access for when SSO is down, never for routine work |
| Session-scoped assumed role | `sts:AssumeRole` with a session policy narrower than the role itself, and a short `DurationSeconds` | AWS cross-account access, CI deploy jobs |
| Federated workload identity | No stored credential at all; the CI runner or workload proves identity to the cloud provider per run | GitHub Actions OIDC to AWS/GCP/Azure instead of a stored access key; GCP Workload Identity Federation |

Default to the narrowest duration the workflow tolerates, then widen only with evidence it is too short — not the reverse.

## Service-account scoping

- One service account per service, never a shared account across unrelated workloads — a compromise of one blast-radiuses into all of them.
- Grant the specific resource-level permission (for example, viewer on one storage bucket) over the project-level equivalent (admin on the whole project); most cloud IAM systems support resource-scoped bindings.
- Rotate long-lived service-account keys on a schedule if they must exist at all; prefer workload identity federation so no long-lived key exists to leak (see [gitleaks.md](gitleaks.md) for what happens when one does).
- CI credentials get the same treatment as service accounts: scope a deploy token to the one environment and repository it deploys, with a defined expiry — not an org-wide personal access token committed to a secrets manager once and reused forever.

## Decision table

| Symptom | Likely cause | Fix |
|---|---|---|
| A CI job holds a personal access token with org-wide scope | Convenience credential never narrowed after the pipeline started working | Replace with a fine-grained token or app installation scoped to the one repo and the exact permissions the job uses |
| A service account has a broad editor/owner-equivalent role | Broad role granted to unblock an unknown error, never revisited | Grant the specific permission the error actually needed; use the provider's access-analyzer tooling to find the minimum set actually used |
| An on-call engineer has standing admin for incident response | No time-boxed elevation path exists, so standing access substitutes for it | Build the JIT elevation path; standing access is a workaround, not a design |
| A long-lived cloud key sits in a CI secret store | Workload identity federation was never set up for that provider or runner | Migrate to OIDC federation; delete the long-lived key once the migration is verified |

## Rules

- Least privilege is a moving target, not a one-time grant: review IAM policies on the same cadence as dependency audits, not only after an incident.
- A role name that sounds narrow is not evidence of a narrow effect — read the actual policy document.
- Emergency access needs an audit trail by construction (alert on assumption, log every action taken under it), not a promise to check later.

## Checklist

- [ ] No wildcard action or resource in a reviewed policy without a stated reason.
- [ ] Elevated access is time-boxed, logged, and auto-revoked, not standing.
- [ ] Each service account maps to one workload with resource-scoped permissions.
- [ ] CI credentials are federated or narrowly scoped and time-limited, never a shared long-lived key.
