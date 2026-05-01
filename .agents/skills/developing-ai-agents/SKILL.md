---
name: developing-ai-agents
description: "Prompts, tool calling, context. Triggers: prompts."
argument-hint: "[agent-name/project] [options]"
---
---

# Developing AI Agents

This skill defines the standards for building autonomous AI agents that interact with external tools and manage complex context workflows.

## Instructions
1.  **System Prompts & Personas:**
    *   **Clarity:** Write concise, objective system prompts. Avoid generic platitudes.
    *   **Constraints:** Clearly define what the agent *cannot* do.
    *   **Format:** State output requirements explicitly (e.g., "Output ONLY valid JSON").
2.  **Tool Calling (Function Calling):**
    *   **Strict Typing:** Define input parameters with strict schemas (e.g., using Zod or JSON Schema).
    *   **Error Handling:** Agents must handle tool errors gracefully. Never expose raw stack traces to the LLM without context.
    *   **Descriptions:** Write detailed descriptions for each tool parameter, as this is the primary way the LLM understands how to use the tool.
3.  **Context Window Management:**
    *   **Pruning:** Remove old or irrelevant messages from the context window to save tokens and prevent distraction.
    *   **Summarization:** Periodically summarize the conversation history for long-running tasks.
    *   **Retrieval:** Use RAG (Retrieval-Augmented Generation) for injecting knowledge rather than hardcoding it in the system prompt.
4.  **Frameworks vs. Raw APIs:**
    *   Prefer lightweight wrappers or raw SDKs (OpenAI, Anthropic) over heavy abstractions unless building multi-agent systems (e.g., LangChain, AutoGen, CrewAI).

## Common Patterns
*   **ReAct (Reasoning and Acting):** Force the agent to output a "Thought" before taking an "Action".
*   **Routing:** Use a fast, cheap model to route user requests to specialized, more capable agents.
*   **Human-in-the-Loop (HITL):** Require human approval for destructive actions (e.g., executing arbitrary bash commands or deleting database rows).

## Evaluation & Testing
*   **Deterministic Tests:** Test tool implementations completely independently of the LLM.
*   **Eval Frameworks:** Use LLM-as-a-judge or exact-match assertions to evaluate the agent's behavior over a dataset of test cases.

## Security
*   **Prompt Injection:** Sanitize user inputs and isolate the context of external retrieved data.
*   **Least Privilege:** Tools should run with the absolute minimum permissions necessary.

## Checklist

- [ ] Define the agent boundary, tools, and handoff criteria before writing prompts or code.
- [ ] Validate tool behavior independently of the model whenever deterministic checks exist.
- [ ] Review prompt injection, data isolation, and least-privilege risks before shipping.

## References

- [Workspace Agent Conventions](../../../AGENTS.md)
- [Model Context Protocol](https://modelcontextprotocol.io/)
