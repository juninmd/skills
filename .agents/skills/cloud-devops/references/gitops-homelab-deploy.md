
# GitOps homelab deploy patterns

Recurring failure modes on a self-managed ArgoCD + GHCR homelab cluster, independently rediscovered across multiple personal projects. Read this before live-debugging an ArgoCD-managed workload or trusting a deploy script's exit message.

## Preflight
```bash
argocd app get "$APP" -o json | jq '.status.sync.status, .status.health.status'
kubectl -n argocd get application "$APP" -o jsonpath='{.spec.syncPolicy.automated}{"\n"}'
kubectl -n "$NS" get pod -l app="$APP" -o jsonpath='{.items[0].status.containerStatuses[0].imageID}{"\n"}'
```

Confirm self-heal is actually on (`syncPolicy.automated.selfHeal: true`) before assuming an edit will be reverted — a manually-synced Application will not fight you, an automated one will.

## Three failure modes

| Mode | What happened | Detect by | Fix |
|---|---|---|---|
| **Self-heal reverts a live edit** | `kubectl edit`/`patch` on an ArgoCD-managed resource, then it snaps back within seconds to minutes | edit disappears without you touching it again; `argocd app get` shows recent sync events | never edit the managed resource directly — see out-of-band testing below |
| **`:latest` digest drift** | image re-pushed to `:latest`; cluster may still run the old layer | pod `imageID` digest vs freshly pushed digest | compare digests every time, never trust "deploy succeeded" text |
| **CI billing block masquerading as a real failure** | GitHub Actions check fails in seconds, empty step log | `gh run view` shows near-zero duration and no executed steps | confirm billing before treating as a code regression; fall back to [deploy-ghcr-manual](deploy-ghcr-manual.md) |

## Workflow
1. Before touching a live resource, check whether ArgoCD owns it and whether self-heal is on (Preflight). If both are true, do not `kubectl edit`/`patch` it — the next sync (seconds to minutes) reverts you silently and the debugging session looks like it never happened.
2. For live debugging or a manual test against the real cluster, use an out-of-band path instead: a scratch Pod/Deployment carrying a label ArgoCD's resource selector excludes, or pause reconciliation by suspending the Application, make the edit, then resume and let it re-sync.
3. After any deploy — scripted, manual, or CI — verify by digest, not by the deploy tool's reported status. A script printing "deploy not confirmed" is a known false negative in this setup; it still requires the digest check below to resolve either way, not a re-run or a shrug.
4. When a GitHub Actions check fails in under a few seconds with an empty step log, suspect a billing block before a code regression. Confirm with `gh run view`, not by assumption — a real regression can also fail fast on an early lint step.
5. If CI is confirmed blocked, use the manual build-push-rollout path in [deploy-ghcr-manual](deploy-ghcr-manual.md), then re-verify the digest here.

```bash
# out-of-band test: scratch pod ArgoCD's selector never touches
kubectl -n "$NS" run "$APP-debug" --image="ghcr.io/$OWNER/$APP:$SHA" \
  --labels="app=$APP-debug,argocd.argoproj.io/instance-!=$APP" --restart=Never

# or: suspend reconciliation, edit freely, resume when done
argocd app set "$APP" --sync-policy none
kubectl -n "$NS" edit deployment "$APP"          # safe now — nothing will revert it
argocd app set "$APP" --sync-policy automated

# digest verification — the only thing that proves a deploy happened
PUSHED=$(docker inspect --format='{{index .RepoDigests 0}}' "ghcr.io/$OWNER/$APP:latest")
RUNNING=$(kubectl -n "$NS" get pod -l app="$APP" \
  -o jsonpath='{.items[0].status.containerStatuses[0].imageID}')
[ "${RUNNING##*@}" = "${PUSHED##*@}" ] && echo "MATCH" || echo "STALE: script output is not proof"

# distinguish a billing block from a real failure
gh run view "$RUN_ID" --json conclusion,jobs --jq '.jobs[].steps'
gh api "repos/$OWNER/$APP/check-runs/$RUN_ID" --jq '.output.summary'
```

## Stop
- The Application has no `syncPolicy.automated` set. Self-heal cannot be the cause of a reverted edit — look at a second controller or a CronJob reapplying state instead.
- `argocd app set --sync-policy none` was left in place after debugging. Resume automated sync before ending the session; a suspended Application is a silent drift risk.
- The digest check has no baseline to compare against because nothing was actually pushed. That is not a stale deploy, it is a deploy that never ran — say so.

## Rules
- Never edit a resource ArgoCD manages directly for anything you intend to keep; self-heal treats your edit as drift and erases it.
- Treat a deploy script's success or "not confirmed" message as a hint, never as proof — the pod's `imageID` digest is the only source of truth.
- A `:latest` tag carries no version signal by itself; pair every `:latest` deploy with a digest comparison immediately after.
- A fast, empty-log CI failure is a billing-block signature, not a free pass to assume it — confirm with `gh run view` before routing around it.

## Checklist
- [ ] Confirmed whether the target resource is ArgoCD-managed and self-heals before any live edit
- [ ] Used an out-of-band Pod or a suspended Application for live testing, never a direct edit of a managed resource
- [ ] Verified the running pod's image digest against the digest just pushed, not the deploy script's reported status
- [ ] Confirmed a fast CI failure as billing-related via `gh run view` before treating it as a regression
- [ ] Resumed automated sync if it was suspended for debugging
