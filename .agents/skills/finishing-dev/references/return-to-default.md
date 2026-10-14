# Return to the default branch at PR handoff

Execute when PR creation/update is handed back, when the user declines pipeline monitoring, or when monitoring stops with a pending/failed check or external blocker. An explicit request to remain on the delivery branch takes precedence. No green CI prerequisite applies to returning; the CI verdict remains separate.

1. Save the repository identifier, PR number/URL, reviewed head, delivery branch, and worktree path. After switching, all PR checks must use that explicit identifier rather than infer a PR from the current branch. If continuing to monitor from the default branch, poll the saved PR/head and record any head change; fixes return deliberately to the owned delivery worktree and require checks/review again.
2. Resolve the real default branch and primary remote from instructions and remote HEAD, independently of the PR base (a stacked PR may target another feature). Use a verified local symbolic ref, remote `ls-remote --symref`, or the host's repository API. If remote verification is unavailable, state the cached evidence and limitation. Never assume `origin`, `main`, or `master`; when evidence is missing or contradictory, preserve the current checkout and report the exact gap.
3. Inspect `git worktree list --porcelain` and status in the current and intended target worktrees. Returning to the default branch is authorized by this workflow; stashing, committing unrelated work, resetting, forcing checkout, pruning, deleting, and removing worktrees are not. Any dirty current or target checkout or uncertain ownership blocks automatic return; preserve it and explain the blocker.
4. If the default branch already belongs to a clean, available worktree, use that checkout. Otherwise select the clean, owned main checkout (the first worktree record) and run `git -C MAIN_PATH switch DEFAULT`. Do not switch another owner's active feature checkout. If the local default branch does not exist, do not silently create a tracking branch; use `git-workflow` to resolve it within existing authority. Never use `--ignore-other-worktrees` or force flags.
5. Set the active tool working directory to the target checkout, then verify `git rev-parse --show-toplevel`, `git branch --show-current`, and `git status --short` there. A `cd` in a one-shot shell may not persist: carry the target path into subsequent tool calls. Switching location alone does not prove that checkout is on the default branch.
6. Report the final checkout path/branch or exact blocker along with the PR and CI status. Keep the delivery branch and worktree so pending CI fixes can resume. If a task-owned worktree was used, offer its exact removal command separately and execute only after explicit authorization.

## Commands

Use the detected host shell. These PowerShell probes also invoke native Git; replace the uppercase operands with resolved values and quote paths containing spaces.

```powershell
git remote
git symbolic-ref --quiet --short refs/remotes/REMOTE/HEAD
git ls-remote --symref REMOTE HEAD
git worktree list --porcelain
git status --short
git -C TARGET_PATH status --short
# Only after default, target, ownership and clean state are established:
git -C TARGET_PATH switch DEFAULT
Set-Location -LiteralPath TARGET_PATH
git rev-parse --show-toplevel
git branch --show-current
git status --short
# GitHub monitoring uses the saved PR rather than the newly active default branch:
gh pr checks PR_NUMBER --repo OWNER/REPO --json name,state,link
gh pr view PR_NUMBER --repo OWNER/REPO --json headRefOid,url
```

| Situation | Result |
|---|---|
| PR handed off without monitoring | Return safely; CI is unverified or pending, never declared green |
| Monitoring finishes or stops on a blocker | Return safely; retain checks and blocker in the report |
| Default already checked out in another clean worktree | Activate that path and verify its branch |
| Main checkout is clean, owned, on another branch | Switch it to the resolved default and verify |
| Current/target checkout dirty, locked, inaccessible, or actively owned by somebody else | Preserve state; report why automatic return could not run |
| User explicitly requests staying on the delivery branch | Honor it and report the branch retained |

Do not fetch/update the default branch's contents merely to return, or run a cleanup as part of the switch. This procedure changes active checkout state, not publication, merge, or runtime readiness.
