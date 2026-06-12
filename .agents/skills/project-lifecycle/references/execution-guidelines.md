# Plan Execution Guidelines

Detailed rules and workflows for executing implementation plans and specs.

## 1. Rules of Engagement
- **Load First:** Always review the plan/spec before touching files.
- **Task Order:** Follow the plan task-by-task; do not skip ahead.
- **Validation:** Never skip specified validations. If unavailable, use the closest check.
- **Scope Control:** Keep implementation strictly scoped to the plan; no unrelated refactors.
- **Safety:** Stop and ask if a step is destructive or requirements are unclear.
- **Cleanup:** Delete temporary specs in `temp/specs/` after successful implementation.

## 2. Execution Workflow
1. **Review:** Compare the plan against current code reality (APIs, scripts, layout).
2. **Checklist:** Create a working checklist from plan headings.
3. **Iterate:** For each task: Read -> Edit -> Validate -> Complete.
4. **Test-First:** If planned, add failing tests first, then implement the fix.
5. **Finalize:** Run broad validations (lint, test, build) and summarize changes.

## 3. Stop Conditions
Pause if:
- Required dependencies or credentials are missing.
- Destructive commands lack explicit approval.
- Validations fail repeatedly.
- Plan references non-existent or unmappable resources.
