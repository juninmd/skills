# Spec-First Design Templates and Checklists

Reusable components for executable implementation plans.

## 1. Handoff Plan Template
Assume the reader has no context. Provide exact paths and steps.
- **File Map:** Create/Modify/Test/Delete responsibilities.
- **Tasks:** Bite-sized checkboxes.
- **Failing-Test-First:** Step-by-step verification.
- **Commands:** Exact strings for pass/fail results.

## 2. Design Validation Checklist
- [ ] Existing project patterns were inspected.
- [ ] The chosen design is a single path.
- [ ] Scope is small enough for one implementation pass.
- [ ] Assumptions are explicit and low risk.
- [ ] No placeholders remain.

## 3. Plan Validation Checklist
- [ ] Files and modules to change are named.
- [ ] Every task has exact steps and expected output.
- [ ] Tests or smoke checks are listed with commands.
- [ ] Internally consistent (types, routes, paths).
- [ ] Rollback or cleanup needs are noted.
