---
name: agent-engineering
description: |
  Design, orchestrate, and supervise AI agents, MCP servers, subagents, and context pipelines. Use for agent loops, MCP tools, context window pruning, parallel subagents, concurrent workspaces, headless resilience, and radar digests.
---



# Agent Engineering

## Preflight
```bash
rg -n "tool_choice|function_call|tools:" src/ | head
rg -n "max_tokens|maxSteps|timeout" src/agent* | head    # is the loop bounded at all?
```

Name the authority boundary and the human approval points before designing anything. An agent whose boundary is unstated has all of it.

## Workflow
1. Define the goal, the non-goals, the authority boundary, and the human approval points. An agent without a stated authority boundary has all of it.
2. Map each user intent to the smallest deterministic tool. Strict schemas, bounded outputs.
3. Design state transitions, retries, timeouts, idempotency, and handoff criteria **before** writing prompts. Prompt engineering cannot fix a missing state machine.
4. Treat prompts, retrieved content, tool output, and remote resources as untrusted input.
5. Trace requests, tool calls, latency, token use, failures, and outcomes — without logging secrets or chain-of-thought.
6. Test the failure matrix, not just the happy path.

## Code or Model

| Job | Use | Why |
|---|---|---|
| Routing on a known set | code | deterministic, testable, free |
| Retries, backoff, idempotency | code | a model will not be consistent about it |
| Parsing structured output | code (schema validation) | a model re-reading its own JSON is waste |
| Policy enforcement, authorization | code | a prompt is not a permission system |
| Classification, extraction, summarization | model | genuinely fuzzy input |
| Judgment with tradeoffs | model | that is what it is for |

Every decision moved from prompt to code removes a class of nondeterminism you would otherwise be debugging in production.

## Bound the Loop
An unbounded loop is the top failure mode — it burns budget, then stops silently, and the user sees a truncated answer with no error.

```ts
const limits = { steps: 12, tokens: 200_000, wallClockMs: 120_000 };
// Hitting any limit is a REPORTED failure, never a quiet return.
if (step > limits.steps) throw new AgentBudgetExceeded('step limit', { step, trace });
```

## Prompt Injection Is an Input Problem

| Vector | Defense |
|---|---|
| Retrieved document says "ignore previous instructions" | content is data, never instructions — never concatenate it into the system prompt |
| Tool output contains a new directive | same; render it in a delimited data block |
| A web page instructs a destructive tool call | tool allowlist plus human approval on anything destructive |
| Exfiltration via a crafted URL in output | allowlist outbound domains; strip or refuse unknown ones |
| Chained agent passes a poisoned instruction along | handoffs carry structured intent, never raw transcripts |

The defense is architectural: least privilege on tools, deny destructive by default, human gate on the irreversible. No prompt wording survives a determined injection.

## Test Matrix

| Case | Expected |
|---|---|
| Valid call | correct tool, correct arguments |
| Malformed model output | schema rejects, one bounded retry |
| Prompt injection in retrieved content | instruction ignored, flagged |
| Tool denied | graceful degradation, reported |
| Tool timeout | bounded, surfaced, not retried forever |
| Partial failure mid-plan | state consistent, resumable |
| Retry exhaustion | visible failure with the trace |
| Budget exceeded | reported, never a silent stop |

## Reference Routing
- Practical agent failure cases: [real-world-cases.md](references/real-world-cases.md)
- Agent loops, tool contracts, and orchestration: [agent-development.md](references/agent-development.md)
- Deep audit scope and evidence collection: [audit-phases.md](references/audit-phases.md)
- Function-level trust-boundary analysis: [function-analysis.md](references/function-analysis.md)
- Stable outputs and subagent isolation: [stability-rules.md](references/stability-rules.md)
- Building or wiring MCP servers, transports, and tool exposure: delegate to mcp-integration.
- Window budgets, pruning, and summarization strategy: delegate to context-engineering.

See [Reference Map](references/TOPIC_MAP.md) for specialized references and sub-domain guides.

## Stop
- The loop has no hard step, token, and wall-clock bound. Bound it before running it anywhere real.
- A destructive tool has no human gate. Add the gate; a careful prompt is not a permission system.
- Retrieved content is concatenated into the system prompt. Fix the architecture before shipping — no wording survives injection.

## Rules
- Hand off security audits to `security-ops`, CLI automation to `tooling-dev`, and prompt documentation to `documentation`.
- Give tools least privilege and deny destructive operations by default. A tool that can delete needs a human gate, not a careful prompt.
- Keep memory provenance, retention, and deletion behavior explicit. Memory that cannot be inspected or deleted is a liability.
- Never log the system prompt or chain-of-thought, and never echo unsanitized tool output back to the user.
- On handoff to another agent, pass intent, scope, current state, verification commands, and boundaries — never raw transcripts. A transcript hands over noise and hides the contract.
- An agent evaluation needs a fixed input set and a graded rubric. "It seemed better" is not a result, and it will reverse next week.
- Whether every model behind an OpenAI-compatible gateway actually emits tool calls is llm-gateway-testing; auditing a third-party MCP server or plugin before installing it is plugin-vetting; keeping an unattended headless run alive across expiring tokens and quotas is headless-agent-supervision.

## Checklist
- [ ] Goal, non-goals, authority boundary, and approval points written down.
- [ ] Every deterministic decision implemented in code, not in the prompt.
- [ ] Tool schemas strict; outputs bounded and validated.
- [ ] Loop bounded on steps, tokens, and wall clock, with a reported failure on the limit.
- [ ] External content treated as data; destructive tools gated.
- [ ] Whole test matrix exercised, injection case included.
- [ ] Traces cover tool calls, latency, tokens, and outcomes, with no secrets.
