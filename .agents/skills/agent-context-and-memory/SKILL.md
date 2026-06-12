---
name: agent-context-and-memory
description: "Agent Context & Memory Management for Designing context, Implementing pruning, Building hierarchical via developing-ai-agents, administrating-databases."
license: MIT
metadata:
  version: 1.0.0
  token_budget_exception: "Core memory lifecycle requires threat, retention, and retrieval guidance."
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file]
---

# Agent Context & Memory Management

Expert guidance for managing agent state, memory, and context lifecycle in systems with 1M+ token windows. Performance falloff occurs after ~700K tokens; active management required.

**USE FOR:**
- Designing context lifecycle: growth → saturation → falloff recovery.
- Implementing pruning strategies (recency bias, importance weighting, irrelevance detection).
- Building hierarchical summarization for long-running agents.
- Integrating RAG (Retrieval-Augmented Generation) for agent memory.
- Sliding window buffers: maintaining context coherence across chunk boundaries.
- Token budget constraints: real-time tracking and tool selection under limits.
- Long-running agents (>6 hours): state persistence, resumption, recovery.

**DO NOT USE FOR:**
- Database design and optimization (use `administrating-databases`).
- Frontend state management (use `developing-react-native`, `react-dev`).
- Performance optimization (use `performance-profiling`).

**INVOKES:**
- `developing-ai-agents` for agent loop design.
- `administrating-databases` for state persistence.
- `observability-patterns` for token accounting and monitoring.

## Context Lifecycle (1M Token Window)

**Growth Phase (0–500K tokens):**
- Agent accumulates observations, reasoning, tool results.
- Full context available; no performance penalty.
- Action: Monitor token growth rate; prepare pruning strategy.

**Saturation Phase (500–700K tokens):**
- Context approaching limits; model latency increases.
- Reasoning quality begins degradation (~20% slower).
- Action: Begin pruning or summarization.

**Falloff Phase (>700K tokens):**
- Model loses coherence; earlier context "forgotten."
- Reasoning quality collapses; token cost per decision rises.
- Action: Aggressive pruning, hierarchical summarization, or context reset.

**Recovery:**
- Use RAG to retrieve relevant historical context on-demand.
- Maintain separate summary layer: compress falloff context to <50 tokens.
- Resume from checkpoint: load previous agent state, attach summary.

## Pruning Strategies

1. **Recency Bias** — Keep last N interactions; discard older.
   - Cost: O(1) deletion.
   - Risk: Loses long-term patterns.
   - Use for: Short-term tasks, high-volume interactions.

2. **Importance Weighting** — Score observations by relevance; prune low-scoring.
   - Cost: O(n log n) per pruning cycle.
   - Risk: Scoring heuristic may be wrong.
   - Use for: General-purpose agents.

3. **Irrelevance Detection** — Use embedding similarity; remove observations unrelated to current goal.
   - Cost: O(n) with embedding calls (expensive).
   - Risk: Removes surprising but relevant context.
   - Use for: Goal-driven agents.

## RAG for Agent Memory

- **Chunking:** Split historical context into semantic chunks.
- **Retrieval:** On-demand fetch relevant chunks based on current query.
- **Injection:** Prepend retrieved chunks to current context.
- **Advantage:** Full context available but memory-efficient.

## Sliding Window Buffers

- **Overlap:** Keep 20% overlap between consecutive chunks to maintain coherence.
- **Edge Handling:** On chunk boundary, repeat last N tokens to preserve state.
- **Validation:** Test that sliding window doesn't lose critical decision context.

## Checklist

- [ ] Context lifecycle phases identified; growth rate monitored.
- [ ] Pruning strategy chosen (recency, importance, irrelevance); falloff handled.
- [ ] Token accounting real-time; agent tracks token budget before each tool call.
- [ ] RAG system (if used) has latency <500ms; retrieval tested under load.
- [ ] Summarization strategy defined (hierarchical, rolling summary, or hybrid).
- [ ] Sliding window tested; coherence preserved across chunk boundaries.
- [ ] Long-running agent checkpointing implemented; resumption tested.
- [ ] Falloff recovery tested: agent continues reasoning after context truncation.
