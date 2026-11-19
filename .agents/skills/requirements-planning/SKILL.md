---
name: requirements-planning
description: |
  Turn an ambiguous ask into something buildable. Use for acceptance criteria, PRDs and specs, implementation briefs with finish lines, vertical-slice backlog issues, and triage of incoming issues. Trigger on 'what should this do', 'interview me first', 'write the PRD', 'break this into issues', 'triage these issues'.
---

# Requirements Planning

**Not this skill:** a request that is already specific enough to act on (use its
domain skill); repo onboarding, AGENTS.md/README authoring, or the research ->
prototype -> plan -> implement loop (`starting-dev`); module boundaries and
contracts (`software-architecture`); editing the prose of an existing README
(`readme-standard`) or doc (`documentation`).

## Loading Constraints

Clarification needs a live requester. In CI, a scheduled run, `/loop`, or any
headless session, do not interview. Write down the assumption you would have
tested, flag it as a blocker, and keep going on everything that does not depend
on the answer.

## Preflight
Find out what already exists before writing anything. From the repository root:

```bash
ls docs/ specs/ 2>/dev/null                       # existing PRDs/specs
gh issue list --limit 20 2>/dev/null              # open issues, in-flight triage
ls .out-of-scope/ 2>/dev/null                     # prior rejections
rg -n '<the behavior in question>' src/ | head    # does the code already answer it?
```

Each question the repository could have answered burns the requester's patience.

## Workflow
1. Restate the request: who asks, what triggers it, and which outcome counts as
   success. Give the whole task in one message with a finish line: "Done means:
   `<observable conditions>`. Stop and ask only if `<specific condition>`." For
   ambiguity, follow [requirements clarification](references/requirements-clarification.md):
   ask the decision frontier in rounds, every question carrying a recommended
   answer, and look facts up yourself. If the design direction is still open,
   send it to `starting-dev`'s [prototype stage](../starting-dev/references/phase-prototype.md).
2. Once answers are confirmed, write the spec or PRD with
   [spec workflow](references/spec-workflow.md) and
   [spec templates](references/spec-templates.md). Acceptance criteria describe
   observable behavior, never adjectives, and live where the work lives.
3. Cut the feature into vertical slices that can each be verified alone
   ([incremental delivery](references/incremental-delivery.md)), then publish
   them as backlog issues ([to-issues process](references/to-issues-process.md)).
4. To hand a slice to an AFK agent, write an [agent brief](references/agent-brief.md):
   a behavioral contract (no file paths or line numbers) with its own finish
   line and out-of-scope list.
5. For incoming issues, classify with [triage logic](references/triage-logic.md),
   meet the bar in [triage standards](references/triage-standards.md), and run
   the lifecycle in [triage workflow](references/triage-workflow.md). Begin with
   the redundancy check: search open and closed issues for a duplicate, and the
   code for an existing implementation. A request that is already built closes as
   done with a pointer to it, never as out of scope. Read
   [out-of-scope records](references/out-of-scope.md) before reopening a rejected
   request.
6. For a run that must outlast many turns or a context compaction, keep the task
   list in a temp file named with the session id, outside the repository (no
   `TASKS.md` in the repo), and update it as you go.
7. Pass accepted, sliced work to `starting-dev` for the dev loop, or to the
   owning domain skill to build directly.

For multi-step plans, anchor each choice in repository evidence (manifests, CI,
callers, tests, recent changes), take checks from real scripts at the lowest
test level that proves the contract, and add migration, security, rollout, or
rollback only where relevant. Ask only for missing decisions or authority;
authorized work continues without another approval checkpoint.

When a full spec template is overkill, use this compact plan:

