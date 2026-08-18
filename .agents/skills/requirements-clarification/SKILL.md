---
name: requirements-clarification
description: |
  Interrogate a vague request until it is buildable. Use for ambiguous tickets, unstated assumptions, missing acceptance criteria, conflicting stakeholder input, undefined edge cases, and deciding what questions to ask before any planning starts.
---

# Requirements Clarification

## Workflow
1. Restate the request in your own words and name the user, the trigger, and the outcome that makes it a success.
2. List what you are assuming. Anything you cannot point to in the request is an assumption, not a fact.
3. Rank the assumptions by what breaks if you guess wrong, then ask only about the top ones.
4. Ask closed, decidable questions with a proposed default: "I plan to reject empty carts with a 422. Correct?"
5. Pin the edges: empty, maximum, concurrent, unauthorized, offline, and already-done cases.
6. Write acceptance criteria as observable behavior, confirm them, and treat that as the contract.

## Rules
- Ask in one batch, not one at a time. Serial questions burn the requester's patience faster than the answers are worth.
- Never ask what the code, the ticket, or the existing behavior can tell you. Look first.
- Propose a default with every question so silence still moves the work forward.
- Separate what the requester wants from how they proposed to get it; the solution in the ticket is a hypothesis.
- Chase the "why" one level past the request. A stated feature often names a workaround, not the need.
- When two stakeholders conflict, surface it explicitly and make them decide. Do not average the two.
- If nothing important is unclear, say so and start. Clarification has a cost too.

## Checklist
- [ ] Assumptions are written down and the risky ones are asked about.
- [ ] Edge cases and out-of-scope items are explicit.
- [ ] Acceptance criteria are observable and agreed.
