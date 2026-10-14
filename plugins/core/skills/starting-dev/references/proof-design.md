# Proof Design

Decide how you will prove the change works **before** writing it. [phase-plan.md](phase-plan.md)
requires "exact verification commands with expected results"; this file helps pick them when the
right command is not obvious. It is the planning side of the QA rule that every change needs a check
that fails before it and passes after it. Comparing an existing suite against its baseline is
covered by [regression-gate.md](../../test-engineering/references/regression-gate.md).

## Preflight
```bash
jq -r '.scripts // {} | keys[]' package.json 2>/dev/null          # checks the project already has
rg -n '^\s*(test|check|lint|e2e|bench)[\w:-]*:' Makefile justfile 2>/dev/null
ls .github/workflows 2>/dev/null                                   # what CI runs today
```

Match the effort to the risk. A mechanical edit relies on the project's normal checks and does not
need this file. Reach for it on work that spans phases or systems, a bug nobody can reproduce yet,
or a promise a passing unit suite cannot back up.

## Workflow
1. State the outcome and how it could go wrong.
2. Pick the proof from what the system exposes, after considering more than one option.
3. Keep the set of checks small: one decisive check per outcome.
4. Add a test hook only when the system does not show the deciding fact.
5. Write every step as a command with its expected result.
6. After implementing, run the steps and give each outcome a verdict.

## 1. Outcome and risks

In a line or two each, write down:

- the behavior that has to **appear**;
- the behavior that has to **keep working**, starting with the regressions that would hurt most;
- the edges the behavior crosses: another process, the network, storage, time, a screen;
- the way a passing check could still be misleading.

Move on once each of these is specific enough to test.

## 2. Pick the proof

Look at what the system lets you control and observe, and let that choose the technique:

| You can | Proof that fits |
|---|---|
| drive an input and read the output | a test through the public interface |
| move the system between states | check the state before and after, including moves that must be refused |
| name a rule that always holds | a property-based or fuzz test over generated inputs |
| capture an output artifact (file, message, response) | a golden-file comparison or a schema check |
| repeat or undo the scenario | a reproduction script that starts from a known state |
| only observe it in a production-like setting | a staging run, reading logs or traces |

Write down at least two options. Choose the one that gives the most confidence for its cost and
risk, and note a cheaper and a stronger fallback in case the environment changes.

## 3. Keep the proof set small

Number the separate outcomes. Each gets exactly **one** deciding check. Pick the fewest checks that
cover every outcome and every important edge, with no two proving the same thing. A result only
holds while its code, inputs, environment, and data are unchanged; after an edit, rerun the checks
that edit affected rather than everything. The repository's mandatory checks run regardless.

## 4. Test hooks

If the deciding fact is only visible indirectly, add the **smallest** piece of support code that
lets someone create the state, observe it, replay it, and diagnose a failure: a debug endpoint that
is behind a flag and never reachable in production, a seed command, a controllable clock, a
structured log line, or a test double at an existing seam.

- Prefer hooks that make the observation more direct, repeatable, isolated, or easy to reset.
- Decide up front whether the hook is throwaway (deleted after the verdict) or permanent (kept,
  documented, and tested itself).
- Ask before adding a dependency, or a permanent diagnostic surface that exists only for proof.

## 5. Runnable steps

A step is a command plus the result you expect, never a sentence describing what to check. Setup,
fixtures, and resetting state count as steps. If a step needs a secret, use a fixture, a mock, or a
narrowly scoped test credential; production data is never acceptable.

## 6. Verdicts

Once the change is implemented, run the steps as planned and give each outcome one verdict:

| Verdict | Meaning |
|---|---|
| **Proven** | the checks show the outcome under the conditions stated |
| **Conditional** | it holds only under a narrower condition than promised; name that condition |
| **Disproven** | the checks contradict the outcome; the work is not finished |

Keep what the checks showed apart from what is still unknown. A later reader should find the check
behind every verdict and see which scenarios it left untested.

## Stop
- Nothing can observe the outcome at a reasonable cost or risk: report the gap instead of calling
  the work done.
- The only possible proof needs production data or a real secret.
- Two checks give contradictory answers: reconcile them before writing more code.
