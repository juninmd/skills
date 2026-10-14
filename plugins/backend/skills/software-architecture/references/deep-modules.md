# Deep Modules and Seam Architecture

Open when designing module boundaries, evaluating interface depth, placing testable seams, or consolidating shallow pass-through components into cohesive units.

## Contents

- Architectural Glossary
- Deep Modules vs. Shallow Modules
- Architectural Invariants
- Dependency Categories across Seams
- Seam Discipline and Adapter Grounding
- Testability at the Interface
- Deletion Test Protocol

## Architectural Glossary

Use these core architectural terms consistently:

- **Module:** Any unit with an interface and an implementation (function, class, package, or slice). Avoid ambiguous synonyms like "unit", "component", or "service".
- **Interface:** Everything a caller must know to use the module correctly: signatures, invariants, ordering constraints, error modes, configuration requirements, and latency characteristics.
- **Implementation:** The encapsulated logic inside a module.
- **Depth:** Leverage delivered at the interface. A module is **deep** when a substantial volume of capability and complexity sits behind a minimal, clean interface. It is **shallow** when its interface approaches the complexity of its underlying logic.
- **Seam:** A boundary where behavior can be altered or intercepted without modifying call sites. Where to place a seam is a distinct architectural choice.
- **Adapter:** A concrete implementation that satisfies an interface across a seam (e.g. an in-memory test fake or a Postgres repository).
- **Leverage:** The capability gained per unit of interface learned. One deep implementation pays dividends across multiple callers and tests.
- **Locality:** The concentration of domain rules, invariant enforcement, and bug fixes in one cohesive location.

## Deep Modules vs. Shallow Modules

```
┌─────────────────────────────────┐
│     Small, Simple Interface     │  ← Minimal methods, concise parameters
├─────────────────────────────────┤
│                                 │
│       Deep Implementation       │  ← Complex state, validation, caching, I/O hidden
│                                 │
└─────────────────────────────────┘

                VS.

┌─────────────────────────────────┐
│        Large Interface          │  ← Sprawling methods, internal types exposed
├─────────────────────────────────┤
│       Thin Implementation       │  ← Pass-through wrappers, shallow delegation
└─────────────────────────────────┘
```

When evaluating an interface, verify:
1. Can the number of entry points be reduced?
2. Are callers forced to orchestrate multi-step ordering that the module could execute internally?
3. Does the module leak internal data representations across the seam?

## Architectural Invariants

1. **Depth is Measured at the Interface:** A deep module can be internally partitioned into smaller helpers; those helpers simply remain private to the module's implementation.
2. **The Interface is the Test Surface:** Callers and automated tests cross the identical seam. If a test must pierce private internals to establish confidence, the module interface is poorly factored.
3. **The Deletion Test:** Mentally delete the candidate module. If domain complexity disappears, it was merely an empty wrapper. If complexity scatters across callers, the module was earning its place.

## Dependency Categories across Seams

When deepening a cluster of components, categorize its dependencies to determine how testing crosses the seam:

| Category | Characteristic | Seam and Testing Strategy |
|---|---|---|
| **In-Process** | Pure computation, memory state, no I/O | Merge modules directly; exercise via the new interface with zero adapters |
| **Local-Substitutable** | Replaceable with fast local test doubles (in-memory SQLite/PGLite, temp filesystem) | Internal seam; test suite runs against the local substitute |
| **Owned Remote Services** | Internal APIs, microservices, databases across network boundaries | Ports & Adapters: Deep module owns domain logic; transport injected via adapter |
| **External Third-Party** | Third-party systems (payment gateways, messaging vendors) | Port at the seam; production uses client SDK adapter, tests use bounded fake adapter |

## Seam Discipline and Adapter Grounding

- **Two-Adapter Rule:** A single adapter represents a hypothetical seam that adds indirection without leverage. A seam is justified when at least two concrete adapters exist (e.g., production client and in-memory test double).
- **Internal vs. External Seams:** Internal seams remain private to the module implementation. Never export an internal seam solely to satisfy a test runner.
- **Replace, Don't Layer:** When shallow components are collapsed into a deep module, delete obsolete unit tests that checked individual pass-through layers. Author fresh tests targeting the unified public interface.
