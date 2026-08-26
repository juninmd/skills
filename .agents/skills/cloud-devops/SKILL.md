---
name: cloud-devops
description: |
  Design and validate CI/CD, containers, Kubernetes, Helm, IaC, cloud, and serverless changes. Use for GitHub Actions deployment workflows, pipelines, Dockerfiles, Terraform or Pulumi modules, deployment safety, health checks, rollback paths, and release verification.
---

# Cloud DevOps

## Preflight
```bash
ls .github/workflows/ Dockerfile* helm/ chart/ *.tf 2>/dev/null
kubectl config current-context          # which cluster are you actually pointed at?
terraform workspace show 2>/dev/null
```

The wrong kube context is the single most expensive mistake available here. Read it before every session, not once.

## Workflow
1. Inspect what already exists — pipeline, image, chart, IaC, deployment ownership — before proposing a change. Who applies this, and from where?
2. Write down the failure domain, the rollback path, the secret flow, and the one signal that says it worked. A change without a stated rollback is not ready to plan.
3. Make the smallest declarative change. Pin external actions by SHA, images by digest, providers by version — a floating tag is a supply-chain hole and a reproducibility hole at once.
4. Validate locally without mutating anything live (see the dry-run table).
5. Prove runtime health with rollout status, events, and a workload smoke. The pipeline going green is not the signal.

## Dry Run Before Apply
Every one of these is read-only. There is no reason to skip them.

| Change | Validate with |
|---|---|
| GitHub Actions workflow | `actionlint` · `gh workflow view <file>` |
| Dockerfile | `hadolint Dockerfile` · `docker build --no-cache -t tmp .` |
| Kubernetes manifest | `kubectl apply --dry-run=server -f <file>` |
| Helm chart | `helm lint ./chart` · `helm template ./chart -f values.yaml` |
| Helm upgrade | `helm diff upgrade <rel> ./chart` (needs helm-diff) |
| Terraform | `terraform validate` · `terraform plan -out=tf.plan` |
| Pulumi | `pulumi preview --diff` |

## Verify the Rollout, Not the Pipeline

```bash
kubectl rollout status deploy/<name> --timeout=180s
kubectl get events --sort-by=.lastTimestamp | tail -20
kubectl get pod -l app=<name> -o jsonpath='{.items[*].status.containerStatuses[*].imageID}'
```

The last one is the one people skip. With a mutable tag (`:latest`), a **failed build leaves the old image serving while the sync reports healthy** — Argo CD says Synced, the pipeline is green, and the running digest is yesterday's. Compare that digest against the artifact you just built; if they differ, the deploy did not happen.

| Symptom | Likely cause |
|---|---|
| `ImagePullBackOff` | tag or digest does not exist, or registry auth missing in that namespace |
| `CrashLoopBackOff` | app exits on start — read `kubectl logs --previous` |
| Pod `Pending` forever | no node satisfies requests, taints, or the PVC's zone |
| Rollout hangs at N-1 replicas | readiness never passes, or a PodDisruptionBudget blocks eviction |
| `OOMKilled` | limit below real usage; raise the limit or fix the leak |

## Reference Routing
Open a file only when its trigger fires.
- Symptom matches a known outage: [real-world-cases.md](references/real-world-cases.md)
- Pipeline or runner edit: [ci-cd-best-practices.md](references/ci-cd-best-practices.md)
- Authoring an image: [dockerfile-standards.md](references/dockerfile-standards.md); debugging a running container: [docker-operations.md](references/docker-operations.md)
- Chart templates or values: [helm-standards.md](references/helm-standards.md); install, upgrade, rollback: [helm-workflow.md](references/helm-workflow.md)
- Terraform or Pulumi structure: [iac-principles.md](references/iac-principles.md); plan, state, or drift: [iac-operations.md](references/iac-operations.md)
- Picking managed services: [cloud-patterns.md](references/cloud-patterns.md); functions or cold starts: [serverless-patterns.md](references/serverless-patterns.md)

## Stop
- The kube context or Terraform workspace is not the one you intended. Stop before any command that mutates.
- No rollback path exists for this change. Define it first; a deploy without a reversal is a cutover.
- The running digest does not match the artifact just built. The deploy did not happen — do not report success.

## Rules
- No `apply`, deploy, deletion, or production mutation without explicit confirmation.
- Use short-lived identity/OIDC; never place credentials in manifests or workflow logs. A secret echoed by a debug step is a leaked secret.
- Build once and promote the same immutable artifact by digest across environments.
- Kubernetes workloads need resource requests and limits, liveness and readiness probes, and a PodDisruptionBudget so a node drain cannot evict the last replica. Liveness that duplicates readiness restarts a healthy pod under load.
- Under a GitOps controller (Argo CD, Flux): inspect the desired-versus-live diff, fix desired state in the repository instead of forcing a sync by hand, and treat pruning as dangerous for shared objects.
- Terraform state is production data: remote backend, locking, versioned, never edited by hand. `terraform apply` without a saved plan applies something nobody reviewed.
- Logs, metrics, traces, SLOs, and alerting belong to `observability`; a live outage to `incident-response`. Keep rollout mechanics here.

## Checklist
- [ ] Blast radius, secret flow, and rollback path stated before the change.
- [ ] Configuration lints, renders, or plans cleanly with no live mutation.
- [ ] External actions, images, and providers pinned.
- [ ] Rollout status green **and** the running digest matches the artifact just built.
