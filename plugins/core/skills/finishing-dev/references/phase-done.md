# Readiness and handoff procedure
Owned by `finishing-dev`; this file is not a standalone skill.

1. Verify remote head matches the reviewed candidate. Inspect all CI checks, required reviews, unresolved comments, and acceptance evidence.
2. If pending or failed, keep readiness blocked; diagnose and fix authorized defects, then repeat affected gates and independent review.
3. Report PR URL, reviewed head, successful checks, any unverified runtime or environment assumptions, and the remaining human decision.
4. Set a sustained loop to done only when the requested deliverable is complete. Record that done means PR delivery/readiness, not merge or deployment.
5. Inventory owned scratch assets and worktrees. Remove only when authorized and verified to belong to this task; keep the delivery branch and unrelated work. A completed PR never authorizes broad deletion.

When the delivery resolves tracked tickets, handle them one at a time, each with the change that fixes it, and link each from the PR (`Fixes #n`) so it closes with the merge. Closing a ticket by hand is a public write: confirm with the user, and only after the fix is merged. Carry out only the changes the review approved; its decisions are not revisited at this stage. Past about three tickets in one batch, audit the combined tree before committing and pushing, per [untrusted-contribution.md](../../code-review/references/untrusted-contribution.md).

Merge is a separate explicit user decision handled by `git-workflow` after all checks succeed. Publication and Argo/CI health do not prove application runtime behavior.

## CI flaky vs genuinely red
A red check is not automatically a real defect, and a green rerun is not automatically proof of health. Treat "just rerun it" as a claim requiring the same evidence as any other.

| Signal | Action |
|---|---|
| Same check fails on rerun with the same failure | Genuinely red. Diagnose and fix; never rerun a third time hoping for green |
| Fails, rerun passes, failure matches an already-tracked flaky test/infra step | Rerun once, link the existing flaky-test issue in the PR, and proceed |
| Fails, rerun passes, no tracked flake exists | Treat as a new flake: file it, and do not report the pipeline reliably green until it has passed twice or the cause is understood |
| Same check is flaky across multiple unrelated PRs | Escalate as an infrastructure problem, not a per-PR retry loop; blocking merges on a known-bad shared check is a process failure |
| Timeout or infra error (runner OOM, network) distinct from the test assertion | A single retry is reasonable; still record it — a pattern of infra timeouts is itself a signal |

Never report "CI green" from a rerun without naming that a rerun happened and why the first failure does not apply to the final candidate. A reviewer who later finds the failed run in the check history unmentioned loses trust in every other claim in the PR.
