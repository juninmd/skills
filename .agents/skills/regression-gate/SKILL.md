---
name: regression-gate
description: |
  Decide if a change is safe to ship by replaying the project's checks on a captured baseline and diffing the candidate against it. Use for a one-shot stability verdict before release, green-to-red detection, flaky versus real failures, and performance or size gates. See metric-loop for tuning.
---

# Regression Gate

## Preflight
```bash
git merge-base HEAD main                     # the base ref the candidate is judged against
jq -r '.scripts | keys[]' package.json       # checks this project already owns
```

A protocol over the project's **own** test, bench, snapshot, and migration commands, never a bundled framework. Without them there is nothing to gate — that is `test-engineering` first.

## Workflow
1. Pick the base ref explicitly and map the project's existing checks to the dimensions below.
2. Capture the baseline in an isolated worktree, recording its result per dimension.
3. Classify every unit against that baseline **before** any diff.
4. Run the candidate per dimension, one logged row per dimension and axis.
5. Decide: any hard green-to-red blocks, else weight the score dimensions against the threshold.
6. On a confirmed hard regression, hunt the root cause; bisect only what reproduces three times out of three.
7. Report the verdict with its arithmetic and gaps, then remove every worktree.

## Classify Before You Diff
A regression is a **green to red transition, and nothing else**. Tag every unit against its baseline result, matching by test id first and path second — a rename is not a regression.

| State | Baseline to candidate | Gates? |
|---|---|---|
| regression-eligible | green to red | **yes — the only blocking case** |
| pre-existing | red to red | no; broken before the change |
| new-coverage | absent to red | no; that is coverage, not regression |
| flaky | nondeterministic on the baseline | no; route to the flakiness score |
| baseline-unavailable | never green on the base ref | no; advisory, always listed |

Skipping classification is how a gate blocks on debt it did not create — and how a team learns to bypass it.

## Capture the Baseline
```bash
git worktree add --detach "baseline/$SHA" "$SHA"   # detached: works even when base == HEAD
(cd "baseline/$SHA" && git submodule update --init && npm ci)  # lockfile is SHA-pinned; cache is sound
# ... run each dimension there, record the number or the green-set ...
git worktree remove "baseline/$SHA" && git worktree prune      # always, including on crash
```

Cache by full SHA. A contract diff needs no build; functional, e2e, and migration runs need the full environment. Worktree mechanics belong to `using-git-worktrees`.

## Dimensions

| Dimension | Tier | Compare | Blocks? |
|---|---|---|---|
| functional | hard | baseline green-set versus candidate | yes |
| api-contract | hard | exported schema or type diff: breaking? | yes |
| data-migration | hard | applies clean, re-applies idempotently, app boots | yes |
| integration-e2e | hard | e2e green-set diff | yes |
| flakiness | score | N runs on **both** sides, count nondeterminism | no |
| performance | score | K independent-process samples per side, median delta | no |
| resource | score | bundle, image, or memory delta against a budget | no |
| visual | score | containerized render diff ratio | no |

Hard dimensions block on a single green-to-red. Score dimensions produce a 0-100 subscore, and the verdict is **stable** only if their weighted total clears the threshold. Print that arithmetic and name every dimension that did **not** run: a silently skipped dimension is a false green.

## Two Traps That Fake a Verdict
- **Flake math.** Detecting a p-flake in n runs is `1-(1-p)^n`: five green runs at p=5% is a ~23% chance of having caught it. Five for five is not stability — state n and its detection rate.
- **Sampled subsets.** An affected-test mapper (`jest --findRelatedTests`, `nx affected`) is best-effort static import analysis, blind to dynamic requires, global setup, and runtime wiring. Name it and its blind spot; the full suite stays the high-stakes default.

## Stop
- The base ref was never green for a dimension. Report baseline-unavailable: never a pass, never a block.
- A candidate failure sits inside the baseline's flake envelope. Not a regression — route it to flakiness, do not bisect.
- A migration is about to hit a database whose URL is not allowlisted. Stop; `security-ops` holds the anchored check.
- The gate is red and it must ship anyway: a human decision with a written reason, never a lowered threshold.

## Rules
- Only green to red blocks. Red to red, absent to red, and flake to red are reported, never gated.
- Every performance sample is an independent process launch, warmups discarded. In-process iterations autocorrelate through JIT, GC, and thermal state, invalidating any significance test run over them.
- Bisect only what reproduces three times out of three; non-deterministic failures get differential root cause instead.
- Cap total runs: dimensions times axes times samples grows fast, so project it and confirm before passing the ceiling.
- Fix cycles are bounded: each pass must strictly shrink the blocking set, and the final re-gate runs the full battery, not the failing subset.
- A stable verdict is not deploy approval: shipping is `release-management`/`finishing-dev`, a failing test `test-engineering`, a slow dimension `performance-engineering`, a root cause `diagnostics`.
- Protocol adapted from the autoresearch regression gate by uditgoenka (MIT).

## Checklist
- [ ] Base ref explicit, baseline captured in an isolated worktree.
- [ ] Every unit classified before any diff; pre-existing and new-coverage excluded from the verdict.
- [ ] Flakiness measured on both sides, with n and its detection rate stated.
- [ ] Performance sampled as independent processes; medians and effect size reported.
- [ ] Verdict shows its arithmetic and names every dimension that did not run.
- [ ] Worktrees removed and pruned, including after a failure.
