
# Legacy Refactoring

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

## Stop
- No characterization test or golden master pins current behavior. Build it before any edit.
- Behavior would change in the same commit as the refactor. Split them; the safety net lands alone, first.
- The old path's counter is not yet zero across a full traffic cycle. Do not delete it — including the monthly job.

## Rules
- Never refactor and change behavior at once. Land the safety net first, in its own commit, and say so in the message.
- Do not rewrite from scratch. A rewrite discards the undocumented behavior production depends on, and you will rediscover it as incidents.
- Boy-scout only what you touched. A sweep across untested code is a rewrite in disguise.
- Shadow comparison must handle the cases where old and new *legitimately* differ — log those as expected divergences up front, or the noise buries the real ones.
- Delegate schema and data cutover to `migration-engineering`; once the safety net holds, delegate cleanup to `code-simplification`. Reconstructing what a whole undocumented system does belongs to `legacy-discovery`.

## Checklist
- [ ] Characterization tests or a golden master pin current behavior before any edit.
- [ ] Known bugs recorded, not fixed, inside the safety net.
- [ ] Dependency broken at the smallest real seam, not by restructuring the module.
- [ ] New behavior sprouted or wrapped, never edited into the tangle.
- [ ] Shadow comparison clean and the old path's counter at zero through a full cycle before deletion.
