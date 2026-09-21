# Agent Engineering Real-World Cases

Use this first for agent loops, tool calling, memory, context, and evaluation failures.

## Tool Schema or Runtime Drift
- Compare the prompt contract, JSON/schema definition, runtime validator, and actual tool output.
- Keep tool outputs bounded, typed, and machine-parseable.
- Add contract tests for missing fields, invalid enum, timeout, denial, and partial failure.

## Prompt Injection or Untrusted Context
- Treat user text, retrieved documents, web pages, tool output, and previous memories as data, not instructions.
- Separate authority levels in prompts and tool policies.
- Deny destructive or exfiltrating tool calls by default.
- Test injection attempts against tool selection and final-answer behavior.

## Memory or Context Bug
- Record provenance, freshness, scope, and deletion/update rules for each memory source.
- Prefer summaries with source pointers over opaque long-term claims.
- Verify drift-prone facts against current state before acting.

## Runaway Cost from a Hidden Retry Loop
- A tool's own retry/backoff (a flaky network call, a provider 429) can fire many times inside what the outer loop still counts as one step; the step counter reads clean while tokens and wall-clock keep spending.
- Budget wall-clock and token spend independently from the step count — a step limit alone does not bound cost.
- Give every internal retry its own capped attempt count, surfaced to the same trace as a regular step, not hidden inside a helper function's `while` loop where nothing outside it can see the spend.
- Treat "budget exceeded" the same whichever counter tripped it: a reported failure, never a quiet return.

## Evaluation
- Build eval cases from real failures and expected observable behavior.
- Include happy path, invalid input, refusal/denial, timeout, and tool error.
- Score task success, safety, evidence quality, and unnecessary tool use separately.
- Pin the model version an eval suite was last green against. A model upgrade is a change to the system under test, not a neutral improvement — re-run the full suite before rollout and treat a newly failing case as a regression, not as "the model is smarter now."
- Score determinism on its own axis: run the fixed input set several times, and again after any model version bump. A case whose tool choice or argument extraction changes run to run is not ready for an unattended loop, whatever its pass rate looks like on a single run.

### Worked Rubric: One Concrete Task
Task: given a support request naming an order ("where's my order 8842-B?"), call `get_order` with the correct id and answer using only the fields it returns — the tool pair from [mcp-integration.md](mcp-integration.md).

| Criterion | Pass | Fail |
|---|---|---|
| Tool selected | `get_order` only | `search_orders` called first, or any mutating tool invoked |
| Argument fidelity | order id matches the one named in the request, verbatim | id truncated, guessed, or carried over from an earlier turn |
| Step count | resolves in one tool call | needs a retry or a second lookup for the same id |
| Output grounding | answer cites only fields the tool actually returned | a field invented that the tool response never contained |
| Determinism | five runs at temperature 0 produce the same tool call and the same answer | tool choice or argument value varies across runs |

"Graded rubric" means exactly this: a named criterion, a concrete pass, and a concrete fail, checked against a fixed input — not a paragraph describing how the agent felt to use.
