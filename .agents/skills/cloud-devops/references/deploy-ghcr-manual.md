
# Manual GHCR deploy (CI bypass)

## Preflight
```bash
gh api "repos/$OWNER/$APP/check-runs/$JOB_ID/annotations" --jq '.[].message'  # the real reason; logs expire
gh auth status | grep -i 'token scopes'                                       # needs write:packages
docker info >/dev/null 2>&1 || echo 'docker daemon down'
kubectl -n "$NS" get deploy "$APP" -o jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'
```

Confirm CI genuinely cannot build before bypassing it. A red build that a fix would turn green belongs to `deploy-sync-guard`, not here. Billing blocks and Actions outages are the cases this skill exists for, and they show up in the check-run annotations, not the logs.

## Two deploy models

| Model | Manifest | Rollout trigger | What a deploy needs |
|---|---|---|---|
| **pinned SHA** | `image: ghcr.io/OWNER/APP:<40hex>`, `imagePullPolicy: IfNotPresent`, `strategy: Recreate` | manifest commit | push the image **and** commit the new pin |
| **mutable latest** | `:latest`, `imagePullPolicy: Always` | pod restart | push `:latest` and `rollout restart` |

Pick by reading the live manifest, not by memory. Pinning a SHA on a `:latest` app is harmless; assuming `:latest` on a pinned app deploys nothing at all.

## Workflow
1. Check out the exact commit you want live and confirm the tree is clean.
2. Log Docker into GHCR with a token that carries `write:packages`.
3. Build for the cluster's architecture — this is where a Windows or Apple Silicon workstation silently ships an unrunnable image.
4. Push both `:<sha>` and `:latest`.
5. **Pinned model:** rewrite the image tag in the manifest repo and commit it. **Latest model:** skip to the restart.
6. Force the GitOps controller to reconcile now instead of at its next poll.
7. Verify the running pod actually reports the new SHA, then re-audit with `deploy-sync-guard`.

```bash
SHA=$(git rev-parse HEAD)
gh auth token | docker login ghcr.io -u "$OWNER" --password-stdin
docker build --platform linux/amd64 \
  -t "ghcr.io/$OWNER/$APP:$SHA" -t "ghcr.io/$OWNER/$APP:latest" .
docker push "ghcr.io/$OWNER/$APP:$SHA" && docker push "ghcr.io/$OWNER/$APP:latest"

# pinned model: bump the manifest (the GET's blob sha is required by the PUT)
gh api "repos/$OWNER/$CHARTS_REPO/contents/$APP/deployment.yaml" --jq .sha

# make ArgoCD reconcile now rather than at the next poll
kubectl -n argocd annotate applications.argoproj.io "$APP" \
  argocd.argoproj.io/refresh=hard --overwrite

# latest model
kubectl -n "$NS" rollout restart "deploy/$APP" && kubectl -n "$NS" rollout status "deploy/$APP"

# verify
kubectl -n "$NS" get pods -o jsonpath='{.items[0].spec.containers[0].image}{"\n"}'
```

Replace the tag by matching `image: ghcr.io/OWNER/APP:` followed by 40 hex characters, so you never need to know the old SHA.

## Stop
- `gh` lacks `write:packages`. The push 403s. Refreshing scopes is interactive, so the user runs it — do not try to script an OAuth flow.
- The billing block or account issue is the user's to fix. Until then every push needs this procedure; say so plainly rather than implying CI works.
- The cluster API is unreachable or returns Unauthorized. Fix connectivity first; a half-applied deploy is worse than a stale one.
- The commit you are about to ship was never reviewed. Bypassing CI already removed the automated gate; do not remove the human one too.

## Rules
- Always build with an explicit `--platform` matching the cluster, never the workstation default.
- `Recreate` briefly drops the pod. Confirm that is acceptable for the workload before deploying that way.
- Do not trust image labels to prove what shipped; verify by the running pod's tag.
- Record in the pin commit message that this was a manual deploy and why, so the next person does not read it as normal CI output.
- Restore CI as the deploy path as soon as it can build. This is an escape hatch, not a workflow — durable pipeline design belongs to `cloud-devops`.

## Checklist
- [ ] CI confirmed unable to build, reason read from the check-run annotations
- [ ] image built for the cluster architecture and pushed under both tags
- [ ] manifest pin committed (pinned model) or rollout restarted (latest model)
- [ ] controller reconciled and the pod reports the new SHA
- [ ] follow-up recorded to unblock CI
