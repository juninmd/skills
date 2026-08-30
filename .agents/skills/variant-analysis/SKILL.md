---
name: variant-analysis
description: |
  After one defect is understood, sweep the codebase for every sibling of the same class and close the class for good. Use for the same mistake repeated elsewhere, copy-paste propagation, a misused API, and writing the lint rule that stops the pattern from returning.
---

# Variant Analysis

## Preflight
```bash
git log --oneline -3 -- path/to/fixed/file      # the fix you are generalizing from
rg -n 'faultyApi\(' -g '!*.min.*' | wc -l       # how many candidate siblings exist
git log --all -S'faultyApi(' --oneline | head   # where the pattern entered and spread
```

State the bug as a **pattern** before searching: the API misused, the guard missing, the arguments reversed. A bug you can only describe as a story cannot be searched for, and the sweep will miss its own siblings.

## The Search Ladder
Each rung finds what the one above it cannot. Stopping at the first is how a sweep misses the variant that matters.

| Rung | Finds | Command |
|---|---|---|
| Literal | Exact copy-paste | `rg -n -F 'user.role === "admin"'` |
| Structural | Same shape, renamed identifiers | `ast-grep -p 'if ($X.role === $_) { $$$ }'` |
| Callers of the API | Every use of the thing that is easy to misuse | `rg -n -w 'faultyApi'` then read each |
| Type or signature | Wrong argument order, nullable ignored | compiler or `tsc --noEmit` after tightening the type |
| Historical | Where it entered, and what it was copied into | `git log --all -S'pattern' --oneline` |
| Cross-repo | The same snippet in a sibling service | the org search, not just this checkout |

## Workflow
1. Write the pattern in one sentence, naming the precondition that makes it wrong.
2. Climb the ladder above. Record the query you ran at each rung — an unrecorded sweep cannot be repeated after the next fix.
3. Triage every hit into one of the verdicts below. Do not fix while triaging; the two jobs use different attention.
4. Fix each verdict group as its own reviewable batch, each with a test that fails before it.
5. Codify the pattern as a rule and wire it into CI. Without the rule, the sweep is a snapshot with a short shelf life.
6. State plainly what you did **not** sweep: other repositories, other languages, generated code, vendored trees.

## Triage Verdicts

| Verdict | Meaning | Action |
|---|---|---|
| Same class | The precondition holds here too | Fix in this batch |
| Same shape, safe here | Pattern matches, precondition does not | Record **why** it is safe, in a comment |
| Latent | Safe only by accident of a caller | Fix or guard; accidents get refactored away |
| Different | Superficial match | Tighten the query so it stops matching |

A "not a bug" without a recorded reason is a finding someone re-investigates next quarter.

## Codify the Rule
```bash
semgrep --config rule.yaml --error .           # locally, then in CI
ast-grep scan --rule rule.yaml
rg -n 'faultyApi\(' && exit 1                  # last resort: a grep gate beats no gate
```

Tune until the rule has no false positives on the current tree — a rule people learn to ignore has negative value. If it cannot be made clean, delete the sharp API instead of policing it.

## Stop
- The pattern cannot be stated in one sentence. Go back to `diagnostics`; you have a symptom, not a class.
- The sweep is landing in vendored, generated, or minified trees. Exclude them and fix the generator instead.
- The rule fires on correct code and cannot be tightened. Ship the fixes without it and say so, rather than adding noise CI will learn to skip.
- A hit turns out to be a different, worse bug. Stop the sweep and triage that one on its own; do not bury it in a batch.

## Rules
- One bug is a sample, not an incident. The question is always how many more there are, and the answer is rarely zero.
- Search for the pattern, never for the symptom. Symptoms are how variants hide.
- Triage before fixing. A sweep that fixes as it reads loses count and produces an unreviewable diff.
- Every "safe here" needs its reason written down where the next reader will find it.
- The rule is the deliverable. Fixes close instances; only the rule closes the class.
- Sweeping the same pattern twice with no new hits is evidence — record it and stop, rather than re-running it forever.
- Batches stay reviewable: group by verdict and by module, never one commit touching forty files for four different reasons.
- Reviewing one diff for defects is `expert-review`; this skill starts after a defect is already understood.

## Checklist
- [ ] Bug stated as a pattern with its precondition.
- [ ] All applicable ladder rungs run, with each query recorded.
- [ ] Every hit triaged to a verdict; "safe here" reasons written into the code.
- [ ] Fixes landed as per-verdict batches, each with a failing-first test.
- [ ] Rule wired into CI and clean on the current tree, or its absence explained.
- [ ] Unswept surface named explicitly.
