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
gh issue view <n> --json title,body,comments      # read the whole ticket first
rg -n '<the behavior in question>' src/ | head    # does the code already answer it?
```

Each question the repository could have answered burns the user's patience.

## Workflow
1. Restate the request: who the user is, what triggers it, and which outcome counts as success. If you cannot, that inability is your first question.
2. List your assumptions. Whatever the request does not show is an assumption, not a fact.
3. Sort them. A **fact** (the repo, tools, or docs can settle it) goes to a search or subagent. A **decision** goes on the decision tree.
4. Rank decisions by the damage of guessing wrong. Cheap, reversible ones are chosen and noted, not asked.
5. Ask the current **frontier**, meaning the decisions whose prerequisites are settled, as one round with a recommended answer on each question. Wait, recompute the frontier, ask the next round.
6. Pin the edges, including the pre-existing data everyone forgets.
7. When the frontier is empty, write acceptance criteria as observable behavior where the work lives, and have the requester confirm that text as the contract.

## Facts Are Yours, Decisions Are Theirs
Finding facts is your job. "Which ORM do we use?", "Is there a retry helper already?", "What does the endpoint return today?" are searches: run `rg`, read the config, or dispatch a read-only subagent. Do not hold the round for it. Only questions that depend on an unfinished lookup wait; ask the rest now.

The requester owns the choices: scope, edge behavior, who may do what, what counts as done. Put those to them and wait.

## Ask the Frontier, One Round at a Time
Model the open decisions as a tree, where each answer unlocks the choices beneath it, and resolve it top-down:

| Order | Level | Example forks |
|---|---|---|
| 1 | Scope and bounds | in or out; synchronous response or background job |
| 2 | Data and contracts | new schema or extension; payload shape; status codes |
| 3 | Permissions | role access, tenant boundaries, secret handling |
| 4 | Edges and errors | duplicates, empty state, timeout, partial failure |
| 5 | Non-functional | latency target, caching, pagination limits |

One round carries every frontier question, **seven at most**. Beyond seven, ask the seven with the widest blast radius and carry the rest over. A question that hinges on an unanswered one waits for a later round: asking about caching before sync-versus-async is settled wastes both answers. Use the client's structured question tool if there is one; otherwise number the questions and phrase each so a bare "yes" accepts the recommendation:

```
Q1 — Empty cart at checkout: reject with 422 `cart_empty`?
     → Recommended: yes. Clients already branch on 4xx; the alternatives are 200 with an empty body, or 400.
Q2 — Same submit twice within 5s: return the first result idempotently?
     → Recommended: yes. Survives network retries; the alternatives are 409, or creating both.
Q3 — Existing rows that break the new rule: grandfather them?
     → Recommended: yes. No migration window; the alternatives are migrating, or rejecting on next write.
```

With a recommendation, silence or a nod still moves work forward. A question without one is a blocker you made.

## Rank Before Asking

| Assumption | If wrong | Ask? |
|---|---|---|
| Alters the data model | schema and every consumer reworked | yes, first |
| Alters who may do it | security defect | yes |
| Alters failure behavior | wrong contract for every client | yes |
| Pattern already set in the repository | nothing | no, mirror it |
| Alters a label or copy | one-line fix later | no, choose and note it |
| Answerable by reading the code | nothing | **no, go read it** |

## The Edges

| Edge | Question it forces |
|---|---|
| Empty | zero items, no history, first run |
| Maximum | 10,000 items: paginate, cap, or reject? |
| Concurrent | two users, same second, same row |
| Unauthorized | wrong role, expired session, revoked plan |
| Offline / partial | half the request went through |
| Already done | the operation runs a second time |
| **Pre-existing state** | rows, sessions, or files created before this rule that now violate it |

The last row is the one people skip, and it ships as an incident. Decide **migrate, grandfather, or reject**, explicitly and in writing.

## Criteria That Survive
Write observable behavior where the work lives: the ticket body, or a repository note linked from the pull request.

| Weak | Observable |
|---|---|
| "Checkout should be fast" | "p95 under 800ms at 50 rps" |
| "Handle errors gracefully" | "On gateway timeout: retry twice, then show a retry action; the cart is kept" |
| "Only admins can do it" | "A non-admin POST returns 403 and writes nothing" |

Criteria left in chat vanish next session. This step exists to prevent that.

## When the Success Check Itself Is Untestable
Some requests define success in a way no run could confirm or refute: "make it feel faster," "users should love it," "the code should be clean." That is not a gap to fill by assumption. Renegotiate the check into something observable before work begins.

| Untestable as stated | Ask for | Fallback if unanswerable |
|---|---|---|
| "Make it feel faster" | a metric and target (p95 latency, time to interactive) and the load it must hold under | take the narrowest, cheapest metric that plausibly drives the complaint and label it a stand-in |
| "Users should love it" | a proxy: adoption rate, satisfaction delta, task completion on the named flow | use task completion on the flow in the request; record it as a proxy, not the goal |
| "The code should be clean" | a convention: a lint config, an existing module as the model, a coverage floor | follow the nearest existing convention in the repository; "clean" alone is no check |
| "It should just work" | one reproduction of the failure and what "worked" means for that case | do not guess at an unnamed failure; ask for the one case that is broken now |

Use specification by example: convert the vague statement into one concrete case, a specific input and the specific output that would count as met, before writing code. If the requester cannot give one example, that is the real blocker. Say so plainly instead of inventing a proxy nobody agreed to.

## The Frontier Is the Stop Condition
The interview ends when the frontier is empty (every branch visited, nothing silently assumed) **and** the requester confirms the written criteria say what they meant. Do not build on the tree before that confirmation.

To avoid endless rounds, count **net-new** constraints per round; an answer that restates something already pinned adds none. If two rounds in a row yield fewer than two each, the rest is cheap: decide it, list it as assumptions, and ask for confirmation instead of another round.

## Stop
- Frontier empty and criteria confirmed: write them and start.
- The last two rounds added almost nothing new: decide the remainder as recorded assumptions and ask for confirmation.
- The code, the ticket, or existing behavior can answer a question: read it or send a subagent; do not ask.
- No requester is reachable: take each recommendation, record the decisions and what reversing each would cost, and proceed.
- Two stakeholders conflict: surface it and make them decide; never average.

## Rules
- Never ask the user a fact a search or subagent can find. Look first.
- One round per frontier, at most seven questions, each with a recommended answer that "yes" accepts. This is the only cap; `starting-dev` interviews by the same rule.
- No requester available? Take each recommendation, record it as an explicit decision **with its reversal cost**, and proceed. Do not stall.
- Separate what the requester wants from how they proposed to get it. A ticket's solution is a hypothesis, often a workaround for the real problem.
- Ask "why" one level beyond the request; a named feature often hides a simpler fix.
- When two stakeholders conflict, surface it and make them decide. An average satisfies neither and nobody owns it.
- If nothing important is unclear, say so and start. Clarifying also costs something.
- Turning agreed criteria into an executable plan belongs to `starting-dev`'s [phase-plan procedure](../../starting-dev/references/phase-plan.md), or to `starting-dev` outside the loop.

## Checklist
- [ ] Request restated with user, trigger, and success outcome.
- [ ] Assumptions sorted into facts (looked up, not asked) and decisions (ranked by blast radius; cheap ones decided, not asked).
- [ ] Each round asked only the current frontier, seven or fewer, each with a recommended answer.
- [ ] Every edge covered; pre-existing state decided explicitly.
- [ ] Frontier empty; acceptance criteria observable, recorded durably, and confirmed by the requester as the contract.
