# Deep Modules and Seam Architecture

Open when drawing module boundaries, judging interface depth, placing testable seams, or merging shallow pass-through pieces into cohesive units.

## Contents

- Architectural Glossary
- Deep Modules vs. Shallow Modules
- Architectural Invariants
- Dependency Categories across Seams
- Seam Discipline and Adapter Grounding

## Architectural Glossary

Use these terms the same way every time:

- **Module:** any unit with an interface and an implementation (function, class, package, slice). Avoid vague stand-ins such as "unit", "component", or "service".
- **Interface:** everything a caller must know to use the module correctly: signatures, invariants, ordering rules, error modes, required configuration, latency traits.
- **Implementation:** the logic hidden inside the module.
- **Depth:** leverage delivered at the interface. A **deep** module hides a lot of capability behind a small, clean interface. A **shallow** one has an interface nearly as complex as what it wraps.
- **Seam:** a spot where behavior can be changed or swapped without editing the code at that spot. The external seam holds the module's interface; a module may also keep internal seams private to itself and its own tests. A seam is a substitution point, not just a boundary, and where you place it is a separate decision from what sits behind it.
- **Adapter:** a concrete implementation of an interface across a seam (an in-memory fake, a Postgres repository).
- **Leverage:** capability gained per unit of interface learned. One deep implementation pays off across many callers and tests.
- **Locality:** domain rules, invariant enforcement, and bug fixes living in one place.

## Deep Modules vs. Shallow Modules

```
┌─────────────────────────────────┐
│     Small, Simple Interface     │  ← few methods, short parameter lists
├─────────────────────────────────┤
│                                 │
│       Deep Implementation       │  ← state, validation, caching, I/O hidden
│                                 │
└─────────────────────────────────┘

                VS.

┌─────────────────────────────────┐
│        Large Interface          │  ← many methods, internal types exposed
├─────────────────────────────────┤
│       Thin Implementation       │  ← pass-through wrappers, delegation
└─────────────────────────────────┘
```

Check any interface against three questions:
1. Can it have fewer entry points?
2. Do callers have to run a multi-step sequence the module could run itself?
3. Do internal data shapes leak across the seam?

## Architectural Invariants

1. **Depth belongs to the interface.** Measure it as behavior reached per concept learned, not by line count. A deep module may split internally into small swappable helpers; they stay private and never widen the interface.
2. **The interface is the test surface.** Callers and tests cross the same seam. If a test must reach into private internals to gain confidence, the interface is badly factored.
3. **The deletion test.** Picture the module gone. If the complexity vanishes, it was an empty wrapper. If the complexity spreads across callers, the module was earning its place.

## Dependency Categories across Seams

When deepening a cluster, sort its dependencies first. The category decides how tests cross the seam:

| Category | Trait | Seam and test strategy |
|---|---|---|
| **In-Process** | Pure computation or in-memory state, no I/O | Merge the modules; test through the new interface with no adapters |
| **Local-Substitutable** | Swappable for a fast local double (in-memory SQLite/PGLite, temp filesystem) | Internal seam; run the suite against the local substitute |
| **Owned Remote Services** | Your own APIs, microservices, or databases across the network | Ports & Adapters: the deep module owns domain logic, transport comes in via an adapter |
| **External Third-Party** | Outside vendors (payment gateways, messaging providers) | Port at the seam; production uses the vendor SDK adapter, tests use a bounded fake |

## Seam Discipline and Adapter Grounding

- **Two-adapter rule:** one adapter means a hypothetical seam: indirection without leverage. Justify a seam with at least two real adapters (say, the production client and an in-memory double).
- **Internal vs. external:** internal seams stay private. Never export one just to please a test runner.
- **Replace, don't layer:** when shallow pieces collapse into a deep module, delete the tests that covered each pass-through layer and write new ones against the unified public interface.
- **Tests outlive refactors:** assert observable outcomes through the interface. A test that breaks when only the implementation changes is probing past the seam.
