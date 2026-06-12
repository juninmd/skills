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

## 3. Context Management
- **Pruning:** Remove irrelevant history to save tokens.
- **Summarization:** Compress long histories periodically.
- **Retrieval:** Use RAG for external knowledge injection.

## 4. Architecture Patterns
- **ReAct:** Thought -> Action -> Observation loop.
- **Routing:** Use small models to route to specialized agents.
- **HITL:** Require human approval for destructive tool calls.

## 5. Security & Testing
- **Injection:** Sanitize all untrusted inputs before inclusion in prompts.
- **Least Privilege:** Limit tool permissions to the absolute minimum.
- **Evaluation:** Use LLM-as-a-judge or deterministic tests for tool outputs.

## References
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
