---
name: git-workflow
description: |
  Operate Git safely and recover from history problems. Use for bisect, cherry-pick, reflog, cleaning up stale branches and worktrees, submodules, hooks, stash, rebase, amend, detached HEAD, conflict resolution, and history rewrite safety.
---

# Git Workflow

## Preflight
Run before any mutation. Never operate on a state you have not read.

```bash
git status --porcelain          # dirty? untracked?
git branch --show-current       # detached HEAD prints nothing
git log --oneline -5            # where HEAD actually is
git remote -v && git remote show origin | grep 'HEAD branch'
```

## Workflow
1. Read the state above, then pick the smallest command that expresses the intent. Prefer an operation that adds history over one that rewrites it.
2. Before any rewrite (`rebase`, `commit --amend`, `reset`, `filter-repo`), prove nothing pushed is affected: `git log --oneline origin/<base>..HEAD` lists exactly what is still local. If a commit is not in that list, rewriting it is a public history change and needs explicit confirmation.
3. Recover before you conclude anything is lost. `git reflog` holds every position HEAD held; `git reflog show <branch>` does the same per branch, and `git fsck --lost-found` finds dangling commits a reflog expiry dropped.
4. Bisect mechanically, never by hand: `git bisect start <bad> <good>` then `git bisect run ./script`. The script exits 0 for good, 1 for bad, and **125 for untestable** so a broken build is excluded instead of scored bad. Finish with `git bisect reset`.
5. Verify after every operation: `git status --porcelain`, `git diff --stat`, `git log --oneline -5`.

## Symptom Routing

| Symptom | Command | Trap |
|---|---|---|
| Committed to the wrong branch | `git switch -c right && git switch - && git reset --hard @{u}` | reset destroys uncommitted work — stash first |
| Need to undo a published merge | `git revert -m 1 <merge-sha>` | `reset` rewrites a branch others pulled; their next push resurrects it. Re-merging later needs the revert reverted |
| Wrong file in the last commit | `git restore --staged <f> && git commit --amend` | only while unpushed |
| Detached HEAD with real work | `git switch -c rescue` | switching away first loses the commits to gc |
| Rebase stuck on the same conflict | `git config rerere.enabled true` before restarting | review replayed hunks; rerere replays a wrong resolution just as happily |
| Stale local branches | `git fetch --prune && git branch -vv \| grep ': gone]'` | `--prune` only drops remote-tracking refs, not your local branches |
| Cherry-pick lands broken | `git cherry-pick -x <sha>` | `-x` records the origin; without it the duplicate is untraceable |

## Conflicts: Resolve By Intent
A conflict is two intents meeting, not two texts. Picking a side is a coin flip that compiles.

```bash
git log --merge -p -- <path>        # only the commits from both sides that touch this file
git log --oneline HEAD..MERGE_HEAD  # what the incoming side was trying to do
git diff --diff-filter=U --name-only  # exactly what is still unresolved
```

| Conflict shape | Resolve by |
|---|---|
| Both sides changed the same line for different reasons | Apply **both** intents; neither side is redundant |
| One side deleted, the other edited | Read why it was deleted; a delete that lost is usually a revert waiting |
| Rename against edit | `git log --follow` the new path, then replay the edit onto it |
| Lockfile or generated file | Never hand-merge — take one side and regenerate |
| Import or list block | Take the union, then let the formatter settle order |
| The same conflict on every replayed commit | `git config rerere.enabled true`, then review each replay |

Verify with build and tests **before** `git rebase --continue`, and never `--skip`, which silently drops the commit.

## Stop
- A conflict is resolved by picking a side without reading why the other side existed.
- The rewrite would touch a commit already on the remote. Stop and get explicit confirmation.
- A destructive command has an unset or unverified target. Bind it and dry-run first.
- Work appears lost. Check `git reflog` and `git fsck --lost-found` before concluding anything is gone.

## Rules
- Never rewrite pushed history without explicit confirmation.
- Never `git push --force`. Fetch first, then `--force-with-lease --force-if-includes`: the lease only compares your remote-tracking ref, so an uninspected fetch makes it pass while overwriting unseen work.
- Two branches checked out at once (bisect, hotfix, comparing builds): `git worktree add ../<dir> <branch>` instead of stashing; clean up with `git worktree remove`; never point two worktrees at one branch.
- Prefer `git stash push --include-untracked` and keep stashes short-lived — an unnamed stash is unrecoverable context after a week.
- Submodules: update `--init --recursive`, pin by commit, never orphan the pointer. A submodule bump is a content change and belongs in its own commit.
- Hooks live in-repo (`.githooks/` with `core.hooksPath`), never copied into `.git/hooks`. A local hook cannot enforce a convention; pair it with a check over the branch range in CI.
- `git clean -fdx` deletes ignored files too — `.env`, local databases, build caches. Dry-run with `-n` first, always.
- Branching, committing, and opening the pull request belong to `finishing-dev`; tags and releases to `release-management`.

## Checklist
- [ ] State read before the mutation, and re-read after it.
- [ ] Intent maps to the smallest safe command.
- [ ] No pushed history rewritten without confirmation; shared branches undone by revert, not reset.
- [ ] Destructive commands dry-run first where a dry-run exists.
