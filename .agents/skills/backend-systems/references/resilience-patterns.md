
# Resilience Patterns: Delivery Guarantees and Service-to-Service Calls

## Exactly-Once Is an Illusion

No distributed system delivers exactly once across a network boundary. A caller that gets no
response cannot tell whether the request never arrived, arrived and crashed mid-processing, or
arrived, succeeded, and only the *response* was lost — Kleppmann's *Designing Data-Intensive
Applications* uses exactly this ambiguity to argue that "exactly-once" is only ever at-least-once
delivery plus deduplication done somewhere. The choice is not whether to accept duplicates; it is
where the dedup happens and whether it is correct.

| Delivery model | What actually happens | Where dedup has to live |
|---|---|---|
| At-most-once | send and forget; a lost message is silently gone | nowhere — only acceptable when losing a message is cheaper than a duplicate |
| At-least-once | retry until acknowledged; a message can arrive more than once | consumer, keyed on a message/event id |
| "Exactly-once" (broker feature) | at-least-once delivery plus broker-side dedup within its own window | still the consumer, once the message crosses a system boundary the broker does not cover |

## Idempotent Consumers

The same fingerprint-and-store pattern used for [idempotency keys](api-design.md) at the API edge
applies to message consumers, and the failure mode is identical: two workers picking up the same
retried message and both applying it.

```ts
async function handle(event: OrderPaidEvent) {
  const seen = await dedupStore.setIfAbsent(event.id, { ttl: '7d' });
  if (!seen) return;                 // already processed (or currently being processed)
  await applyPayment(event);         // must itself be safe if this step is retried after a crash
}
```

Two things make this correct rather than a false sense of safety: the `setIfAbsent` must be atomic
(a unique constraint or `SETNX`, not a read-then-write), and its TTL must outlive the broker's own
redelivery window — a dedup entry that expires before the last possible retry lets the duplicate
back in.

## Circuit Breakers

A downstream dependency that is failing or slow does not need every caller to keep discovering
that one request at a time. Nygard's *Release It!* names the pattern: track failures per
dependency, and once they cross a threshold, **stop calling it** for a cooldown window and fail
fast instead — protecting the caller's own threads/connections and giving the dependency room to
recover instead of being kept down by continued load.

| State | Behavior |
|---|---|
| Closed | calls pass through; failures counted |
| Open | calls fail immediately, no network attempt, for the cooldown window |
| Half-open | one trial call allowed; success closes the breaker, failure reopens it |

A breaker with no half-open trial either recovers only when someone restarts the process, or
never — both are worse than the pattern properly implemented.

## Bulkheads

Also from *Release It!*: partition capacity so one dependency's failure cannot exhaust the
resources every other dependency needs. A single shared connection pool or thread pool means a
slow payments provider can starve unrelated requests to a healthy search service, because every
caller is blocked waiting on the same pool.

- Separate connection pools / semaphores per downstream dependency, sized to that dependency's
  own capacity, not a shared global limit.
- Separate queues for background jobs whose failure domains differ (retries for a flaky webhook
  should never sit behind checkout email delivery).
- A timeout without a bulkhead still lets one dependency exhaust the pool by holding every slot
  until each individual timeout fires — the two patterns are complementary, not substitutes.

## Stop

- A retried operation is not idempotent and there is no dedup layer in front of it. Add one before
  wiring in any retry.
- A dependency call has a timeout but shares an unbounded pool with unrelated calls. One slow
  dependency will still exhaust it.
- A circuit breaker has no half-open trial. It will never recover on its own.

## Rules

- Treat every network call as at-least-once on the receiving end; "exactly-once" is a delivery
  guarantee from the broker's door to the consumer's door, never end-to-end.
- Dedup TTL must exceed the broker's maximum redelivery window, not just the "usual" retry delay.
- Size each bulkhead to its dependency's real capacity; a bulkhead sized to the whole pool is not
  a bulkhead.
- Fire-and-forget background work still needs a failure path — see [backend-node](backend-node.md)
  and [backend-python](backend-python.md) for the runtime-specific gotchas.
