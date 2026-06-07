# Document Formats

## CONTEXT.md format

```markdown
# [Context Name]

[One or two sentence description of what this context is and why it exists.]

## Language

**TermName**:
[One or two sentence definition. What it IS, not what it does.]
_Avoid_: [synonym1, synonym2]
```

### Rules

- **Be opinionated.** When multiple words exist for the same concept, pick the best one and list others under `_Avoid_`.
- **Keep definitions tight.** One or two sentences max.
- **Only project-specific terms.** Not general programming concepts. Ask: is this unique to this context, or generic? Only the former belongs.
- **Group under subheadings** when natural clusters emerge.

### Single vs multi-context repos

**Single context:** One `CONTEXT.md` at the repo root.

**Multiple contexts:** A `CONTEXT-MAP.md` at the repo root listing contexts, where they live, and how they relate:

```markdown
# Context Map

## Contexts

- [Ordering](./src/ordering/CONTEXT.md) — receives and tracks customer orders
- [Billing](./src/billing/CONTEXT.md) — generates invoices and processes payments

## Relationships

- **Ordering → Fulfillment**: Ordering emits `OrderPlaced` events; Fulfillment consumes them
```

## ADR format

Stored in `docs/adr/NNNN-slug.md`. The directory is created only when the first ADR is warranted.

An ADR can be a single paragraph. The value is recording *that* a decision was made and *why*.

```markdown
# NNNN — [Decision Title]

[Context, decision, and rationale. What did we consider? What did we choose? Why?]

## Status
Accepted

## Consequences
[What becomes easier or harder as a result?]
```

Optional sections (only when they add value): Considered Options, Status, Consequences.

### When an ADR is warranted (all three must hold)

1. Hard to reverse — reversing it carries real cost
2. Surprising without context — future readers will question the approach
3. Result of genuine trade-offs — alternatives existed and were evaluated

Good subjects: architectural patterns, technology selections with switching costs, scope boundaries, intentional deviations from conventions, non-obvious constraints, rejected alternatives.