```markdown
## Plan: <title>
### Goal
<outcome and observable acceptance criteria>
### Scope
| IN | OUT |
|---|---|
### Evidence and assumptions
<repository findings, constraints, unresolved decisions>
### Decisions and trade-offs
| Decision | Choice | Reason |
|---|---|---|
### Milestones
1. <action> — owner: <skill/subsystem>; depends on: <...>; verify: `<command>`
   - Consumes: <names and signatures this slice takes from earlier slices>
   - Produces: <names, parameters, and return types later slices rely on>
### Test strategy
- <unit/integration/E2E or smoke check, and the failure path>
### Risks, rollout, and rollback
| Risk | Mitigation | Rollback |
|---|---|---|
### Residual risks and handoff
<remaining uncertainty, owning skill, any missing decision or authority>
```

Review the plan yourself before passing it on, and fix gaps in place:

| Check | Fails when |
|---|---|
| Coverage | an acceptance criterion has no milestone that builds and verifies it |
| Name and type consistency | a later slice uses a name or signature no earlier slice produces (`clearLayers()` in one step, `clearAllLayers()` in another) |
| Decides something | a step says "handle edge cases", "add validation", or "TBD" |
| Proportion | the plan is longer than the code it describes, or the riskiest slice gets one line while a minor one gets pages |

## Reference routing
The [reference map](references/TOPIC_MAP.md) lists the clarification, spec,
slicing, brief, and triage procedures. This skill runs them itself.

## Decision table

| Situation | Do |
|---|---|
| Outcome is named but edges and failure modes are not | [requirements clarification](references/requirements-clarification.md) |
| Requester wants a PRD or implementation plan document | [spec workflow](references/spec-workflow.md) + [spec templates](references/spec-templates.md) |
| Two or more plausible designs, none chosen | `starting-dev` [prototype stage](../starting-dev/references/phase-prototype.md) |
| Feature must become tracked work | [incremental delivery](references/incremental-delivery.md) -> [to-issues process](references/to-issues-process.md) |
| Work goes to an unattended agent | [agent brief](references/agent-brief.md) |
| An accepted slice needs a durable implementation handoff | [agent brief](references/agent-brief.md) |
| New issue needs classification | [triage logic](references/triage-logic.md) + [triage workflow](references/triage-workflow.md) |
| Requested behavior already exists in the code | close as done with a pointer; no `.out-of-scope/` record |
| Request resembles a past rejection | [out-of-scope records](references/out-of-scope.md) |

## Gotchas
- A fuzzy success check ("make it feel faster", "users should love it") is not a
  detail to assume. Turn it into an observable metric or proxy before writing
  criteria; the untestable-check table in
  [requirements clarification](references/requirements-clarification.md) shows how.
- Leaving out the pre-existing-state edge ("rows created before this rule
  existed") ships as an incident, not a review comment.
- A brief that cites a file path or line number goes stale. Describe interfaces
  and behavior.
- When two stakeholders conflict, surface the decision; never average them.

## Stop
- A material product, authority, or compatibility decision cannot be inferred:
  ask for it and continue the independent work.
- No requester is reachable and the question has no safe default: record the
  assumption, flag it as a blocker, and move on with what does not depend on it.
- The decision frontier is empty and the requester confirmed the criteria:
  write them down and stop asking.

## Rules
- Never ask what the code, the ticket, or current behavior already answers.
- A plan or issue with no observable acceptance criterion is unfinished.
- Name what is out of scope; nobody should infer scope from silence.
- Publishing, merging, deploying, or messaging people unasked is out of scope here.

## Checklist
- [ ] Goal, non-goals, acceptance criteria, and finish-line condition recorded.
- [ ] Facts found by reading; decisions asked in frontier rounds with recommended answers, not guessed.
- [ ] Plan slices carry Consumes/Produces, and the self-review table passed.
- [ ] Feature sliced vertically; each slice verifiable on its own.
- [ ] Agent briefs are behavioral, durable, and carry acceptance criteria and out-of-scope.
- [ ] Triage ran the redundancy check; already-built requests closed as done; rejections checked against `.out-of-scope/`.
