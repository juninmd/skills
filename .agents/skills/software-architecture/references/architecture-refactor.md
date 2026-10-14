# Architecture Audit and Deepening Workflow

Open when scanning a codebase for shallow modules, identifying architectural friction, and executing structural refactorings toward deep modules.

## Contents

- Discovery and Friction Scanning
- Candidate Identification Rubric
- Deletion Test Execution
- Stakeholder Review and Decision Recording
- Implementation and Test Modernization

## Discovery and Friction Scanning

Focus exploration where architectural churn generates the highest friction:

1. **Frequent Churn Areas:** Inspect recent git history (`git log --oneline -n 100`) to find files and packages subject to repeated modification.
2. **Multi-File Bouncing:** Trace common workflows where understanding a single feature requires navigating across multiple tiny, single-function files.
3. **Pervasive Forwarders:** Identify classes or controllers whose method signatures directly mirror and forward to underlying database or service calls without validation or transformation.

## Candidate Identification Rubric

| Architectural Smell | Signal | Deepening Strategy |
|---|---|---|
| **Shallow Facade** | A class only exposes getters or 1:1 forwarding calls | Collapse the facade into the core domain handler |
| **Scattered Business Logic** | Multiple callers independently coordinate the same 4-step sequence | Push the multi-step sequence inside the receiving module behind a single entry point |
| **Leaky Seam** | Callers configure and invoke internal database or HTTP transport objects directly | Introduce a port at the seam; encapsulate transport in an injected adapter |
| **Fragmented Unit Tests** | Tests mock internal intermediaries rather than asserting on public outcomes | Delete pass-through unit tests; test behavior exclusively across the module interface |

## Deletion Test Execution

For every candidate component:
- **Hypothesis:** Mentally remove the component from the codebase.
- **If complexity vanishes:** The component was unnecessary overhead; delete it and connect the caller directly.
- **If complexity spreads across callers:** The component was shallow; deepen it by pulling caller orchestration inside its boundary.

## Stakeholder Review and Decision Recording

- Generate an architectural HTML report (see [architecture-reports.md](architecture-reports.md)) comparing candidate architectures with visual before/after diagrams.
- Present competing interface candidates (see [interface-exploration.md](interface-exploration.md)).
- If a refactoring decision establishes or alters long-term conventions, record an Architecture Decision Record (ADR) in `docs/adr/`.

## Implementation and Test Modernization

1. Implement the new interface with backwards-compatible adapters or in an atomic branch.
2. Author comprehensive tests targeting the new public interface (see [deep-modules.md](deep-modules.md)).
3. Migrate callers to the unified interface.
4. Delete the deprecated shallow modules and their mock-heavy unit tests.
