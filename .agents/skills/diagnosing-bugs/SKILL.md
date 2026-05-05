---
name: diagnosing-bugs
description: "Evidence-driven debugging for defects, flaky behavior, and performance regressions. Triggers: bug, debug, failing, broken, regression, flaky, timeout."
argument-hint: "[symptom/test/issue]"
---

# Diagnosing Bugs

Use this skill when a reported problem needs investigation before implementation. The goal is to turn uncertainty into a fast, repeatable signal, then use that signal to prove the fix.

## Workflow

### 1. Define the symptom
- Restate the user-visible failure in one sentence.
- Capture exact evidence: error text, wrong output, slow timing, failing test, screenshot, request payload, or reproduction steps.
- Confirm the failure matches the user's report before fixing nearby issues.

### 2. Build a feedback loop
Prefer the fastest deterministic check that exercises the failing path:

- Existing failing test or a new focused regression test.
- CLI command with a fixture input and expected output.
- HTTP request against a local service.
- Browser automation for UI defects.
- Replay of a captured request, log sample, event, or trace.
- Narrow harness around the affected module when the full system is too slow.

If the bug is intermittent, raise the reproduction rate with repeated runs, fixed seeds, controlled time, isolated filesystem state, or stress loops. A flaky but frequent signal is workable; a rare unmeasured signal is not.

### 3. Rank hypotheses
List 3-5 likely causes before editing code. Each hypothesis must have a prediction:

```text
If <cause> is true, then <probe/change> should make <observable signal> change.
```

Test one variable at a time. Do not jump from "plausible" to "fix" without a probe.

### 4. Instrument narrowly
- Prefer debugger, REPL, targeted assertions, or local probes over broad logging.
- If temporary logs are needed, tag them with a unique prefix such as `[DBG-issue-id]`.
- For performance regressions, establish a baseline before changing code.
- Remove all temporary instrumentation before declaring the task complete.

### 5. Fix and lock it down
- Write or preserve the failing regression check before applying the fix when there is a reliable seam.
- Apply the smallest code change that makes the original feedback loop pass.
- Re-run the original scenario, not only the minimized test.
- If no good regression seam exists, document that gap and recommend the smallest architecture change that would create one.

## Stop Conditions

Stop and ask for more input when no trustworthy feedback loop can be built from available context. Ask for the missing artifact: logs, payloads, environment access, screen recording, dataset sample, or permission for temporary instrumentation.

## Checklist

- [ ] The observed failure matches the user's reported symptom.
- [ ] There is a repeatable pass/fail loop before the fix.
- [ ] Hypotheses were falsifiable and tested one at a time.
- [ ] The fix passes both the minimized check and the original scenario.
- [ ] Temporary debug code, logs, fixtures, and harnesses were removed or clearly isolated.

## References

- [Workspace Agent Conventions](../../../AGENTS.md)
- [Testing Rule](../../rules/testing.instructions.md)
- [Error Handling Rule](../../rules/error-handling.instructions.md)
