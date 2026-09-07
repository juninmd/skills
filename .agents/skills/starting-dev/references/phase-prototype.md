# Prototype procedure
Owned and executed by `starting-dev`; this file is not a standalone skill.

1. Identify the unresolved decision and define what observation would decide it. Skip this stage for a dictated approach or routine bug fix and record why.
2. Build the smallest disposable variants that test meaningfully different directions. Three variants are useful when requested; never manufacture alternatives to meet a quota.
3. Keep prototypes in an isolated task directory; inventory created paths in `scratch`. Do not introduce prototype dependencies or mocks into production paths.
4. Run each variant and capture comparable behavior, constraints, and meaningful performance evidence. Route interface work to `frontend-engineering`, 3D scenes to `threejs`, and system boundary decisions to `software-architecture`.
5. Record `prototype.md`: hypothesis, variants, reproduction commands, observations, tradeoffs, recommendation, and discarded options.
6. Resolve user-owned product choices explicitly; routine technical choices already authorized may proceed with a recorded rationale. Set `awaiting` only for an actual unanswered decision; after resolution advance to plan.

A visual mock is not a working integration. Preserve useful experimental findings but do not ship scratch assets accidentally. Cleanup follows ownership and existing authorization, not a blanket recursive delete.
