# Evidence-Driven Debugging Workflow

A systematic approach to diagnosing defects, regressions, and flaky behavior.

## 1. Symptom Definition
- Capture exact evidence: error text, logs, failing tests, or slow timings.
- Confirm the failure matches the user report before proceeding.

## 2. Feedback Loop Creation
- Prefer the fastest deterministic check (focused regression test, CLI command with fixture).
- For intermittent bugs, increase reproduction rate via repeated runs or stress loops.

## 3. Hypothesis Ranking
- List 3-5 causes with specific predictions: `If <cause> is true, then <probe> should change <signal>`.
- Test one variable at a time.

## 4. Instrumentation
- Use targeted assertions or local probes over broad logging.
- Remove temporary instrumentation before completion.

## 5. Verification
- Smallest possible fix that makes the feedback loop pass.
- Re-run the original scenario to ensure no side effects.

## Stop Conditions
Pause and ask the user for more context (logs, payloads, environment access) if no trustworthy feedback loop can be built.
