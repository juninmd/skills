---
name: verifying-changes
description: |
  **VERIFICATION SKILL** - Prove a change works with reproducible evidence before reporting "done".
  USE FOR: running the app, smoke checks, reproduce-before-fix, homologation/acceptance gates, fail-to-pass proof, definition-of-done enforcement.
  DO NOT USE FOR: authoring test suites (use test-driven-development), designing failure scenarios (use engineering-test-scenarios), root-cause analysis (use diagnosing-bugs), CI pipeline setup (use configuring-ci-cd).
  INVOKES: test-driven-development, engineering-test-scenarios, diagnosing-bugs, configuring-ci-cd.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Verifying Changes

A change is not "done" until it runs and is proven by evidence a reviewer can reproduce — never by reading the code alone. This skill makes verification a mandatory ceremony and the gate for declaring work complete.

**USE FOR:**
- Running the real code/app and capturing actual output as proof.
- Reproduce-before-fix: confirm the failure exists *before* changing anything.
- Homologation/acceptance gates between staging and promotion.
- Fail-to-pass evidence: the same check is red before and green after.

**DO NOT USE FOR:**
- Writing the test suite (use `test-driven-development`).
- Designing unhappy-path cases (use `engineering-test-scenarios`).
- Diagnosing root cause when a gate fails (use `diagnosing-bugs`).
- Wiring CI/CD pipelines (use `configuring-ci-cd`).

**INVOKES:**
- `test-driven-development` / `engineering-test-scenarios` when coverage gaps surface.
- `diagnosing-bugs` when a rung fails for an unclear reason.
- `configuring-ci-cd` to gate promotions on these same checks.

## The Verification Ladder

Run in order; stop and fix at the first failing rung. A higher rung never excuses a lower one.

1. **Compile/Lint** — builds and lints clean on changed files.
2. **Unit** — scoped tests pass, exit 0, zero silent skips.
3. **Integration** — cross-module/DB/external contracts hold.
4. **Smoke/Run** — launch the real thing; exercise critical paths (< 5 min).
5. **Homologation** — acceptance rubric on staging (perf budget met, no leaked secrets).
6. **Evidence** — attach reproducible proof: test log + run output/screenshot.

## Reproduce-Before-Fix

Capture the failure → change one thing → re-run the *same* check → confirm it now passes → re-run the full suite for regressions. A fix with no prior red state is unfalsifiable; reject it.

## Checklist

- [ ] Failure reproduced and captured before any fix (red first).
- [ ] Compile/lint clean on every changed file.
- [ ] Scoped unit + integration tests pass, exit 0, no silent skips.
- [ ] App/feature actually launched and critical paths exercised (smoke/run).
- [ ] Determinism confirmed: critical tests rerun twice, both green (no flaky pass).
- [ ] Homologation rubric passes on staging; promotion blocked if any gate fails.
- [ ] No secrets/credentials in the staged diff (`git diff --cached`).
- [ ] Performance within the stated budget when latency/memory matters.
- [ ] Reproducible evidence attached to the PR/commit (log + run output).
- [ ] "Done" claimed only after all gates pass; any skipped check stated loudly.
