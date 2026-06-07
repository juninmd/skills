---
name: diagnose
description: |
  **DIAGNOSTIC SKILL** - Disciplined 6-phase diagnosis loop for hard bugs and performance regressions.
  USE FOR: when user says "diagnose this" / "debug this", reports a bug, says something is broken/throwing/failing, describes a performance regression.
  DO NOT USE FOR: implementing new features, general refactoring, known fixes.
  INVOKES: feedback loop construction, hypothesis ranking, regression tests.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, run_shell_command]
---

# Diagnose

A discipline for hard bugs. Skip phases only when explicitly justified. Use the project's domain glossary and check ADRs before diving in.

Full methodology: [6-Phase Debugging Guide](references/debugging-phases.md)

## Phase summary

| Phase | Goal | Gate |
|---|---|---|
| 1 — Feedback loop | Build a fast, deterministic pass/fail signal | Do not proceed without one |
| 2 — Reproduce | Confirm symptom matches user report | Do not proceed without reproduction |
| 3 — Hypothesise | Generate 3–5 ranked, falsifiable hypotheses | Show list to user before testing |
| 4 — Instrument | One probe per prediction, one variable at a time | Tag all logs `[DEBUG-xxxx]` |
| 5 — Fix | Regression test before fix (if correct seam exists) | Watch it fail, fix, watch it pass |
| 6 — Cleanup | Remove instrumentation, state post-mortem in commit | Re-run Phase 1 loop |

## Quick reference — feedback loop options

1. Failing test (unit / integration / e2e)
2. Curl / HTTP script against dev server
3. CLI invocation diffing stdout against snapshot
4. Headless browser script (Playwright / Puppeteer)
5. Replay captured trace
6. Throwaway harness with mocked deps
7. Property / fuzz loop (1000 random inputs)
8. `git bisect run` bisection harness
9. Differential loop (old vs new version)

**Non-deterministic bugs:** goal is a higher reproduction rate, not a clean repro. Loop 100×, parallelise, add stress.

## Checklist

- [ ] Phase 1: Feedback loop built and validated before any code changes.
- [ ] Phase 2: Bug reproduced — symptom matches user report.
- [ ] Phase 3: 3–5 falsifiable hypotheses ranked and shown to user.
- [ ] Phase 4: Probes map to specific predictions; one variable changed at a time.
- [ ] Phase 5: Regression test written (or absence of seam documented).
- [ ] Phase 6: All `[DEBUG-...]` instrumentation removed; post-mortem in commit.
