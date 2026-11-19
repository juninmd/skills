# Grill-Me Interview Procedure
Owned and executed by `starting-dev`; this file is not a standalone skill.

The interview rule lives in `requirements-planning`'s [requirements clarification](../../requirements-planning/references/requirements-clarification.md). Follow its frontier rounds: look facts up (search, read-only subagent), never ask them; ask only decisions whose prerequisites are settled; cap each round at seven questions, each with a recommended answer that a "yes" accepts; stop once the frontier is empty and the user confirms.

In the dev loop:

1. Ask only about decisions that block the current stage. A request still needing acceptance criteria, a PRD, or issue triage is not a grilling session; hand it to `requirements-planning`.
2. Keep reading the repository while a round is pending; only work depending on an unanswered decision waits.
3. Write confirmed decisions and their reasons into the workspace `plan.md` (or `research.md` before planning), then continue with the [plan procedure](phase-plan.md).
4. Headless or unattended: ask nothing. Record each recommended answer as an assumption with its reversal cost; proceed with independent steps.
