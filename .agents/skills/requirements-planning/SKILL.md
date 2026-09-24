---
name: requirements-planning
description: |
  Turn an ambiguous ask into something buildable. Use for acceptance criteria, PRDs and specs, agent briefs with finish lines, vertical-slice backlog issues, and triage of incoming issues. Trigger on 'what should this do', 'interview me first', 'write the PRD', 'break this into issues', 'triage these issues'.
---

# Requirements Planning

**Not this skill:** a request already specific enough to act on (its domain
skill); repository onboarding, AGENTS.md/README authoring, or the research
-> prototype -> plan -> implement dev loop (`starting-dev`); resolving module
boundaries and contracts (`software-architecture`); polishing prose in an
existing README or doc (`documentation`).

## Loading Constraints

Clarification needs a live requester. In CI, a scheduled run, `/loop`, or any
headless session, do not interview: write the assumption you would have
tested, mark it as a blocker, and carry on with everything that does not
depend on the answer.

## Preflight
Establish what already exists before writing anything new. Run from the
repository root:

```bash
ls docs/ specs/ temp/specs/ 2>/dev/null           # existing PRDs/specs
gh issue list --limit 20 2>/dev/null              # open issues, in-flight triage
ls .out-of-scope/ 2>/dev/null                     # prior rejections
rg -n '<the behavior in question>' src/ | head    # does the code already answer it?
```

Every question you could have answered by reading costs the requester's
patience for nothing.

## Workflow
1. Restate the request, naming the requester, the trigger, and the outcome
   that counts as success. Give the whole task in one message with an
   explicit finish line: "Done means: `<observable conditions>`. Stop and ask
   only if `<specific condition>`." Use
   [requirements clarification](references/requirements-clarification.md) for
   ambiguity — prefer structured multiple-choice questions with a marked
   default over open-ended ones.
2. For an open design question with no clear direction, generate a few
   throwaway HTML mockups or option sketches before committing to one — mark
   each explicitly as an experiment: "this is an experiment, build nothing
   painful to throw away."
3. Write the spec or PRD from confirmed answers using
   [spec workflow](references/spec-workflow.md) and
   [spec templates](references/spec-templates.md). Acceptance criteria are
   observable behavior, not adjectives; record them where the work lives.
4. Slice the feature into independently verifiable vertical slices with
   [incremental delivery](references/incremental-delivery.md), then publish
   them as backlog issues with [to-issues process](references/to-issues-process.md).
5. Handing a slice to an AFK agent: write an
   [agent brief](references/AGENT-BRIEF.md) — behavioral contract, not file
   paths or line numbers — with its own finish line and out-of-scope list.
6. Triaging incoming issues: classify with
   [triage logic](references/triage-logic.md), hold response quality to
   [triage standards](references/triage-standards.md), and execute the
   lifecycle with [triage workflow](references/triage-workflow.md). Check
   [out-of-scope records](references/OUT-OF-SCOPE.md) before re-litigating a
   rejected request.
7. For a run expected to survive many turns or a context compaction, keep the
   task list in a file (e.g. `TASKS.md`) in the repository and update it as
   work proceeds rather than only in conversation state.
8. Hand accepted, sliced work to `starting-dev` to run the dev loop, or to the
   owning domain skill to implement directly.

## Reference routing
[Reference map](references/TOPIC_MAP.md) selects the clarification, spec,
slicing, brief, and triage procedures. References are local procedures
executed by this skill.

## Decision table

| Situation | Do |
|---|---|
| Request names outcome but not edges/failure modes | [requirements clarification](references/requirements-clarification.md) |
| Requester wants a PRD or implementation plan document | [spec workflow](references/spec-workflow.md) + [spec templates](references/spec-templates.md) |
| Direction unresolved between two or more plausible designs | throwaway mockups/prototypes, each marked an experiment |
| Feature needs to become tracked work | [incremental delivery](references/incremental-delivery.md) -> [to-issues process](references/to-issues-process.md) |
| Work is handed to an unattended agent | [agent brief](references/AGENT-BRIEF.md) |
| A new issue arrives and needs classification | [triage logic](references/triage-logic.md) + [triage workflow](references/triage-workflow.md) |
| A feature request looks like a past rejection | [out-of-scope records](references/OUT-OF-SCOPE.md) |

## Gotchas
- A vague success check ("make it feel faster", "users should love it") is
  not a detail to assume — renegotiate it into an observable metric or proxy
  before writing acceptance criteria; see the untestable-check table in
  [requirements clarification](references/requirements-clarification.md).
- Skipping the pre-existing-state edge ("rows created before this rule
  existed") ships as an incident, not a code review comment.
- An agent brief that names a file path or line number goes stale before the
  agent gets to it; describe interfaces and behavior instead.
- Two stakeholders conflicting is a decision to surface, never one to average.

## Stop
- A material product, authority, or compatibility decision cannot be
  inferred; request that decision while continuing independent work.
- No requester is available and the question has no safe default; write the
  assumption, mark it a blocker, and keep moving on what does not depend on it.
- Two rounds of clarification produced almost no net-new constraints —
  saturated, write the criteria and stop asking.

## Rules
- Never ask what the code, the ticket, or existing behavior can already tell you.
- A plan or issue without an observable acceptance criterion is incomplete.
- State what is out of scope explicitly; do not let an agent or implementer
  infer scope from silence.
- Unrequested publishing, merging, deployment, or external messages are
  outside requirements planning.

## Checklist
- [ ] Goal, non-goals, acceptance criteria, and the finish-line condition recorded.
- [ ] Material ambiguity resolved by asking (with defaults) or by reading, not guessed.
- [ ] Any open design question tried as a throwaway experiment before committing.
- [ ] Feature sliced vertically; each slice independently verifiable.
- [ ] Agent briefs are behavioral, durable, and carry acceptance criteria and out-of-scope.
- [ ] Triage decisions checked against `.out-of-scope/` before repeating a rejection.
