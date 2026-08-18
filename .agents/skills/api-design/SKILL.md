---
name: api-design
description: |
  Design and evolve HTTP, GraphQL, gRPC, and event contracts that stay compatible for consumers. Use for resource modeling, request and response shapes, versioning, pagination, idempotency, error envelopes, breaking-change review, and deprecation policy.
---

# API Design

## Workflow
1. Name the consumers, their use cases, and the read/write volume each contract must serve.
2. Model resources and operations around client intent, not around database tables.
3. Fix the cross-cutting contract first: identifiers, timestamps, pagination, filtering, sorting, and the error envelope.
4. Make writes safe to retry with idempotency keys, and make reads safe to cache with explicit validators.
5. Classify every change as compatible or breaking; route breaking changes through versioning and a deprecation window.
6. Publish the schema (OpenAPI, SDL, protobuf) as the source of truth and generate clients and validation from it.

## Rules
- Additive is compatible: new optional fields and new endpoints. Removing, renaming, retyping, or tightening validation is breaking.
- Paginate every collection from day one; unbounded list endpoints become outages.
- Use cursor pagination for large or mutating datasets; offsets skip and duplicate rows under concurrent writes.
- Return one error envelope everywhere: stable machine code, human message, and a correlation identifier. Never leak stack traces or internal identifiers.
- Map status codes by cause: 400 malformed, 401 unauthenticated, 403 unauthorized, 404 absent, 409 state conflict, 422 semantic rejection, 429 throttled.
- Never overload 200 with an error body; clients stop checking.
- Enums and dates are contracts. Use ISO 8601 with an explicit offset, and treat unknown enum values as forward-compatible on the client.
- Announce deprecation in the schema and response headers before removal, with a date and a migration path.

## Checklist
- [ ] Consumers, operations, and error envelope are explicit.
- [ ] Collections paginate and writes are idempotent.
- [ ] Breaking changes carry versioning and a deprecation window.
