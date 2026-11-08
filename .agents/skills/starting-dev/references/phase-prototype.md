# Prototype procedure
Owned and executed by `starting-dev`; this file is not a standalone skill.

A prototype is throwaway code that answers one question. The question decides its shape, so pick the branch before writing anything.

| Question | Branch | Artifact |
|---|---|---|
| Does this logic, state model, or data shape hold up? | **LOGIC** | One self-contained file (an HTML page or a single script) driving a pure module — reducer, state machine, or plain functions — with buttons or commands per action and scripted scenarios: happy path, awkward edge, an action that must be illegal |
| What should this look like? | **UI** | Structurally different variants on one existing route, switched by `?variant=` and a dev-only switcher; a new throwaway route only when no host page exists. Route the build to `frontend-engineering` (3D scenes to `threejs`) |
| Where should this boundary or contract sit? | neither | `software-architecture` |

Ambiguous and the user is unreachable: take the branch matching the surrounding code (backend module → LOGIC, page or component → UI) and state that assumption at the top of the prototype.

1. Identify the unresolved decision, the observation that would decide it, and the branch. Skip this stage for a dictated approach or routine bug fix and record why.
2. Build the smallest variants that test meaningfully different directions; never manufacture alternatives to meet a quota. UI variants differ in layout and hierarchy, not colour or copy.
3. Make each variant trivial to run: one command from the project's task runner, or one file opened directly. No setup steps, no persistence unless persistence is the question (then a scratch store named so it is obviously disposable).
4. Surface the state. After every action (LOGIC) or variant switch (UI), print or render the full relevant state in domain language, so the user sees what changed without reading code.
5. Keep variants isolated on a throwaway branch (for example `prototype/<slug>`) or a user-accepted [worktree](worktree-setup.md); commits there follow the same authorization as any commit, and without it the variants stay untracked in owned paths inventoried in `scratch`. Never add prototype dependencies, mocks, or the switcher to production paths.
6. Run each variant and capture comparable behavior, constraints, and meaningful performance evidence. Record `prototype.md` in the workspace: question, branch, variants with run commands, observations, tradeoffs, recommendation, discarded options, and where the variant code lives.
7. Resolve user-owned product choices explicitly; routine technical choices already authorized may proceed with a recorded rationale. Set `awaiting` only for an actual unanswered decision; after resolution advance to plan.

A visual mock is not a working integration, and prototype code is not production code: fold the validated decision (for LOGIC, the pure module) into the real implementation and rewrite it to production standards. The delivery branch keeps only the decision.

**Exit criterion:** one direction is selected with its observed evidence recorded in `prototype.md`, and every variant path or branch is inventoried. Evidence before cleanup: variant code stays on its throwaway branch or inventoried path until the decision is recorded, and it is removed only afterwards, only for paths this task created, and only within existing authorization — never by a blanket recursive delete.

**Output shape:**
```
Question: <what observation decides it> | branch: LOGIC|UI
Variant A / B: <one command to run> -> <observed state or screen>
Recommendation: <variant> because <evidence>; discarded: <variant, reason>; code kept at: <branch or path>
```

Adapted in part from mattpocock/skills (MIT, © 2026 Matt Pocock).
