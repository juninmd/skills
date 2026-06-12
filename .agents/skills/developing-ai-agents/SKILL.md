---
name: developing-ai-agents
description: "Developing AI Agents for Crafting structured, Defining strict, Implementing context via Prompt engineering, tool selection, and context-efficiency strategies."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Developing AI Agents

Expert guidance for building autonomous agents that interact with external tools and manage complex context workflows.

**USE FOR:**
- Crafting structured system prompts and agent personas.
- Defining strict JSON schemas for tool calling (function calling).
- Implementing context management strategies (pruning, summarization, RAG).
- Designing multi-agent systems and routing logic.
- Building agents using the Model Context Protocol (MCP).

**DO NOT USE FOR:**
- Training or fine-tuning Large Language Models.
- General frontend development for AI applications.
- Statistical data analysis or traditional ML pipelines.

**INVOKES:**
- Prompt engineering, tool selection, and context-efficiency strategies.

## Methodology and Guidelines
Implementation details for prompt clarity, tool calling, and context management are documented in:
- [AI Agent Development Guidelines](references/agent-development.md)

## Core Principles
1. **Tool Integrity:** Define parameters with strict schemas and high-signal descriptions.
2. **Safety First:** Implement Human-in-the-loop (HITL) for any destructive actions.
3. **Context Efficiency:** Proactively prune irrelevant history to maximize token availability.

## Checklist
- [ ] Define agent boundary, tools, and handoff criteria before writing code.
- [ ] Validate tool behavior independently of the model using deterministic tests.
- [ ] Review prompt injection, data isolation, and least-privilege risks.
