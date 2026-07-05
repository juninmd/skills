---
name: agent-engineering
description: |
  Design, implement, test, and secure AI agents, MCP tools, context pipelines, memory, and multi-agent orchestration. Use for agent loops, tool schemas, handoffs, prompt-injection defenses, tracing, and agent evaluations.
---

# Agent Engineering

## Workflow
1. Define the agent goal, non-goals, authority boundary, and human approval points.
2. Map each user intent to the smallest deterministic tool; use strict schemas and bounded outputs.
3. Design state transitions, retries, timeouts, idempotency, and handoff criteria before prompts.
4. Treat prompts, retrieved content, tool output, and remote resources as untrusted input.
5. Add traces for requests, tool calls, latency, token use, failures, and final outcomes without logging secrets.
6. Test valid calls, malformed input, prompt injection, tool denial, timeout, partial failure, and retry exhaustion.

## Reference Routing
- Practical agent failure cases: [real-world-cases.md](references/real-world-cases.md)
- Agent loops, tool contracts, and orchestration: [agent-development.md](references/agent-development.md)
- Deep audit scope and evidence collection: [audit-phases.md](references/audit-phases.md)
- Function-level trust-boundary analysis: [function-analysis.md](references/function-analysis.md)
- Stable outputs and subagent isolation: [stability-rules.md](references/stability-rules.md)

## Rules
- Prefer code for routing, retries, parsing, and policy enforcement; use models for judgment-heavy work.
- Give tools least privilege and deny destructive operations by default.
- Keep memory provenance, retention, and deletion behavior explicit.
- Never expose hidden reasoning; log concise decisions and observable evidence instead.

## Checklist
- [ ] Boundaries, tools, and approvals are explicit.
- [ ] Schemas and untrusted inputs are validated.
- [ ] Failure, abuse, and trace checks pass.
