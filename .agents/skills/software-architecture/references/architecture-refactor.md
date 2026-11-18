# Architecture Audit and Deepening Workflow

Open when hunting shallow modules, naming where the architecture causes friction, and refactoring toward deep modules.

## Contents

- Scope Before Scanning
- Discovery and Friction Scanning
- Candidate Identification Rubric
- Deletion Test Execution
- Stakeholder Review and Decision Recording
- Implementation and Test Modernization

## Scope Before Scanning

Deepening pays off where code changes next, so pick the area before you read anything:

1. **The user's direction wins.** A named module, subsystem, or pain point is the scope; skip hot-spot inference.
2. **Otherwise infer hot spots** from history. If changes are scattered with no cluster, widen the scan instead of forcing one.
3. **Read the recorded model first.** Open the glossary (`CONTEXT.md`, `GLOSSARY.md`) and ADRs (`docs/adr/`) for the area. They supply the vocabulary candidates must use and the decisions you must not quietly reopen.

## Discovery and Friction Scanning

Look where churn and confusion concentrate:

1. **Churn:** run `git log --oneline -n 100` and list files and packages edited again and again.
2. **File hopping:** follow a common workflow. If understanding one feature means opening many tiny single-function files, note it.
3. **Forwarders:** find classes or controllers whose methods mirror a database or service call one-to-one, adding no validation or transformation.
4. **Untestable surfaces:** flag code with no tests, or whose tests reach behavior only by mocking internals.

## Candidate Identification Rubric

| Smell | Signal | Deepening move |
|---|---|---|
| **Shallow Facade** | The class exposes only getters or 1:1 forwarding calls | Fold it into the core domain handler |
| **Scattered Business Logic** | Several callers each run the same 4-step sequence | Move the sequence behind one entry point in the module that owns it |
| **Leaky Seam** | Callers build and drive database or HTTP transport objects themselves | Add a port at the seam and hide transport in an injected adapter |
| **Fragmented Unit Tests** | Tests mock internal middlemen instead of asserting public outcomes | Delete the pass-through tests; test behavior across the module interface only |

## Deletion Test Execution

For each candidate, imagine deleting it and inlining its work into every caller:

| Outcome | Meaning | Action |
|---|---|---|
| Complexity disappears and callers stay simple | The module was a pass-through | Delete or inline it; wire callers straight to what it wrapped |
| Complexity returns, copied into N callers | The module earns its place | Keep it; consider pulling more caller orchestration inside |

## Stakeholder Review and Decision Recording

1. Offer candidates, not designs. Build the HTML report (see [architecture-reports.md](architecture-reports.md)) with before/after diagrams and ask which candidate to explore. Propose no interface until the user chooses.
2. **ADR conflicts:** if a candidate contradicts an existing ADR, say so on that candidate ("contradicts ADR-0007; worth reopening because ..."). Raise it only when the friction justifies revisiting. Never override an ADR silently, and do not list every refactor an ADR rules out.
3. For the chosen candidate, compare competing interfaces (see [interface-exploration.md](interface-exploration.md)).
4. Record decisions as they form, not at the end (see [domain-modeling.md](domain-modeling.md)):
   - The deepened module carries a concept the glossary lacks: add the term now.
   - Discussion sharpened a fuzzy term: update its entry now.
   - A candidate was rejected for a durable reason a later reviewer would need: offer an ADR so nobody proposes it again. Skip temporary reasons such as "not now".
   - A decision changes long-term conventions: write the ADR in `docs/adr/`.

## Implementation and Test Modernization

1. Build the new interface behind backwards-compatible adapters, or on an atomic branch.
2. Write thorough tests against the new public interface (see [deep-modules.md](deep-modules.md)).
3. Move callers onto it.
4. Delete the old shallow modules and their mock-heavy unit tests.
