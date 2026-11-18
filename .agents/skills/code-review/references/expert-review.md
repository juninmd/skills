
# Expert Review

## Contents

- Preflight
- Workflow
- Pass Order
- Spec Pass
- Adversarial Checklist
- Severity
- What Makes a Finding Real
- Aggregating Independent Passes
- Socratic Mode
- Reference Routing
- Stop
- Rules
- Checklist

## Preflight
```bash
git diff --stat <base>...HEAD          # measure the change before forming opinions
git diff <base>...HEAD -- '*test*' | head -40   # did tests change alongside the code?
```

## Workflow
1. Pin down four things first: the artifact, the intended behavior, the constraints, the acceptance criteria. Without a stated intent, a review turns into taste.
2. Read beyond the hunks: callers, contracts, tests, and any doc that makes promises about the changed path.
3. Go through the costly categories first (see Pass Order). Style comes last, every time.
4. Prove a finding before you report it. Keep confirmed defects, open questions, and residual risk in separate lists.
5. Order findings by severity. Each gets file and line, impact, evidence, and the smallest fix.

## Pass Order
Costly defects should surface while your attention is freshest, so work top to bottom.

Design goes first by this repo's convention: if the layering is wrong, every line-level comment is wasted effort.

| Pass | Looking for |
|---|---|
| Design | a layer, dependency, or abstraction the callers do not need, or code living in the wrong module; report it only with a stated consequence (drift, untestable coupling, broken contract), otherwise it is an observation |
| Spec | a requirement missing, partial, or built wrong; behavior nobody requested (see Spec Pass) |
| Correctness | bad condition, off-by-one, unhandled null, wrong return value, inverted boolean |
| Data safety | data loss, unbounded delete, absent transaction, retry that is not idempotent |
| Security | injection, missing authorization check, secret in code or logs, unsafe deserialization |
| Compatibility | broken contract, removed field, altered status code, migration order |
| Concurrency | race, unawaited promise, shared mutable state, lock ordering |
| Operability | no timeout, unbounded retries or memory, new path with no observability |
| Tests | the failure path nobody exercised; an assertion that can never fail |
| Style | last, and only when it hides meaning |

## Spec Pass
Code can meet every standard and still be the wrong feature. Compare the diff with what was asked before judging how it was built.

```bash
git log --format=%B <base>..HEAD | rg -o '(#|!)[0-9]+|[A-Z][A-Z0-9]+-[0-9]+' | sort -u   # issue and ticket refs
gh pr view --json body,closingIssuesReferences 2>/dev/null | jq -r '.body' | head -40
```

1. Locate the spec, in this order: refs in commit messages, the PR body and linked issues, a path the user gave, a plan or spec doc named after the branch. If none exists, ask once; if still none, report "no spec available" and skip the pass.
2. Write each requirement and acceptance criterion as one line.
3. Match every requirement to the hunks that implement it, then read the leftover hunks for behavior the list never mentioned.
4. Report four kinds, each quoting the spec line it relies on: **missing**, **partial** (some cases or criteria unmet), **wrong** (implemented, but contradicts the line), **unrequested** (scope creep: flags, endpoints, options, or abstractions that no line asks for).
5. Where the spec says nothing, use what a reasonable user would expect. Silence does not grant permission, but raise the gap as a question, not a defect.

Give spec findings their own heading. Folded into the correctness list, a clean build of the wrong requirement looks like approval. Severity still follows consequence: an unmet acceptance criterion is Major or higher; unrequested behavior is Minor unless it widens a contract, the attack surface, or upkeep cost.

## Adversarial Checklist

Read the diff as though it were engineered to pass review while hiding a bug. The author need not be hostile; that stance simply catches what a generous read skips. A reviewer exists to find what the author's own reading cannot.

| Hunt for | Why a generous read misses it |
|---|---|
| A caught exception with no log, rethrow, metric, or use | Looks "handled"; only following what happens next shows nothing does |
| An off-by-one at a loop bound or slice (`<` vs `<=`, `length` vs `length - 1`) | The happy-path test picks a value well inside the bound |
| No null, empty, or unicode handling on a new input | Manual tests use ASCII, non-empty, well-formed data |
| A database or API call inside a loop (N+1) | Reads as idiomatic; only counting calls per request exposes the multiplier |
| A loop, recursion, or queue consumer without a bound | Fine at review-time volume, broken at production volume |
| A write wrapped in a retry with no idempotency key | Looks like resilience; actually produces duplicate writes |

