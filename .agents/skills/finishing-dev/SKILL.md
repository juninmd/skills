---
name: finishing-dev
description: |
  Finish development and prepare or create a pull request after independent code-review and security subagents, fixes, tests, and CI checks. Use for finishing a feature branch, review-before-PR delivery, PR descriptions, shipping a completed change, and final acceptance evidence.
---

# Finishing Development

## Preflight
Read the request's existing commit, push, and PR authorization. Inspect repository instructions, remotes, base branch, worktree changes, test scripts, and CI. Resolve the actual PR base; never assume `main` or compare only the last commit.

```bash
git status --short
git remote -v
git branch --show-current
git diff --stat
git diff --cached --stat
gh auth status
gh pr view --json number,url,baseRefName,headRefName,state
```
Use GitHub probes only for a GitHub remote and available `gh`; absence of an existing PR is expected before creation. Preserve unrelated work. Fetch only the relevant remote refs before comparison when available, and report stale offline evidence.

## Workflow
1. Resolve the deliverable, acceptance criteria, base ref, and complete candidate scope. Inspect committed changes from the merge base plus staged, unstaged, and relevant untracked files. For an existing PR, verify its head and base match the branch being reviewed. Use `git-workflow` for branch or history problems.
2. Run configured lint, types, focused tests, and build/smoke appropriate to the change. Commands come from the repository and CI, not a universal script list. Record pass/fail and remaining environment limits. Use `test-engineering` for missing behavior coverage.
3. **Run two independent review subagents before creating the PR.** Give one `code-review` for correctness, regressions, contracts, and tests; give the other `security-ops` for trust boundaries, secrets, permissions, dependencies, and deployment risk. Supply the same immutable base/head or candidate snapshot, changed paths, acceptance criteria, and relevant surrounding code. Bound each assignment; keep both read-only and blind to each other's findings until complete. See [review protocol](references/review-protocol.md).
4. Adjudicate findings against actual code and reproducible conditions. Fix confirmed blocking and substantive defects in scope; document false positives with evidence and unrelated concerns without quietly expanding scope. Route implementation to the domain owner. Re-run affected gates and independent review of the final candidate after fixes; any change invalidates review evidence for affected paths.
5. **Delegate two more subagents.** One captures [PR evidence](references/pr-evidence.md): real screenshots/terminal output per visible UI/web/CLI/TUI change, real payloads per new or modified contract. The other drafts the PR title and body from the final diff and template — problem, behavior, decisions, verification, limits — each claim traceable to a diff line. Merge both into one body; a missing or fabricated capture is a named blocker, never prose. No raw logs, secrets, or history. Complete even without publication authorization.
6. Within existing explicit authorization, stage only reviewed files, inspect the staged diff, commit, push, and create/update the PR. The request to create a PR authorizes that PR operation; check whether commit/push are also authorized by the request and applicable instructions. Ask once only for missing authority after presenting the ready result. Use `git-workflow` for safe Git mutations and verify the pushed SHA equals the reviewed candidate.
7. Inspect all PR checks and remote head. Pending, failed, cancelled, or missing required checks block readiness. Diagnose and fix authorized failures, rerun affected review/gates, and update the same PR. Report PR URL, exact head, checks, and unresolved review comments. **Never auto-merge.**

## PR preparation
Write real newlines through a file-writing tool, then use that file. Substitute resolved values; execute external writes only with authorization.

```bash
git merge-base origin/BASE HEAD
git diff origin/BASE...HEAD --stat
git diff --cached --check
gh pr create --draft --base BASE --head BRANCH --title 'Concrete problem and fix' --body-file PR_BODY_PATH
gh pr checks PR_NUMBER --json name,state,link
gh pr view PR_NUMBER --json headRefOid,mergeStateStatus,reviewDecision,url
```
Match requested draft/ready status. A draft can exist while CI runs; do not report it ready until every pipeline/check is successful and blockers are resolved. Do not use `--required` alone because it can hide failing optional checks.

| Evidence / condition | Action |
|---|---|
| No native subagent capability | Prepare diff, gates, and PR body; report independent-review blocker; do not claim self-review satisfies it |
| Review finds a concrete defect | Fix, retest, and have independent reviewers inspect the changed final candidate |
| Review is clean | Report reviewed scope and uncertainty; absence of findings is not proof of absence |
| Authorization missing | Present concrete ready artifacts and request only the missing action |
| CI pending or failed | PR may remain draft; readiness stays blocked |
| All checks green | Report ready for human review; merge remains a separate user decision |

## Stop
- Independent review cannot be completed, the candidate changed without re-review, or substantive findings remain unresolved.
- Tests, lint, smoke, or CI fail; diagnose and fix within scope, otherwise report the blocker.
- Base, scope, ownership, credentials, or publication authority cannot be established.

## Rules
- Review the whole proposed change, not only the latest commit.
- Never silently stage unrelated files or bypass hooks/checks.
- Prefer separate reviewers; a different model is useful when available but not required or invented.
- Publishing a branch is not runtime, CI, merge, or deployment proof.
- `starting-dev` owns planning and acceptance changes; do not silently drop criteria to finish.

## Excuses

| Excuse | Why it is false |
|---|---|
| Small diff, skip review | Small diffs hide contract regressions |
| CI is green | Pipeline ran; scoped tests are separate proof |
| Pushed means delivered | Publishing is not merge, deploy, or runtime proof |

More in [Reference Map](references/TOPIC_MAP.md).

## Checklist
- [ ] Full candidate and base identified; unrelated changes preserved.
- [ ] Independent code and security reviews completed before PR creation.
- [ ] Confirmed defects fixed; final candidate reviewed and checked.
- [ ] Evidence and description subagents ran; every visible or contract change has a real capture; publication uses existing authorization.
- [ ] Remote head matches reviewed work; all pipelines/checks inspected.
- [ ] PR URL or exact blocker reported; no automatic merge.
