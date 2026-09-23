# Regression Review

## Contents

- Contracts
- Failures That Stop Being Visible
- Concurrency and Partial Failure
- Data Layer
- Input Boundaries
- Cost and Capacity
- The Tests in the Diff Are Part of the Diff
- Stop

What to look for in a diff so a working system does not stop working. Every entry is a **signal visible
in the change itself**, not a principle. Verdict discipline — green-to-red classification, baselines in
an isolated worktree, flake arithmetic — belongs to `test-engineering` and its `regression-gate.md`;
this file is what the reviewer reads before the gate runs.

## Contracts

A public API, schema, event, CLI flag, or config key is a contract. The diff tells you which way it
moved.

| Signal in the diff | Why it bites |
|---|---|
| Field removed or renamed, required param tightened, error shape or status code changed | old clients break silently; only additive change (new optional field, new value with a safe default) is compatible ([protobuf compatibility](https://yokota.blog/2021/08/26/understanding-protobuf-compatibility/)) |
| One PR both adds the new column/field **and** drops the old one | expand, migrate, and contract must ship as independently deployable changes, or rollback of code forces rollback of schema ([Parallel Change / expand-contract](https://xata.io/blog/pgroll-expand-contract)) |
| New enum value with no default arm in the consumer's switch | older readers coerce unknown values to the zero value and take the wrong branch ([protobuf compatibility](https://yokota.blog/2021/08/26/understanding-protobuf-compatibility/)) |
| Migration with no `down`, or a destructive step shipped with the code that needs it | the release can no longer be rolled back independently ([Stripe API versioning](https://stripe.com/blog/api-versioning)) |
| Flag added with no owner or expiry, or a removal that deletes the check but leaves the dead branch | flag debt accumulates and the dead branch stays reachable ([LaunchDarkly, flag technical debt](https://launchdarkly.com/docs/guides/flags/technical-debt)) |
| A constant, byte, or field reused for a new meaning while old code still reads it | Knight Capital: a repurposed flag byte re-activated dormant 2003 code, $460M in 45 minutes ([SEC 34-70694](https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf)) |
| A producer's schema changed without diffing it against every consumer | CrowdStrike 2024: template defined 21 fields, the interpreter supplied 20; out-of-bounds read, kernel crash fleet-wide ([CrowdStrike RCA](https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf)) |

## Failures That Stop Being Visible

| Signal in the diff | Why it bites |
|---|---|
| `catch` block with no log, metric, rethrow, or use of the error | the condition is detected and then discarded ([CWE-390](https://cwe.mitre.org/data/definitions/390.html)) |
| `throw new X(...)` inside a catch that does not pass the original error as cause | the stack trace to the real fault is destroyed |
| Fallback returning a cached or default value on error, with **no signal emitted anywhere** | an outage renders as a normal response; alerting never fires ([Google SRE, cascading failures](https://sre.google/sre-book/addressing-cascading-failures/)). A designed fallback — a breaker, a safe default behind a flag — is correct *when the degraded state is observable*; ask where the metric is before flagging |
| A `throw` or error return replaced by `log.warn` plus continued happy path | a contract violation becomes a log line nobody reads until the incident |
| Retry added around a non-idempotent write, with no idempotency key or dedup | retries turn a transient failure into duplicate charges or orders ([AWS: making retries safe](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/), [Stripe idempotency](https://docs.stripe.com/api/idempotent_requests)) |
| A required config read gains a default value | a loud startup failure becomes a quiet wrong value in production |
| A guard, budget, or limit removed during refactoring | Cloudflare 2019: the CPU protection for regex execution was "removed by mistake during a refactoring of the WAF weeks prior"; a backtracking regex then took the fleet down for 27 minutes ([Cloudflare RCA](https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/)) |

A removed guard is a change even when nothing replaces it. Diffs that only delete deserve the same
scrutiny as diffs that add.

## Concurrency and Partial Failure

- Shared mutable state read and then written in two statements, especially across an `await` or
  callback boundary, with no lock, CAS, or atomic operation ([CWE-362](https://cwe.mitre.org/data/definitions/362.html)).
- Check-then-act on a file, balance, or lock instead of acting and checking the result
  ([CWE-367, TOCTOU](https://cwe.mitre.org/data/definitions/367.html)).
- A network call, sleep, or queue publish inside `BEGIN...COMMIT` — locks are held for the duration of
  someone else's latency.
- A new multi-service write path with no compensating action on second-step failure
  ([saga pattern](https://microservices.io/patterns/data/saga.html)).
- A new cross-service call with no timeout, retry budget, or breaker, and success/timeout/failure
  collapsed into one catch branch
  ([Fallacies of distributed computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing)).

## Data Layer

- A database call inside a loop over a collection, with no eager load added in the same diff — the N+1
  reads as idiomatic code, which is why it survives review.
- A new list query or endpoint with no `LIMIT`, page, or cursor; or an existing cap raised without a
  stated reason ([Stripe pagination](https://docs.stripe.com/api/pagination)).
- `CREATE INDEX` without `CONCURRENTLY` on a table that takes production writes during deploy
  ([PostgreSQL](https://www.postgresql.org/docs/current/sql-createindex.html)).
- A changed `WHERE`/`JOIN`, an added `OR`, a function wrapped around an indexed column, or a new column
  in the wrong position of a composite index — all can flip the planner to a sequential scan and all
  pass correctness tests at test-data volume. Require an `EXPLAIN (ANALYZE, BUFFERS)` diff on changed
  hot-path queries; `data-engineering` owns the plan reading.

## Input Boundaries

- New parameter or field with no min/max, null handling, or cross-field rule such as start-before-end
  ([OWASP input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)).
- `toLowerCase()`/`toUpperCase()` or case-insensitive comparison on identifiers without an ordinal
  comparison — the Turkish locale folds `i`/`I` to `İ`/`ı` and the lookup misses
  ([the Turkish İ problem](https://haacked.com/archive/2012/07/05/turkish-i-problem-and-why-you-should-care.aspx/)).
- Timestamp arithmetic, dedup keys, or rate-limit windows on local wall-clock time: DST fall-back
  repeats an hour, which duplicates idempotency keys and resets limits twice.
- A parser, loop, or endpoint with no size cap, body limit, or recursion bound
  ([CWE-400](https://cwe.mitre.org/data/definitions/400.html)).
- Data decoded more than once ([CWE-174](https://cwe.mitre.org/data/definitions/174.html)), or a
  security check applied before canonicalization rather than after
  ([CWE-179](https://cwe.mitre.org/data/definitions/179.html)) — either lets one canonical-form filter
  be bypassed.
- An operational tool that accepts an unbounded count or id list before a destructive action —
  AWS S3 us-east-1, 2017: a mistyped input to an established playbook removed far more capacity than
  intended ([AWS post-event summary](https://aws.amazon.com/message/41926/)).

## Cost and Capacity

A new or shortened cron, a new polling loop, an always-on scheduled function, or a full-result read
replacing a streamed one are all regressions even when latency looks fine — they bill continuously.
Deep analysis belongs to `performance-engineering`; the review only has to notice them.

## The Tests in the Diff Are Part of the Diff

| Signal | Verdict |
|---|---|
| Assertion equals whatever the code currently returns, no comment on why that value is correct | the test encodes output, not intent, and will pass straight through the next regression ([Fowler, TestCoverage](https://martinfowler.com/bliki/TestCoverage.html)) |
| Existing test edited so it matches the new behavior, in the same commit that changes the behavior | the safety net was adjusted to fit the change; demand the pre-change test and the reason it was wrong |
| Test deleted, skipped, or marked flaky inside a feature diff | a removed test is a behavior change; it needs its own justification |
| Snapshot churn accepted wholesale | nobody read what changed |
| Coverage cited as the justification | coverage finds untested code, never badly tested code; a mutation score on the changed files is the evidence that assertions can fail ([PIT](https://pitest.org/)) |
| Refactor of untested legacy code with no characterization test committed first | there is no baseline to compare against — see [legacy-refactoring.md](legacy-refactoring.md) |

## Stop

- The change mixes expand and contract, or ships a destructive migration with the code that depends on
  it. Rollback is no longer possible — split it before reviewing further.
- A guard, timeout, limit, or validation was deleted and nothing replaced it.
- A producer schema changed and the consumers were not diffed against it.
- Tests were edited in the same commit as the behavior they cover, with no explanation.
- The change is too large to hold in one pass. Say so and stop; see
  [review-effectiveness.md](review-effectiveness.md).
