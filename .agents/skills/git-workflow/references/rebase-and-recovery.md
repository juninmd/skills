# Interactive Rebase, Conflict Recovery, and Worktree Cleanup

Open this for a rebase gone wrong, a conflict in a binary or generated file, a
commit that seems to have vanished, a bisect fighting a flaky test, a stash
that will not apply cleanly, or a worktree left behind after a branch
merged. Chacon & Straub's *Pro Git* (git-scm.com) is the reference for the
object model underneath every recovery here — commits, refs, and the reflog
are all it takes to explain why these procedures work.

## Interactive Rebase Pitfalls

- **Reordering commits with a dependency.** Moving commit B before commit A
  when B uses a symbol A introduces breaks the tree at that point in the
  rebase, not just at the tip. Rebase pauses on the conflict; resolve it in
  place rather than reordering back — or split the rebase into two passes.
- **Squash vs fixup.** `git commit --fixup=<sha>` marks a correction as
  belonging to an earlier commit; `git rebase -i --autosquash` moves and
  squashes it automatically. Reserve manual `squash` in the interactive list
  for combining commits that were never meant to be separate.
- **Rewriting already-pushed commits.** Requires authorization and a lease
  push (`--force-with-lease`); tell collaborators before doing it — anyone
  with a local branch based on the old commits needs `git rebase --onto` or
  a fresh clone, not a silent `git pull`.
- **Preserving merge topology.** Plain `git rebase -i` flattens merge
  commits by default. Use `git rebase -i --rebase-merges` when the merge
  structure itself is meaningful and must survive the rebase.
- **When in doubt, abort.** `git rebase --abort` returns to the exact
  pre-rebase state; it is always cheaper than fighting a rebase whose intent
  became unclear halfway through.

## Conflicts in Binary and Generated Files

- **Lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`).**
  Never hand-merge the conflict markers. Resolve the manifest
  (`package.json`, `pyproject.toml`) first, then regenerate the lockfile
  with its own tool and commit the regenerated file whole.
- **True binary files (images, fonts, compiled artifacts).** Git cannot
  three-way merge them. Decide intent, then `git checkout --ours -- path` or
  `git checkout --theirs -- path`, `git add`, and verify the result opens
  correctly — do not guess from the diff, there isn't one.
- **`.gitattributes` merge strategies.** `merge=ours` or `merge=union` can be
  declared per path for files where that resolution is always correct (for
  example a changelog fragment file safe to union); never set it for a file
  where "both sides" or "keep mine" can silently drop the other side's real
  change.
- **Git LFS pointers.** A conflict in an LFS-tracked path is a conflict in
  the pointer file, not the binary itself; resolve it with `git lfs`-aware
  tooling so the resolved pointer still resolves to an object present in the
  LFS store.

## Reflog Recovery Deep Dive

The reflog records every ref update locally; it is not pushed and it
expires (`gc.reflogExpire`, 90 days for reachable entries; 30 days for
unreachable ones, both configurable).

```bash
git reflog show <branch>                 # every point <branch> has pointed to, newest first
git show <sha>                           # inspect a candidate before touching anything
git branch rescue/<name> <sha>           # recover it onto a new branch, never overwrite HEAD blindly
```

If the reflog itself no longer has the entry (expired, or a fresh clone with
no local history), `git fsck --no-reflog --unreachable` and `git fsck
--lost-found` can surface dangling commit objects the garbage collector has
not yet swept — but only until the next `git gc`. Absence of a result is not
proof the commit never existed; it is proof it is no longer recoverable from
this repository copy.

## Bisect with a Flaky Test

A `git bisect run` script must distinguish "bad", "good", and "cannot tell":

```bash
git bisect start <bad-sha> <good-sha>
git bisect run ./check.sh   # exit 0 good, 1 bad, 125 skip this commit
```

When the test itself is flaky, do not let a single flaky failure mark a
commit bad — that corrupts the binary search, not just one data point. Have
`check.sh` retry a fixed, small number of times and only report bad on a
reproducible failure; if it still cannot decide, exit 125 (`git bisect
skip`) rather than guessing. A flaky test found this way is itself a bug
report for `test-engineering`, not something to route around permanently.

## Worktree Cleanup

```bash
git worktree list                 # every checkout, and whether it is locked
git worktree remove <path>        # clean removal; refuses if the worktree has uncommitted changes
git worktree remove --force <path> # only with explicit authorization for the discarded changes
git worktree prune                # clears administrative files for worktrees whose directory is already gone
git worktree unlock <path>        # required before removing a worktree locked against pruning
```

A worktree left behind after its branch merges keeps that branch from being
deleted cleanly and confuses `git branch --show-current` invocations run
from automation that assumes one worktree per repository.

## Stash Pitfalls

- `git stash pop` that conflicts leaves the stash entry **on the stash
  list** until the conflict is resolved and it is dropped explicitly with
  `git stash drop` — an interrupted pop is not silently lost.
- `git stash apply` never deletes the stash entry even on success; follow it
  with `git stash drop` once the result is verified, or reuse the same
  stash entry deliberately.
- Inspect before applying: `git stash show -p stash@{0}` shows the diff
  without touching the working tree.
- If a stash conflicts badly with the target branch, `git stash branch
  <name>` recreates the branch the stash was taken from and applies it
  there, which is often less painful than resolving the conflict in place.

## Signing Commits

```bash
git config commit.gpgsign true
git config user.signingkey <key-id>       # GPG key id, or an SSH public key with gpg.format=ssh
git log --show-signature -1               # verify a signature after the fact
```

Some branch protection rules require verified signatures on every commit
merged to a protected branch; check the rule (`gh api
repos/{owner}/{repo}/branches/{base}/protection`) before assuming a plain
commit will be accepted. Signing proves authorship of the commit content, not
of the code's correctness — it is a supply-chain control, not a review
substitute.
