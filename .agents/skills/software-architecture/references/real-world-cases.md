# Software Architecture Real-World Cases

Use this first for structural changes, modularization, and design decisions.

## Refactor Proposal
- Identify the behavior to preserve, current pain, ownership boundary, and expected proof.
- Avoid architecture changes that only rename files or create single-use abstractions.
- Move one boundary at a time and keep compatibility adapters temporary and visible.

## Module Boundary
- Check dependency direction, data ownership, side effects, test seams, and runtime deployment boundary.
- Prefer stable domain interfaces over framework or transport types crossing layers.
- Make illegal dependencies hard to import when the repo tooling supports it.

## Distributed or Async System
- Define consistency model, retry/idempotency behavior, timeout budget, backpressure, and observability.
- Treat queues, caches, and cron jobs as failure-prone dependencies with replay and duplicate scenarios.
- Test partial failure, stale data, double delivery, and cancellation.

## ADR
- Record context, decision, options rejected, consequences, rollback path, and validation evidence.
- Keep ADRs short enough to be read during future incident response.
