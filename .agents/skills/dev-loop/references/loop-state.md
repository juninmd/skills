# Loop State Contract

Every loop owns one workspace: `.workflow/<slug>/`, created by `phase-research` (the first stage to run).
`<slug>` is `<issue-number>-<kebab-title>`, or `<YYYY-MM-DD>-<kebab-title>` when `issue` is `null`.
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
  "skipped": [],
  "scratch": [".workflow/42-group-links/prototypes"],
  "updated": "2026-08-19T14:02:00Z",
  "notes": "variant C rejected on first round"
}
```

| Field | Meaning |
|---|---|
| `issue` | Tracking issue number. `null` only when issue tracking is unavailable. |
| `slug` | Workspace directory name; never changes once created. |
| `stage` | One of `research`, `prototype`, `plan`, `implement`, `finalize`, `done`. |
| `awaiting` | `null` when the agent owns the turn; otherwise the pending gate. |
| `artifacts` | Files written so far, relative to the workspace. |
| `branch` / `pr` | Set by `phase-implement`; `pr` is the PR number or URL. |
| `rounds` | Iteration counter per stage. Rising counts with no progress signal a stall. |
| `skipped` | Stages the fast path bypassed, e.g. `["research", "prototype"]`. Empty on a full loop. |
| `scratch` | Paths, branches, worktrees, and sessions the loop created that must be removed at `done`. |
| `updated` | ISO timestamp of the last write. |
| `notes` | Short free text carried between stages. |

## Gates

| `awaiting` | Set by | Cleared by |
|---|---|---|
| `prototype-selection` | `phase-prototype` | `phase-prototype` on an explicit variant choice |
| `questionnaire` | `phase-plan` | `phase-plan` in the same write that sets `stage: "implement"` |
| `iterate` | `phase-implement` | `phase-implement` on an explicit ship-it |
| `review` | `phase-done` | the human review verdict; merge is the human's act |

## Round Counters

- `phase-prototype` increments `rounds.prototype` on every variant round, including the first.
- `phase-implement` increments `rounds.implement` on every iteration round, including the first.
- No other stage writes `rounds`. A counter that rises while `stage` and the artifacts stand still is the stall the driver reports.

## Scratch Inventory

- Whoever creates a throwaway artifact appends its path or name to `scratch` in the same write.
- `phase-prototype` records `.workflow/<slug>/prototypes/`; `phase-implement` records worktrees, test branches, and child sessions.
- `phase-done` removes exactly what `scratch` lists, with confirmation, and removes nothing that is not listed.
- The delivery branch never contains a path listed in `scratch`.

## Fast Path

Work with no direction or UX decision to make — a bugfix, a refactor, a mechanical or mandated change — may enter the loop at `plan`.
A loop may also enter at a later stage the user names explicitly; that instruction is the justification, and `notes` records it verbatim.
The entering stage writes the bypassed stages into `skipped` and states in `notes` why no direction was needed.
Anything with an open UX or architecture choice runs the full loop. `finalize` and `done` are never skipped.

## Acceptance Criteria Precedence

`research.md` states the initial acceptance criteria; the `phase-plan` questionnaire may narrow, widen, or replace them.
`plan.md` supersedes `research.md` wherever they disagree. `phase-finalize` validates against `plan.md`, and treats a `research.md`
criterion that `plan.md` dropped as deferred, naming it in `evidence.md` rather than silently failing it.

## Red Gate

A red gate is any of: a failing test, a red CI run, a blocking lint or type error, or the user rejecting the stage output.
On a red gate the loop stops, reports the failure verbatim, and leaves `stage` and `awaiting` untouched. No stage advances over one.

## Write Discipline

- Exactly one writer at a time: the skill that owns the current stage.
- Write the state file last, after the stage artifact exists on disk.
- Advancing means two edits in one write: set the next `stage` and set `awaiting` to that stage's gate or `null`.
- Never edit `stage` from the driver itself; the driver only reads and dispatches.
- Append to `artifacts`, `scratch`, and `skipped`; never rewrite the history of the loop.

## Recovery

- **Missing file, workspace exists** — rebuild it from the artifacts present: the newest artifact names the completed stage.
- **Invalid or truncated JSON** — stop, show the file, and ask before overwriting. Never silently reset a loop. A file that parses but is missing `stage` or `slug` counts as corrupt; rebuild it from the artifacts present and confirm the result with the user before continuing.
- **Two loops sharing a slug** — the slug is the workspace identity, so this means one workspace holds two loops' artifacts. Stop. Show both `issue` values and the artifact list, and ask which loop keeps the slug; the other is re-created under a new slug and its artifacts moved. Never merge the two state files.
- **Stage unchanged after a stage ran** — a stall. Report what the skill produced and what its checklist still fails; do not rerun.
- **`awaiting` set but the gate was already answered** — clear `awaiting` only after the owning skill confirms the answer was consumed.
- **Several active loops** — list `slug`, `stage`, and `awaiting` for each, and ask which one to continue.
- **Parked in `awaiting`** — a gate whose answer is never coming is not a stall and not a completed loop. List every loop whose `updated` timestamp is old while `awaiting` is set, showing `slug`, `stage`, and the pending gate, and ask which to abandon. Do not answer the gate on the user's behalf, and do not advance the stage to reach `done`.
- **Abandoned loop** — archive `.workflow/<slug>/` to `.workflow/done/<slug>/` with `stage: "done"`, `awaiting: null`, and a note explaining why it stopped. Archiving is a direct write and never runs `phase-done`: that stage is for a delivered loop and would clean up `scratch` and request human review for work that was never finished. Remove the abandoned loop's `scratch` paths manually, with confirmation.
