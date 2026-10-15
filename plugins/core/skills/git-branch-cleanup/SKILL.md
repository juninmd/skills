---
name: git-branch-cleanup
description: |
  Safely detect, prune, and delete merged and squash-merged Git branches locally and remotely on GitHub. Use for bulk branch cleanup, repository housekeeping, removing stale branches after PR merges, and cleaning gone tracking branches. Trigger on 'remove merged branches', 'clean up stale branches', 'delete merged branches remotely', 'prune merged branches'.
---

# Git Branch Cleanup

**Not this skill:** active rebase conflict recovery, stash, bisect, or release tagging (`git-workflow`), or pull request review and delivery (`finishing-dev`).

## Preflight

```bash
git status --porcelain
git branch --show-current
git remote -v
git worktree list
gh auth status
```

Inspect default branch, tracking configuration, and active worktrees. Never assume `main` or `master` without verification.

## Workflow

1. Identify base and protected branches: Establish default branch (`main` or `master`), current branch, and worktree checkouts. Never target protected branches (`main`, `master`, current checkout, or active worktree paths).
2. Query merged pull requests: Standard `git branch --merged` misses squash-merged and rebase-merged PRs because commit SHAs differ. Query GitHub CLI (`gh pr list --state merged --limit 500 --json headRefName,number`) to identify branches successfully merged into the base branch.
3. Cross-reference candidate branches: Intersect merged PR head branch names with remote heads (`gh api repos/:owner/:repo/branches`) and local branches (`git branch --list`). Also detect gone tracking refs (`git branch -vv` showing `[...: gone]`).
4. Present dry-run report and gate: Output candidate counts and exact branch names. Require explicit user confirmation before any destructive delete (`git push origin --delete` or `git branch -D`).
5. Execute approved deletions and prune: Delete confirmed remote branches via GitHub API or push delete; delete confirmed local branches with `git branch -D`; run `git fetch --prune` and `git worktree prune` to eliminate stale tracking refs and administrative locks. Verify resulting state with `git branch -vv`.

## Operation Decisions

| Situation | Action | Verify |
|---|---|---|
| Squash-merged PR branch | Query `gh pr list --state merged` to match branch names against merged PR head refs | Candidate branches match merged PR numbers; `master`/`main` excluded |
| Local branch marked `[origin/...: gone]` | Verify upstream was deleted and no unpushed commits remain before removal | `git log HEAD@{u}..HEAD` empty or PR confirmed merged |
| Branch checked out in another worktree | Identify path via `git worktree list`; do not delete active branch | Worktree pruned only after worktree directory removal |
| Unmerged or closed PR branch | Do not delete unless explicitly authorized by user as discarded | Candidate branch not in unmerged closed PR list without consent |
| Remote deletion failure due to protection rule | Check branch protection or rulesets; report blocker to user | Branch remains untouched; report reason |

## Cleanup Commands

Run dry-run inspection with the bundled script or execute deletion after user authorization:

```bash
python .agents/skills/git-branch-cleanup/scripts/clean-merged-branches.py --dry-run
python .agents/skills/git-branch-cleanup/scripts/clean-merged-branches.py --all --yes
```

Manual fallback commands for targeted pruning:

```bash
git fetch --prune
git branch -vv | grep ': gone]'
git worktree prune
```

## Stop

- Branch deletion authorization is missing, or requested scope is ambiguous.
- Candidate includes default branch (`main` or `master`), current active branch, or a branch with unmerged commits without explicit user consent.
- Worktree lock or active checkout prevents safe removal.
- GitHub CLI authentication fails or API rate limit is reached.

## Rules

- Never delete `master`, `main`, or the current checkout branch.
- Squash-merged PRs change commit SHAs; always use GitHub PR state (`gh pr list --state merged`) alongside git merge detection.
- Always require explicit confirmation before deleting remote branches (`push --delete`) or local branches.
- Always run `git fetch --prune` and `git worktree prune` after branch deletions to keep tracking references clean.
- Dry-run first: report exact branch counts and names before deleting.

## Excuses

| Excuse | Why it is false |
|---|---|
| `git branch --merged` is enough | Squash merges create new commits on the base branch with different SHAs; relying only on `--merged` leaves squash-merged PR branches stranded |
| I can delete remote branches without asking because the user asked to clean | Deleting remote branches alters shared repository state; explicit confirmation of the candidate list is mandatory |
| The worktree branch is merged so I can delete it now | Git prevents deleting checked-out branches; the worktree must be removed first |
| Closed PRs are the same as merged PRs | Closed PRs may have been rejected or abandoned with unmerged work; only `state == MERGED` proves integration |

## Checklist

- [ ] Default branch, active branch, and worktrees identified.
- [ ] Merged PR branches cross-referenced via `gh pr list --state merged`.
- [ ] Exact candidate branches and counts reported for user confirmation.
- [ ] Approved remote branches deleted and confirmed.
- [ ] Approved local branches deleted cleanly.
- [ ] Remote tracking refs pruned with `git fetch --prune`.
- [ ] Final state verified with `git branch -vv`.
