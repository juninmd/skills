---
name: requirements-clarification
description: |
  Interrogate a vague request until it is buildable. Use for ambiguous tickets, unstated assumptions, missing acceptance criteria, conflicting stakeholder input, undefined edge cases, and deciding what questions to ask before any planning starts.
---

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

## Stop
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
- Turning agreed criteria into an executable plan belongs to `phase-plan`, or to `project-lifecycle` outside the loop.

## Checklist
- [ ] Request restated with user, trigger, and success outcome.
- [ ] Assumptions written down and ranked by blast radius; the cheap ones decided, not asked.
- [ ] Seven questions or fewer, in one batch, each with a marked default.
- [ ] Every edge covered, pre-existing state decided explicitly.
- [ ] Acceptance criteria observable, recorded durably, and confirmed as the contract.
