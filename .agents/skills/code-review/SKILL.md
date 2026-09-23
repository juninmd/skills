---
name: code-review
description: |
  Review diffs and pull requests for defects, regressions, and contract violations, however small the diff; sweep sibling bug variants. Trigger on 'review this diff', 'before it merges', 'is it safe to delete'. Also legacy code recovery, characterization tests, simplifying working code, and deleting proven dead code.
---

# Code Review

**Not this skill:** reviewing your own uncommitted work as the author before a PR (`finishing-dev` runs review as an independent pass), or auditing trust boundaries and secrets (`security-ops`).

## Preflight
Establish review versus implementation intent, base/head or path scope, acceptance criteria, and applicable instructions. Default review requests are read-only. Inspect the full candidate, including uncommitted work if requested.

```bash
git status --short
git diff --stat
git diff --cached --stat
git log -5 --oneline
rg -n -w 'symbolName' --glob '!*.min.*' --glob '!node_modules/**' --glob '!target/**'
rg -n -F -e "'symbolName'" -e '"symbolName"' --glob '!node_modules/**' --glob '!target/**'
```
Substitute the actual symbol. Resolve the base rather than assuming a branch name; use `git diff BASE...HEAD` for the committed candidate and inspect relevant untracked files separately.

## Workflow
1. Read the diff, callers, public exports, tests, and configuration needed to understand behavior. Use `starting-dev` for unfamiliar repository mapping. Separate introduced regressions from pre-existing defects; a line changed nearby is not causality.
2. Trace concrete failure conditions through inputs, state transitions, outputs, and side effects. Check authorization assumptions, null/empty/boundary inputs, concurrency, cancellation, idempotency, errors, lifecycle, compatibility, and resource bounds where relevant. Consult [expert review](references/expert-review.md).
3. Verify each suspected defect with a focused reproduction, test, or explicit code path. Distinguish observed failures from inferred risk. Prefer actionable defects over stylistic preferences; search related call sites with [variant analysis](references/variant-analysis.md) after identifying a real defect pattern.
4. Report findings first, ordered by severity. Each names `file:line`, trigger, actual consequence, evidence, and a concise correction. State when no actionable defects were found, then list scope and verification limits, and stop there: a clean verdict does not get a tail of pre-existing edge cases. Do not invent findings to fill a quota. A pre-merge pass before human review lists only problems that would block the merge, each with `file:line`, why it is wrong, and how to show it fails.
5. If fixes or simplification are requested, route domain implementation to the appropriate sibling such as `backend-systems` or `frontend-engineering`. For cleanup owned here, use [legacy refactoring](references/legacy-refactoring.md) to characterize uncertain behavior before changing it. Preserve behavior, public contracts, and unrelated modifications.
6. Re-run meaningful scoped checks after authorized edits. Re-read the final diff; route independent pre-PR delivery to `finishing-dev`, specialized security audit to `security-ops`, and boundary redesign to `software-architecture`.

## Evidence and action

| Observation | Decision |
|---|---|
| Reproducible changed behavior violates a contract | Report severity, trigger, consequence, and minimal corrective direction |
| Plausible failure lacks a reachable path | Investigate or state an uncertainty; do not present as confirmed |
| Pre-existing defect outside scope | Mention only when reachable and material to what the diff touches; a clean diff gets "no actionable defects" plus scope, not a list of old edge cases |
| Diff introduces a vulnerability (injection, auth bypass, exposed secret) | Block the merge with the finding and hand the security assessment to `security-ops` by name; do not run the exploitability or blast-radius analysis here |
| No direct callers | Check string dispatch, exports, external consumers, flags, plugins, and scheduled jobs before deletion |
| Behavior uncertain before cleanup | Add characterization with `test-engineering`; avoid semantic edits until understood |
| Naming or abstraction preference only | Omit unless maintainability review or simplification was requested |

## Subagent diffs
A subagent that edited one file cannot hold sibling files, prior incidents, or project intent in working memory the way a human author can. These patterns read as correct in isolation and fail only in production or under concurrency.

| Pattern | Why it passes review at a glance | How to catch it |
|---|---|---|
| A "split into two statements" refactor moves the assignment after the `await` (`this.x = {...}; await persist(x)` becomes `this.x = await op(x)`) | Reads as pure mechanical cleanup; tests stay green | Diff line order against the pre-refactor version; ask what a concurrent read sees during the await window |
| `return` inserted on a new early-exit path ahead of an existing `finally` | The new branch is locally correct | Trace every return path through to the `finally`; confirm cleanup still fires on each |
| `clearTimeout()` added with no matching `resolve()`/callback call | Reads as a leak fix; nothing throws | Confirm the promise or callback still settles on every branch, not only that the timer is cleared |
| A fix ships with a test that also passes against `git show HEAD:` (the pre-fix code) | Green test, plausible assertion | Run the new test against the old revision; it must fail there or it proves nothing |
| A file-scoped diff is locally correct but breaks a caller or violates intent recorded only in a sibling file or team memory | The subagent saw only the file it was told to edit | Grep callers before approving; check sibling files and project memory the subagent never read |

## Reference routing
[Reference map](references/TOPIC_MAP.md) selects undocumented-system recovery, output formats, safe refactoring, and defect sweeps. These files are local procedures, not installed skills.
- Diff signals that precede an outage — contracts, deleted guards, retries, plans, test edits: [regression-review.md](references/regression-review.md). Verdict arithmetic stays with `test-engineering` and its `regression-gate.md`.
- Anything that renders, web or desktop: [ui-review.md](references/ui-review.md).
- How big a review may be and what it provably misses: [review-effectiveness.md](references/review-effectiveness.md).
- Cross-file smells a single-file scan misses, and their matching refactor: [fowler-smells.md](references/simplification/fowler-smells.md).

## Stop
- Review scope or base cannot be determined; report what evidence is missing.
- A cleanup would change uncharacterized behavior, break a public contract, or delete code without usage evidence.
- A test or verification fails after a fix; diagnose before reporting completion.
- A credible security issue requires broader investigation; hand it to `security-ops` without disclosing secrets.
- The diff changes what renders and carries no Playwright coverage, and no unchanged visual baseline covers it; block and name the missing spec.
- Screenshots or traces exist, images are readable here, and none were opened; the rendered output is unreviewed.
- The change is too large to hold in one pass; say so instead of skimming it.

## Rules
- Findings must explain a real consequence and a reachable condition.
- A review is read-only unless changes were requested or already authorized.
- Smaller code is not automatically clearer; do not trade explicit behavior for clever compression.
- Never rewrite tests merely to fit changed behavior or remove safeguards to make checks pass.
- Frontend tests are Playwright, web and desktop alike; a documented driver exception is required for Tauri, never a renamed one.
- A vision claim from a screenshot is triage. Contrast, ARIA, and focus findings need an axe or ARIA-snapshot assertion.
- Keep semantic fixes distinguishable from cleanup. Commits require existing user authorization.

## Excuses

| Excuse | Required evidence |
|---|---|
| No tests means unused | Verify callers and runtime entry paths; absent coverage proves nothing |
| The last commit looked fine | Inspect the whole candidate against its actual base |
| Two reviewers agree | Validate the trigger and consequence in code |
| Cleanup is harmless | Characterize behavior and inspect public contracts before editing |

## Checklist
- [ ] Scope, base, relevant callers, and contracts inspected.
- [ ] Findings include location, trigger, consequence, and evidence.
- [ ] Security concerns routed; speculative style comments omitted.
- [ ] Requested cleanup preserves behavior and proves deletions safe.
- [ ] Final changes checked; untested paths and residual uncertainty reported.
