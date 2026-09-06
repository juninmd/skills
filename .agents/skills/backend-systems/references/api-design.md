
# API Design

## Preflight
```bash
ls openapi.yaml openapi.json schema.graphql *.proto 2>/dev/null   # is there a contract already?
rg -n '@(Get|Post|Put|Patch|Delete)\(|@app\.(get|post)' src/ | head
```

Name the consumers and their release cadence first. A contract designed without a named consumer optimizes for the implementer.

## Workflow
1. Name the consumers, their use cases, and each contract's read/write volume. A contract designed without a named consumer optimizes for the implementer.
2. Model resources and operations around client intent, never around database tables. The table is an implementation detail the client should never be able to infer.
3. Fix the cross-cutting contract first — ids, timestamps, pagination, filtering, sorting, error envelope — because changing it later breaks every endpoint at once.
4. Make writes retry-safe with idempotency keys and reads cacheable with validators.
5. Classify every change as compatible or breaking, and route breaking ones through versioning and a deprecation window.
6. Publish the schema (OpenAPI, SDL, protobuf) as the source of truth; generate clients and validation from it.

## Compatible or Breaking

| Change | Verdict |
|---|---|
| New endpoint, new **optional** request field | compatible |
| New response field | compatible (clients must ignore unknowns) |
| Removing or renaming any field | **breaking** |
| Changing a field's type or nullability | **breaking** |
| Making an optional request field required | **breaking** |
| Tightening validation (new max length, stricter regex) | **breaking** — silently, for existing valid payloads |
| Adding an enum value | **breaking** for clients that switch exhaustively |
| Changing a status code or the error body shape | **breaking** |
| Changing default page size or sort order | **breaking** in practice |

## Status Codes by Cause

| Code | Means | Not |
|---|---|---|
| 400 | malformed — could not parse | a valid body you disagree with |
| 401 | unauthenticated — no or bad credentials | insufficient permission |
| 403 | authenticated, not allowed | missing resource |
| 404 | absent, or hidden on purpose | a bad request |
| 409 | conflicts with current state | validation failure |
| 422 | parsed, semantically rejected | 400 |
| 429 | throttled — always with `Retry-After` | 503 |

Never return an error inside a 200. Clients stop checking bodies, and the failure becomes invisible.

## Idempotency and Pagination

```http
POST /payments
Idempotency-Key: 5f2c…            # client-generated, scoped to caller+route
```

Store the key with a fingerprint of the body for a stated window (24h is typical). A replay returns the recorded response; the same key with a **different** body returns 409. Without the fingerprint, a client bug silently overwrites a different payment.

```http
GET /orders?limit=50&cursor=eyJpZCI6MTIzfQ    # cursor, opaque, stable
GET /orders?limit=50&offset=1000              # skips and duplicates under writes
```

Paginate every collection from day one. An unbounded list is an outage waiting for the tenant that grows.

## Stop
- The change is breaking and no version, shim, or deprecation window exists. Stop and put the options to the user.
- A collection has no pagination. Add it before shipping; retrofitting it later is itself breaking.
- An error is being returned inside a 200. Fix it now — once clients stop checking bodies, the failure is invisible forever.

## Rules
- One error envelope everywhere: stable machine code, human message, correlation id. Never leak stack traces or internal ids.
- Rate limits are part of the contract — `RateLimit-*` headers on every response, `Retry-After` on the 429.
- Enums and dates are contracts: ISO 8601 with an explicit offset, and clients must treat unknown enum values as forward-compatible.
- GraphQL: keep fields nullable so one failing resolver does not null its parent; retire a field with `@deprecated(reason:)` plus a usage check, never by deletion.
- gRPC: protobuf field numbers and wire types are immutable. `reserved` anything removed; renumbering corrupts old clients silently, with no error anywhere.
- Events: register payload schemas with an enforced compatibility mode (usually backward), and require consumers to tolerate unknown fields.
- Announce deprecation in the schema and in response headers before removal, with a date and a migration path. A deprecation nobody was told about is a removal.
- Implementation belongs to `backend-node` and `backend-python`; rolling a breaking change out to live consumers to `migration-engineering`.

## Checklist
- [ ] Consumers, use cases, and volume named before modeling.
- [ ] Cross-cutting contract — ids, timestamps, pagination, errors — fixed before endpoints.
- [ ] Every collection paginates; cursors wherever the set is large or mutating.
- [ ] Writes are idempotent, with a body fingerprint stored against the key.
- [ ] Every change classified compatible or breaking against the table above.
- [ ] Breaking changes carry a version, a deprecation window, and a migration path.
