# IaC Operations and Examples

Detailed procedures and code standards for Terraform and Open Policy Agent.

## 1. Common Tasks
- **Create Module:** Implement `main.tf`, `variables.tf` (with validation), and `outputs.tf`.
- **Linting:** `tflint --init && tflint`.
- **Security Check:** `checkov -d .`.
- **Deployment Flow:** `terraform plan -out=tfplan && terraform apply tfplan`.

## 2. Example: Valid Module Interface
```hcl
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
  validation {
    condition     = can(cidrnetmask(var.vpc_cidr))
    error_message = "Must be a valid IPv4 CIDR block."
  }
}

output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}
```

## 3. Policy as Code
Use **Open Policy Agent (OPA)** for complex compliance rules that go beyond standard linter checks.

## 4. State Locking in a Team

A remote backend with locking (S3+DynamoDB, GCS, Terraform Cloud) exists so two people running
`apply` at once cannot corrupt the same state file. When it works as designed, the second run
blocks with `Error acquiring the state lock` instead of racing.

| Symptom | Cause | Fix |
|---|---|---|
| Lock error, and someone else's `plan`/`apply` is genuinely running | working as intended | wait; do not force-unlock a live run |
| Lock error, but the other run crashed (CI job killed, laptop closed) | stale lock left in the backend | confirm no process is actually running, then `terraform force-unlock <LOCK_ID>` |
| Lock acquired instantly by two different CI runs | backend does not actually support locking, or it is disabled | fix the backend config — this is the corruption bug waiting to happen |

`force-unlock` is a manual override of a safety mechanism — verify first, unlock second, never the
reverse.

## 5. Drift Detection

Terraform's state is a cache of what it last applied, not a live read of the cloud. Someone
clicking around the console, an out-of-band script, or another tool managing the same resource all
produce **drift**: real infrastructure that no longer matches state, with nothing in the pipeline
that would have caught it.

```bash
terraform plan -refresh-only -out=refresh.plan   # shows drift without proposing to fix it
terraform plan -detailed-exitcode                # 0 = no changes, 1 = error, 2 = changes pending
```

Run the refresh-only plan on a schedule (see `developer.hashicorp.com`'s state documentation), not
only before a deploy — drift discovered the moment before an unrelated `apply` is drift that has
already been live, unnoticed, for however long since it happened. A nonempty plan on a clean
branch with no merged infra change is drift, not a Terraform bug; investigate before running
`apply` to "fix" it, since apply will silently revert someone's manual production fix if that is
what the drift actually was.

## References
- [Terraform State Docs](https://developer.hashicorp.com/terraform/language/state) — locking and drift detection
- [OPA Documentation](https://www.openpolicyagent.org/docs/latest/)
