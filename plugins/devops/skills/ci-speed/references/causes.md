# Known causes of slow or wasteful CI

Check each row against the workflow files and the `split` numbers. A cause counts only when the numbers show it; a clue in "How to see it" is not yet the cause, so confirm it as the row says before ranking. The table says nothing about how common a cause is: check every row. Fix sections are in [fixes.md](fixes.md).

## Contents

- Table
- Items for a person
- Ranking

| # | Cause | How to see it | Fix |
|---|---|---|---|
| 1 | Cache never saved on the default or base branch, so a pull request's first run starts cold (a PR run restores from its own branch, the default branch and its base, and saves only to its own merge ref) | "Cache not found" on most first PR runs; `gh api repos/OWNER/NAME/actions/caches` shows no entry for the default branch | Cache |
| 2 | Cache key misses the toolchain or tool version, so a hit restores files the new version cannot use | Restore reports a hit while the compiler cache's own hit rate (sccache, ccache) is near 0%; key built from the lockfile alone | Cache |
| 3 | Parallel jobs share one cache key; the first to save wins, and a saved cache cannot change | Same key in several jobs; one job's setup much slower than the rest | Cache |
| 4 | Repository cache cap (10 GB unless raised) evicts least-recently-used entries | `gh api repos/OWNER/NAME/actions/cache/usage` near the cap; caches vanish before 7 days after last use. A manual deletion looks the same: say "likely" | Cache |
| 5 | A cache slower than the work it saves (`node_modules` restore against a filtered install) | Whole setup on hits, partial hits and misses, weighted by frequency, against an uncached install | Cache |
| 6 | Many tiny jobs each pay setup (checkout, toolchain, install) | Jobs whose running time is a small share of their total | Workflow shape |
| 7 | Superseded runs keep going after a newer push | No `concurrency` group; runs still running when a newer push to the same PR started | Workflow shape |
| 8 | A `needs` chain that passes no data and gates nothing | Jobs waiting on others with no artifact or output used; a deploy after tests is a gate | Workflow shape |
| 9 | Slow checkout (full history, large repository) | Checkout step seconds; `fetch-depth: 0` | Workflow shape |
| 10 | Tools compiled on every run that ship prebuilt | Long install steps running `cargo install`, `go install` | Workflow shape |
| 11 | One or a few tests take most of the test step | Per-test times from the JUnit report | Slow tests |
| 12 | Fewer test workers than runner cores, or module reloads per file | Worker count against `nproc` (standard Linux runner: 4 cores public, 2 private); per-file setup time | Slow tests |
| 13 | Shards that each pay a long setup | Setup share per shard | Slow tests, Workflow shape |
| 14 | Real sleeps or network calls in tests | `sleep(` in tests; tests calling a server | Slow tests |
| 15 | Jobs that fail then pass on a rerun of the same commit | `rerun_flakes` in `split` | Flaky tests |
| 16 | Retries, long timeouts or `continue-on-error` hiding failures | Grep the workflow and test config | Flaky tests: find the cause, never remove the check |
| 17 | Many pushes per PR, runs failing on format, lint or type errors | Pushes per PR; failed step names | Push guard |
| 18 | Large share of minutes in failed, timed-out or cancelled runs | Wasted share in `split`; read why they failed (a run that caught a real bug is not waste) | Push guard, Flaky tests, Workflow shape |
| 19 | Long waits for a machine | Waiting share on the slowest path; queued jobs hitting the plan's concurrent-job limit, a `concurrency` group, or a matrix `max-parallel`; a label with no machines | Workflow shape when one of those is the limit; otherwise a person |
| 20 | `paths:` filter on a workflow behind a required check (the check stays pending forever) | `paths:` on a workflow whose job is required | Workflow shape (review only) |
| 21 | Catch-up runs: PRs merged with main again and again, by people or by `gh pr update-branch` | `catch-up runs` line in `split` (it cannot tell a needed update from one to stay current: read a sample); `strict: true` in branch protection required checks | Push guard; a person for a merge queue |
| 22 | No cache at all for dependencies or build outputs | Install or compile steps take minutes, no cache step, setup actions' `cache` inputs off | Cache |
| 23 | Docker images rebuilt from scratch every run | `docker build` or `build-push-action` with no `cache-from`; layers rebuilt in the logs | Cache |
| 24 | A hung job runs until the default `timeout-minutes` of 360 | Jobs with no `timeout-minutes`; failed or cancelled jobs far longer than the median; a step silent for most of its time before a timeout is a suspected hang | Workflow shape |
| 25 | One shard finishes well after the others | Per-shard running time in `split`; per-file test time | Slow tests |

## Items for a person

Never fixed by this skill: bigger or different runners, new providers or paid services, repository settings such as a merge queue or the cache cap. List them with the number that motivates each.

## Ranking

1. Causes observed on the slowest path first; a cause off it saves runner-minutes but no wait.
2. Within those, the cheapest to prove in one pull request.
3. Rank by observed cost, or by an upper bound labelled as a ceiling when only a ceiling is known. Never add the savings of several causes up.
