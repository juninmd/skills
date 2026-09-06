
# Metric Loop

## Preflight
```bash
git rev-parse --git-dir && git status --porcelain   # the loop commits every iteration; start clean
bash -c "$VERIFY" | tail -1                         # must print exactly one number
bash -c "$VERIFY" | tail -1                         # same tree, same number — otherwise the metric is noise
```

Fix all of it before iteration 0 or there is no loop: **Goal**, **Scope** (globs the loop may touch), **Metric** and its direction, **Verify** (a command printing one number), and a **Guard** that must keep passing whatever the metric does. Anything missing gets asked in one batch — `requirements-clarification`, not a guess.

## Workflow
1. Screen Verify and Guard before the first run — they execute unattended, every iteration. Refuse `rm -rf`, `curl | sh`, credentials, and anything writing outside the repository.
2. Run Verify twice on an unchanged tree. Two different numbers means the metric is noise — fix determinism (seed, warmup, samples) first, or every verdict below is a coin flip.
3. Record iteration 0: baseline metric, commit, guard status. Every later row is a delta against it.
4. Each iteration: read the last log rows and `git log --oneline -20`, make **one** focused change inside Scope, commit it as `experiment: what changed`, run Verify, then Guard.
5. Apply the verdict table at once. Anything not kept is reverted in the same iteration, never left for the next one to build on.
6. Append one row to the log, then test the stop conditions before starting the next iteration.
7. On exit report: iterations, kept versus reverted, baseline to final, and the three changes that moved it most.

## Verdicts

| Verdict | Condition | Action |
|---|---|---|
| keep | metric moved the right way, guard passed | commit stays |
| discard | metric moved the wrong way, or not at all | `git revert HEAD --no-edit` |
| crash | Verify or Guard failed to run | revert, then fix the harness before iterating again |
| metric-error | Verify printed something that is not a number | revert — a parse failure is not a score of zero |
| guard-fail | metric improved, guard broke | revert; the guard outranks the metric, always |
| no-op | nothing changed this iteration | log it — two in a row means out of ideas, not out of budget |

## The Log Is the Memory
One appended row per iteration, in the repository, so the next iteration inherits what the last one learned:

```bash
printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$i" "$(date +%FT%T)" \
  "$(git rev-parse --short HEAD)" "$metric" "$delta" "$guard" "$status" \
  >> .metrics/loop-$(date +%y%m%d).tsv
```

Header first, direction recorded: `# direction: lower_is_better`, then `iteration timestamp commit metric delta guard status description`. Undirected, a later reader cannot tell a win from a loss.

## Reading the Log

| Signal | Means | Do |
|---|---|---|
| metric flat for 3+ iterations | plateau | stop; what remains is structural, not incremental |
| deltas shrinking on every keep | diminishing returns | stop, or change the *class* of change being tried |
| revert rate above ~70% | the hypothesis pool is wrong | re-profile before spending another iteration |
| kept commits cluster in one file | hotspot | say so — that is the real finding, not the percentage |
| guard fails whenever the metric improves | the metric is a bad proxy | fix the metric; never relax the guard |

## Stop
- Verify is non-deterministic, or Guard was never established. There is no loop yet — go make the measurement repeatable.
- The bound is reached. Bounded by default (25 iterations); unbounded runs only on an explicit ask, and still report at every checkpoint.
- Plateau or diminishing returns across three checkpoints. Report the trajectory and stop; more iterations buy noise.
- The metric improved and the product got worse. Stop and fix the metric — a loop pointed at a proxy will eventually destroy what the proxy stood for.
- The next change would leave Scope. Re-contract first; an unbounded scope makes both the log and the reverts unsafe.

## Rules
- One change per iteration. Two changes in one commit make the metric unattributable and the revert too coarse.
- The loop never edits its own Verify, Guard, or Scope: moving the goalposts is scoring yourself.
- A metric with no guard optimizes exactly one number and quietly trades away everything else — correctness first, always.
- Never push, deploy, or publish from inside the loop. Delivery is `finishing-dev`, with a human in it.
- Reverting is normal, not failure. A loop with no reverts is trying changes too timid to matter.
- The log lives in the repository, not the transcript: the next session reads rows, not your summary.
- Choosing *which* change to try comes from evidence — `performance-engineering` for a profile, `diagnostics` for a defect. `test-engineering` writes the benchmark Verify runs; `regression-gate` proves a kept series broke nothing; durable lessons go to `session-learnings`.
- Protocol adapted from the autoresearch loop by uditgoenka (MIT).

## Checklist
- [ ] Goal, Scope, Metric, direction, Verify, Guard all fixed in writing before iteration 0.
- [ ] Verify screened for destructive commands and proven deterministic on an unchanged tree.
- [ ] Baseline row logged with commit and guard status.
- [ ] Every iteration: one change, one commit, one verdict, one row — reverts applied immediately.
- [ ] Stop condition named explicitly at exit (bound, plateau, or target met), not "ran out of turns".
- [ ] Final report states baseline to final, revert rate, and the changes that actually moved the metric.
