# Prototype procedure
Owned and executed by `starting-dev`; this file is not a standalone skill.

A prototype is throwaway code that answers one question. The question sets its shape, so choose the branch before writing anything.

| Question | Branch | Artifact |
|---|---|---|
| Does this logic, state model, or data shape hold up? | **LOGIC** | One self-contained file (an HTML page or a single script) driving a pure module (reducer, state machine, or plain functions), with a button or command per action and scripted scenarios: happy path, awkward edge, an action that must be illegal |
| What should this look like? | **UI** | Structurally different variants on one existing route, switched by `?variant=` and a dev-only switcher; a new throwaway route only when no host page exists. Send the build to `frontend-engineering` (3D scenes to `threejs`) |
| Where should this boundary or contract sit? | neither | `software-architecture` |

If ambiguous and the user is unreachable, follow the surrounding code (backend module: LOGIC; page or component: UI) and state that assumption at the top of the prototype.

1. Name the open decision, the observation that settles it, and the branch. Skip this stage for a dictated approach or a routine bug fix, and record why.
2. Build the fewest variants that test meaningfully different directions; never invent alternatives to hit a quota. UI variants differ in layout and hierarchy, not color or copy.
3. Make each variant trivial to run: one command from the project's task runner, or one file opened directly. No setup steps and no persistence, unless persistence is the question (then use a scratch store whose name makes it obviously disposable).
4. Show the state. After every action (LOGIC) or variant switch (UI), print or render the relevant state in domain language so the user sees what changed without reading code.
5. Isolate variants on a throwaway branch (for example `prototype/<slug>`) or a user-accepted [worktree](worktree-setup.md). Commits there need the same authorization as any commit; without it, leave variants untracked in owned paths inventoried in `scratch`. Never put prototype dependencies, mocks, or the switcher in production paths.
6. Run every variant and capture comparable behavior, constraints, and meaningful performance evidence. Write `prototype.md` in the workspace: question, branch, variants with run commands, observations, tradeoffs, recommendation, discarded options, and where the variant code lives.
7. Settle user-owned product choices explicitly; routine technical choices already authorized may proceed with a recorded rationale. Set `awaiting` only for a genuinely unanswered decision, and advance to plan once it is resolved.

A visual mock is not a working integration, and prototype code is not production code. Fold the validated decision (for LOGIC, the pure module) into the real implementation and rewrite it to production standards. The delivery branch keeps only the decision.

**Exit criterion:** one direction is selected, its observed evidence is recorded in `prototype.md`, and every variant path or branch is inventoried. Evidence comes before cleanup: variant code stays on its throwaway branch or inventoried path until the decision is recorded. Remove it only afterwards, only for paths this task created, and only within existing authorization, never with a blanket recursive delete.

**Output shape:**
```
Question: <what observation decides it> | branch: LOGIC|UI
Variant A / B: <one command to run> -> <observed state or screen>
Recommendation: <variant> because <evidence>; discarded: <variant, reason>; code kept at: <branch or path>
```
