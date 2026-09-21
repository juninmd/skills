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
- Ask whether the coupling is essential (the domain genuinely requires it, per Eric Evans' *Domain-Driven Design*) or accidental (an implementation detail leaking across the boundary, per Sam Newman's *Building Microservices*). Only accidental coupling is worth spending a refactor on; essential coupling just needs a clear home.

## Bounded-Context Violation
A bounded context is the scope inside which a term has one meaning. It is violated in code, not just in conversation, and the tell is structural, not semantic:

| Symptom | What it actually is | Fix |
|---|---|---|
| Two teams write to the same table, each reading a different meaning into a shared column (`status`: fulfillment to warehouse, payment to billing) | One table serving two contexts | Split the table along the context boundary; each context owns its own schema and publishes events the other consumes |
| One service calls another's internal table or ORM entity directly | No context boundary at all, just a shared database pretending to be two services | Put an API or event contract at the boundary; the internal schema stops being anyone else's contract |
| A shared library encodes another team's business rule "for convenience" | The rule's owner no longer controls its own logic | Move the rule to its owner; the caller depends on the outcome, not the recipe |
| The same DTO is passed unmodified from an upstream API into a downstream domain model | The upstream vendor's model has become the domain model | Introduce an anti-corruption layer (below) |

## Anti-Corruption Layer
When integrating a legacy system or a third party whose model does not match the domain, translate at the boundary instead of letting the foreign shape leak inward (Eric Evans, *Domain-Driven Design*, ch. 14).

- Define the domain's own type first, independent of the upstream schema.
- Write one adapter that maps the foreign representation to the domain type, and nowhere else in the codebase references the foreign shape.
- The adapter absorbs the foreign system's quirks — inconsistent nulls, stringly-typed enums, a differently-scoped `id` — so domain code never special-cases them.
- Treat the adapter as the extension point when the legacy system is being replaced incrementally: swap what feeds it without touching the domain (martinfowler.com describes the same incremental-replacement shape as the [Strangler Fig pattern](https://martinfowler.com/bliki/StranglerFigApplication.html) and [Branch by Abstraction](https://martinfowler.com/bliki/BranchByAbstraction.html) for the in-process version of the same seam).

## Premature Monolith Split
A split that produces two conjoined services — deployed separately but sharing one database, one transaction, or one release train — pays the distributed-systems tax (network, partial failure, versioning) without buying the isolation that justifies it (Sam Newman, *Building Microservices*, on the database-per-service rule; see also [microservices.io: Database per service](https://microservices.io/patterns/data/database-per-service.html)).

| Sign it is premature | What to do instead |
|---|---|
| Both services read or write the same tables | Keep it one module until data ownership is genuinely separable |
| A deploy of one requires the other to deploy in lockstep | The seam is not real yet; the split added a network hop to a single unit of change |
| Both must be up for either to serve a request | No failure isolation was gained — see the Split or Keep table in [SKILL.md](../SKILL.md) |
| The split was done to match a team boundary, not a domain boundary | Decompose by subdomain first ([microservices.io: Decompose by subdomain](https://microservices.io/patterns/decomposition/decompose-by-subdomain.html)), then let the team boundary follow it |

## Distributed or Async System
- Define consistency model, retry/idempotency behavior, timeout budget, backpressure, and observability.
- Treat queues, caches, and cron jobs as failure-prone dependencies with replay and duplicate scenarios.
- Test partial failure, stale data, double delivery, and cancellation.

## ADR
- Record context, decision, options rejected, consequences, rollback path, and validation evidence.
- Keep ADRs short enough to be read during future incident response.

### ADR Lifecycle
An ADR is not a one-time note — it carries a status that changes as the decision ages, so a reader can tell a live constraint from history:

| Status | Meaning | When to set it |
|---|---|---|
| Proposed | Under discussion, not yet acted on | Written before the change ships, while alternatives are still open |
| Accepted | In effect; the codebase reflects it | The change has shipped and the rejected alternatives are recorded |
| Superseded by ADR-NNN | Replaced by a later decision | A new ADR changes the same boundary; link both directions |
| Deprecated | No longer followed, with nothing formally replacing it | The constraint stopped applying (a dependency was dropped, a team merged) and no new ADR covers the gap |

Write one when the decision has real alternatives or consequences that outlive the pull request — a database choice, a boundary move, a consistency model. Do not write one for a decision with a single reasonable option; that is a comment, not an ADR.
