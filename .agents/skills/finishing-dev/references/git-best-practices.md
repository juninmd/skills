# Git delivery reference
Use `git-workflow` for staging, committing, pushing, rebasing, and release tags. This procedure supports `finishing-dev`; it does not bypass independent reviews or action authority.

1. Resolve base, head, remote, branch ownership, and unrelated modifications.
2. Inspect all candidate and staged changes, including generated output and relevant untracked files. Stage only reviewed paths.
3. Use existing explicit user authorization for commit/push/PR operations; prepare concrete artifacts before asking only for any missing authority.
4. Verify commit hooks did not change the reviewed candidate. Re-review affected paths if they did.
5. Push without force by default; do not rewrite shared history without explicit authorization. Verify remote head equals intended local head.
6. Create/update the PR with a real multiline body file. Inspect all CI, review state, and comments before readiness.

No automatic merge, branch deletion, deployment, or release publication. Preserve secrets and unrelated work. See [review protocol](review-protocol.md) for the pre-PR gate.

## Generated files and lockfiles in the diff
A PR that regenerates a lockfile, a client, a snapshot, or a compiled asset carries two different diffs at once: the hand-written change and its generated consequence. Review them differently.

| Situation | Action |
|---|---|
| Lockfile changed alongside a dependency edit in the manifest | Expected; verify it was produced by the package manager (`npm ci`, `pnpm install --frozen-lockfile`), never hand-edited |
| Lockfile changed with no manifest edit | Investigate before staging — an unrelated transitive bump or a stale local install; do not silently include it |
| Generated client/schema/snapshot changed with no source edit | The generator drifted from what is committed, or the artifact was hand-edited; regenerate from source and diff again, never patch the artifact directly |
| Generated diff is large and unreadable (minified bundle, full lockfile rewrite) | Isolate it in its own commit, separate from the hand-written change, so a reviewer can skip it deliberately |
| Reviewer cannot tell hand-written from generated | State which paths are generated and the exact command that regenerates them, in the PR body |

Never hand-edit a lockfile, generated client, or snapshot to shrink a diff or force a test green — that value is fabricated, and the next regeneration silently reverts it.

## Squash vs merge commit strategy
The repository's configured merge strategy is not a per-PR preference. Confirm it before assuming either shape.

| Strategy | Keeps | Use when |
|---|---|---|
| Squash merge | One commit per PR on the base branch; full history stays on the PR page | Default for feature branches with messy WIP commits; keeps `git bisect` on the base branch fast and every base-branch commit shippable |
| Merge commit | Every commit, plus a merge node | The branch's intermediate commits are individually meaningful, e.g. a migration commit that must be revertable on its own |
| Rebase and merge | Every commit, linear, no merge node | Small branches with already-clean, atomic commits |

Do not fight the configured strategy by hand — hand-picking a few commits into a squash-only repository, or rebasing into a merge-commit repository, produces base-branch history nobody else's tooling expects. If a PR needs individually revertable commits and the repository squashes by default, say so in the PR body rather than silently overriding the merge button.

## Breaking a huge diff into reviewable commits
A diff a reviewer cannot hold in working memory gets a rubber-stamp approval, not a review; Google's engineering practices for code review (`google.github.io`) size a change so one sitting covers it. When a change grew past that size, split it before requesting review, not after a stalled one.

1. Identify seams that already exist: a schema/migration, a pure refactor, the new code path, the call-site switch-over, cleanup of the old path.
2. Order commits so every intermediate commit builds and passes tests — `git bisect` must never land on a broken intermediate state.
3. Prefer commit-by-commit review for a large PR: each commit is a reviewable unit with its own message explaining why, not just what.
4. Never combine a refactor commit and a behavior-change commit; mixing them hides the behavior change inside noise.
5. If splitting after the fact, hand the rebase/reorder to `git-workflow`; this skill does not perform history surgery.

| Diff shape | Action |
|---|---|
| Mechanical rename/move across many files | One commit, clearly labeled, reviewed for the mechanical rule only |
| New feature behind a flag | Separate commits: scaffolding, implementation, flag flip |
| Refactor plus behavior change bundled | Split into a refactor commit (no behavior change, provable by tests) and a behavior commit |
| Multiple unrelated fixes in one branch | Separate PRs; do not bundle unrelated concerns because they touched nearby lines |
