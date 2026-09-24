# What the Evidence Says About Review

## Contents

- Size and Duration Decide Detection
- Reviewers Find Style, Not Bugs
- Checklists Help by Being Complementary
- What Review Will Never Catch
- Machine Reviewers Are Assistants, Not Approvers
- Known Gaps in the Evidence

The empirical base for how a review is run: how big, how long, what it catches, what it never will.
Claims here carry a source; where the primary text could not be confirmed, the line says so.

## Size and Duration Decide Detection

| Constraint | Number | Source |
|---|---|---|
| Inspection rate above which detection collapses | ~400–500 LOC/hour | Cohen, *Best Kept Secrets of Peer Code Review* (Cisco/SmartBear, 2006) |
| Sweet spot per sitting | 200–400 LOC over 60–90 min, 70–90% of defects found | same |
| Change size that is "usually too large" | ~1,000 lines; ~100 lines is usually reasonable | [Google eng-practices, Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html) |
| Maximum reviewer response time | one business day | [Google eng-practices, Speed](https://google.github.io/eng-practices/review/reviewer/speed.html) |

The Cisco figures are consistent across secondary sources but were not read from the primary PDF in
this research pass — treat them as reported, not independently verified. The Google numbers are from
the current official docs.

Size is conceptual, not mechanical: 200 lines in one file can be reviewable while 200 lines spread over
50 files is not. Independent corroboration of the size effect by a different method: the more files a
change touches, the lower the proportion of *useful* review comments
([Bosu, Greiler, Bird, MSR 2015](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/bosu2015useful.pdf)).

**Applied:** a change too large to review is rejected for that reason alone — Google's docs explicitly
authorize this. Splitting it is cheaper than pretending to have read it.

## Reviewers Find Style, Not Bugs

About **75% of defects found in review are evolvability issues** — maintainability, readability,
structure — and only **~25% are functional defects**
([Mäntylä & Lassenius, IEEE TSE 35(3), 2009](https://dl.acm.org/doi/abs/10.1109/TSE.2008.71); 9 industrial
and 23 student reviews, 759 defects classified).

The mechanism is structural, not a matter of reviewer diligence: style is cheap to judge from a diff,
while functional defects need execution-context reasoning the diff does not supply — and it degrades
further as the change grows. The widely quoted "only 15% of Microsoft reviews find a defect" figure
could **not** be confirmed against the primary text; do not cite it.

**Applied:** spend the attention budget on the passes that the evidence says get skipped — contracts,
concurrency, data layer, failure handling — and let the linter own style. A review that produced only
naming comments has not been done.

## Checklists Help by Being Complementary

Perspective-based reading (tester / developer / user lenses) found a **wider and more complementary set
of defects** than ad hoc review
([Basili et al., Empirical Software Engineering, 1996](https://link.springer.com/article/10.1007/BF00368702)).
A 2006 replication found **no advantage over a plain checklist** on one document
([EMSE 2006](https://link.springer.com/article/10.1007/s10664-006-5967-6)).

Read together: the gain comes from covering different lenses, not from any lens being better. That is
the argument for independent reviewers with assigned perspectives rather than one reviewer with a
longer checklist. No controlled study quantifying checklist fatigue was found — treat that risk as
practitioner lore, not measurement.

## What Review Will Never Catch

- Static analysis is not the backstop either: **22% of vulnerability-contributing commits went
  undetected by all five SAST tools evaluated**
  ([ACM SIGSOFT 2024](https://dl.acm.org/doi/10.1145/3650212.3680313)).
- Runtime and memory defects surface through execution. A supplier case study reported 32% of bugs
  found solely by fuzzing (secondary citation, not re-verified — treat as indicative).
- Concurrency, performance, and data-volume regressions need a test, a plan, or a load run, not a
  careful read. Route them to `test-engineering` and `performance-engineering` rather than pretending
  a diff can settle them.

## Machine Reviewers Are Assistants, Not Approvers

Evaluated on code review tasks, GPT-4o reached **68.5%** and Gemini 2.0 Flash **63.9%** accuracy on
correctness classification, with correction success of 67.8% and 54.3%; both **degraded substantially
without contextual problem description**, and the authors recommend human-in-the-loop rather than
autonomous review ([arXiv:2505.20206, 2025](https://arxiv.org/abs/2505.20206)). A field study at
WirelessCar found reviewer preference for AI-led review to be **conditional** — on familiarity with the
codebase and on the severity of the change — with false positives and trust named as the live concern
([arXiv:2505.16339, 2025](https://arxiv.org/abs/2505.16339)).

Deployed at scale the picture holds. Across 19,450 pull requests, PRs reviewed only by a review agent
merged at **45.20% against 68.37%** for human-only review — 23 points lower — and 12 of 13 agents
averaged a signal ratio below 60%
([arXiv:2604.03196, MSR 2026](https://arxiv.org/abs/2604.03196)). An industrial deployment over 4,335
PRs saw 73.8% of automated comments resolved but mean closure time rise from 5h52 to 8h20
([Cihan et al., ICSE-SEIP 2025](https://arxiv.org/abs/2412.18531)).

The failure mode on the human side is measured too: over seven months and 11,429 reviews by 400 repeat
reviewers of agent-authored code, approval rose from 30.1% to 36.8% while inline comments fell 22% and
latency grew 3.5x, with PR size flat — habituation under load, not earned confidence
([arXiv:2606.22721, 2026](https://arxiv.org/abs/2606.22721)).

The scaling failure is already observable: curl shut down its bug bounty after the confirmed-
vulnerability rate among submissions fell from over 15% to under 5% under a flood of AI-generated
reports. Once findings are cheap, **triage attention becomes the binding constraint**, not detection.

**Applied:** give a machine reviewer the context it needs (acceptance criteria, base/head, callers) or
its accuracy drops by design; cap output; and never let volume of findings stand in for review quality.
The output cap and "say plainly that you found nothing" rule in [expert-review.md](expert-review.md)
exist for this reason.

## Known Gaps in the Evidence

No 2023–2026 controlled replication of the Cisco size-vs-detection curve exists. Median change size and
review latency distributions at Google or Microsoft were not extracted from primary tables. No
vendor-independent false-positive rate for any commercial AI review product was found. Treat any
specific number quoted for those as unsourced.
