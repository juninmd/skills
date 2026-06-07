---
name: diagnosing-bugs
description: |
  **DIAGNOSTIC SKILL** - Evidence-driven debugging for defects and performance regressions.
  USE FOR: bug investigation, failing tests, flaky behavior, performance regressions, production errors, root cause analysis.
  DO NOT USE FOR: implementing new features, general code refactoring (use applying-design-principles), infrastructure issues.
  INVOKES: regression tests, log analysis, hypothesis testing, feedback loop construction.
license: MIT
metadata:
  version: 1.1.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, run_shell_command]
---

# Diagnosing Bugs

Evidence-driven methodology for turning uncertainty into repeatable signals to identify and prove fixes for software defects and performance regressions.

Full 6-phase methodology: [Evidence-Driven Debugging Workflow](references/debugging-workflow.md)

## Phase summary

| Phase | Key action | Gate |
|---|---|---|
| 1 — Feedback loop | Build a fast, deterministic pass/fail signal | Do not proceed without one |
| 2 — Reproduce | Confirm symptom matches user report | Do not proceed without reproduction |
| 3 — Hypothesise | 3–5 ranked, falsifiable hypotheses | Show list to user before testing |
| 4 — Instrument | One probe per prediction, tag logs `[DEBUG-xxxx]` | One variable changed at a time |
| 5 — Fix | Regression test before fix (if correct seam exists) | Watch fail → fix → watch pass |
| 6 — Cleanup | Remove instrumentation, post-mortem in commit | Re-run Phase 1 loop |

## Core Principles

1. **Evidence First:** Never guess the cause; prove it with an observable signal change.
2. **Determinism:** Convert intermittent failures into frequent signals before fixing.
3. **Minimization:** Apply the smallest change that resolves the identified root cause.

## Checklist

- [ ] Feedback loop built and validated before any code changes.
- [ ] Bug reproduced — symptom matches user report.
- [ ] 3–5 falsifiable hypotheses ranked and shown to user before testing.
- [ ] Each probe maps to a specific prediction; one variable changed at a time.
- [ ] Regression test written at a correct seam (or absence of seam documented).
- [ ] All `[DEBUG-...]` instrumentation removed; post-mortem stated in commit.
