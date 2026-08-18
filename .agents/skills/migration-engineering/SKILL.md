---
name: migration-engineering
description: |
  Move schemas, data, APIs, and dependencies to a new shape without downtime or data loss. Use for expand/contract rollouts, backfills, dual writes, codemods, framework upgrades, cutover planning, and rollback strategy.
---

# Migration Engineering

## Workflow
1. Write down the current shape, the target shape, and every reader and writer that touches them.
2. Split the change into expand, migrate, and contract phases that each ship and revert independently.
3. Expand: add the new shape alongside the old one, defaulted and nullable, and deploy without changing behavior.
4. Migrate: dual-write both shapes, backfill history in bounded batches, then flip reads behind a flag.
5. Reconcile: compare old and new for a full traffic cycle and prove the difference is zero before contracting.
6. Contract: remove writes, then reads, then the old shape, once no consumer references it.

## Rules
- Never combine a schema change and a behavior change in one deploy; you lose the ability to attribute a failure.
- Backfill in batches with an offset checkpoint, throttling, and a kill switch. A single unbounded UPDATE locks the table.
- The old path stays live and working until reconciliation is clean; a migration without a live rollback path is a cutover.
- Additive-then-destructive: deploy code that tolerates both shapes before deleting either one.
- Prefer a deterministic codemod plus review over hand-editing call sites; commit the codemod script with the change.
- Verify on a production-sized copy. Row counts, null rates, and checksums are the evidence, not a spot check.
- Time-box the dual-write window and schedule the contract phase; a migration left half-done is permanent complexity.

## Checklist
- [ ] Expand, migrate, and contract phases ship separately.
- [ ] Backfill is batched, checkpointed, and reversible.
- [ ] Reconciliation proves parity before the old shape is removed.
