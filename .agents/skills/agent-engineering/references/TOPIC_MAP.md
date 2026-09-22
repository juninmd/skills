# agent-engineering Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `agent-development.md` | Writing or reviewing an agent's system prompt, tool-calling contract, or context/HITL architecture before it ships |
| `audit-phases.md` | Structuring a security audit's orientation and phase order, before diving into any one function |
| `automation-candidates.md` | Decide whether a recurring task needs an agent asset, and the lightest option that does the job, before writing a skill: [automation-candidates](automation-candidates.md) |
| `context-engineering.md` | Context window is filling up, a compaction is looming, or deciding what to prune, summarize, or persist to disk |
| `function-analysis.md` | Doing line-by-line function micro-analysis during a security audit and need the per-function checklist and output requirements |
| `headless-agent-supervision.md` | An unattended/headless agent run needs a supervisor loop for auth expiry, quota 429s, stalls, or crash classification |
| `mcp-integration.md` | Designing or reviewing MCP server tools: how many to expose, their shape, schemas, transport, or pagination |
| `multi-model-council.md` | Multi-model consensus, adversarial review hats (SecOps/QA/DevOps/SWE), and deterministic dispute arbitration |
| `parallel-subagents.md` | Deciding whether a task can fan out to parallel subagents/worktrees, or how to brief and integrate them safely |
| `real-world-cases.md` | Diagnosing a live agent-loop failure — tool schema drift, prompt injection, memory/context bugs, runaway retry cost, or eval design |
| `skill-creator.md` | Authoring a new skill: naming its trigger, deduplicating against existing skills, and fitting the required body structure |
| `stability-rules.md` | An audit is losing coherence across findings — need anti-hallucination anchoring rules or when to spawn analysis subagents |
| `tool-guards-and-hooks.md` | Deterministic tool interceptors, pre/post execution hooks, secret scrubbers, token truncation, and circuit breakers |
| `transport-auth-and-testing.md` | Hardening an MCP server's HTTP transport, auth, timeouts, or writing protocol-client tests against it |
