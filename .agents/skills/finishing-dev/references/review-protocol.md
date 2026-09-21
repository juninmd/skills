# Independent review protocol

Create two separate subagent tasks using the host's delegation tool. Do not emulate independence with two consecutive self-reviews. If the client cannot spawn subagents, finish local checks and the PR body, then report the blocked review requirement before publication.

This covers the blind adversarial pair only. Evidence capture and PR description drafting are a second, non-adversarial pair of subagents defined in [pr-evidence.md](pr-evidence.md); run all four around the same stable candidate.

Provide each reviewer:
- Exact base and head; for uncommitted candidates, a stable diff/snapshot including relevant untracked files. Reviewers receive paths or artifact references, never secrets.
- Acceptance criteria, changed paths, related callers/contracts, and current check evidence.
- Read-only scope, time/output bounds, and explicit permission to inspect relevant surrounding code.
- Finding format: severity, file/line, reachable trigger, consequence, evidence, and suggested minimal correction.

| Reviewer | Load | Lens |
|---|---|---|
| Correctness | `code-review` | Behavioral regressions, lifecycle, concurrency, contracts, tests, data loss |
| Security | `security-ops` | Trust boundaries, secrets, authorization, injection, dependency and deployment exposure |

Do not show either reviewer the other's findings before their initial review completes. Different models can add diversity when available; do not claim a model was used without evidence. If concurrency is unavailable, separate blind tasks may run sequentially.

Adjudicate each finding with a real code path or reproduction. A failed refutation is not proof; uncertainty stays labeled. Fix confirmed substantive defects within scope and record justified dismissals. After any change, invalidate affected review evidence, rerun affected gates, and request independent review of the final candidate. Review unaffected paths may retain evidence if their snapshot and dependencies did not change.

Before publication verify the candidate still matches what was reviewed, including generated files and commit-hook changes. Check staged and committed diffs. After push compare remote head and file content to that candidate. Publish no unrelated files.

## Coordinating a PR that depends on another unmerged PR
A change stacked on an unmerged base carries every commit of that base in its diff until the base merges. Reviewing it as if it targeted the trunk hides which lines are actually new.

| Situation | Action |
|---|---|
| Dependent PR opened against the unmerged base branch, not `main`/`master` | State the real base explicitly in the PR body and to reviewers; the diff view only shows the incremental change when the base is set correctly |
| Base PR still under review | Mark the dependent PR draft, or label it blocked-by, so it cannot be merged first by mistake |
| Base PR changes after the dependent branch was cut | Rebase the dependent branch onto the updated base before re-review; a stale base silently reviews code that will not match what ships |
| Base PR merges | Retarget the dependent PR's base to `main`/`master` and verify the diff shrinks to only the incremental change |
| Independent review requested before the base merges | Scope reviewers explicitly to the incremental diff (base branch vs candidate head), not the combined diff against `main` — otherwise every base-PR finding gets re-litigated here |

Never claim readiness for a dependent PR while its base is unmerged; readiness is a property of the combined result, and the combined result does not exist until the base lands.
