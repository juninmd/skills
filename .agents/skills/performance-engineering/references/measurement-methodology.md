# Measurement Methodology

What to measure, and why an average lies, before any profiler runs. Linked
from `SKILL.md`.

## USE Method: Per-Resource

Brendan Gregg's *Systems Performance* names the checklist for any finite
resource — CPU, memory, disk, network, a connection pool, a thread pool:
**Utilization** (how busy), **Saturation** (how much work is queued beyond
what it can serve), **Errors** (count of error events). Saturation is the
one people skip, and it is the one that predicts an outage before
utilization looks alarming — a resource can sit at 60% utilization and still
have a growing queue if the arrival pattern is bursty.

| Resource | Utilization | Saturation | Errors |
|---|---|---|---|
| CPU | `%usr + %sys` | run-queue length, throttled cgroup time | machine checks, thermal throttling events |
| Memory | used / total | swap-in rate, OOM-killer events | allocation failures |
| Disk | busy time % | I/O queue depth, average wait time | device errors, retries |
| Network | throughput / link capacity | retransmits, drops | interface errors, checksum failures |
| Connection/thread pool | checked-out / total | wait queue depth for a free slot | checkout timeouts, leaked connections |

Run USE top-down: check the resource the symptom points at first (CPU pegged
→ CPU row; latency with idle CPU → pool or disk row), not every resource in
sequence.

## RED Method: Per Request-Driven Service

For anything that serves requests rather than being a finite resource, ask
**Rate** (requests/sec), **Errors** (failed requests/sec), **Duration**
(distribution of response time, not a single number). RED and the four
golden signals overlap deliberately — `observability` owns making them the
same dashboard so a performance investigation and an on-call page read
identical numbers.

```bash
# A RED snapshot from access logs, no APM required
awk '{print $9}' access.log | sort | uniq -c | sort -rn | head   # status code -> rate/errors
```

## Percentiles vs Averages

An average is a single number standing in for a distribution, and the
distribution of latency is never symmetric — it has a long right tail from
GC pauses, cold caches, lock contention, and slow outliers. Kleppmann's
*Designing Data-Intensive Applications* (ch. 1, "Describing Performance")
makes the case directly: report percentiles, because the mean tells you
almost nothing about the experience of the unlucky requests, and those are
often your highest-value customers (the ones with the most data, doing the
most work per request).

Worked example: 1,000 requests, 990 at 50ms and 10 at 4,000ms.

| Statistic | Value | What it implies |
|---|---|---|
| Mean | ~89ms | "The service is fast" |
| p50 | 50ms | Matches the mean's story — still misleading alone |
| p99 | ~4,000ms | 1 in 100 users has a broken experience |
| p999 | ~4,000ms | At higher traffic, this percentile is what pages on-call |

An SLO written against the mean would never fire for this system. An SLO
written against p99 fires immediately, correctly. Always carry p99 (and
p999 for high-QPS services) next to any reported average; a "faster on
average" change that widens the tail is a regression, not an improvement.

## Measure Before Optimizing

Donald Knuth: "premature optimization is the root of all evil" (*Structured
Programming with go to Statements*, 1974) — the full context is an argument
*for* profiling, not against optimizing: he is warning against tuning code
whose cost was never measured, while the profiled 3% still deserves careful
work. Two failure modes follow from misreading the quote:

- Skipping the profile and shipping a "safe-looking" optimization that does
  not touch the actual bottleneck — this wastes the change budget on code
  nobody was waiting on.
- Refusing to optimize a profiled, proven hot path because "optimization is
  bad" — this is citing the quote backwards.

## Load Testing That Reflects Production Traffic Shape

A load test that "passes" and a production incident the next day usually
disagree about *shape*, not volume:

| Mismatch | Effect | Fix |
|---|---|---|
| Uniform arrival rate vs. real bursty/diurnal traffic | Pool and cache behavior under a burst is untested | Replay a captured arrival distribution, or ramp with spikes, not a flat RPS line |
| Single repeated payload vs. real payload-size mix | Cache hit rate and serialization cost are unrealistically favorable | Sample real payload sizes/shapes from production, or a representative synthetic mix |
| Cold cache/pool state vs. steady-state production | Test flatters a system that leans on a warm cache in prod | State and hold cache/pool warmth explicitly; test both cold-start and steady-state |
| Single client/IP vs. real client diversity | Connection reuse and per-client rate limits behave differently | Vary client identity/connection pools in the harness |
| Load from one region vs. real geographic spread | Network latency floor is invisible | Run generators from the regions real traffic originates, when the target metric is user-facing latency |

The result of a mismatched shape is not "no data" — it is confident, wrong
data that clears review and fails in production.
