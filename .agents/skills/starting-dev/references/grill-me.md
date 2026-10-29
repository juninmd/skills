# Grill-Me Interview Procedure
Owned and executed by `starting-dev`; this file is not a standalone skill.

The interview rule lives in one place: `requirements-planning`'s [requirements clarification](../../requirements-planning/references/requirements-clarification.md). Follow its frontier rounds — facts looked up by search or a read-only subagent, never asked; only decisions whose prerequisites are settled; at most seven per round, each with a recommended answer that "yes" accepts; stop when the frontier is empty and the user confirms.

What differs inside the dev loop:

1. Interview only for the few decisions blocking the current stage. A request that still needs acceptance criteria, a PRD, or issue triage is not a grilling session; hand it to `requirements-planning`.
2. Keep inspecting the repository while a round is out; only work downstream of an unanswered decision waits.
3. Write the confirmed decisions and their reasons into the workspace `plan.md` (or `research.md` before planning), then continue with the [plan procedure](phase-plan.md).
4. Headless or unattended: ask nothing; record each recommended answer as an assumption with its reversal cost and proceed with non-dependent steps.

Adapted in part from mattpocock/skills (MIT, © 2026 Matt Pocock).
