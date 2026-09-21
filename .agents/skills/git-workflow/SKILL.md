---
name: git-workflow
description: |
  Operate Git safely and manage releases. Use for branches, worktrees, rebase conflicts, reflog recovery, stash, bisect, conventional commits, semantic version bumps, changelogs, and release tags. PR review and delivery use finishing-dev.
---

# Git Workflow

**Not this skill:** preparing or publishing a reviewed pull request (`finishing-dev`), or CI pipeline configuration (`cloud-devops`).

## Preflight

```bash
git status --porcelain
git branch --show-current
git log --oneline -5
git branch -vv
git remote -v
git worktree list
```

Read tracking configuration and the requested operation; do not assume origin, main, or an upstream. Remote URLs may contain credentials: redact before reporting.

## Workflow

1. Establish ownership of the dirty worktree, intended branch and base. Read-only inspection and preparing a scoped diff need no new approval.
2. Before a rewrite, refresh relevant remote refs with `git fetch <remote>` and inspect `git log --oneline HEAD --not --remotes`. This identifies commits absent from the fetched remote-tracking refs; it cannot prove they were never published. `origin/<base>..HEAD` describes branch divergence, not publication. For each affected commit use `git branch -r --contains <sha>`; if remote state is incomplete, report uncertainty.
3. Prepare the smallest operation. Require authorization for commits, pushes and rewrites within the user's requested scope. Preserve a named backup branch before an authorized rewrite; a backup does not protect uncommitted files, so isolate or save those separately.
4. Resolve conflicts by reading both changes' intent, regenerate generated files with the owning tool, and run relevant checks before continuation. Skip a commit only when its change is demonstrably already present or explicitly unwanted.
5. Verify status, relevant diff and resulting log. For a requested push, compare local SHA with the advertised remote ref. Use `finishing-dev` for reviewed PR delivery.

## Operation Decisions

| Situation | Action | Verify |
|---|---|---|
| Commits on wrong branch | Create a named rescue branch at HEAD; inspect worktree and desired base before proposing any branch move | Rescue ref contains all intended commits; no automatic hard reset |
| Existing file accidentally changed in latest commit | After rewrite authorization: `git restore --source=HEAD^ --staged -- path/to/file`, inspect `git diff --cached`, then `git commit --amend --no-edit` | Parent exists; worktree content preserved; other staged changes excluded |
| Newly added file should remain local | After rewrite authorization: `git rm --cached -- path/to/file`, inspect index, then amend | File remains on disk; root commits require this route rather than HEAD^ |
| Published change must be undone | Prepare `git revert <sha>`; for merge inspect parents before choosing `-m` | Run affected checks; record mainline choice |
| Detached HEAD with work | `git switch -c rescue-name` | Branch points at the expected commit |
| Lost commit | `git reflog --all`; inspect candidate with `git show <sha>`; create rescue ref | Reflogs are local and expire; absence is not proof of destruction |
| Locate regression | `git bisect start <bad> <good>` then `git bisect run ./check` | Script exits 0 good, 1 bad, 125 untestable; finish `git bisect reset` |
| Finished worktree left behind | `git worktree remove <path>`, then `git worktree prune` if the directory is already gone | `git worktree list` no longer shows it; no stale lock remains |
| Interactive rebase or binary/generated-file conflict | Read [rebase and recovery](references/rebase-and-recovery.md) | Regenerated files match the tool that owns them; history reads as intended |
| Choosing or challenging a branching model | Read [branching strategies](references/branching-strategies.md) | Model matches release cadence and team size, not habit |
| Release version/tag/changelog | Read [release procedure](references/release-management.md) | Version and tag identify the tested artifact; publication authorized |

## Conflict Evidence

```bash
git diff --diff-filter=U --name-only
git log --merge -p -- path/to/file
```

Use merge-specific refs only while a merge exists; inspect rebase status and the current patch during rebase. Do not blindly union imports or choose one side of a lockfile without checking the final manifests.

See [Reference Map](references/TOPIC_MAP.md) for release and GitHub troubleshooting.

## Stop

- Rewrite authorization or target ownership is missing, remote state is uncertain, or unrelated changes would be included.
- Conflict resolution loses required behavior or verification fails.
- A destructive target is unverified: report the exact proposed target and consequence first.

## Rules

- CI pipelines belong to `cloud-devops`; repository setup to `starting-dev`; independent review and PR creation to `finishing-dev`.
- Prefer revert for shared history. Never use plain `--force`; an authorized rewrite uses `--force-with-lease` tied to the expected remote SHA (add `--force-if-includes` when the local remote-tracking ref might itself be stale) and checks concurrent updates.
- Scope staging by file or hunk; inspect the complete index before committing or amending.
- Use worktrees for simultaneous branches; inspect ownership before pruning or removing one.
- Do not bypass hooks to make a check appear green. Report a broken gate and repair it within scope.
- Chacon & Straub's *Pro Git* explains the object model behind every recovery here (reflog, `fsck`, detached HEAD); read it when a rescue plan needs to reason about objects instead of porcelain output.

## Excuses

| Excuse | Why it is false |
|---|---|
| Force push is fine on my branch | Ownership and remote state must be verified; use a lease, never plain force |
| Reflog will save us | Reflog is local and expires; verify the target before rewriting |
| The hook is flaky, skip it | A broken gate is repaired in scope, never bypassed |
| Add everything, it is all related | Inspect the full index; unrelated files never ride along |
| Bisect is failing because the test is flaky, mark it bad | `git bisect skip`; marking a flaky run bad or good corrupts the search, not just this one result |
| Just take theirs on the lockfile conflict | Regenerate the lockfile with its own tool; a hand-picked side rarely matches either branch's actual dependency tree |

## Checklist

- [ ] Worktree, branch, tracking refs and authorization established.
- [ ] Publication status assessed against refreshed refs with limitations stated.
- [ ] Unrelated work preserved; diff and checks reviewed after mutation.
- [ ] Requested remote operation verified by SHA, or remaining blocker reported.
