---
name: phase-done
description: |
  Done stage of the delivery loop. Use for handing the pull request to human review, closing the tracking issue, filing follow-ups, and archiving the finished loop workspace.
---

# Stage 6 — Done

## Preflight
```bash
gh pr view <pr> --json state,mergedAt,statusCheckRollup
jq -r '.scratch[]' .workflow/<slug>/loop-state.json    # everything that must be cleaned up
```

Confirm the acceptance criteria are met before requesting review. This stage hands over; it does not fix.

## Contract
- **Entry:** `.workflow/<slug>/evidence.md` from `phase-finalize`.
- **Output:** pull request in human review, closed issue, archived workspace, persisted learnings.
- **Human gate:** the loop stops at `awaiting: "review"` until the human's verdict.
- **Terminal stage.** New scope reopens the loop at `phase-research`.

## Workflow
1. Confirm the pull request is production-ready: gates green, acceptance criteria met, description and screenshots current.
2. Request human code review. **Do not merge, and never self-approve.**
3. Address comments in the same pull request. A comment that reopens a design question returns the loop to the stage that owns it.
4. After merge, **verify the delivered state at its destination** — merged, deployed, or handed over. Check; do not assume.
5. Remove every `scratch` entry.
6. Close the issue with a closure block.
7. File every deferred item and discovered problem as its own issue, with an owner.
8. Persist learnings.
9. Archive `.workflow/<slug>/` to `.workflow/done/<slug>/` and set `stage: "done"`.

## Verify at the Destination
"CI is green" is not "it is live". The most common false done is a merge that never reached anything.

```bash
gh pr view <pr> --json state,mergedAt,mergeCommit
git log origin/main --oneline -1                 # is the commit actually there?
kubectl rollout status deploy/<name>             # did it deploy?
curl -sS -o /dev/null -w '%{http_code}\n' <health-url>
```

## Clean Up `scratch`
The loop created all of it; the loop removes all of it.

```bash
jq -r '.scratch[]' .workflow/<slug>/loop-state.json
git worktree list && git worktree remove ../review-412
git branch -d <test-branch>
rm -rf .workflow/<slug>/prototypes/
```

Confirm before each removal. A leftover worktree quietly holds a branch and confuses the next loop.

## The Closure Block

| Section | Contains |
|---|---|
| Delivered | what shipped, against the acceptance criteria |
| Deferred | what was cut, and where it now lives as an issue |
| Known limitations | what is true and imperfect, stated plainly |

Deferred work with no issue is work that was silently dropped. Filing it is what makes the scope cut honest.

## Learnings
Facts, not a diary. Non-obvious constraints, workflow exceptions, mistakes worth not repeating. In a repository using `.learnings/`, route them through `session-learnings`; otherwise persist to assistant memory.

| Worth keeping | Not |
|---|---|
| "This service's migrations must run before the deploy, not after" | "Wrote the validator today" |
| "The staging DB has no seed data; tests need the fixture" | "Fixed three tests" |
| "The team pushes straight to master after validation" | "The PR was reviewed" |

## Stop
- An acceptance criterion is unmet or unverified. Do not declare done — name what is missing.
- The merge has not been verified at its destination. "CI is green" is not "it is live".
- Deferred work has no issue. File it; deferred work without an issue was silently dropped.

## Rules
- Never declare done while an acceptance criterion is unmet or unverified — **name what is missing**.
- Deferred work is stated out loud. Silent scope reduction is not allowed, and it is always discovered later by someone with less context.
- No merge, branch deletion, or file removal without explicit confirmation.
- Merge is the human's decision. This stage hands over; it does not finish the job on its own authority.

## Checklist
- [ ] Pull request handed to human review with `awaiting: "review"` set; merge left to the human.
- [ ] Delivered state verified at its destination after merge, not assumed.
- [ ] Every `scratch` entry removed, each with confirmation.
- [ ] Issue closed with delivered, deferred, and known limitations.
- [ ] Every deferred item and discovered problem filed as an issue with an owner.
- [ ] Learnings persisted as facts, not narrative.
- [ ] Workspace archived to `.workflow/done/<slug>/`.
