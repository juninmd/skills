---
name: agent-observability-and-testing
description: |
  **TESTING SKILL** - Test and observe agentic systems with ReAct loop instrumentation.
  USE FOR: tool call unit testing, agent loop tracing, distributed tracing for agents, LLM-as-judge evaluation, error categorization, agent trace replay.
  DO NOT USE FOR: general application testing (use test-driven-development), infrastructure monitoring (use observability-patterns), code review (use auditing-code).
  INVOKES: test-driven-development, observability-patterns, agent-cost-benchmarking.
license: MIT
metadata:
  version: 1.0.0
  token_budget_exception: "Agent evaluation requires metrics, traces, tests, and failure analysis."
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Agent Observability & Testing

Expert guidance for testing agent behaviors deterministically while observing reasoning quality through distributed tracing and LLM-as-judge evaluation.

**USE FOR:**
- Unit testing agent tools in isolation (deterministic, no LLM calls).
- Instrumenting agent loop (ReAct step logging: thought → action → observation → next thought).
- Distributed tracing for agent trees (correlation IDs, span hierarchy).
- LLM-as-judge evaluation: scoring agent reasoning quality against rubrics.
- Error categorization: tool failure vs reasoning error vs policy violation.
- Trace replay and counterfactual analysis: "what if agent chose different tool?"
- Agent behavior regression testing: ensure reasoning consistency across model versions.

**DO NOT USE FOR:**
- General application testing (use `test-driven-development`).
- Infrastructure and system monitoring (use `observability-patterns`).
- Code quality reviews (use `auditing-code`).

**INVOKES:**
- `test-driven-development` for test framework and coverage.
- `observability-patterns` for structured logging and tracing backends.
- `agent-cost-benchmarking` for cost-aware evaluation metrics.

## ReAct Loop Instrumentation

```
Agent Iteration:
  Thought: <agent reasoning>
    ↓ [trace: reason_depth=3, tokens_used=245]
  Action: <tool_name(params)>
    ↓ [trace: tool_id=uuid, permitted=true, param_validation=pass]
  Observation: <tool_result>
    ↓ [trace: tool_result_length=512, tool_latency_ms=145]
  Next Thought: <agent updates reasoning>
```

**Trace Metadata:**
- `span_id`, `trace_id` — correlation across agents and services.
- `agent_iteration`, `tool_call_sequence` — order within agent loop.
- `token_count`, `latency_ms` — performance metrics per step.
- `decision_rationale` — agent's explanation for tool selection.

## Tool Unit Testing

**Isolation:** Test tool behavior independent of LLM.

```python
def test_search_tool():
    result = search_tool("query", top_k=5)
    assert len(result) <= 5
    assert all(isinstance(r, SearchResult) for r in result)
```

**Validation:** Ensure tool contract (inputs, outputs, side effects) is correct.

- Input: Validate parameter types, ranges, constraints.
- Output: Check return schema, no unexpected mutations.
- Side effects: Confirm only intended resources modified.

## LLM-as-Judge Evaluation

**Rubric-based scoring:** Evaluate agent reasoning on dimensions:

1. **Correctness** — Did agent reach right conclusion?
2. **Reasoning Quality** — Were steps logical and justified?
3. **Tool Usage** — Did agent select appropriate tools in order?
4. **Error Recovery** — How did agent handle tool failures?
5. **Compliance** — Did agent follow policies (HITL, security)?

**Scoring:** 1–5 per dimension; aggregate to final score.

**Usage:** Detect regressions when model changes; identify reasoning gaps.

## Error Categorization

| Error Type | Root Cause | Detection | Mitigation |
|-----------|-----------|-----------|-----------|
| Tool Failure | Tool crashed or returned error | Tool response code | Retry logic, fallback tool |
| Reasoning Error | Agent chose wrong tool | LLM-as-judge scores <3 | Prompt refinement, example tuning |
| Policy Violation | Agent violated constraints | HITL approval denied | Policy statement refinement |
| Timeout | Tool or LLM exceeded limits | Latency > SLA | Async execution, caching |
| Hallucination | Agent claimed capability it lacks | Cross-reference with tool schema | Fine-tuning, guardrails |

## Trace Replay & Counterfactual Analysis

**Replay:** Re-run agent from recorded trace; verify deterministic behavior.
- Useful for: Debugging odd decisions, regression testing after model updates.

**Counterfactual:** "If agent had chosen tool X instead of Y, would it succeed?"
- Useful for: Identifying missed optimization opportunities, better tool composition.

## Checklist

- [ ] All agent tools have isolated unit tests (no LLM calls).
- [ ] Tool contract validated: input types, output schema, side effects.
- [ ] ReAct loop instrumented: thought → action → observation logged with metadata.
- [ ] Distributed tracing enabled: correlation IDs across all agent calls.
- [ ] LLM-as-judge rubric defined; scoring tested on sample agent traces.
- [ ] Error categorization implemented: tool vs reasoning vs policy vs timeout.
- [ ] Regression test suite runs on model version changes.
- [ ] Trace replay validates determinism (same inputs → same trace structure).
- [ ] Incident response uses trace replay to reconstruct failures.
