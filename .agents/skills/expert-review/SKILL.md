---
name: expert-review
description: |
  Review code, diffs, plans, and designs for defects, regressions, hidden assumptions, and missing proof. Use for pull-request review, design review, plan stress-testing, risk analysis, and evidence-based findings.
---

# Expert Review

## Preflight
```bash
git diff --stat <base>...HEAD          # scope before opinions
git diff <base>...HEAD -- '*test*' | head -40   # did the tests move with the code?
```

Establish the intended behavior and the acceptance criteria first. A review without a stated intent degrades into taste.

## Workflow
1. Establish the artifact, the intended behavior, the constraints, and the acceptance criteria. A review without a stated intent degrades into taste.
2. Read the changed path **and its surroundings**: callers, contracts, tests, and the documentation that promises something about it.
3. Sweep the high-cost categories first (see the pass order). Style is last, always.
4. Prove each finding before reporting it. Separate confirmed defects from questions and from residual risk.
5. Report findings ordered by severity, each with file/line, impact, evidence, and the smallest remediation.

## Pass Order
Reviewing in this order means the expensive defects surface while attention is still fresh.

| Pass | Looking for |
|---|---|
| Correctness | wrong condition, off-by-one, unhandled null, wrong return, inverted boolean |
| Data safety | data loss, unbounded delete, missing transaction, non-idempotent retry |
| Security | injection, missing authz check, secret in code or log, unsafe deserialization |
| Compatibility | broken contract, removed field, changed status code, migration ordering |
| Concurrency | race, unawaited promise, shared mutable state, lock ordering |
| Operability | no timeout, no retry bound, unbounded memory, missing observability on a new path |
| Tests | the unhappy path nobody covered; an assertion that cannot fail |
| Style | last, and only when it obscures meaning |

## Severity

| Severity | Definition | Merge |
|---|---|---|
| **Blocker** | Data loss, security hole, broken contract, broken build | Stops |
| **Major** | Wrong behavior on a real path with no workaround, or an untested branch carrying risk | Fix, or record why not |
| **Minor** | Wrong behavior with a known workaround, or a maintenance cost | Merge, then fix |
| **Nit** | Preference | Say so; never let it outrank the above |

## What Makes a Finding Real
Every finding needs a **failure scenario**: concrete input or state, then the wrong output or crash. A finding that cannot be stated that way is a question, and belongs in a different list.

```
finding:   `parseAmount` returns NaN for a comma decimal separator
location:  src/billing/parse.ts:42
scenario:  locale pt-BR sends "10,50" → Number("10,50") → NaN → charged 0
severity:  Blocker (silent financial loss)
smallest:  parse with the request locale, reject non-finite before charging
```

## Socratic Mode
Enter it **only** when the artifact is a plan or design with an unresolved decision, or the user asks. Then ask one decision-relevant question at a time and stop once the evidence supports recommending a path. On a code diff, report findings instead — questions there read as evasion.

## Reference Routing
- Practical review cases: [real-world-cases.md](references/real-world-cases.md)
- Use [doc-formats.md](references/doc-formats.md) when reviewing PRDs, specs, ADRs, plans, or other structured documents.

## Stop
- A finding has no concrete failure scenario. It is a question, not a finding — move it to the observations list.
- The diff cannot be understood without runtime or contract evidence you have not gathered. Go get it before asserting a bug.
- A blocker is present. Say so first and plainly; do not bury it under a summary.

## Rules
- Review the diff, not the file. Pre-existing debt the change merely touches is out of scope — list it as an observation, and raise it as a finding only when this change makes it materially worse.
- Cap the output at ten findings. Report every blocker and major; if minors and nits exceed the cap, report the count and drop the rest. A review that lists everything is read as noise and actioned as nothing.
- Findings lead, highest severity first. The summary comes after them, never before.
- Do not infer a bug from a diff alone when runtime or contract evidence is available — go get it.
- Do not report style preferences as defects, and never pad a review to look thorough.
- If no defect is found, say so plainly and state the remaining test gaps. "Looks good" with no gap analysis is not a review.
- The reviewer is not the author. Whoever wrote the change cannot be the one who clears it — self-verification inherits the assumption that produced the defect. When the author is unavoidable, the finding stays open until something external confirms it: a test, a run, another reader.
- One defect found is a class to sweep, not an instance to close — hand that to `variant-analysis`.
- Reproducing a finding's root cause belongs to `diagnostics`; writing the test it exposed to `test-engineering`; the delivery gate to `finishing-dev`.

## Checklist
- [ ] Artifact, intended behavior, and acceptance criteria stated before reading.
- [ ] All high-cost passes made before any style comment.
- [ ] Every finding carries a concrete failure scenario, not a suspicion.
- [ ] Severity assigned by consequence, not by confidence.
- [ ] Output capped and ordered; observations kept separate from findings.
- [ ] Remaining risk and test gaps stated explicitly, even when nothing was found.
