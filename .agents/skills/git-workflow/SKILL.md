---
name: git-workflow
description: |
  Operate Git safely, finish pull requests, and manage releases. Use for branches, rebase, reflog, stash, conflict resolution, PR drafting, conventional commit verification, version bumping, changelogs, and release tags.
---


# Git Workflow

## Preflight
Never operate on a state you have not read.

```bash
git status --porcelain          # dirty? untracked?
git branch --show-current       # detached HEAD prints nothing
git log --oneline -5            # where HEAD actually is
git remote -v && git remote show origin | grep 'HEAD branch'
```

## Workflow
1. Read the state above, then pick the smallest command that expresses the intent. Prefer an operation that adds history over one that rewrites it.
2. Before any rewrite (`rebase`, `commit --amend`, `reset`, `filter-repo`), prove nothing pushed is affected: `git log --oneline origin/<base>..HEAD` lists what is still local. A commit missing from it is public history, and rewriting that needs explicit confirmation.
3. Recover before concluding anything is lost: `git reflog` holds every position HEAD held, `git reflog show <branch>` the same per branch, and `git fsck --lost-found` catches what a reflog expiry dropped.
4. Bisect mechanically, never by hand: `git bisect start <bad> <good>` then `git bisect run ./script`. The script exits 0 for good, 1 for bad, and **125 for untestable** so a broken build is excluded instead of scored bad. Finish with `git bisect reset`.
5. After mutations, verify status and the relevant diff/log; check sooner for destructive or conflict-prone work.

## Symptom Routing

| Symptom | Command | Trap |
|---|---|---|
| Committed to the wrong branch | `git switch -c right && git switch - && git reset --hard @{u}` | reset destroys uncommitted work — stash first |
| Need to undo a published merge | `git revert -m 1 <merge-sha>` | `reset` resurrects it on their next push; re-merging later needs the revert reverted |
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

Verify the resolved result before completing the rebase; never `--skip`, which drops the commit.

See [Reference Map](references/TOPIC_MAP.md) for specialized references and sub-domain guides.

## Stop
- A conflict is resolved by picking a side without reading why the other side existed.
- The rewrite would touch a commit already on the remote. Stop and get explicit confirmation.
- A destructive command has an unset or unverified target. Bind it and dry-run first.
- Work appears lost. Check `git reflog` and `git fsck --lost-found` before concluding anything is gone.

## Rules
- Hand off CI pipelines to `cloud-devops`, loop automation to `dev-loop`, and project tracking to `project-lifecycle`.
- Never rewrite pushed history without explicit confirmation.
- Never `git push --force`. Use `--force-with-lease --force-if-includes` after fetching.
- Two branches checked out at once: use `git worktree add ../<dir> <branch>`.
- Prefer `git stash push --include-untracked`; an unnamed stash is unrecoverable context after a week.
- Submodules: update `--init --recursive` and pin by commit; a bump is a content change and belongs in its own commit.
- Hooks live in-repo (`.githooks/` with `core.hooksPath`), never in `.git/hooks`. A local hook cannot enforce a convention — pair it with a CI check over the branch range.
- Never `--no-verify`, and never `-c core.hooksPath=`. The hook is the gate, not a suggestion; a slow or wrong hook is a hook to fix or delete, not to route around.
- `git clean -fdx` deletes ignored files too — `.env`, local databases, build caches. Dry-run with `-n` first.
- Branching, committing, and opening the pull request belong to finishing-dev; tags and releases to release-management.

## Excuses

| Excuse | Why it is false |
|---|---|
| "The hook is slow, --no-verify just this once" | The gate you skip is the one that was going to catch this |
| "Just take their side and move on" | A conflict is two intents; the side you drop was somebody solving a problem |

## Checklist
- [ ] State read before the mutation, and re-read after it.
- [ ] Intent maps to the smallest safe command.
- [ ] No pushed history rewritten without confirmation; shared branches undone by revert, not reset.
- [ ] Destructive commands dry-run first where a dry-run exists.
