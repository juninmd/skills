# Measuring CI changes

## Contents

- Baseline, before any change
- While the pull request is open
- After merge
- Reading the verdict
- Why 5 runs a side
- Break-it probe
- Receipt

`M` is `node .agents/skills/ci-speed/scripts/measure.mts`. Run it from the root of the repository being measured; it writes under `.ci-speed/` and adds that folder to `.git/info/exclude`. If `git ls-files .ci-speed` lists anything, stop and ask before writing.

## Baseline, before any change

Pick the `--created` time before looking, a few hours ago, so every run up to it has finished. Reuse a saved baseline only if its recorded commands fetched this way.

```bash
node $M fetch --repo OWNER/NAME --workflow ci.yml --event pull_request --limit 150 \
  --created '<=2026-11-20T12:00:00Z' --out .ci-speed/before.jsonl
node $M split --in .ci-speed/before.jsonl
```

With several workflows, fetch one file per workflow. Download the JUnit reports of one run into an empty folder (`gh run download RUN_ID -D .ci-speed/junit-before`), every job and matrix leg, and confirm each test job's report is there. With no report, record the runner's count and say test preservation is **unverified**: a count cannot show one test lost and another added.

Write `.ci-speed/baseline.md`: workflow, job and runner label, run count, median and slowest runs as `split` printed them, tests that ran, and these commands.

## While the pull request is open

Put the baseline and the branch's own runs in the description, marked **provisional**: a handful of runs cannot show a change smaller than the noise. Run `tests` against the baseline now; a lost test fails the change before merge.

## After merge

Choose the window before looking (a day or two). Fetch it only once it has ended and every run created in it has finished: fast runs finish first, so an early read keeps the fastest and can pass for a speedup. `fetch` refuses an unfinished window and one larger than `--limit`.

```bash
node $M fetch ...the baseline's recorded options... --out .ci-speed/before.jsonl
node $M fetch --repo OWNER/NAME --workflow ci.yml --event pull_request \
  --created 'MERGE-TIME..WINDOW-END' --out .ci-speed/after.jsonl
```

If either `fetch` refuses, stop. Then keep the runs that tested the fix, judged from each run's own record the same way on both sides:

- `compare --base BRANCH` keeps pull request runs whose recorded target is that branch alone, plus pushes to it. Runs it cannot place (forks, no branch) are left out on both sides, passed or failed, so a gap cannot shift the failure rate.
- A pull request run tests its merge commit with the base as it was when the run started; the `HEAD is now at … Merge HEAD into BASE` line from `actions/checkout` names it.
- After side: require the fix in that base (`git merge-base --is-ancestor FIX_SHA BASE`) and no revert of it there. A passed run that prints no such line is unknown: leave it out. A failed run that stopped before it stays; its failure counts.
- Leave out workflows that check out the pull request head instead of the merge commit.

Write the kept runs to `before-fix.jsonl` and `after-fix.jsonl`, then:

```bash
node $M compare --before .ci-speed/before-fix.jsonl --after .ci-speed/after-fix.jsonl \
  --event pull_request --base main --label RUNNER-LABEL [--job NAME]
node $M tests --before JUNIT-BEFORE --after JUNIT-AFTER
```

Always pass the runner label; add `--job` when jobs run on different runners. `--label`, `--job` and `--cache` choose only the runs that are timed; the failure rate reads every finished run of the workflow and event. Count cold-cache and warm-cache runs separately when the change touches caching (`--cache-state` takes a JSON map of run id to `hit` or `miss`, built from `cachelog`).

## Reading the verdict

| Verdict | Meaning |
|---|---|
| median faster | The whole interval is below zero and the median fell. With "but more runs failed after": name each failure's cause before calling it faster |
| median slower | The whole interval is above zero and the median rose |
| mixed | The interval excludes zero but the median moved the other way or not at all; report both numbers, do not call it faster |
| no measurable change yet | The interval includes zero; more runs can tighten it |
| not enough runs yet | Under 5 a side; timings are hidden so a longer window is chosen without seeing them |
| not valid | More runs fail after than chance explains (one-sided Fisher test at 5%) |

Under 5 runs: choose a longer window (and a longer baseline if that side is short), write the exact commands into the pull request so anyone can finish, and stop. Never trigger runs to fill the count without asking.

A second count chosen after seeing the first result is exploratory: report it as such beside every comparison made. Two looks with counts fixed beforehand (5 then 20 a side) stay under about 10% false verdicts.

## Why 5 runs a side

The estimate is the Hodges-Lehmann shift (median of every after-minus-before difference) with its exact Mann-Whitney 95% interval (Bauer, 1972). Unlike a bootstrap, it holds its 95% at any count. With 3 a side no 95% interval can rule out "no change"; with 4 only if all 16 pairs agree; at 5, 2 of 25 pairs may disagree, the fewest that leaves room for noise. The 95% assumes independent runs: runs sharing one busy hour or runner pool move together, so let the window span more than a day when possible and say so when it did not.

Below 20 runs, the slowest 5% is just the slowest run: the smaller side shows its slowest run and the larger side its typical slowest of that many, so the two compare like with like. Both are provisional below 100 runs. The failure test has little power at a few runs: with 5 before, none failed, and 5 passed after, it takes 7 failed after to count; `compare` prints the number.

## Break-it probe

For any change to tests or test setup: on a local throwaway branch (never pushed, so no CI run starts), re-plant a bug the suite caught before, run the affected tests, confirm the changed test itself fails for that reason, report it, delete the branch.

## Receipt

Print it whatever the verdict. Never post it anywhere yourself, and leave out the repository name unless asked. Example with made-up numbers:

```text
CI speed receipt
  PR wait, median: 14m 10s -> 9m 20s (24 runs before, 22 after)
  slowest 5%: 31m 02s -> 18m 40s (provisional)
  runner-minutes per run: 41 -> 27
  failed runs: 1 of 25 before, 0 of 22 after
  tests: 1,842 ran before, the same 1,842 after, by name; 0 new failures
  verdict: median faster (24 runs before, 22 after)
  change: seed the pnpm cache from main
```
