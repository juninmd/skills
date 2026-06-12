---
name: executing-plans
description: "Executing Plans for Executing multi-step, Following task-by-task, Continuing work via Incremental validation loops and task-based checklists."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Executing Plans

Expert methodology for systematically executing written implementation plans, temporary specs, or issue briefs with a focus on order, validation, and scope control.

**USE FOR:**
- Executing multi-step implementation tasks from a design document.
- Following task-by-task checklists to ensure completion and validation.
- Continuing work from a previously defined temporary spec (`temp/specs/`).
- Converting vague issue briefs into concrete, validated code changes.

**DO NOT USE FOR:**
- Brainstorming or initial requirement gathering.
- Opportunistic refactoring outside the scope of the current plan.

**INVOKES:**
- Incremental validation loops and task-based checklists.

## Methodology and Guidelines
Implementation details for the execution workflow, test-first patterns, and stop conditions are documented in:
- [Plan Execution Guidelines](references/execution-guidelines.md)

## Core Principles
1. **Order:** Execute tasks sequentially to maintain a clean execution state.
2. **Validation:** Every task is incomplete until its focused check passes.
3. **Scoping:** Implementation must strictly adhere to the plan to prevent drift.

## Checklist
- [ ] Review the entire plan against current code state before starting.
- [ ] Maintain a working checklist with exactly one active task.
- [ ] Run focused validations after every individual task.
- [ ] Execute broad project-level checks before finalizing the implementation.
- [ ] Delete temporary spec files upon completion.
