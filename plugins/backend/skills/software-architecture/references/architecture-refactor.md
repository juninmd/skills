# Architecture Audit and Deepening Workflow

Open when scanning a codebase for shallow modules, identifying architectural friction, and executing structural refactorings toward deep modules.

## Contents

- Scope Before Scanning
- Discovery and Friction Scanning
- Candidate Identification Rubric
- Deletion Test Execution
- Stakeholder Review and Decision Recording
- Implementation and Test Modernization

## Scope Before Scanning

Deepening pays off where the code will change next, so decide where to look before looking:

1. **User direction wins.** If the user named a module, subsystem, or pain point, scope the scan to it and skip hot-spot inference.
2. **Otherwise infer hot spots** from history (below). If churn is scattered with no clear cluster, widen the net instead of forcing one.
3. **Read the recorded model first.** Open the glossary (`CONTEXT.md`, `GLOSSARY.md`) and any ADRs (`docs/adr/`) covering the scoped area. They name the concepts candidates should use and the decisions not to re-litigate silently.

## Discovery and Friction Scanning

Focus exploration where architectural churn generates the highest friction:

1. **Frequent Churn Areas:** Inspect recent git history (`git log --oneline -n 100`) to find files and packages subject to repeated modification.
2. **Multi-File Bouncing:** Trace common workflows where understanding a single feature requires navigating across multiple tiny, single-function files.
3. **Pervasive Forwarders:** Identify classes or controllers whose method signatures directly mirror and forward to underlying database or service calls without validation or transformation.
4. **Untestable Surfaces:** Note areas with no tests, or tests that can only reach behavior by mocking internals.

## Candidate Identification Rubric

| Architectural Smell | Signal | Deepening Strategy |
|---|---|---|
| **Shallow Facade** | A class only exposes getters or 1:1 forwarding calls | Collapse the facade into the core domain handler |
| **Scattered Business Logic** | Multiple callers independently coordinate the same 4-step sequence | Push the multi-step sequence inside the receiving module behind a single entry point |
| **Leaky Seam** | Callers configure and invoke internal database or HTTP transport objects directly | Introduce a port at the seam; encapsulate transport in an injected adapter |
| **Fragmented Unit Tests** | Tests mock internal intermediaries rather than asserting on public outcomes | Delete pass-through unit tests; test behavior exclusively across the module interface |

## Deletion Test Execution

For every candidate module, imagine deleting it and inlining its work into the callers:

| Result | Meaning | Action |
|---|---|---|
| Complexity vanishes; callers get no harder | It was a pass-through | Delete or inline it; connect callers directly |
| Complexity reappears, duplicated across N callers | It is earning its keep | Keep it; consider deepening it further by pulling caller orchestration inside |

## Stakeholder Review and Decision Recording

1. Present candidates, not designs. Generate the HTML report (see [architecture-reports.md](architecture-reports.md)) with before/after diagrams, then ask which candidate to explore. Do not propose interfaces until the user picks one.
2. **ADR conflicts:** when a candidate contradicts an existing ADR, say so on the candidate ("contradicts ADR-0007; worth reopening because ..."). Raise it only when the friction is real enough to justify revisiting; never override an ADR silently, and never list every refactor an ADR forbids.
3. For the chosen candidate, explore competing interfaces (see [interface-exploration.md](interface-exploration.md)).
4. Record decisions as they crystallize, not at the end (see [domain-modeling.md](domain-modeling.md)):
   - A deepened module named after a concept missing from the glossary: add the term now.
   - A fuzzy term sharpened in discussion: update its entry now.
   - A candidate rejected for a load-bearing reason a future reviewer would need: offer an ADR so the same refactor is not re-suggested. Skip ephemeral reasons ("not now").
   - A decision that alters long-term conventions: write the ADR in `docs/adr/`.

## Implementation and Test Modernization

1. Implement the new interface with backwards-compatible adapters or in an atomic branch.
2. Author comprehensive tests targeting the new public interface (see [deep-modules.md](deep-modules.md)).
3. Migrate callers to the unified interface.
4. Delete the deprecated shallow modules and their mock-heavy unit tests.

Adapted from mattpocock/skills (MIT, © 2026 Matt Pocock).
