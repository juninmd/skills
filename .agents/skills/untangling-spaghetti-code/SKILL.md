---
name: untangling-spaghetti-code
description: |
  **REFACTORING SKILL** - Detect and systematically untangle spaghetti code behind characterization tests.
  USE FOR: high cyclomatic/cognitive complexity, god functions/classes, deep nesting, tangled control flow, dependency cycles, hidden coupling, copy-paste duplication.
  DO NOT USE FOR: naming-only cleanup (use applying-clean-code), greenfield principle application (use applying-design-principles), system boundary/layering design (use improving-codebase-architecture).
  INVOKES: applying-clean-code, applying-design-principles, improving-codebase-architecture, verifying-changes.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Untangling Spaghetti Code

Spaghetti is fixed by measurement and small reversible steps, never by a rewrite. Lock current behavior with characterization tests first, then untangle one knot at a time and re-prove behavior after each step.

**USE FOR:**
- Functions over ~50 LOC or cyclomatic complexity > 10.
- God classes (> ~400 LOC, many methods, low cohesion).
- Deep nesting (4+ levels) and tangled control flow.
- Dependency cycles (`A → B → A`) and hidden/implicit coupling.
- Duplicated logic that drifts out of sync.

**DO NOT USE FOR:**
- Renaming/local readability only (use `applying-clean-code`).
- Applying principles to new code (use `applying-design-principles`).
- Module boundaries and layering at system scale (use `improving-codebase-architecture`).

**INVOKES:**
- `applying-clean-code` for guard clauses and naming after extraction.
- `applying-design-principles` to validate a chosen pattern fits.
- `improving-codebase-architecture` when knots cross module boundaries.
- `verifying-changes` for fail-to-pass proof on every step.

## Detect: Complexity Thresholds

| Signal | Watch | Refactor | Critical |
|---|---|---|---|
| Cyclomatic complexity | 6–10 | 11–20 | > 20 |
| Cognitive complexity | 10–15 | 16–25 | > 25 |
| Function length | 30–50 | 50–100 | > 100 |
| Nesting depth | 3 | 4 | 5+ |

Measure with the stack's linter (ESLint `complexity`, Ruff/pylint, SonarQube) and a cycle check (`madge --circular`, depcheck). Thresholds live in lint config so they are enforced, not judged.

## Workflow: Detect → Characterize → Untangle → Verify

1. **Detect** — rank hot spots by complexity × change-frequency; pick one.
2. **Characterize** — write tests that capture *actual* current behavior (golden/snapshot if output is complex). They must pass before you touch anything.
3. **Untangle** — one move at a time: guard clauses to flatten nesting, extract method per responsibility, extract class to split a god object, break cycles by depending on an interface.
4. **Verify** — re-run characterization tests after every move; `verifying-changes` for fail-to-pass proof. If red, revert the single step.

## Checklist

- [ ] Complexity baseline measured and documented (CC / cognitive / LOC / cycles).
- [ ] Hot spots ranked by complexity × churn; smallest valuable knot chosen first.
- [ ] Characterization tests capture real behavior and pass before refactoring.
- [ ] No behavior change intended; refactors are structure-only.
- [ ] Each step is one move, independently reverted if tests go red.
- [ ] Nesting flattened with guard clauses; mixed concerns extracted.
- [ ] Dependency cycles broken via extracted abstraction/inversion.
- [ ] Complexity metrics measurably reduced versus baseline.
- [ ] Tests green and lint/static analysis clean after each step (no new issues).
- [ ] Fail-to-pass evidence captured; thresholds enforced in lint config.
