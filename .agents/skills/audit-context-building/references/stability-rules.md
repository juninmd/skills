# Stability, Consistency, and Subagents

Ensuring anti-hallucination and global coherence in audits.

## 1. Stability Rules
- **Evidence First:** Never reshape evidence to fit assumptions. Update the model and state corrections explicitly.
- **Fact Anchoring:** Periodically summarize core invariants, state relationships, and roles.
- **Uncertainty:** Avoid vague guesses. Use "Unclear; need to inspect X" instead of "It probably...".
- **Cross-Reference:** Connect new insights to previous flows and invariants constantly.

## 2. Subagent Usage
Spawning subagents (e.g., `function-analyzer`) is encouraged for:
- Dense/complex functions.
- Long control-flow chains.
- Cryptographic or mathematical logic.
- Complex state machines.

Subagents must follow the same micro-first rules and return summaries for integration into the global model.
