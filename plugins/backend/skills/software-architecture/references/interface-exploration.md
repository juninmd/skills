# Interface Exploration and Multi-Design Comparison

Open when evaluating competing public interfaces for a candidate module, exploring radically different API shapes, and comparing design leverage.

## Contents

- Design Exploration Rationale
- Framing the Problem Space
- Generating Competing Candidates
- Evaluation Criteria
- Selection and Synthesis

## Design Exploration Rationale

Initial interface ideas tend to reflect the internal implementation structure rather than the perspective of external callers. Exploring distinct, competing designs reveals trade-offs in cognitive load, flexibility, and testability before concrete code is locked in.

## Framing the Problem Space

Before generating proposals, establish the concrete operational constraints:

1. **Invariants and Guarantees:** What must remain true across every state mutation?
2. **Caller Usage Scenarios:** What are the 2-3 most common workflows? What edge-case paths exist?
3. **Dependency Classification:** Which dependencies cross external network seams versus in-process calculations?

## Generating Competing Candidates

Author at least three distinct interface paradigms for the same functional capability:

| Candidate Strategy | Design Optimization | Typical Shape |
|---|---|---|
| **Minimalist** | Lowest cognitive load; 1-2 primary entry points | A single execution method taking a typed intent payload; implementation manages all sequencing |
| **Composable / Fluent** | Maximum caller expressiveness and configuration | Builder pattern or pipeline stages with combinable operator methods |
| **Task-Oriented** | Common case is a single one-liner; advanced case exposes fine-grained overrides | Sane defaults for 90% of invocations with optional configuration bags |

Each candidate interface must define:
- Type signatures and argument shapes
- Handling of asynchronous sequencing and cancellations
- Error taxonomy and recovery contracts
- Concrete usage example illustrating a standard caller interaction

## Evaluation Criteria

Compare the competing designs against architectural properties:

- **Interface Depth:** How much caller orchestration is eliminated by the module?
- **Error Locality:** Do invalid combinations fail at compile time or at runtime?
- **Cognitive Overhead:** How many concepts must a developer understand to write a basic invocation?
- **Testing Ergonomics:** Does the interface accept in-memory test adapters without polluting the public API?

## Selection and Synthesis

Select the design that maximizes depth and locality for the primary usage path. If individual elements from different proposals complement each other cleanly, synthesize them into a unified interface rather than compromising with unprincipled middle-ground abstractions.
