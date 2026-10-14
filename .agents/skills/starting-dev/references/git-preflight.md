# Git state before development

Run this read-only inspection on every start or resume, before branch-dependent edits. Existing worktrees are inspected even when creating a new worktree was not requested.

## Resolve the default branch

Read remotes and branch tracking configuration. Choose the repository's primary remote from instructions and upstream evidence; do not assume `origin`, `main`, or `master`. Avoid displaying credentials embedded in remote URLs.

```powershell
git branch --show-current
git status --short
git remote
git worktree list --porcelain
# Replace REMOTE with the resolved primary remote.
git symbolic-ref --quiet --short refs/remotes/REMOTE/HEAD
git ls-remote --symref REMOTE HEAD
```

The symbolic ref is a local hint; `ls-remote --symref` verifies the advertised remote HEAD when network access exists. If it is unavailable, label the local hint as unverified. For a GitHub repository with authenticated `gh`, `gh repo view --repo OWNER/REPO --json defaultBranchRef --jq '.defaultBranchRef.name'` is an alternative. If no authoritative default can be established, report the gap and ask; never substitute a guessed branch name.

Compare the current branch with that default. An empty branch name means detached HEAD. When they differ, ask: “This checkout is on BRANCH; the default is DEFAULT. Switch to DEFAULT or continue here?” Reuse an explicit switch-or-stay decision already made in this session. Branch-dependent edits wait for the answer; read-only discovery can proceed. In a headless run, record the pending decision rather than silently switching.

Before an accepted switch, recheck status and branch occupancy. Do not carry dirty work to another branch, auto-stash, commit, reset, or force a switch. Explain any blocker. If DEFAULT is held by another worktree, offer that existing checkout rather than creating or removing one; inspect its ownership and status first. After any accepted switch/location change, verify the active path, branch, and status again.

## Inventory worktrees and potential pending PRs

Parse `git worktree list --porcelain` as records, preserving paths with spaces. For every available path, inspect:

```powershell
# Replace WORKTREE_PATH and DEFAULT_REF with verified values.
git -C WORKTREE_PATH status --short
git -C WORKTREE_PATH branch --show-current
git -C WORKTREE_PATH log -1 --format=%h%n%cI%n%s
git -C WORKTREE_PATH rev-list --count DEFAULT_REF..HEAD
git -C WORKTREE_PATH diff --stat DEFAULT_REF...HEAD
# GitHub only: resolved repository and exact branch, not the current shell branch.
gh pr list --repo OWNER/REPO --head BRANCH --state all --limit 100 --json number,url,state,headRefName,headRefOid
```

Inspect staged, unstaged, and untracked changes without dumping private file contents. Use the live default ref when available; otherwise state that comparisons use cached refs. A commit count alone does not establish an undelivered change: inspect the diff and PR history, including squash merges. A failed or truncated PR lookup is unknown evidence, not “no PR.” For other hosts use their read-only PR/MR API when available; otherwise mark remote status unknown.

| Evidence | Report and next step |
|---|---|
| Open PR on the exact branch | Link it and note dirty/unpushed changes separately; the PR may not contain the local tip |
| Changes or commits differing from the default, no matching PR | Potentially awaiting a PR; confirm ownership/activity and ask whether to resume or prepare delivery |
| Closed unmerged PR or local changes beyond a merged PR head | Possible unfinished work; compare actual content before recommending a new PR |
| Clean worktree with no remaining diff | No pending delivery evidenced; this does not authorize removal |
| Locked, missing, detached, or inaccessible worktree | Report its state and inspection limits; never prune or unlock automatically |
| Remote query unavailable or incomplete | PR status unknown; do not label it abandoned or PR-free |

Report one compact row per worktree: path, branch, local changes, diff/commit evidence, PR URL/state, and known owner/activity. Call it idle only when the owner or a workstream register establishes that fact; age, last commit date, and a clean status do not prove inactivity. Inspection grants no permission to switch other worktrees, create PRs, push, merge, remove, or clean. Continue the authorized task after the current-branch decision; unrelated pending work does not expand its scope.
