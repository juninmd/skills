
# Legacy Refactoring

Operationalizes Michael Feathers' *Working Effectively with Legacy Code*: pin today's behavior with a characterization test, find a seam, and change the dependency there instead of in the tangle.

## Preflight
```bash
rg -l "$(basename target.ts .ts)" --glob '*test*'   # is there any coverage at all?
git log --oneline -20 -- path/to/target             # how often does it change, and why
```

If there is no coverage, the first deliverable is the safety net — not the refactor.

## Workflow
1. Pin current behavior with characterization tests: assert what the code does **today**, bugs included — not what it should do.
2. No return value to assert against? Build a golden master instead (below).
3. Find a seam where behavior can be swapped without editing the code around it.
4. Break the dependency at that seam so the unit becomes constructible in a test.
5. Sprout the new behavior in a fresh, tested function or class, then call it from the old code with one line.
6. Replacing a whole subsystem? Strangle it: route callers through a facade and move them across one at a time.
7. Shadow the cutover — run old and new on the same input, compare, log divergence — before removing either path.

## Writing a Characterization Test
You are not asserting correctness. You are recording reality so a refactor cannot change it silently.

```
1. Call the code with realistic input.
2. Assert something deliberately wrong.
3. Run it. The failure message tells you the actual value.
4. Paste that value in as the expectation.
5. Add a comment where the recorded behavior is a known bug.
```

When a characterization test asserts something wrong, **keep it** and note the bug separately. Fixing it in the same commit destroys the safety net you just built.

## Seams

| Seam | Where it exists | Break it by |
|---|---|---|
| Parameter | The dependency is already an argument | pass a test double |
| Constructor | Built in `__init__`/constructor | inject it, default to the real one |
| Interface | A protocol/interface already exists | implement a fake |
| Module | `import`ed at module level | monkeypatch or inject the module |
| Subclass | Method is overridable | subclass and override in the test |
| Environment | Reads config, clock, or filesystem | wrap in a function you can replace |

Take the **smallest** seam that works. Restructuring a package to test one function is a rewrite wearing a refactor's clothes.

## Sprout, Wrap, Strangle

| Technique | When | Shape |
|---|---|---|
| **Sprout** | New behavior, existing method too tangled to touch | Write it fresh and tested; call it with one line |
| **Wrap** | Must run before/after the existing behavior | Rename the old method, add a new one that calls it |
| **Strangle** | Replacing a whole subsystem | Facade in front, move callers one at a time, delete when the old path is unused |

## Proving the Strangle Finished
Searching for callers is not enough — reflection, string dispatch, and cron jobs do not appear in a grep.

```ts
function legacyPath(...args) {
  metrics.increment('legacy.orderCalc.hits');   // then delete only after
  log.warn('legacy path hit', { caller: new Error().stack?.split('\n')[2] });
  return oldImplementation(...args);
}
```

Delete only after that counter stays at zero through a **full traffic cycle** — including the monthly job.

## Simplify Directly, or Characterize First?

Not every cleanup needs the full seam-and-characterize procedure. Gate on coverage, not on how confident you feel:

| State | Action |
|---|---|
| Meaningful test coverage already asserts the behavior being touched | Simplify directly under [simplification/simplification.md](simplification/simplification.md); run tests after every change |
| Some coverage, but not on the exact branch or edge case being changed | Add the missing test first — a normal test, not a characterization one, since the intended behavior is already known |
| No coverage, and the intended behavior is unclear or undocumented | Characterization tests first, per this file; do not simplify from a guess at intent |
| No coverage, but the code is small and behavior looks obvious from reading it | Still write the characterization test — "obvious" is where the fewest tests exist and the most regressions hide |

Feathers' point is not "always write characterization tests" — it is that changing code you cannot safely re-run is not refactoring, it is gambling with production as the test suite.

## Verifying a Refactor's Behavior-Preserving Claim

A pull request titled "refactor" or "no behavior change" is a claim, not a fact. Check it the way [untrusted-contribution.md](untrusted-contribution.md) checks any author assertion:

| Signal in the diff | Verdict |
|---|---|
| Characterization or existing tests pass unchanged, with no test file touched | Supports the claim |
| A test's assertion value changed in the same commit | Behavior changed; the claim is false or incomplete — demand the pre-change value and why it was wrong |
| Control flow reordered around an early return, a caught exception, or a default value | Re-derive the truth table by hand; reordering silently changes behavior on cases the tests do not hit |
| A "pure rename" also touches a call site's argument order or count | Not pure; review it as a behavior change |
| Shadow comparison (old and new run side by side) shows any divergence not called out up front | The refactor is not finished, regardless of what the title claims |

A refactor that needs a new test to prove it safe was already a behavior change wearing a refactor's name.

## Stop
- No characterization test or golden master pins current behavior. Build it before any edit.
- Behavior would change in the same commit as the refactor. Split them; the safety net lands alone, first.
- The old path's counter is not yet zero across a full traffic cycle. Do not delete it — including the monthly job.

## Rules
- Never refactor and change behavior at once. Land the safety net first, in its own commit, and say so in the message.
- Do not rewrite from scratch. A rewrite discards the undocumented behavior production depends on, and you will rediscover it as incidents.
- Boy-scout only what you touched. A sweep across untested code is a rewrite in disguise.
- Shadow comparison must handle the cases where old and new *legitimately* differ — log those as expected divergences up front, or the noise buries the real ones.
- Delegate schema and data cutover to `data-engineering`; once the safety net holds, delegate cleanup to `code-review`. Reconstructing what a whole undocumented system does belongs to [legacy-discovery procedure](legacy-discovery.md).

## Checklist
- [ ] Characterization tests or a golden master pin current behavior before any edit.
- [ ] Known bugs recorded, not fixed, inside the safety net.
- [ ] Dependency broken at the smallest real seam, not by restructuring the module.
- [ ] New behavior sprouted or wrapped, never edited into the tangle.
- [ ] Shadow comparison clean and the old path's counter at zero through a full cycle before deletion.
