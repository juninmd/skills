# agent-engineering Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `agent-development.md` | Writing or reviewing an agent's system prompt, tool-calling contract, or context/HITL architecture before it ships; deciding whether to add a tool; prompt-cache ordering and cache-hit monitoring |
| `audit-phases.md` | Structuring a security audit's orientation and phase order, before diving into any one function |
| `context-engineering.md` | Context window is filling up, a compaction is looming, or deciding what to prune, summarize, or persist to disk |
| `function-analysis.md` | Doing line-by-line function micro-analysis during a security audit and need the per-function checklist and output requirements |
| `mcp-integration.md` | Designing or reviewing MCP server tools: how many to expose, their shape, schemas, transport, or pagination |
| `real-world-cases.md` | Diagnosing a live agent-loop failure — tool schema drift, prompt injection, memory/context bugs, runaway retry cost, or eval design |
| `stability-rules.md` | An audit is losing coherence across findings — need anti-hallucination anchoring rules or when to spawn analysis subagents |
| `tool-guards-and-hooks.md` | Deterministic tool interceptors, pre/post execution hooks, secret scrubbers, token truncation, and circuit breakers |
| `transport-auth-and-testing.md` | Hardening an MCP server's HTTP transport, auth, timeouts, or writing protocol-client tests against it |
