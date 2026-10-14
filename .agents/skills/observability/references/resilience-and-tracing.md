# Resilience, Tracing, and Log Hygiene at Scale

## Contents

- Trace Context Propagation Across Async Boundaries
- Log Sampling Under High Volume
- Clock Skew and Timezone Bugs in Cross-Service Correlation
- Retry Storms and Cascading Failures
- Cardinality Explosions: Catching Them Before Production

Deeper treatment of four failure modes that only appear at volume or under
partial failure, referenced from `SKILL.md`.

## Trace Context Propagation Across Async Boundaries

A trace that stops at the last synchronous call is worse than no trace: it
looks complete and hides exactly the hop that was slow. Every async boundary
needs the context carried across it explicitly — nothing propagates it for
free.

| Boundary | What breaks propagation | Fix |
|---|---|---|
| Message queue (SQS, Kafka, RabbitMQ) | Producer's trace context is not a message field | Inject `traceparent`/`tracestate` (W3C Trace Context) into message headers or attributes on publish; extract on consume, as a new span linked to the producer's |
| Background job / worker pool | Job is enqueued, dequeued later on a different thread or process | Serialize the trace context into the job payload, not into thread-local state — thread-locals do not survive the handoff |
| Fire-and-forget call | Caller does not await the callee | Still inject the header; the callee's span is orphaned only if it drops the context, and an orphaned span is a debuggable gap, not a silent one |
| Batch/cron aggregating many requests | One batch run represents N logical operations | Use span links (not parent-child) to each contributing trace; a single parent misrepresents fan-in as fan-out |
| Cross-language hop | Only one SDK auto-instruments | Verify the header format is W3C Trace Context on both sides; vendor-specific formats (e.g. legacy B3) need a translating collector |

Verification, not assumption: a trace that enters a queue and never comes out
the other side means propagation is broken, not that the consumer was fast.

```bash
# Confirm the header actually reaches the consumer, do not assume the SDK does it
rg -n "traceparent|tracestate" src/**/consumer* src/**/worker* | head
```

## Log Sampling Under High Volume

At scale, logging every request is either impossible (cost, I/O) or masks
the interesting 0.01%. The failure mode to avoid is losing the rare error
while keeping oceans of identical success lines.

| Strategy | Keeps | Risk |
|---|---|---|
| Fixed-rate sampling (log 1 in N) | Cheap, uniform | A rare error has a 1-in-N chance of surviving; at N=100 you lose 99% of a bug that fires twice a day |
| Always-log errors and warnings, sample info/debug | Every failure, bounded volume elsewhere | None if the error path is genuinely exhaustive — audit that no error is logged at `info` to dodge the rule |
| Adaptive / priority sampling (raise rate when error rate rises) | Detail exactly when it is needed | Needs a feedback signal (current error rate) driving the sampler, not a static config |
| Exemplar linking (sample the metric, attach one full trace per bucket) | A representative trace for every latency/error bucket without logging everything | Requires trace and metrics pipelines to share IDs |

The rule that survives every strategy above: **sampling decisions apply to
volume, never to severity.** An `error`-level event is not a candidate for
the sampler; it is always emitted, in full.

## Clock Skew and Timezone Bugs in Cross-Service Correlation

Logs from three services claim an event happened in an order that never
occurred, because "when" was measured three different ways.

| Symptom | Cause | Fix |
|---|---|---|
| Event B's log timestamp precedes event A's, but B was caused by A | Clock skew between hosts — NTP drift, a container with a frozen clock, a VM pause | Correlate by trace/span id and causal ordering, never by wall-clock timestamp across hosts; monitor NTP offset as a saturation-style signal |
| "Duration" computed as `end_timestamp - start_timestamp` goes negative | Wall clock adjusted (NTP step, DST) mid-request | Compute durations from a monotonic clock (`process.hrtime`, `time.monotonic()`), store wall-clock only for display |
| Logs "off by one hour" after a release | Local timezone used instead of UTC somewhere in the pipeline | Emit and store all timestamps in UTC with an explicit offset (ISO 8601, `Z` suffix); render in local time only at the edge, in the UI |
| Two regions' logs interleave wrong in a merged view | One region's log shipper stamps ingest time, not event time | Always log event time at the source; ingest time is a separate field, never a substitute |

Never trust cross-host wall-clock ordering for causality. Trace and span ids
encode the real causal graph; timestamps are for humans reading one host's
log, and for computing a duration on that same host.

## Retry Storms and Cascading Failures

A retry is a bet that the failure was transient. Without a cap, backoff, and
jitter, that bet compounds: N callers retry a slow dependency simultaneously,
multiplying load on the exact system already struggling, and the dependency
that could have recovered in isolation now cannot. Michael Nygard's
*Release It!* names the stability patterns that stop this cascade:

| Pattern | What it does | When to use it |
|---|---|---|
| Timeout | Bounds how long a caller waits before giving up | Every network call, no exceptions — an unbounded wait holds a thread/connection hostage |
| Retry with backoff + jitter | Spaces out retries so callers don't resynchronize on the same schedule | Idempotent operations only; exponential backoff, jittered, with a max attempt count |
| Circuit breaker | Stops calling a dependency once its failure rate crosses a threshold, fails fast until a health probe succeeds | Any dependency that can be slow-failing rather than fast-failing |
| Bulkhead | Isolates resource pools per dependency so one slow caller cannot starve threads/connections needed by another | Any shared pool serving multiple downstream calls of different criticality |
| Fail fast | Rejects a request immediately when a precondition (e.g. circuit open, queue full) is already known to fail | Anywhere a slow failure would otherwise queue behind healthy work |

Retry storms show up in the metrics before the outage does: retry rate
climbing on a flat-or-falling success rate, and queue depth or connection
pool occupancy rising in lockstep across every caller of the same
dependency. Alert on retry rate as its own signal — a service can look
"fine" on latency while quietly retrying every third call.

```text
retry_rate = retries_total / (requests_total)
# a rising retry_rate at falling p99 is not recovery — it's the breaker
# should have already opened and callers are still hammering the target
```

## Cardinality Explosions: Catching Them Before Production

`SKILL.md` names the label rule; catch a violation in review, not in the
incident that follows it.

- Add a cardinality budget per service (e.g. "under 10k active series") and
  fail CI when a new metric or label pushes past it — a synthetic scrape
  against a staging instance with realistic label values catches this before
  merge, not after the metrics backend falls over.
- Grep new metric call sites for a label sourced from user input, a UUID, or
  a raw path before approving the PR: `rg -n "\.labels?\(.*\b(id|email|path)\b" src/`.
- Watch `series count by metric name` on a fixed cadence; a metric whose
  series count grows with traffic (not with the number of distinct routes or
  tenants) has an unbounded label somewhere in it, and the growth is visible
  weeks before the backend actually falls over.
