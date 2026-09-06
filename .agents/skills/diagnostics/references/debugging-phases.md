# 6-Phase Debugging Guide

## Phase 1 — Build a feedback loop

**This is the skill.** If you have a fast, deterministic, agent-runnable pass/fail signal, you will find the cause. Spend disproportionate effort here.

### Construction strategies (choose the cheapest reliable loop)

1. Failing test at whatever seam reaches the bug — unit, integration, e2e.
2. Curl / HTTP script against a running dev server.
3. CLI invocation with a fixture input, diffing stdout against a known-good snapshot.
4. Headless browser script (Playwright / Puppeteer).
5. Replay a captured trace (network request, payload, event log replayed in isolation).
6. Throwaway harness — minimal subset of the system, mocked deps, single function call.
7. Property / fuzz loop — run 1000 random inputs and look for the failure mode.
8. Bisection harness — `git bisect run` between two known states.
9. Differential loop — same input through old-version vs new-version, diff outputs.

### Iterate on the loop

- Can I make it faster? (Cache setup, skip unrelated init, narrow scope.)
- Can I make the signal sharper? (Assert on the specific symptom, not "didn't crash".)
- Can I make it more deterministic? (Pin time, seed RNG, isolate filesystem, freeze network.)

A 2-second deterministic loop is a debugging superpower. A 30-second flaky loop is barely better than none.

### When you cannot build a loop

Stop and say so explicitly. List what you tried. Ask for: (a) environment access, (b) captured artifact (HAR, log dump, core dump), or (c) permission to add temporary production instrumentation. Do not proceed.

## Phase 2 — Reproduce

Run the loop. Confirm:
- The loop produces the failure mode the **user** described — not a different failure nearby.
- The failure is reproducible across multiple runs.
- You have captured the exact symptom (error message, wrong output, slow timing).

## Phase 3 — Hypothesise

Generate falsifiable hypotheses proportionate to the uncertainty before testing:

> "If `<X>` is the cause, then `<changing Y>` will make the bug disappear / `<changing Z>` will make it worse."

Keep the hypotheses visible in the investigation; do not block progress on presenting the list.

## Phase 4 — Instrument

Each probe maps to a specific prediction from Phase 3. **Change one variable at a time.**

- **Debugger / REPL inspection** — one breakpoint beats ten logs.
- **Targeted logs** at boundaries that distinguish hypotheses.
- Never "log everything and grep".
- Tag every debug log: `[DEBUG-a4f2]`. Cleanup is a single grep.

**Perf branch:** establish a baseline measurement first (timing harness, `performance.now()`, profiler, query plan), then bisect.

## Phase 5 — Fix + regression test

Write the regression test **before the fix** only if a **correct seam** exists (test exercises the real bug pattern at the call site).

If no correct seam exists, note it — the architecture is preventing the bug from being locked down. Flag for architecture review.

1. Failing test at the seam.
2. Watch it fail.
3. Apply the fix.
4. Watch it pass.
5. Re-run the Phase 1 loop against the original scenario.

## Phase 6 — Cleanup + post-mortem

- [ ] Original repro no longer reproduces (re-run Phase 1 loop)
- [ ] Regression test passes (or absence of seam documented)
- [ ] All `[DEBUG-...]` instrumentation removed
- [ ] Throwaway prototypes deleted
- [ ] Correct hypothesis stated in commit/PR message

**Then ask: what would have prevented this bug?** If architectural change is needed, hand off to the `software-architecture` skill after the fix is in.
