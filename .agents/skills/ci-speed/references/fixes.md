# Fixes by cause family

`M` is the script path defined in [measuring.md](measuring.md). One change per pull request. Each fix keeps every test running; a change that would run fewer tests, add a retry, widen a timeout, skip, quarantine or loosen an assertion is not a fix here. Measure each as [measuring.md](measuring.md) says.

## Contents

- Cache
- Workflow shape
- Slow tests
- Flaky tests
- Push guard

## Cache

1. **Hit rate per key.** Sample about 20 runs on pull requests and on the default branch. For each job, `node $M cachelog --repo OWNER/NAME --job JOB_ID` prints one fixed label per cache line with an 8-hex hash that names the key without printing it. If none of 20 tries hits, the hit rate is under 14% at 95% confidence (0.86^20 is under 5%, tries treated as independent). Record per key: exact hit, partial hit, miss or unknown. Some setup actions print no key: then the outcome is unknown unless the step's `cache-hit` output settles it. List existing caches with `gh api repos/OWNER/NAME/actions/caches --paginate`.
2. **Check each silent miss; the logs say which applies.**
   - Nothing saved on the default branch: add the save to an existing `push` run on that branch. Adding a new warming run costs minutes: ask first. `pull_request_target`, `issue_comment` and `workflow_run` runs restore but do not save by default.
   - Key misses the toolchain, tool version, compiler flags, OS or architecture: put each in the key; a dependency cache also keys on the lockfile. A build cache (`GOCACHE`, sccache, `target/`) keyed with a trailing run id or commit plus a `restore-keys` prefix restores the newest one, and grows: prune it, and ask before raising the cap.
   - Parallel jobs share one key: one key per job, for example a job-name prefix.
   - Cache cap evicts entries: stop saving caches nothing restored over the retention window and the workflow's usual cycle.
   - No cache at all: the setup action's own `cache` input (`cache: pnpm`, `cache: pip`) or `actions/cache`; Docker builds use `cache-from: type=gha` and `cache-to: type=gha,mode=max` with a Buildx builder that supports it.
   - Cache costs more than it saves: before caching `node_modules` or anything a package manager can rebuild, compare the whole path (restore, any install still run, save) on hits, partial hits and misses, weighted by frequency, against a filtered or offline install. Keep the faster.
3. **Never** let a cache hit skip work the job would otherwise do (no "skip tests on cache hit"). Test-result caches are sound only for the same binary, flags, files read and environment.
4. **Prove it:** the first run after a key change may be cold; count cold and warm runs separately with `--cache-state`, so the fix shows its warm-up cost too.

## Workflow shape

First read which checks are required (`gh api repos/OWNER/NAME/rules/branches/BRANCH` and `.../branches/BRANCH/protection/required_status_checks`; on 403 or 404 ask). A required job's name must keep reporting or every pull request waits forever. Pick the change that saves the most wait on the slowest path, or when off it, the most runner-minutes.

- **Cancel superseded PR runs.** Concurrency group per pull request for first attempts of `opened`, `synchronize`, `reopened`; every other run in a group of its own so nothing on the default branch is cancelled. Put it only in the top-level workflow, never a reusable one. Keep an existing deploy or environment group and ask. Apply only if a cancelled or skipped test run cannot pass a required check: trace each required check back to the test jobs (a job skipped because a needed job failed reports success), then verify on a real PR that cancelling mid-run leaves the required checks neither `success`, `skipped` nor `neutral`. If any check shows otherwise, undo it and report.

  ```yaml
  concurrency:
    group: ${{ github.workflow }}-${{ github.event_name == 'pull_request' && github.run_attempt == 1 && contains(fromJSON('["opened","synchronize","reopened"]'), github.event.action) && format('pr-latest-{0}', github.event.pull_request.number) || format('run-{0}', github.run_id) }}
    cancel-in-progress: ${{ github.event_name == 'pull_request' && github.run_attempt == 1 && contains(fromJSON('["opened","synchronize","reopened"]'), github.event.action) }}
  ```

  Group names compare ignoring case across the repository: check against every existing group and give each workflow its own prefix where two could meet.
- **Fold tiny jobs** whose work takes seconds but whose setup takes a minute: one job pays setup once and runs the tasks side by side (background each, `wait` on each pid, fail if any failed, print each output and exit code). Prove exit codes locally by making each task fail in turn. Check working directory, environment, matrix inputs and file or port collisions. Keep separate jobs where the check is required by name or runners differ.
- **Drop a `needs` edge** only when the upstream passes no output or artifact and gates nothing.
- **Trim checkout:** the default fetches one commit; where history is read, set the depth first, then `filter: blob:none`. Compare checkout plus the reading step, since on-demand fetches move time.
- **Download prebuilt tools** at the same version and features instead of compiling per run; time both ways.
- **Cap hung jobs** with `timeout-minutes` well above the longest successful run in the history; report that run beside the cap. A timeout is not success: check it reaches a required check (the job is required, or a required `if: always()` job fails unless `needs.<job>.result` is `success`).
- **Never add path filters or `if:` conditions that skip a check.** That is a person's decision. A `paths:`-skipped workflow holding a required check stays pending; an `if:`-skipped job reports success. Report what you find.

