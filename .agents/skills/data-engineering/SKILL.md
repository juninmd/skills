---
name: data-engineering
description: |
  Diagnose and improve databases, caches, migrations, and vector-search storage. Use for PostgreSQL, MongoDB, Redis, query plans, indexes, locks, rollback, backups, and vector database performance.
---

# Data Engineering

## Workflow
1. Identify engine/version, workload, data size, latency target, availability requirement, and backup state.
2. Collect read-only evidence first: query plan, locks, waits, index use, cardinality, cache metrics, or vector recall/latency.
3. Form one hypothesis and test it on representative data before changing schema or configuration.
4. For migrations, use expand/migrate/contract phases with backward-compatible application releases.
5. Verify correctness, rollback, latency, resource use, and replication/consumer lag after the change.

## Reference Routing
- Operational intake and DBA checks: [FORMS.md](references/FORMS.md)
- PostgreSQL, MongoDB, Redis, query, index, and backup guidance: [REFERENCE.md](references/REFERENCE.md)

## Rules
- Never infer index value without a query plan and realistic selectivity.
- Never run destructive SQL, production migrations, cache flushes, or failovers without approval.
- Backups are not a rollback plan until restore is tested.
- For vector search, record embedding model/version, dimensions, metric, chunking, metadata filters, and recall evaluation.

## Checklist
- [ ] Baseline and success metric are recorded.
- [ ] Change and recovery paths are tested.
- [ ] Correctness and performance are measured.
