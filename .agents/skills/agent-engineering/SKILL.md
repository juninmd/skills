---
name: agent-engineering
description: "Comprehensive Agent Engineering covering AI Agent Development, MCP, Context Management, Observability, and Security."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, replace, run_shell_command]
---

# Agent Engineering

Expert methodology for designing, building, and securing autonomous AI agents and Multi-Agent Systems. This skill unifies prompt engineering, tool integration, Model Context Protocol (MCP), context memory management, observability, and OWASP security for LLMs.

**USE FOR:**
- Crafting structured system prompts, agent personas, and strict JSON schemas for tools.
- Designing multi-agent systems and routing logic (e.g., using LangGraph or custom orchestrators).
- Building Model Context Protocol (MCP) servers and tools.
- Managing long-running agent context (sliding windows, summarization, RAG).
- Securing agents against prompt injection and supply chain risks (OWASP LLM Top 10).
- Instrumenting agent loops for tracing, testing, and evaluation (LLM-as-a-judge).
- Designing type-safe agent tools using branded types and schema inference.

**DO NOT USE FOR:**
- General application backend development (use `backend-node` or `backend-python`).
- Training or fine-tuning underlying Large Language Models (LLMs).

**INVOKES:**
- Prompt engineering techniques, JSON Schema generation, testing, and profiling tools.

## Core Principles
1. **Deterministic Tools:** Design tools with strict inputs/outputs to guide the LLM effectively.
2. **Context Efficiency:** Prune and summarize context proactively; token limits are a hard constraint.
3. **Defense in Depth:** Treat all LLM inputs as untrusted; isolate tool execution environments.
4. **Observable Reasoning:** Instrument the "thought" loop; log prompts, responses, and tool calls for debugging.

## Implementation Guides
Refer to these specific domains for deep-dive instructions:
- [Agent Development & Orchestration](references/agent-development.md)
- [Model Context Protocol (MCP)](references/mcp-builder.md)
- [Context & Memory Management](references/context-memory.md)
- [Agent Security & OWASP](references/agent-security.md)
- [Observability & Testing](references/agent-testing.md)

## Checklist
- [ ] Define the agent's boundaries, tools, and handoff criteria before implementation.
- [ ] Implement strict validation for all tool inputs (e.g., using Zod or Pydantic).
- [ ] Ensure Human-In-The-Loop (HITL) for any destructive actions.
- [ ] Setup tracing for the agent's core decision loop.
