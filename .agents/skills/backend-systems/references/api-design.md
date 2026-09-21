
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

**Storage and the concurrent-request race.** Persist keys in a store with an atomic
create-if-absent operation — a unique constraint in SQL, `SETNX` in Redis — carrying the body
fingerprint, a status (`in-progress` / `completed`), and the response once known. A client firing
the same request twice before the first returns is routine, not a corner case: mobile clients and
retrying proxies do this on any suspicion of a dropped connection.

| Case | Handling |
|---|---|
| Key unseen | insert `in-progress`, run the operation, update to `completed` with the response |
| Key `completed`, same fingerprint | return the stored response — never re-run the write |
| Key `completed`, different fingerprint | 409 — a different logical request reused the key |
| Key `in-progress` (concurrent duplicate) | 409 with `Retry-After`, or block on the row lock — never run the operation twice |
| Key past its TTL | treat as unseen; the caller's retry window has closed |

`docs.stripe.com`'s idempotency-key documentation is the reference implementation of this state
machine. It only prevents a duplicate *write on this API*; the underlying operation must still
tolerate being invoked more than once, because the network can always drop the response after the
write already committed. That is the same at-least-once reality Kleppmann describes in *Designing
Data-Intensive Applications*: "exactly once" as the caller experiences it is really at-least-once
delivery, deduplicated here — see [resilience-patterns.md](resilience-patterns.md) for the same
pattern applied to message consumers instead of HTTP writes.

```http
GET /orders?limit=50&cursor=eyJpZCI6MTIzfQ    # cursor, opaque, stable
GET /orders?limit=50&offset=1000              # skips and duplicates under writes
```

Paginate every collection from day one. An unbounded list is an outage waiting for the tenant that grows.

## GraphQL: N+1 and Query Cost

A resolver that loads its own associations independently issues one query per parent row — a list
of 50 orders each resolving their own customer is 51 round-trips where one would do. The fix is
the DataLoader pattern: batch every load requested within one tick into a single query, keyed and
cached for that request only.

```ts
const customerLoader = new DataLoader(async (ids: readonly string[]) => {
  const rows = await db.customer.findMany({ where: { id: { in: ids as string[] } } });
  const byId = new Map(rows.map(r => [r.id, r]));
  return ids.map(id => byId.get(id) ?? null);   // must match input order; null for a miss
});
```

Scope the loader instance to the request, never to the process — a process-lifetime loader leaks
memory and, worse, can serve one user's cached row to another.

A schema with no query limits also lets a client compose an arbitrarily deep or wide query in one
request — nested connections five levels down, or fifty aliased copies of one expensive field —
a denial-of-service surface REST's URL structure does not have. Enforce a maximum query depth and
a per-request cost budget (cost per field times requested count, summed) and reject an over-budget
query before execution, not after it has already run against the database.

## Rate Limiting and Backpressure

A rate limit protects the service from one caller's volume; backpressure protects it from load it
cannot reject cleanly regardless of who sent it.

| Mechanism | Answers | Signal |
|---|---|---|
| Fixed/sliding window counter | has this caller exceeded N requests per period | 429 with `Retry-After` |
| Token bucket | can this burst be absorbed without exceeding the sustained rate | 429 once the bucket is empty |
| Concurrency limit (semaphore) | how many requests may this caller have in flight at once | 429 or queued, never unbounded |
| Queue-depth shedding | is the service's own backlog past the point where more work helps | 503 — reject fast instead of accepting and timing out |

A rate limit rejects on quota; backpressure rejects on the service's actual current capacity — a
caller well within quota can still arrive at a moment the service cannot serve. Accepting that
request anyway just relocates the failure from a fast 503 to a slow timeout that also ties up a
connection and a thread the whole time. Prefer shedding new work over slowing all work equally: a
service that degrades every request the same amount turns one overloaded dependency into every
caller's timeout.

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
- Implementation belongs to [backend-node](backend-node.md) and [backend-python](backend-python.md); rolling a breaking change out to live consumers to `data-engineering`.

## Checklist
- [ ] Consumers, use cases, and volume named before modeling.
- [ ] Cross-cutting contract — ids, timestamps, pagination, errors — fixed before endpoints.
- [ ] Every collection paginates; cursors wherever the set is large or mutating.
- [ ] Writes are idempotent, with a body fingerprint stored against the key and the concurrent-duplicate case handled.
- [ ] GraphQL resolvers batch through DataLoader; query depth and cost are bounded.
- [ ] Rate limits and backpressure are both defined — quota rejection and capacity rejection are not the same control.
- [ ] Every change classified compatible or breaking against the table above.
- [ ] Breaking changes carry a version, a deprecation window, and a migration path.
