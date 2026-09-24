# AI Agent Development Guidelines

Best practices for building autonomous agents with structured prompts and tool calling.

## 1. System Prompts & Personas
- **Clarity:** Use objective, concise prompts; avoid generic fillers.
- **Constraints:** Define negative constraints (what the agent MUST NOT do).
- **Format:** State output requirements (e.g., "Output JSON only") explicitly.

## 2. Tool Calling (Function Calling)
- **Schemas:** Use strict types (Zod, JSON Schema) for parameters.
- **Descriptions:** Provide high-quality descriptions for every tool and parameter.
- **Errors:** Catch tool errors and provide helpful feedback to the LLM.
- **High bar for a new tool:** each one is another option the model weighs every turn. Prefer extending an existing tool, or a docs link the agent loads and searches on demand ([seeing like an agent](https://claude.dev/blog/seeing-like-an-agent/)).
- **Shape to observed ability:** read transcripts for misuse; a tool the model cannot call correctly is a design bug, not a prompt bug. Retire or reshape tools as models improve (a flat todo list became a task tool with dependencies once subagents shared it).

## 3. Context Management
- **Pruning:** Remove irrelevant history to save tokens.
- **Summarization:** Compress long histories periodically.
- **Retrieval:** Give the agent search tools (grep, glob, a docs index) so it builds its own context; add a RAG pre-fetch only where search cannot reach, such as a corpus outside the workspace.

## 4. Architecture Patterns
- **ReAct:** Thought -> Action -> Observation loop.
- **Routing:** Use small models to route to specialized agents.
- **HITL:** Require human approval for destructive tool calls.

## 5. Security & Testing
- **Injection:** Sanitize all untrusted inputs before inclusion in prompts.
- **Least Privilege:** Limit tool permissions to the absolute minimum.
- **Evaluation:** Use LLM-as-a-judge or deterministic tests for tool outputs.

## 6. Prompt Caching
A cache hit needs a byte-identical prefix, so order and stability decide cost and latency ([prompt caching is everything](https://claude.dev/blog/lessons-from-building-claude-code-prompt-caching-is-everything/)).

| Rule | Breaks the cache when violated |
|---|---|
| Static first: system prompt and tools, then project instructions, then session context, then messages | a timestamp or per-user value near the top invalidates everything after it |
| Deliver changed facts as a message (a `<system-reminder>`-style block), not a system-prompt edit | every edit re-bills the whole prefix |
| Keep the tool set constant for the session; model modes (plan mode) as tools; use deferred-loading stubs for optional tools | adding or removing a tool mid-conversation |
| Do not switch models mid-session; hand the work to a subagent on the other model | the new model has no cache for the prefix |
| Side calls (compaction, summaries, forks) reuse the parent's exact system prompt, tools, and context | a fork with "slightly different" parameters pays full price |

Track cache-hit rate per session as a production metric and alert on drops like an availability incident.

## References
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
