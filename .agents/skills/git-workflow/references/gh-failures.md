# `gh` Failure Modes

Recognize the failure from the message, then take the matching action. Never retry blindly.

## A pull request already exists for this branch
`gh pr create` fails with "a pull request for branch ... already exists".
- Confirm with `gh pr view --json number,url,state,baseRefName`.
- Push the new commits to the same branch; the existing PR updates itself.
- Update the description with `gh pr edit --body-file <file>` instead of opening a second PR.
- Only open a new PR if the existing one is closed and must stay closed.

## Not authenticated
`gh` reports missing or invalid credentials, or a 401.
- Check with `gh auth status`.
- Ask the user to run `gh auth login`; never write a token into the repo, a script, or a shell history line.
- In CI, the failure is a missing or under-scoped `GH_TOKEN`, not a login problem: report it, do not attempt an interactive login.

## Protected base branch
Push or merge is rejected by a branch protection rule (required reviews, required checks, linear history, signed commits).
- Read the rule: `gh api repos/{owner}/{repo}/branches/{base}/protection`.
- Protection is the intended behavior. Satisfy it (open the PR, wait for checks, get the review); never propose disabling protection or force-pushing the base.
- Required linear history means the PR must be rebased, not merged with a merge commit.

## No push permission (fork)
`git push` returns 403 or "Permission to ... denied".
- Confirm the remote: `git remote -v`. If `origin` is the upstream repo and you lack write access, push to your fork instead.
- Fork and set the remote: `gh repo fork --remote --remote-name fork`, then `git push -u fork <branch>`.
- Open the PR across repositories: `gh pr create --repo <upstream-owner>/<repo> --head <your-user>:<branch> --base <base>`.
- Maintainer edits require `--maintainer-can-modify` (the default on the web form) to be left enabled.

## General
- A `gh` command that fails twice for the same reason is a blocker: report it with the exact message and stop, do not work around it.
