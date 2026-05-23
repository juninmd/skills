---
name: diagnosing-bugs
description: |
  **DIAGNOSTIC SKILL** - Perform evidence-driven debugging for defects and regressions.
  USE FOR: bug investigation, failing tests, flaky behavior, performance regressions, production errors, root cause analysis.
  DO NOT USE FOR: implementing new features, general code refactoring (use applying-design-principles), infrastructure issues.
  INVOKES: regression tests, log analysis, hypothesis testing.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, run_shell_command]
---

# Diagnosing Bugs

Expert methodology for turning uncertainty into repeatable signals to identify and prove fixes for software defects and performance regressions.

**USE FOR:**
- Investigating reported symptoms by building deterministic feedback loops.
- Analyzing flaky or intermittent behavior with reproduction stress tests.
- Ranking and testing falsifiable hypotheses for root cause analysis.
- Instrumenting code narrowly to capture state during failure.
- Validating fixes against minimized regression checks.

**DO NOT USE FOR:**
- Drafting initial application architecture.
- Tasks where the fix is already known and verified.

**INVOKES:**
- Debuggers, log parsers, and automated regression suites.

## Methodology and Guidelines
Implementation details for symptom definition, hypothesis ranking, and stop conditions are documented in:
- [Evidence-Driven Debugging Workflow](references/debugging-workflow.md)

## Core Principles
1. **Evidence First:** Never guess the cause; prove it with an observable signal change.
2. **Determinism:** Convert intermittent failures into frequent signals before fixing.
3. **Minimization:** Apply the smallest change that resolves the identified root cause.

## Checklist
- [ ] Confirm the observed failure matches the reported symptom.
- [ ] Establish a repeatable pass/fail loop before touching implementation.
- [ ] Test hypotheses one at a time with falsifiable probes.
- [ ] Ensure all temporary debug artifacts are removed after verification.
