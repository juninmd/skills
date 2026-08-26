---
name: software-architecture
description: |
  Improve codebase structure and system design with evidence-based boundaries. Use for deciding whether something is a separate service or stays a module, modularization, dependency direction, circular dependencies, technical debt, distributed systems, failure modes, and ADRs.
---

# Software Architecture

## Preflight
```bash
npx dependency-cruiser --validate .dependency-cruiser.js src 2>/dev/null
git log --format= --name-only --since='6 months ago' | sort | uniq -c | sort -rn | head
```

Map what exists with `codebase-mapping` first. Never redesign a system you have only read about.

## Workflow
1. Map what exists — entry points, dependencies, ownership, runtime boundaries, change pain — with `codebase-mapping`. Never redesign a system you have only read about.
2. State the invariant or failure the design must improve, and collect the evidence: coupling metrics, test times, latency, incident history.
3. Compare the smallest viable options against migration cost, operational cost, and reversibility. Reversibility is the tiebreaker.
4. Protect behavior with characterization tests before moving a boundary — `legacy-refactoring` covers writing them.
5. Move one boundary at a time and verify dependency direction, behavior, and deployability after each.
6. Record an ADR only when the decision has real alternatives or long-lived consequences.

## Split or Keep
A split you cannot justify with evidence is a distributed version of the same problem, plus a network.

| Signal | Split | Keep |
|---|---|---|
| Change pain | Changes constantly cross the seam | Concentrated in one module |
| Deploy coupling | Two teams blocked on one release | One team owns both sides |
| Scaling shape | Genuinely different load or hardware profile | Same profile |
| Failure isolation | One side must survive the other's outage | They fail together anyway |
| Data ownership | Clear, non-overlapping | Shared tables, shared transactions |
| The real friction | — | Slow tests, unclear naming, missing types — **splitting spreads the defect** |

## Breaking a Dependency Cycle

| Move | When |
|---|---|
| Invert one edge behind an interface **owned by the lower layer** | The dependency is one-directional in meaning, wrong in code |
| Extract the shared concept into a third module both depend on | Both genuinely need the same thing |
| Merge the two modules | The cycle exists because they are one concept |

Deleting the import without moving the concept just hides the cycle behind a runtime lookup.

Dependency direction is a claim only if a check enforces it — encode allowed edges as a lint or build rule (`dependency-cruiser`, `import-linter`, `go-arch-lint`) that fails on a new violation. Review catches the first violation and never the second.

## Distributed Designs Must Answer All Six

| Question | Failing to answer means |
|---|---|
| Retries | a duplicate every time the network hiccups |
| Idempotency | those duplicates become double charges |
| Ordering | events applied out of sequence, silently |
| Timeout | one slow dependency exhausts every caller's threads |
| Consistency | reads that contradict the write that just returned |
| Observability | an outage you can only describe as "it's slow" |

Choose the broker by requirement, never by habit: log-structured (Kafka) for high throughput and replay, routing-oriented (RabbitMQ) for complex per-message delivery rules.

## Reference Routing
- Practical architecture cases: [real-world-cases.md](references/real-world-cases.md)
- Design principles: [design-principles.md](references/design-principles.md)
- Distributed systems: [distributed-architecture.md](references/distributed-architecture.md), [distributed-toolkit.md](references/distributed-toolkit.md)
- Intake templates for design requests and health reports: [intake-templates.md](references/intake-templates.md)
- Desktop main/renderer applications: use the `electron-architecture` skill.

## Stop
- The split cannot be justified with change-pain evidence. It would be the same problem, distributed, plus a network.
- A distributed design leaves any of the six questions unanswered. Answer them before building it.
- A boundary move and a behavior change are in the same step. Sequence them; the failure would be unattributable.

## Rules
- Prefer fewer, deeper modules over layers that only forward calls. A layer that adds no decision adds only a hop and a file to open.
- Do not introduce a service, queue, cache, or abstraction without a measured problem. Every one of them is a permanent operational cost.
- The design that is easy to undo beats the design that is slightly better and permanent.
- An ADR records the alternatives **and why they were rejected**. Without that, it is a changelog entry pretending to be a decision.
- Moving a boundary and changing behavior in one step makes the failure unattributable; sequence it with `incremental-delivery` and `migration-engineering`.

## Checklist
- [ ] Current structure mapped from the code, with change-pain evidence.
- [ ] The invariant or failure the design improves is stated.
- [ ] Split-or-keep decided against evidence, not instinct.
- [ ] Dependency direction enforced by a check, not by intention.
- [ ] Distributed designs answer all six questions.
- [ ] Migration is incremental and reversible; one boundary moves at a time.