List in the pull request every task that ran before and still runs. GitHub rounds each job up to the minute, so folded jobs can also save partial minutes.

## Slow tests

1. Time every test from the report CI already writes (JUnit, `pytest --durations=0`, `go test -json`, Vitest or Jest JSON). A test's time bounds what fixing it saves, and on a parallel shard it shows only in the shard's finish. Local timing only ranks tests; never claim a result from it. For the wait, rank by seconds on the shard that finishes last; for minutes, by total across shards.
2. Start with the slowest test; look for the mundane: a missing mock or fake for something the test is not about, per-test setup that could run once per file (migrations, seeding, compiling, browsers), real sleeps where a fake clock or an event wait fits, something started for nothing. Mock what the test is not about, never the subject, never a call whose behavior the test checks. If the right fix changes an assertion or expected value, stop and flag it.
3. Cores before shards: compare the runner's worker count with `nproc`; a shard pays machine setup again, a worker does not. Spare cores are not spare memory, disk or database: keep a worker count only if CI time and failures say so. Per-file module reloading (some runners isolate each file by default) can be large: turn it off file by file as an opt-in, with teardown resetting shared state, and run each changed file alone and the suite shuffled.
4. If one shard lags, balance by recorded durations before adding shards. Check the split has no duplicates: `tests` catches a lost test, not one run twice.
5. Offer, never add unasked, a per-test time check set from that test's spread on CI; report how often it would have failed past runs.
6. Run the changed tests, then the whole suite with `tests`. A test that still runs can have stopped checking: run the break-it probe in [measuring.md](measuring.md).

## Flaky tests

Never: a retry (runner, test or workflow), an added or longer sleep or timeout, skip, `xfail`, quarantine, `.only`, mocking the subject, a loosened assertion, or fewer workers to hide a race. If the only fix found is one of these, stop and report.

1. **Find flakes from history:** `split` lists jobs that failed then passed on a rerun of the same commit (`--json` lists all). Rank by occurrences times observed cost.
2. **Reproduce first:** run the one test many times in a fixed batch as CI ran it, then under strain (fewer CPUs, a busy machine, random order, the whole file or suite around it), raising the count (10, 50, 100, more) until it fails the way CI did. Record the command and rate. No reproduction, no fix: report what was tried.
3. **Find the cause:** waiting on real time (wait for the event or inject a fake clock); shared state (isolate per test or worker); order dependence (own setup); a race in the code (fix the code); something outside the code (a fake for what the test is not about). A runner that died is not a flaky test.
4. **Fix the cause** in the smallest change, explain what raced against what, then search the suite for the same pattern and fix every test it affects.
5. **Prove with the same repetition,** sized beforehand: fix the batch size n, count its x failures whatever they are, then

   ```bash
   node $M flakebound --failures X --runs N
   ```

   It prints the low end of the exact 95% interval for the rate and the re-test runs that would catch a flake still failing at that rate with 95% probability. With no failures there is no low end: reproduce first. Green runs bound how often it can still fail; they never prove it cannot. Keep an upper bound on any new wait so a lost event still fails promptly.
6. One cause per pull request, with every test that shares it.

## Push guard

For coding agents that push repeatedly to find format, lint or type errors.

1. **Measure the waste** with `split`: pushes per PR, catch-up runs and their minute share (read a sample), the share of minutes on failed runs, and which steps failed (`gh run view RUN_ID --json jobs`).
2. **Fast pre-push check:** the repository's own format, lint and type commands on changed files, in its existing hook tool (lefthook, husky, pre-commit) or `scripts/pre-push`, installed by a one-line setup step. Report two numbers apart: runner-minutes it can save, and wait (it pays when its total time, including stopped and fixed attempts, is below the time until those rounds' failing checks reported). Keep any pre-push hook already there.
3. **Keep the server check.** The same checks stay required in CI: agents can skip hooks, so a hook is a shortcut, never the gate.
4. **Rules for agents,** appended to the repository's `AGENTS.md` (or `CLAUDE.md`): at most two CI rounds per task, then stop and report; run the fast checks before every push and never skip the hook (`--no-verify`, a variable); never pipe a test run into `tail` or `head`, write it to a file; never set a commit status or check run yourself; if a test exposes a real bug fix the code, not the test; update a branch from main only for a conflict, a needed change, or once before a merge when protection requires it.
5. **Offer** a Claude Code Stop hook that runs the pre-push check and exits 2 with the failure on stderr, which keeps the agent working. Do not add unasked.
6. **For a person:** protection settings (admins, bypass roles, each required check's expected source) and, if protection requires up-to-date branches and `split` shows many catch-up runs, a merge queue (every required workflow then needs the `merge_group` trigger). Never skip or hold CI on pull requests, drafts included, to save minutes.
7. Two pull requests, measured apart: the hook with its measured time, then the rules.
