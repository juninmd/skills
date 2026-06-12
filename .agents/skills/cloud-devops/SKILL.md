---
name: cloud-devops
description: |
  Design and validate CI/CD, containers, Kubernetes, Helm, IaC, cloud, serverless, and observability changes. Use for pipelines, Dockerfiles, Terraform or Pulumi, deployment safety, logs, metrics, and traces.
---

# Cloud DevOps

## Workflow
1. Inspect existing pipeline, image, chart, IaC, environment, and deployment ownership.
2. Define the failure domain, rollback path, secret flow, and observable success signal.
3. Make the smallest declarative change; pin external actions/images/providers where supported.
4. Validate syntax and render/plan locally without mutating live infrastructure.
5. Prove runtime health with deployment status, events, logs, metrics, and a workload smoke when access exists.

## Reference Routing
- CI/CD: [ci-cd-best-practices.md](references/ci-cd-best-practices.md)
- Docker: [dockerfile-standards.md](references/dockerfile-standards.md), [docker-operations.md](references/docker-operations.md)
- Helm: [helm-standards.md](references/helm-standards.md), [helm-workflow.md](references/helm-workflow.md)
- IaC: [iac-principles.md](references/iac-principles.md), [iac-operations.md](references/iac-operations.md)
- Cloud and serverless: [cloud-patterns.md](references/cloud-patterns.md), [serverless-patterns.md](references/serverless-patterns.md)

## Rules
- No `apply`, deploy, deletion, or production mutation without explicit confirmation.
- Use short-lived identity/OIDC; never place credentials in manifests or workflow logs.
- Build once and promote the same immutable artifact.
- A green control plane is insufficient; verify workload behavior and capacity.

## Checklist
- [ ] Blast radius, secrets, and rollback are explicit.
- [ ] Configuration renders or plans cleanly.
- [ ] Runtime evidence proves the outcome.
