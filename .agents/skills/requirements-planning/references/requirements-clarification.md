
# Requirements Clarification

## Preflight
```bash
gh issue view <n> --json title,body,comments      # read the ticket fully first
rg -n '<the behavior in question>' src/ | head    # does the code already answer it?
```

Every question you could have answered by reading costs the user's patience for nothing.

## Workflow
1. Restate the request, naming the user, the trigger, and the outcome that counts as success. If you cannot restate it, that is the first question.
2. List what you are assuming. Anything you cannot point to in the request **is** an assumption, not a fact.
3. Rank assumptions by what breaks if you guess wrong, and ask only about the top ones.
4. Ask at most seven questions, **in one batch**, each answerable by picking an option, with your default marked.
5. Pin the edges — including the pre-existing data everyone forgets.
6. Write acceptance criteria as observable behavior, and record them where the work lives.
7. Confirm the recorded criteria and treat that text as the contract.

## Ask in One Batch, With Defaults
Single-question ping-pong turns a five-minute clarification into three days of calendar time.

```
1. Empty cart at checkout:      (a) 422 [default]  (b) 200 empty body  (c) 400
2. Duplicate submit within 5s:  (a) idempotent, return the first [default]  (b) 409  (c) create both
3. Price changed mid-session:   (a) re-quote and confirm [default]  (b) honor the old  (c) fail
4. Existing rows violating it:  (a) grandfather [default]  (b) migrate  (c) reject on next write
```

A marked default means silence still moves the work forward. A question with no default is a blocker you created.

## Rank Before Asking

| Assumption | If wrong | Ask? |
|---|---|---|
| Changes the data model | rework the schema and every consumer | yes, first |
| Changes who is allowed to do it | security defect | yes |
| Changes the failure behavior | wrong contract for every client | yes |
| Changes a label or copy | one-line fix later | no — pick and note it |
| Answerable by reading the code | nothing | **no — go read it** |

## The Edges

| Edge | Question it forces |
|---|---|
| Empty | zero items, no history, first run |
| Maximum | 10,000 items — paginate, cap, or reject? |
| Concurrent | two users, same second, same row |
| Unauthorized | wrong role, expired session, revoked plan |
| Offline / partial | half the request succeeded |
| Already done | the operation runs twice |
| **Pre-existing state** | rows, sessions, or files created before this rule existed and now violating it |

That last row is the one that gets skipped and then ships as an incident. Decide **migrate, grandfather, or reject** — explicitly, in writing.

## Criteria That Survive
Observable behavior, in the place the work lives — the ticket body, or a note in the repository linked from the pull request.

| Weak | Observable |
|---|---|
| "Checkout should be fast" | "p95 under 800ms at 50 rps" |
| "Handle errors gracefully" | "On gateway timeout: retry twice, then show a retry action; the cart is not cleared" |
| "Only admins can do it" | "A non-admin POST returns 403 and writes nothing" |

Criteria that live only in chat are gone next session — that is the failure mode this step exists to prevent.

## When the Success Check Itself Is Untestable
Some requests state success in a form no run of the system could confirm or deny: "make it feel faster," "users should love it," "the code should be clean." That is not a missing detail to assume — the check itself has to be renegotiated into something observable before work starts.

| Untestable as stated | Ask for | Fallback if unanswerable |
|---|---|---|
| "Make it feel faster" | a metric and a target — p95 latency, time to interactive — and the load it holds under | pick the narrowest, cheapest metric that plausibly drives the complaint, and label it explicitly as a stand-in |
| "Users should love it" | a proxy: adoption rate, a satisfaction delta, task completion rate on the named flow | pick task completion rate on the flow in the request; record it as a proxy for the goal, not the goal itself |
| "The code should be clean" | which convention: a lint config, an existing module held up as the example, a coverage floor | match the closest existing convention in the repository; "clean" alone is not a check |
| "It should just work" | one reproduction of the failure, and what "worked" looks like for that specific case | refuse to guess at an unnamed failure; ask for the one case that is currently broken |

Follow Gojko Adzic's *Specification by Example*: turn the ambiguous statement into a concrete example — one specific input and the specific output that would count as met — before writing a line of code. If the requester cannot supply one example, that gap is the actual blocker, not a detail to fill in silently; say so plainly rather than inventing a proxy nobody agreed to.

## Saturation Is the Stop Condition
Count the **net-new** constraints each round of questions produces — an answer that only restates something already pinned does not count. Two rounds under two net-new each means the requirement is saturated: stop asking and write the criteria. Without that counter, clarification ends when patience runs out instead of when the requirement is known.

## Stop
- The last two rounds produced almost no net-new constraints. Saturated — write the acceptance criteria and start.
- A question can be answered by the code, the ticket, or existing behavior. Go read it; do not ask.
- No requester is available. Pick each default, record the decisions and their reversal cost, and proceed — do not stall.
- Two stakeholders conflict. Surface it and make them decide; never average the two.

## Rules
- Never ask what the code, the ticket, or existing behavior can tell you. Look first; asking a question you could have answered spends the user's patience on nothing.
- No requester available? Pick each default, record them as explicit decisions **with the reversal cost of each**, and proceed. Do not stall.
- Separate what the requester wants from how they proposed to get it. The ticket's solution is a hypothesis, and often a workaround for the real problem.
- Chase the "why" one level past the request. A stated feature frequently names a workaround for something simpler to fix.
- When two stakeholders conflict, surface it and make them decide. Do not average the two — the average satisfies neither and nobody owns it.
- If nothing important is unclear, say so and start. Clarification has a cost too.
- Turning agreed criteria into an executable plan belongs to `starting-dev`'s [phase-plan procedure](../../starting-dev/references/phase-plan.md), or to `starting-dev` outside the loop.

## Checklist
- [ ] Request restated with user, trigger, and success outcome.
- [ ] Assumptions written down and ranked by blast radius; the cheap ones decided, not asked.
- [ ] Seven questions or fewer, in one batch, each with a marked default.
- [ ] Every edge covered, pre-existing state decided explicitly.
- [ ] Acceptance criteria observable, recorded durably, and confirmed as the contract.
