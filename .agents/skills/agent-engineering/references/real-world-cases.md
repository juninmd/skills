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

## Evaluation
- Build eval cases from real failures and expected observable behavior.
- Include happy path, invalid input, refusal/denial, timeout, and tool error.
- Score task success, safety, evidence quality, and unnecessary tool use separately.
