# Architecture Discovery and Design Workflow

Detailed procedures for finding and implementing architectural improvements.

## 1. Local Context Discovery
- Read `AGENTS.md`, `README.md`, and `CONTEXT.md`.
- Inspect `docs/adr/` for historical decisions.
- Use project-specific domain terms in all proposals.

## 2. Identifying Friction
Look for signals of sub-optimal design:
- Callers knowing too much about internal setup or ordering.
- Tests targeting private helpers due to inaccessible public behavior.
- Business rules duplicated across multiple layers (UI, handlers, jobs).
- Dependencies mocked globally due to lack of stable boundaries.

## 3. Designing Changes
- Define the new public interface before changing implementation.
- Simplify callers by moving complexity behind the module.
- Define tests at the new interface.
- Keep migrations incremental and reversible.
- Document irreversible or surprising decisions via ADRs.
