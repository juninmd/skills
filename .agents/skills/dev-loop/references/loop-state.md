# Loop State Contract

Every loop owns one workspace: `.workflow/<slug>/`, where `<slug>` is `<issue-number>-<kebab-title>`.
The driver and all `phase-*` skills read and write a single file: `.workflow/<slug>/loop-state.json`.

## Schema

```json
{
  "issue": 42,
  "slug": "42-group-links",
  "stage": "prototype",
  "awaiting": "prototype-selection",
  "artifacts": ["research.md"],
  "branch": "feat/42-group-links",
  "pr": null,
  "rounds": { "prototype": 1, "implement": 0 },
  "updated": "2026-08-19T14:02:00Z",
  "notes": "variant C rejected on first round"
}
```

| Field | Meaning |
|---|---|
| `issue` | Tracking issue number. `null` only when issue tracking is unavailable. |
| `slug` | Workspace directory name; never changes once created. |
| `stage` | One of `research`, `prototype`, `plan`, `implement`, `finalize`, `done`. |
| `awaiting` | `null` when the agent owns the turn; otherwise the pending gate: `prototype-selection`, `questionnaire`, `iterate`, `review`. |
| `artifacts` | Files written so far, relative to the workspace. |
| `branch` / `pr` | Set by `phase-implement`; `pr` is the PR number or URL. |
| `rounds` | Iteration counter per stage. Rising counts with no progress signal a stall. |
| `updated` | ISO timestamp of the last write. |
| `notes` | Short free text carried between stages. |

## Write Discipline

- Exactly one writer at a time: the skill that owns the current stage.
- Write the state file last, after the stage artifact exists on disk.
- Advancing means two edits in one write: set the next `stage` and set `awaiting` to that stage's gate or `null`.
- Never edit `stage` from the driver itself; the driver only reads and dispatches.
- Append to `artifacts`; never rewrite the history of the loop.

## Recovery

- **Missing file, workspace exists** — rebuild it from the artifacts present: the newest artifact names the completed stage.
- **Invalid JSON** — stop, show the file, and ask before overwriting. Never silently reset a loop.
- **Stage unchanged after a stage ran** — a stall. Report what the skill produced and what its checklist still fails; do not rerun.
- **`awaiting` set but the gate was already answered** — clear `awaiting` only after the owning skill confirms the answer was consumed.
- **Several active loops** — list `slug`, `stage`, and `awaiting` for each, and ask which one to continue.
- **Abandoned loop** — archive `.workflow/<slug>/` to `.workflow/done/<slug>/` with `stage: "done"` and a note explaining why it stopped.
