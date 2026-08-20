---
name: phase-research
description: |
  Research stage of the delivery loop: runs unattended and queues its questions for the plan stage. Use for opening the tracking issue and mapping the codebase and prior art before anything is built.
---

# Stage 1 — Research

## Contract
- Entry: a one-line request. Create or link a tracking issue; `<slug>` = `<issue>-<kebab-title>`.
- State: `.workflow/<slug>/loop-state.json` — `{issue, stage, artifacts, awaiting}`. Set `stage: "research"`.
- Output: `research.md`. Unattended stage; advance to `phase-prototype` without waiting for the user.

## Workflow
1. Restate the request on the issue as goal, non-goals, and measurable acceptance criteria.
2. Research the codebase: entry points, call sites, data model, tests, and local conventions. Cite `path:line`.
3. Research prior art: how comparable products and libraries solve this. Capture patterns, tradeoffs, and links.
4. Record constraints: runtime, versions, auth boundaries, migrations, backward compatibility.
5. List unknowns and rank by blast radius. Unknowns become prototype variants or questionnaire items — never guesses.
6. Write `research.md`: Goal · Non-goals · Acceptance criteria · Codebase map · Prior art · Constraints · Risks · Open questions.
7. Set `stage: "prototype"`, append the artifact, and notify that the loop advanced.

## Rules
- Read-only stage: no production edits, no refactors.
- Do not interrupt the user with questions; queue them for the `phase-plan` questionnaire.
- Every claim carries a source: file path, command output, or URL.
- Verify library and API behavior against current docs, not memory.

## Checklist
- [ ] Issue created or linked and `loop-state.json` initialized.
- [ ] Goal, non-goals, and acceptance criteria written.
- [ ] Codebase map cited as `path:line`.
- [ ] Prior art captured with links and tradeoffs.
- [ ] Open questions queued for the plan questionnaire.
- [ ] Stage advanced to `prototype` unattended.
