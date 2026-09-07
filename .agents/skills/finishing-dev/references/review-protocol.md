# Independent review protocol

Create two separate subagent tasks using the host's delegation tool. Do not emulate independence with two consecutive self-reviews. If the client cannot spawn subagents, finish local checks and the PR body, then report the blocked review requirement before publication.

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
