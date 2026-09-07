# Delivery state contract
`starting-dev` owns research, prototype, plan, and implement; `finishing-dev` owns finalize and readiness. Stage names refer to local procedures, not installed phase skills.

Use `.workflow/<slug>/loop-state.json` for sustained delivery or an already tracked task. The slug is a dated task name, or an issue identifier when issue tracking was requested. Inspect existing workspaces before creating another.

```json
{
  "issue": null,
  "slug": "2026-09-07-example",
  "stage": "research",
  "awaiting": null,
  "artifacts": [],
  "branch": null,
  "pr": null,
  "rounds": {},
  "skipped": [],
  "scratch": [],
  "updated": "2026-09-07T00:00:00Z",
  "notes": ""
}
```

| Field | Contract |
|---|---|
| `stage` | research, prototype, plan, implement, finalize, or done |
| `awaiting` | Null, or a concrete unanswered decision; elapsed time is never an answer |
| `artifacts` | Existing files relative to this workspace; append after writing |
| `branch`, `pr` | Verified branch and PR identifier; PR is set only after finishing review and authorized publication |
| `rounds` | Stage iterations; repeated attempts without new evidence are a stall |
| `skipped` | Bypassed stages with reasons; independent final review cannot be skipped |
| `scratch` | Exact owned temporary paths/worktrees; not permission to delete |
| `updated`, `notes` | Last change timestamp and concise rationale |

One writer owns state at a time. Write artifacts first, state last. Re-read after each stage. Resume from disk plus repository evidence; never advance a gate from conversational memory alone. Starting at plan is valid for a routine fix or dictated approach; record skipped research/prototype and why.

| Condition | Action |
|---|---|
| Missing/corrupt state in existing workspace | Preserve artifacts; resolve intended state and identity before repair |
| Multiple matching loops | Ask which is active; do not combine histories |
| Gate already answered explicitly | Record the actual answer and clear the pending condition |
| Stage unchanged without progress | Report the stall and evidence; do not loop blindly |
| Failing check | Keep stage, fix within scope, rerun; report unresolved blocker |
| Final PR ready | Record readiness evidence; done does not mean merged or deployed |
| Abandoned task | Record cancellation only on explicit user direction; cleanup only owned artifacts with required authority |

A criterion changed from research to plan must have a documented reason and appropriate user direction. Do not hide dropped requirements in state. Human choices and publication authorization remain valid across stage transitions.
