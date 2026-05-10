---
name: executing-plans
description: "Execute a written implementation plan or temporary spec task-by-task with review checkpoints, validations, and cleanup. Use when a plan already exists in temp/specs, docs, an issue brief, or the conversation and the user asks to implement, execute the plan, continue from a spec, or finish planned work. Triggers: execute plan, implement plan, run plan, continue from spec, follow checklist, task-by-task implementation."
argument-hint: "[plan/spec path or task context]"
---

# Executing Plans

Use this skill when there is already a written plan, temporary spec, issue brief, or checklist to execute. Review the plan before editing, execute tasks in order, run the specified validations, and stop when the plan is unsafe or underspecified.

## Rules

- Load and review the plan before touching files.
- Follow the plan task-by-task unless the plan conflicts with current code reality.
- Treat the plan as an execution artifact, not a suggestion list. Convert vague steps into concrete checks only when the intended behavior is clear from local context.
- Do not skip validations. If a validation is unavailable, record why and run the closest useful check.
- Stop and ask when the plan has critical gaps, destructive steps, unclear requirements, or repeated verification failures.
- Do not commit, push, rebase, reset, or delete branches unless the user explicitly asks.
- If the plan came from `temp/specs/YYYY-MM-DD-<topic>-design.md`, delete that temp spec after implementation completes and all checks pass.
- Keep implementation scoped to the plan. Do not add unrelated refactors or opportunistic features.

## Workflow

### 1. Load And Review The Plan

- Read the plan/spec path if provided. If the plan is in the conversation, restate the actionable tasks before starting.
- Check whether the plan names exact files, tests, commands, and cleanup steps.
- Compare the plan against the current repository state: file names, exported APIs, scripts, package manager, and existing patterns.
- If the plan is stale or unsafe, report the specific issue and wait for clarification instead of guessing.

### 2. Create A Working Checklist

Use the task list from the plan as the execution checklist. Keep exactly one task in progress at a time.

If the plan has no checkboxes, derive a minimal checklist from its task headings and preserve the original order.

For each task:

- Mark it in progress.
- Read the files named by that task before editing.
- Apply only the changes required for that task.
- Run the task's focused validation.
- Mark it complete only after validation passes or the skipped check is explicitly justified.

### 3. Execute Test-First When Planned

When the plan includes failing-test-first steps:

1. Add or update the test first.
2. Run the focused command and verify it fails for the expected reason.
3. Implement the smallest change that satisfies the test.
4. Re-run the focused command and verify it passes.
5. Run the wider check listed by the plan.

If the initial test unexpectedly passes, stop and reassess whether the behavior already exists or the test is weak.

### 4. Handle Drift

Plans can age quickly. If code reality differs from the plan:

- Accept harmless path or naming drift when the intent is obvious, and note the adjustment.
- Stop for clarification when the adjustment changes behavior, scope, data model, public API, security posture, or migration risk.
- Update only temporary plan/spec checkboxes if useful for tracking; do not rewrite permanent docs unless asked.

### 5. Finish The Implementation

Before final response:

- Run the broadest relevant validation available in the project, such as lint, typecheck, tests, build, or docs build.
- Delete any completed temporary spec under `temp/specs/`.
- Check `git status -s` and separate your changed files from unrelated preexisting changes.
- Summarize changed files, validations, skipped checks, and remaining risks.

## Stop Conditions

Stop and ask for help when:

- Required dependencies, credentials, fixtures, services, or files are missing.
- A destructive command is required and the user has not explicitly approved it.
- A validation fails repeatedly after a focused fix.
- The plan references functions, routes, files, or tasks that do not exist and cannot be mapped safely.
- The requested implementation conflicts with repository rules or security requirements.

## Checklist

- [ ] Plan or spec was loaded and reviewed before edits.
- [ ] Each task was executed in order with one active task at a time.
- [ ] Focused validations ran after each task.
- [ ] Final lint/test/build or closest available check ran.
- [ ] Completed temporary specs in `temp/specs/` were deleted.

## References

- [Spec-First Design Skill](../spec-first-design/SKILL.md)
- [Finishing a Development Branch Skill](../finishing-a-development-branch/SKILL.md)
- [Git Workflow Rule](../../rules/git-workflow.instructions.md)
- [Testing Rule](../../rules/testing.instructions.md)
- [Context Efficiency Rule](../../rules/context-efficiency.instructions.md)
