---
name: finishing-dev
description: |
  Finish a change and prepare or open its pull request after independent code and security reviews, fixes, tests, and CI. Use for PR delivery, descriptions, acceptance evidence, homologação, 'homologue' (prove it on the real target), and return to the default branch with or without pipeline monitoring. Trigger on 'get it ready for a PR', 'open the PR', 'finish this feature'.
---

# Finishing Development

## The Iron Law

```
NO COMPLETION CLAIM WITHOUT FRESH EVIDENCE FROM THIS SESSION
```

A gate that ran before your last edit says nothing about the current candidate.

## The Gate

Before writing "ready", "passing", or "fixed", or opening a PR:

1. **IDENTIFY** which command proves the claim.
2. **RUN** it in full, fresh, across the entire affected scope.
3. **READ** all the output: exit code, failure count, skips you did not expect.
4. **VERIFY** that the output supports the claim. If not, report the true status and show that output.
5. **THEN** make the claim and quote the line that backs it.

| Claim | Needs | Does not count |
|---|---|---|
| Tests pass | Output with 0 failures and no unexpected skips | A previous run, "should pass" |
| Lint clean | Linter exit 0 across the full scope | Only the edited file |
| Build works | Build exit 0 | Passing types, clean-looking logs |
| Bug fixed | The original symptom reproduced, then gone | Code edited, fix assumed |
| CI green | Every check on the pushed SHA | An open PR with checks still pending |
| Agent or subagent done | The VCS diff, read by you, showing the claimed change | Its own success report |
| Requirements met | A line-by-line checklist against the spec, evidence per item | Passing tests |
| Regression fixed | Revert the fix, watch the test fail, restore, watch it pass | A new test that passed once |

**Not this skill:** unfinished work (use the domain skill) or Git surgery on branches and history (`git-workflow`).

## Preflight
Check what the request already authorizes for commit, push, and PR. Inspect repo instructions, remotes, base branch, worktree changes, test scripts, and CI. Resolve the real PR base; never assume `main` or diff only the last commit.

```bash
git status --short
git remote -v
git branch --show-current
git diff --stat
git diff --cached --stat
gh auth status
gh pr view --json number,url,baseRefName,headRefName,state
```
Run the GitHub probes only for a GitHub remote with `gh` available; no PR yet is normal. Leave unrelated work alone. Fetch the relevant remote refs before comparing when possible, and flag evidence that may be stale.

## Workflow
1. Settle the deliverable, acceptance criteria, base ref, and full candidate scope. That means commits since the merge base plus staged, unstaged, and relevant untracked files. For an existing PR, confirm its head and base match the branch under review. Branch or history trouble goes to `git-workflow`.
2. Run the lint, types, focused tests, and build or smoke steps the change needs. Take commands from the repo and its CI. Missing behavior coverage goes to `test-engineering`. A change that ships to a running target also needs [homologation](references/homologate.md): the real flow proven at the receiving end, beyond green gates.
3. **Before creating the PR, launch two independent review subagents.** One runs `code-review` on correctness, regressions, contracts, tests, and dependency-upgrade compatibility. The other runs `security-ops` on trust boundaries, secrets, permissions, advisories and provenance of locked dependencies, publication age, and deployment risk. Dependency or install-policy changes need the [dependency review deliverables](references/review-protocol.md); supported configuration goes to `package-management`. Give both the same immutable candidate, paths, acceptance criteria, and surrounding code. Keep both read-only and hide each one's findings from the other until both finish.
4. Judge each finding against real code. Fix confirmed blocking and substantive defects in scope; record false positives with evidence and unrelated concerns without widening scope. After fixes, re-run the affected gates and have the final candidate reviewed independently again; any edit voids review evidence for the paths it touches.
5. **Delegate two more subagents.** The first captures [PR evidence](references/pr-evidence.md): screenshots for visual UI/UX changes on web, desktop, mobile, TUI, and CLI; uploads to reviewer-accessible GitHub user-attachments URLs (never local disk paths or raw branch URLs); GIFs or video where interaction or motion must be shown; searchable text for CLI output; real payloads for contract changes. Use only applicable evidence. The second drafts the branch name, PR title, and body from the final diff per the [branch/title/description standard](references/pr-title-and-branch-standard.md): problem, behavior, decisions, verification, limits, with every claim traceable to a diff line. Start from the repository's PR template (`.github/pull_request_template.md`) when present; CI rejects an empty `## Evidence`. Embed both into one body. A missing or invented required capture is a named blocker. Open every capture and confirm it shows this project's surface; a screenshot copied from another app is a blocker too. Exclude raw logs, secrets, and history. Finish this step even without publication authority.
6. Within authorization you already hold, stage only reviewed files, inspect the staged diff, commit, push, and create or update the PR. A request to create a PR covers the PR operation; check whether commit and push are covered too. Ask once, after showing the ready result, only for authority still missing. Use `git-workflow` for safe Git mutations; confirm the pushed SHA equals the reviewed candidate.
7. Verify the remote head. Inspect all PR checks unless the user explicitly declines; then note that and mark CI unverified. When monitoring is requested, follow that exact PR and head until every check ends or a concrete blocker appears. Pending, failed, cancelled, or missing required checks block readiness. Fix authorized failures, re-run affected review and gates, and update the same PR. Report URL, exact head, checks or inspection limits, and open comments. **Never auto-merge.**
8. At every PR delivery handoff, carry out [return to default branch](references/return-to-default.md), even when monitoring was declined, is pending, or is blocked. Returning needs no green CI and proves no readiness. Confirm the active checkout path and default branch, or report the exact dirty-worktree, ownership, or ref blocker. Keep the delivery branch; offer worktree removal only after explicit confirmation.

