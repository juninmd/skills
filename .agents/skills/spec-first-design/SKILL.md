---
name: spec-first-design
description: "Validated temporary design specs and implementation plans before code changes. Use when a user asks to create a feature, change behavior, build a component, refactor with behavior impact, or implement a non-trivial task that needs requirements clarified and planned before code. Triggers: brainstorm, design first, spec first, validate design, implementation plan, plan before implementation, clarify requirements."
argument-hint: "[topic or requested change]"
---

# Spec-First Design

Use this skill to turn a request into one validated design-and-plan spec before implementation. Do not generate proposal sets or alternative approaches. Pick the smallest defensible design that fits the evidence, document the implementation plan in bite-sized steps, validate it with checklists, and keep the spec temporary.

## Rules

- Do not implement until the design and implementation plan are captured in a spec and validated.
- Do not present 2-3 alternatives. Select one approach and explain only the chosen design.
- Optimize for agent execution: every decision must reduce ambiguity for the next code-editing step.
- Ask only the clarifying questions required to remove implementation risk. Ask one question at a time.
- Prefer concrete decisions over open-ended placeholders.
- Keep the spec in `temp/specs/`; never commit it as permanent project documentation.
- Delete the spec when implementation begins if the task is completed in the same turn. If implementation is deferred, leave the temp spec for the next step and call out that it must be removed after implementation.
- Do not create a separate permanent plan file. The implementation plan lives inside the temporary spec.

## Workflow

### 1. Inspect Context

- Read the nearest project instructions, relevant files, current patterns, tests, and recent docs before deciding.
- Identify constraints that materially affect the design: public API, data model, UX contract, security boundary, performance budget, compatibility, and test surface.
- If the request is too large for one coherent implementation, narrow the topic to the first independently shippable slice.

### 2. Clarify Only Blockers

- Ask one concise question only when the answer cannot be inferred safely from the repository or user request.
- Use multiple choice when it reduces back-and-forth.
- If a reasonable assumption is low risk, state it in the spec instead of asking.

### 3. Write The Temporary Spec And Plan

Write the validated design and implementation plan to:

```text
temp/specs/YYYY-MM-DD-<topic>-design.md
```

Use the local date. Normalize `<topic>` to lowercase kebab-case, remove unsafe path characters, and keep it short enough to scan.

The spec must include:

- `# <Topic> Design And Implementation Plan`
- `Status: Temporary implementation spec and plan`
- `Created: YYYY-MM-DD`
- `Delete after: implementation completes`
- `Request`
- `Context`
- `Chosen Design`
- `Implementation Scope`
- `Out Of Scope`
- `File Structure`
- `Data/Control Flow` when relevant
- `Error Handling` when relevant
- `Security And Privacy` when relevant
- `Implementation Plan`
- `Verification Plan`
- `Checklists`

Keep sections short and executable. Prefer exact file paths, names, commands, and acceptance criteria over prose.

### 4. Plan The Work Like An Executable Handoff

Assume the next engineer is capable but has no context. Give them exact paths, exact steps, and exact checks. Keep tasks small enough to execute independently.

The plan section must include:

- File map before tasks: files to create, modify, test, or delete, and each file's responsibility.
- Bite-sized tasks with checkbox syntax.
- Failing-test-first steps when testable behavior changes.
- Exact commands to run and expected pass/fail result.
- Minimal implementation steps with concrete code shape, function names, props, schemas, or signatures when relevant.
- Cleanup step that deletes `temp/specs/YYYY-MM-DD-<topic>-design.md`.

Task template:

````markdown
## Implementation Plan

### Task 1: <specific outcome>

**Files:**
- Modify: `path/to/file.ext`
- Test: `path/to/file.test.ext`

- [ ] Step 1: Write the failing test for <behavior>
  Run: `<exact command>`
  Expected: fails because <specific reason>
- [ ] Step 2: Implement <minimal change>
  Change: <specific function/component/module and behavior>
- [ ] Step 3: Run the focused test
  Run: `<exact command>`
  Expected: passes
- [ ] Step 4: Run the relevant lint/typecheck/build command
  Run: `<exact command>`
  Expected: passes
````

For documentation-only or config-only work, replace failing-test-first with the smallest objective validation command, such as schema validation, docs build, formatter check, or smoke command.

### 5. Apply Checklists In The Spec

Always include and complete checklists inside the spec. Use checked boxes only when the item was actually verified.

Required checklist:

```markdown
## Checklists

### Design Validation
- [ ] Existing project patterns were inspected.
- [ ] The chosen design is a single path, not a menu of alternatives.
- [ ] Scope is small enough for one implementation pass.
- [ ] Assumptions are explicit and low risk.
- [ ] No placeholders such as TBD, TODO, or "decide later" remain.

### Plan Validation
- [ ] Files/modules to change are named.
- [ ] Every task has exact steps and expected validation output.
- [ ] Tests or smoke checks are listed with commands.
- [ ] No step says "add appropriate", "handle edge cases", "similar to", or "implement later".
- [ ] Types, function names, routes, props, and file paths are internally consistent.
- [ ] Rollback or cleanup needs are noted.
- [ ] Temporary spec deletion is part of the implementation cleanup.
```

Add domain-specific checklist items when the task needs them, such as accessibility, performance, migrations, API compatibility, or security.

### 6. Self-Review And Fix Inline

Before presenting the result, re-read the spec and plan, then fix:

- Placeholders: `TBD`, `TODO`, vague verbs, empty sections.
- Contradictions: scope vs design, tests vs files, assumptions vs requirements.
- Ambiguity: requirements that could be implemented two different ways.
- Overreach: work that is not needed for the request.
- Missing cleanup: absent instruction to remove the temp spec after implementation.
- Coverage gaps: each requirement in the spec must point to at least one task.
- Plan gaps: each task must be actionable without reading this conversation.

### 7. Transition To Implementation

- If continuing to implementation immediately, use the spec as the source of truth, then delete the temp spec before final response.
- If implementation waits for user direction, leave the spec in `temp/specs/` and say it is temporary and must be deleted after implementation.
- Do not create permanent docs from this spec unless the user explicitly asks.
- Do not offer subagent-vs-inline execution choices unless the user explicitly asked for delegation. Default to implementing the plan yourself in the current session when asked to proceed.

## Output

After writing the spec, summarize only:

- Spec path.
- Chosen design and implementation plan in one short paragraph.
- Any assumptions that still matter.
- Whether implementation can start now.

## Checklist

- [ ] Inspect project context before writing the spec.
- [ ] Write one chosen design and implementation plan to `temp/specs/YYYY-MM-DD-<topic>-design.md`.
- [ ] Include completed design, plan, and implementation readiness checklists in the spec.
- [ ] Ensure the spec is deleted when implementation completes.

## References

- [Plan Specialist Agent](../../agents/plan-specialist.agent.md)
- [Applying Design Principles Skill](../applying-design-principles/SKILL.md)
- [Executing Plans Skill](../executing-plans/SKILL.md)
- [Testing Rule](../../rules/testing.instructions.md)
- [Context Efficiency Rule](../../rules/context-efficiency.instructions.md)
