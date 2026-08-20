---
name: phase-done
description: |
  Done stage of the delivery loop. Use for handing the pull request to human review, closing the tracking issue, filing follow-ups, and archiving the finished loop workspace.
---

# Stage 6 — Done

## Contract
- Entry: `.workflow/<slug>/evidence.md` from `phase-finalize`.
- Output: PR in human review, closed issue, archived workspace, memory entries.
- Terminal stage; new scope reopens the loop at `phase-research`.

## Workflow
1. Confirm the PR is production-ready: gates green, acceptance criteria met, description and screenshots current.
2. Request human code review. Do not merge, and never self-approve.
3. Address review comments in the PR; if a comment reopens design questions, return the loop to the stage that owns them.
4. After merge, verify the delivered state at its destination — merged, deployed, or handed over. Check, do not assume.
5. Delete prototypes, scratch files, temporary branches, worktrees, and child sessions created by the loop.
6. Close the issue with a closure block: delivered · deferred · known limitations.
7. Turn every deferred item and discovered problem into its own issue with an owner.
8. Persist learnings to assistant memory: non-obvious constraints, workflow exceptions, mistakes worth not repeating.
9. Archive `.workflow/<slug>/` to `.workflow/done/<slug>/` and set `stage: "done"`.

## Rules
- Never declare done while an acceptance criterion is unmet or unverified — name what is missing.
- Deferred work is stated out loud; silent scope reduction is not allowed.
- No merge, branch deletion, or file removal without explicit confirmation.
- Keep memory factual: what was learned, not a session diary.

## Checklist
- [ ] PR handed to human review and merged with approval.
- [ ] Delivered state verified at the destination.
- [ ] Prototypes, scratch files, branches, and worktrees removed.
- [ ] Issue closed with delivered, deferred, and limitations.
- [ ] Follow-ups filed as issues.
- [ ] Learnings persisted and workspace archived.
