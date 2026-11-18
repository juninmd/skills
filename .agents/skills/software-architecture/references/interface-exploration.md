# Interface Exploration and Multi-Design Comparison

Open when weighing competing public interfaces for a candidate module, trying very different API shapes, and comparing their leverage.

## Contents

- Design Exploration Rationale
- Framing the Problem Space
- Generating Competing Candidates
- Design It Twice with Parallel Subagents
- Evaluation Criteria
- Selection and Synthesis

## Design Exploration Rationale

A first interface idea usually mirrors the internal structure instead of the caller's view. Comparing distinct designs exposes trade-offs in cognitive load, flexibility, and testability before code hardens.

## Framing the Problem Space

Pin down the concrete constraints before proposing anything:

1. **Invariants and guarantees:** what must hold after every state change?
2. **Caller scenarios:** the 2-3 most common workflows, plus the edge-case paths.
3. **Dependency classes:** which dependencies cross a network seam, and which are in-process computation?

## Generating Competing Candidates

Write at least three genuinely different interface styles for the same capability:

| Strategy | Optimizes for | Typical shape |
|---|---|---|
| **Minimalist** | Lowest cognitive load; 1-2 entry points | One execute method taking a typed intent payload; the module handles all sequencing |
| **Composable / Fluent** | Caller expressiveness and configuration | Builder or pipeline stages with combinable operators |
| **Task-Oriented** | Common case as a one-liner, with fine-grained overrides for advanced use | Sensible defaults covering about 90% of calls, plus optional config bags |

Each candidate must spell out:
- Type signatures and argument shapes
- How async sequencing and cancellation work
- The error taxonomy and recovery contract
- A concrete example of a typical caller interaction

## Design It Twice with Parallel Subagents

The first interface you think of is rarely the best. When subagents are available, produce the candidates in parallel so no design anchors the next:

1. **Share the framing first.** Show the user the constraints, the dependency categories (see [deep-modules.md](deep-modules.md)), and a throwaway code sketch that makes them concrete. Keep working while they read.
2. **Launch 3+ subagents at once.** Give each the same technical brief (paths, coupling, what sits behind the seam, glossary terms) and a different binding constraint:

| Subagent | Constraint |
|---|---|
| 1 | Smallest interface: 1-3 entry points at most, each with maximum leverage |
| 2 | Maximum flexibility: many use cases and extension points |
| 3 | Common caller first: the default case is a one-liner |
| 4 (optional) | Ports and adapters for every cross-seam dependency |

3. **Demand the same five outputs** from each: the interface (types plus invariants, ordering, error modes), a caller example, what stays hidden behind the seam, the dependency and adapter strategy, and where leverage is strong or thin.
4. **Present the designs one by one,** then compare them in prose on depth, locality, and seam placement.

With no subagents, write the candidates sequentially and never revise an earlier one after seeing a later one.

## Evaluation Criteria

Score each design on these properties:

- **Depth:** how much caller orchestration does the module absorb?
- **Error locality:** do invalid combinations fail at compile time or at runtime?
- **Cognitive overhead:** how many concepts must a developer learn for a basic call?
- **Testing ergonomics:** can it take in-memory test adapters without polluting the public API?
- **Refactor survival:** would tests written against it survive an implementation rewrite? If not, they reach past the seam.

## Selection and Synthesis

Pick the design with the most depth and locality on the primary usage path. If pieces of different proposals fit together cleanly, merge them into one interface rather than settling on an unprincipled middle.

Be opinionated: the user wants a pick, not a menu. State the recommended design (or hybrid) and why it wins, and name each rejected framing with the single reason it lost so the next review does not resurrect it.
