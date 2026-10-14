# Cloud DevOps Real-World Cases

Use this first for pipelines, containers, Kubernetes, IaC, and deployment incidents.

## Failing CI
- Read the exact failing step, event type, permissions, changed files, cache state, and runner image.
- Reproduce the command locally or in the narrowest job before editing workflow YAML.
- Fix the root command/tooling issue before adding retries.
- Verify with the same workflow or a local equivalent plus static workflow lint when available.

## Docker Image
- Preserve the runtime base constraints and package manager lockfile.
- Use multi-stage builds, non-root runtime, minimal copied files, and cache mounts where supported.
- Keep secrets out of build args, layers, logs, and final image.
- Prove with build, run/help or healthcheck, and image scan when available.

## Kubernetes or Helm
- Render templates before applying.
- Verify namespace, values source, image tag/digest, probes, resources, secrets, and rollout strategy.
- After deploy, check rollout, pods, events, logs, metrics/capacity, and workload smoke.
- Green desired state is not enough if pods restart or capacity is exhausted.

## Terraform or Pulumi
- Run fmt/validate and plan/preview without mutation.
- Inspect create/update/delete blast radius, state backend, provider changes, and secret outputs.
- Require explicit approval for apply/destroy/import/state edits.
- Capture rollback or forward-fix path before mutation.
