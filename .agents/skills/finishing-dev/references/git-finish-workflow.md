# Git delivery reference
Use `git-workflow` for staging, committing, pushing, rebasing, and release tags. This procedure supports `finishing-dev`; it does not bypass independent reviews or action authority.

1. Resolve base, head, remote, branch ownership, and unrelated modifications.
2. Inspect all candidate and staged changes, including generated output and relevant untracked files. Stage only reviewed paths.
3. Use existing explicit user authorization for commit/push/PR operations; prepare concrete artifacts before asking only for any missing authority.
4. Verify commit hooks did not change the reviewed candidate. Re-review affected paths if they did.
5. Push without force by default; do not rewrite shared history without explicit authorization. Verify remote head equals intended local head.
6. Create/update the PR with a real multiline body file. Inspect all CI, review state, and comments before readiness.

No automatic merge, branch deletion, deployment, or release publication. Preserve secrets and unrelated work. See [review protocol](review-protocol.md) for the pre-PR gate.
