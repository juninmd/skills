# Audit Orientation and Phases

Structured reasoning for building deep codebase context before security auditing.

## 1. Phase 1 — Initial Orientation (Bottom-Up Scan)
Map the system without assuming behavior:
- **Major Modules:** Identify files/contracts.
- **Entrypoints:** Note public/external interfaces.
- **Actors:** Users, owners, relayers, oracles.
- **State:** Storage variables, state structs, cells.

## 2. Phase 2 — Function Analysis
Every non-trivial function receives full micro-analysis. Refer to [Function Analysis Guidelines](function-analysis.md) for the block-by-block checklist.

## 3. Phase 3 — Global System Understanding
Reconstruct the system from local insights:
- **Invariant Reconstruction:** Map state reads/writes across functions.
- **Workflow Reconstruction:** Identify end-to-end flows (deposit, withdraw, lifecycle).
- **Trust Boundary Mapping:** Identify untrusted input paths.
- **Fragility Clustering:** Note high-complexity functions or many-assumption zones.

## 4. Relationship to Other Phases
This skill runs **before** vulnerability discovery, triage, or report writing. It is for **pure context building** only.
