---
name: deploy-sync-guard
description: |
  Detect drift between source code and what actually runs on a Kubernetes or ArgoCD cluster. Use for verifying an app is deployed at the latest commit, and for the failure GitOps reports as Synced: a mutable latest tag plus a failed build, so the pod keeps old code.
license: MIT
---

# Deploy sync guard

## Preflight
```bash
git rev-parse HEAD && git rev-parse '@{u}' && git status --porcelain   # local == remote, tree clean
gh run list --repo "$OWNER/$APP" --json conclusion,headSha,workflowName,createdAt --limit 10
kubectl -n "$NS" get deploy "$APP" -o jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'
```

GitOps reconciles **manifests**, not image content. With a mutable `:latest` tag, a failed CI build never rebuilds the image, the manifest never changes, and ArgoCD reports Synced and Healthy while the pod runs old code. `Synced` rules out none of the drift modes below.

## Three drift modes

| Mode | What happened | Detect by | Remediate with |
|---|---|---|---|
| **Build drift** | default-branch HEAD is ahead of the last *successful* image build; CI red or never triggered | newest `success` run's `headSha` != repo HEAD | fix the build, push, wait for green |
| **Rollout drift** | image was rebuilt, pod still serves the old digest | pod `imageID` != registry `:latest` digest | `kubectl rollout restart` |
| **Content drift** | pod digest does not match the registry at all | same comparison, unexplained | investigate before restarting |

Build drift is the dangerous, silent one: the push succeeded, the PR merged, and production is stale.

## Workflow
1. Confirm local equals remote and the tree is clean. A local-only commit is not a deploy problem.
2. Find the newest **successful** run of the build workflow and compare its `headSha` to repo HEAD. If the newest run is a failure, that is build drift — read the failure, do not blind-rerun.
3. Resolve the registry digest for the deployed tag and compare it to the pod's `imageID`.
4. When paranoid after a subtle fix, grep the changed symbol inside the container.
5. Remediate per the table, then re-verify step 3.
6. If CI can never go green, hand over to `deploy-ghcr-manual`.

```bash
# pod digest
kubectl -n "$NS" get pod "$POD" -o jsonpath='{.status.containerStatuses[0].imageID}{"\n"}'

# registry digest for a public GHCR tag (OCI index: pick the manifest whose platform.os != unknown)
TOKEN=$(curl -s "https://ghcr.io/token?scope=repository:$OWNER/$APP:pull" | jq -r .token)
curl -sI -H "Authorization: Bearer $TOKEN" \
  -H 'Accept: application/vnd.oci.image.index.v1+json' \
  "https://ghcr.io/v2/$OWNER/$APP/manifests/latest" | grep -i docker-content-digest

# source-in-pod spot check
kubectl -n "$NS" exec "$POD" -- grep -n "$CHANGED_SYMBOL" "$FILE"

# remediation for rollout drift (works because :latest deployments use imagePullPolicy: Always)
kubectl -n "$NS" rollout restart "deploy/$APP" && kubectl -n "$NS" rollout status "deploy/$APP"
```

## Stop
- The build is red for a reason you have not read. `gh run view "$ID" --log-failed` first; a rerun on a real failure just burns minutes.
- A lockfile out of sync with the manifest is the classic cause. Fix by regenerating and committing the lockfile — never by dropping the frozen-install flag in CI, which makes the build lie instead of fail.
- The workload is a CronJob, not a Deployment. Build drift still applies but there is no pod to restart; it pulls at fire time.
- No build workflow is discoverable for the image. Report `UNKNOWN`, never `OK`.

## Rules
- Read-only by default. Auditing must never restart or rebuild anything on its own.
- Do not trust the image's `org.opencontainers.image.revision` label — build actions commonly stamp an unreliable value. Use the build run's `headSha`.
- Discover the app list live from the cluster (`kubectl get deploy -A`) so new apps are covered automatically.
- Repo name equal to image name is an assumption; verify it before reporting drift.
- Recommend durable fixes, do not apply them: immutable `:<git-sha>` tags with an image updater, branch protection requiring the build check, a frozen-install guard on PRs, and this audit on a schedule. Design them with `cloud-devops`.

## Checklist
- [ ] local HEAD equals remote, tree clean
- [ ] newest successful build `headSha` equals repo HEAD
- [ ] pod digest equals the registry digest for the deployed tag
- [ ] changed code verified present inside the container where it mattered
- [ ] every app reported `OK`, `DRIFT` or `UNKNOWN` — never silently skipped
