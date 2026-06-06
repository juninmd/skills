---
name: orchestrating-multi-agent-systems
description: |
  **AGENTIC SKILL** - Compose and orchestrate multi-agent systems with LangGraph, CrewAI, and MCP ecosystems.
  USE FOR: agent composition patterns, framework selection, state management, message routing, supervisor/worker coordination, cost optimization, A2A protocol (agent-to-agent).
  DO NOT USE FOR: single-agent development (use developing-ai-agents), MCP server building (use developing-mcp-servers), performance optimization (use performance-profiling).
  INVOKES: developing-ai-agents, developing-mcp-servers, agent-cost-benchmarking, agent-observability-and-testing.
license: MIT
metadata:
  version: 1.0.0
  token_budget_exception: "Multi-agent orchestration requires topology, coordination, and failure controls."
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Orchestrating Multi-Agent Systems

Professional guidance for designing and implementing multi-agent workflows using LangGraph, CrewAI, and MCP orchestration patterns. 57% of organizations deploy multi-step agent workflows in production.

**USE FOR:**
- Selecting between LangGraph (Apr 2026 v0.4 with HITL), CrewAI (Mar 2026 enterprise), and other frameworks.
- Designing agent composition patterns: supervisor-worker, fan-out, pipeline, debate, swarm.
- Managing agent state, message routing, and conditional branching across agents.
- Building hierarchical agent systems (top-level coordinator → specialized agents).
- Orchestrating MCP server discovery and dynamic capability negotiation.
- Implementing agent-to-agent (A2A) protocols for delegation and coordination.
- Cost profiling and framework selection based on latency/token efficiency tradeoffs.

**DO NOT USE FOR:**
- Building single-agent systems (use `developing-ai-agents`).
- Creating MCP servers (use `developing-mcp-servers`).
- Profiling performance (use `performance-profiling`).

**INVOKES:**
- `developing-ai-agents` for individual agent design.
- `developing-mcp-servers` for MCP server integration.
- `agent-cost-benchmarking` for framework selection metrics.
- `agent-observability-and-testing` for coordination validation.

## Framework Comparison (2026)

| Framework | Strengths | Weaknesses | Token Overhead | Use Case |
|-----------|-----------|-----------|---------------|-|
| **LangGraph** | Graph-based, HITL checkpoints, streaming, fine control | Steeper learning curve | 1.0x baseline | Complex coordination, approval flows, advanced routing |
| **CrewAI** | Intuitive crew metaphor, role-based agents, processes | 3x token overhead on simple tasks, less flexible | 3.0x | Teams, sequential workflows, hierarchical orgs |
| **OpenAI SDK** | Simple, official, latest model support | Limited orchestration, expensive API calls | Varies | Single-step agents, chat interfaces |
| **AutoGen** | Multi-modality, code execution, group chat | Complex debugging, slower iteration | 2.5x | Code generation, multi-turn conversation |

## Composition Patterns

1. **Supervisor-Worker** — One coordinator agent routes tasks to specialized agents.
   - Cost: Efficient (router makes 1 decision per batch).
   - Best for: Task-specific experts, clear role boundaries.

2. **Fan-Out Pipeline** — Multiple agents process same input independently; coordinator merges results.
   - Cost: Parallel execution; aggregate cost = sum of agents.
   - Best for: Fact-checking, consensus building, multi-perspective analysis.

3. **Sequential Pipeline** — Output of agent N feeds into agent N+1.
   - Cost: Linear; each agent pays full token cost.
   - Best for: Data transformation chains, progressive refinement.

4. **Debate/Consensus** — Multiple agents argue positions; resolver picks best reasoning.
   - Cost: High (all agents analyze); good for critical decisions.
   - Best for: Security reviews, architecture decisions, high-stakes reasoning.

5. **Swarm** — Leaderless coordination; agents detect opportunities and contribute.
   - Cost: Unpredictable; needs safeguards.
   - Best for: Exploratory tasks, emergent behavior.

## LangGraph Essentials (Apr 2026 v0.4)

- **Graph Topology:** Nodes (agents/tools) + edges (state transitions).
- **State Management:** Shared mutable state; strong consistency within checkpoints.
- **HITL Checkpoints:** Pause execution for human approval; resume with decision.
- **Streaming:** Partial results returned incrementally (LCP optimization).
- **Sub-graphs:** Compose graphs within graphs (hierarchical orchestration).

## MCP Orchestration

- **Server Discovery:** Registry-based or dynamic (filesystem, HTTP).
- **Capability Negotiation:** Agent queries available tools before deciding routing.
- **Version Management:** MCP 1.0 stability; adapters for legacy servers.
- **A2A Protocol:** Agent-to-Agent delegation via Linux Foundation governed protocol.

## Checklist

- [ ] Framework selected based on token cost analysis (LangGraph vs CrewAI tradeoff evaluated).
- [ ] Composition pattern justified (supervisor, pipeline, debate, etc.); cost model documented.
- [ ] State management strategy chosen (shared vs agent-local); consistency guarantees explicit.
- [ ] Message routing logic implemented; edge cases handled (timeout, dead agents, loops).
- [ ] HITL checkpoints defined for high-risk decisions.
- [ ] Cost profiling implemented: per-agent token accounting, framework overhead measured.
- [ ] MCP server discovery operational; fallback if server unavailable.
- [ ] A2A delegation tested; agent handoff and error propagation validated.
- [ ] Orchestration tested under failure scenarios (agent crash, network partition, timeout).