## PR preparation
Write the body to a file so newlines are real, then pass that file. Run external writes only with authorization.

```bash
git merge-base origin/BASE HEAD
git diff origin/BASE...HEAD --stat
git diff --cached --check
# Visual evidence: upload images to reviewer-accessible user-attachments before drafting body
gh pr create --draft --base BASE --head BRANCH --title 'Concrete problem and fix' --body-file PR_BODY_PATH
gh pr checks PR_NUMBER --json name,state,link
gh pr view PR_NUMBER --json headRefOid,mergeStateStatus,reviewDecision,url
```
Match the requested draft or ready status. A draft may stay open while CI runs; call it ready only after every check succeeds and blockers clear. Avoid `--required` on its own, since it can mask failing optional checks.

| Situation | Action |
|---|---|
| No native subagent capability | Prepare the diff, gates, and PR body; report the independent-review blocker; do not count self-review as a substitute |
| Review finds a concrete defect | Fix, retest, and send the changed final candidate back to independent reviewers |
| Review comes back clean | Report what was reviewed and the uncertainty; no findings is not proof of no defects |
| Authorization missing | Show the ready artifacts and request only the missing action |
| CI pending or failed | The PR may stay draft; readiness stays blocked |
| Pipeline inspection or monitoring declined | Mark CI unverified; finish the handoff and return to the default branch |
| All checks green | Report ready for human review; merging is a separate user decision |

## Stop
- Independent review cannot finish, the candidate changed after review, or substantive findings remain open.
- Tests, lint, smoke, or CI fail. Diagnose and fix within scope; otherwise report the blocker.
- Base, scope, ownership, credentials, or publication authority cannot be established.

## Rules
- Red CI does not always mean broken code. A check failing in seconds with empty steps, or every check on the account failing alike, usually signals a structural fault (billing, quota, runner outage); confirm with `gh run view` or logs before blaming the diff. It still blocks readiness.
- Review the whole change, not just the newest commit.
- Never stage unrelated files or bypass hooks and checks.
- Use separate reviewers; a different model helps but is never invented.
- A published branch is not proof of runtime behavior, CI, merge, or deployment.
- `requirements-planning` owns acceptance changes, `starting-dev` the dev loop; never drop a criterion to finish.

## Excuses

| Excuse | Why it fails |
|---|---|
| Small diff, skip review | Small diffs still hide contract regressions |
| CI is green | The pipeline ran; scoped tests are separate proof |
| Pushed means delivered | Publishing is not merge, deploy, or runtime proof |
| Worktree removal refused, `--force` finishes it | Those files exist only there; show `git -C PATH status --porcelain --untracked-files=all` and ask |
| Prints can come in a follow-up PR | The reviewer cannot see the change now; a missing applicable capture blocks readiness |
| Push rejected, force-push fixes it | The remote moved; fetch and inspect; force only when the user explicitly asks |

More in [Reference Map](references/TOPIC_MAP.md).

## Checklist
- [ ] Full candidate and base identified; unrelated changes preserved.
- [ ] Independent code and security reviews done before PR creation.
- [ ] Confirmed defects fixed; final candidate reviewed and checked.
- [ ] Evidence and description subagents ran; applicable screenshots, GIFs/videos, CLI text, and contract payloads attached with context; inapplicable formats justified; publication uses existing authorization.
- [ ] Every applicable capture opened and verified: right surface, unique hash across the session, final URL returns 200.
- [ ] Remote head matches reviewed work; all checks inspected, or the user's explicit opt-out and unverified CI recorded.
- [ ] PR URL or exact blocker reported; no automatic merge.
- [ ] Active checkout path and default branch verified at handoff, with or without monitoring; exact blocker reported if returning was unsafe.
