# cloud-devops Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `ci-cd-best-practices.md` | Designing or reviewing a GitHub Actions/GitLab CI pipeline: job ordering, caching, reusable workflows, matrix builds |
| `cloud-patterns.md` | Designing cloud infrastructure topology: HA/multi-AZ, three-tier networking, strangler fig, circuit breaker, DR/RPO-RTO |
| `deploy-ghcr-manual.md` | CI genuinely cannot build (billing block, Actions outage) and a manual GHCR build-and-push deploy is needed to bypass it |
| `deploy-sync-guard.md` | ArgoCD/GitOps reports Synced and Healthy but the running pod may still be serving stale code — diagnosing build/rollout/content drift |
| `docker-operations.md` | Managing local containers or Compose stacks day to day: status, logs, cleanup, service health, secrets handling |
| `dockerfile-standards.md` | Writing or reviewing a Dockerfile for image hygiene: multi-stage builds, non-root user, layer caching, pinned bases, scanning |
| `helm-standards.md` | Writing or reviewing Helm chart conventions, or diagnosing a CrashLoopBackOff/restart storm from liveness/readiness probe misconfiguration |
| `helm-workflow.md` | Scaffolding, templating, or testing a Helm chart end to end: values layering, helpers, lint, dry-run, `helm test` |
| `iac-operations.md` | Writing a Terraform module or OPA policy, or diagnosing concurrent-apply/state-locking issues in a shared backend |
| `iac-principles.md` | Deciding Terraform module layout, state isolation per environment, or which CI security scanner (tfsec/checkov) to require |
| `progressive-rollout.md` | Canary, blue-green, feature-flag-gated rollout strategies and rollback triggers |
| `real-world-cases.md` | Diagnosing a live CI, Docker, Kubernetes/Helm, or Terraform/Pulumi incident and need the root-cause checklist first |
| `serverless-patterns.md` | Choosing a serverless platform or fixing cold-start latency, event-driven decoupling, or idempotent write handling |
| `shell-operations.md` | Writing a bash or PowerShell script and need the host-specific strict-mode preamble and cross-shell pitfalls |
| `strict-shell.md` | `set -euo pipefail` or `Set-StrictMode` still let a failure through silently — enumerating the known gaps it doesn't cover |