Swallowed exceptions and N+1 also appear in [regression-review.md](regression-review.md) under "Failures That Stop Being Visible" and "Data Layer". That file holds the full list of diff signals; this checklist supplies the mindset that sends you looking.

## Severity

| Severity | Definition | Merge |
|---|---|---|
| **Blocker** | Data loss, security hole, broken contract, broken build | Stops |
| **Major** | Wrong behavior on a real path with no workaround, or an untested branch that carries risk | Fix, or record why not |
| **Minor** | Wrong behavior with a known workaround, or an upkeep cost | Merge, fix afterward |
| **Nit** | Preference | Label it as one; it never outranks the rows above |

## What Makes a Finding Real
A finding needs a **failure scenario**: a concrete input or state, followed by the wrong output or crash. If you cannot write it that way, it is a question and goes in another list.

```
finding:   `parseAmount` returns NaN for a comma decimal separator
location:  src/billing/parse.ts:42
scenario:  locale pt-BR sends "10,50" → Number("10,50") → NaN → charged 0
severity:  Blocker (silent financial loss)
smallest:  parse with the request locale, reject non-finite before charging
```

## Aggregating Independent Passes
When several passes, reviewers, or models contribute, merge by rule instead of by feel:

| Step | Rule |
|---|---|
| Dedupe | same file:line and same defect become one finding at the highest severity |
| Rank | severity x confidence x number of passes that found it |
| Blind the labels | compare competing diffs under shuffled labels, otherwise authorship sways the vote |
| Anti-herd | agreement from everyone proves nothing; write one counter-argument before accepting |
| Converge | stop once one candidate wins several rounds; if the leader keeps flipping, make the call instead of iterating |

## Socratic Mode
Use it **only** on a plan or design with an open decision, or when asked. Ask one decision-relevant question at a time and stop when the evidence points to a path. On a diff, report findings; questions there look like dodging.

## Reference Routing
- Worked review cases: [real-world-cases.md](real-world-cases.md)
- PRDs, specs, ADRs, plans, and similar structured documents: [doc-formats.md](doc-formats.md)

## Stop
- A finding has no concrete failure scenario. Move it to observations as a question.
- The diff makes no sense without runtime or contract evidence you lack. Collect it before claiming a bug.
- A blocker exists. Lead with it, plainly, ahead of any summary.

## Rules
- Review the diff, not the whole file. Old debt the change only touches is an observation; it becomes a finding only if this change makes it clearly worse.
- Cap output at ten findings: all blockers and majors, then a count of the minors and nits left out. An exhaustive list is skimmed as noise and acted on as nothing.
- Findings come first, highest severity on top; the summary follows.
- Do not guess a bug from the diff when runtime or contract evidence is obtainable; obtain it.
- Do not present style preferences as defects, and never pad a review to seem thorough.
- No defect found? Say so directly and list the remaining test gaps. "Looks good" without a gap analysis is not a review.
- The author must not be the only verifier: self-checks carry the same assumption that produced the bug. If the author is unavoidable, findings stay open until an outside signal confirms them: a test, a run, or another reader.
- One defect means a whole class to sweep, not a single case to close; hand it to the [variant-analysis procedure](variant-analysis.md).
- Two passes by one model share blind spots. If a second model is reachable, run the independent pass there and say which one answered; it costs more, so offer and wait rather than doing it by habit.
- Root-causing a finding belongs to `observability`, writing the test it reveals to `test-engineering`, the delivery gate to `finishing-dev`.

## Checklist
- [ ] Artifact, intended behavior, and acceptance criteria written down before reading the diff.
- [ ] Every costly pass done before any style comment.
- [ ] Each finding has a concrete failure scenario, not a hunch.
- [ ] Severity reflects consequence, not confidence.
- [ ] Output capped and ordered; observations separate from findings.
- [ ] Remaining risk and test gaps stated, even when nothing was found.
