# Requirements Clarification

## Contents

- Preflight
- Workflow
- Facts Are Yours, Decisions Are Theirs
- Ask the Frontier, One Round at a Time
- Rank Before Asking
- The Edges
- Criteria That Survive
- When the Success Check Itself Is Untestable
- The Frontier Is the Stop Condition
- Stop
- Rules
- Checklist

## Preflight
```bash
gh issue view <n> --json title,body,comments      # read the ticket fully first
rg -n '<the behavior in question>' src/ | head    # does the code already answer it?
```

Every question you could have answered by reading costs the user's patience for nothing.

## Workflow
1. Restate the request, naming the user, the trigger, and the outcome that counts as success. If you cannot restate it, that is the first question.
2. List what you are assuming. Anything you cannot point to in the request **is** an assumption, not a fact.
3. Sort each assumption: a **fact** (the repository, tools, or docs can settle it) goes to a search or subagent; a **decision** goes on the decision tree.
4. Rank decisions by what breaks if you guess wrong; cheap, reversible ones are picked and noted, not asked.
5. Ask the current **frontier** — the decisions whose prerequisites are settled — as one round, each question carrying a recommended answer. Wait, then recompute the frontier and ask the next round.
6. Pin the edges — including the pre-existing data everyone forgets.
7. When the frontier is empty, write acceptance criteria as observable behavior where the work lives, and have the requester confirm that text as the contract.

## Facts Are Yours, Decisions Are Theirs
Finding facts is the asker's job. "Which ORM do we use?", "Is there already a retry helper?", "What does the endpoint return today?" are searches, not questions — run `rg`, read the config, or dispatch a read-only subagent. Do not block the round on it: only the questions downstream of an unfinished lookup wait; ask the rest of the frontier now.

What the requester owns is the choice: scope, behavior on the edges, who may do it, what counts as done. Put each of those to them and wait.

## Ask the Frontier, One Round at a Time
Map the open decisions as a tree — each choice unlocks the choices hanging off it — and resolve it top-down:

| Order | Level | Example forks |
|---|---|---|
| 1 | Scope and bounds | in or out; synchronous response or background job |
| 2 | Data and contracts | new schema or extend; payload shape; status codes |
| 3 | Permissions | role access, tenant boundaries, secret handling |
| 4 | Edges and errors | duplicates, empty state, timeout, partial failure |
| 5 | Non-functional | latency target, caching, pagination limits |

A round holds every frontier question, **at most seven**; past seven, ask the seven with the largest blast radius and carry the rest. A question whose answer depends on another question still open belongs to a later round — asking about caching before sync-versus-async is decided wastes both answers. Use the client's structured question tool when it has one; otherwise number the questions and word each so a bare "yes" accepts the recommendation:

```
Q1 — Empty cart at checkout: reject with 422 `cart_empty`?
     → Recommended: yes. Clients already branch on 4xx; alternatives are 200 with an empty body, or 400.
Q2 — Duplicate submit within 5s: return the first result idempotently?
     → Recommended: yes. Survives network retries; alternatives are 409, or creating both.
Q3 — Rows that violate the new rule today: grandfather them?
     → Recommended: yes. No migration window needed; alternatives are migrate, or reject on next write.
```

A recommendation means silence or a nod still moves the work forward. A question with no recommendation is a blocker you created.

## Rank Before Asking

| Assumption | If wrong | Ask? |
|---|---|---|
| Changes the data model | rework the schema and every consumer | yes, first |
| Changes who is allowed to do it | security defect | yes |
| Changes the failure behavior | wrong contract for every client | yes |
| Pattern already established in the repository | nothing | no — mirror it |
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

## The Frontier Is the Stop Condition
The interview ends when the frontier is empty — every branch visited, nothing silently assumed — **and** the requester confirms the written criteria match what they meant. Do not act on the tree before that confirmation.

Guard against endless rounds by counting **net-new** constraints per round; an answer that only restates something already pinned does not count. Two rounds under two net-new each means the remaining branches are cheap: decide them, list them as assumptions, and ask for the confirmation instead of another round.

## Stop
- The frontier is empty and the requester confirmed the criteria. Write them and start.
- The last two rounds produced almost no net-new constraints. Decide the rest as recorded assumptions and ask for confirmation.
- A question can be answered by the code, the ticket, or existing behavior. Go read it or send a subagent; do not ask.
- No requester is available. Pick each recommendation, record the decisions and their reversal cost, and proceed — do not stall.
- Two stakeholders conflict. Surface it and make them decide; never average the two.

## Rules
- Never ask the user a fact a search or subagent can find. Look first; asking what you could have answered spends the user's patience on nothing.
- One round per frontier, at most seven questions, each with a recommended answer that "yes" accepts. This is the only cap; `starting-dev` interviews by the same rule.
- No requester available? Pick each recommendation, record them as explicit decisions **with the reversal cost of each**, and proceed. Do not stall.
- Separate what the requester wants from how they proposed to get it. The ticket's solution is a hypothesis, and often a workaround for the real problem.
- Chase the "why" one level past the request. A stated feature frequently names a workaround for something simpler to fix.
- When two stakeholders conflict, surface it and make them decide. Do not average the two — the average satisfies neither and nobody owns it.
- If nothing important is unclear, say so and start. Clarification has a cost too.
- Turning agreed criteria into an executable plan belongs to `starting-dev`'s [phase-plan procedure](../../starting-dev/references/phase-plan.md), or to `starting-dev` outside the loop.

## Checklist
- [ ] Request restated with user, trigger, and success outcome.
- [ ] Assumptions sorted into facts (looked up, not asked) and decisions (ranked by blast radius; cheap ones decided, not asked).
- [ ] Each round asked only the current frontier, seven or fewer, each with a recommended answer.
- [ ] Every edge covered, pre-existing state decided explicitly.
- [ ] Frontier empty; acceptance criteria observable, recorded durably, and confirmed by the requester as the contract.

Adapted in part from mattpocock/skills (MIT, © 2026 Matt Pocock).
