
# Domain Modeling

## Preflight
```bash
ls CONTEXT.md GLOSSARY.md docs/glossary.md docs/adr 2>/dev/null   # existing vocabulary and decisions
TERMS='Customer|Account|User'   # replace with the competing names from the ticket or glossary
rg -o -w "$TERMS" -g '!*.lock' | sort | uniq -c | sort -rn | head -n 30
rg -n 'i\.e\.|aka|also called|formerly' --glob '*.md'    # prose translating one term to another
```

Count the competing names before proposing a new one. Every synonym you find is a rename that has to happen or a distinction you have not understood yet.

## Drift, and What It Means

| Symptom | What it actually is | Action |
|---|---|---|
| Two types, same fields, different names | One concept, two names | Pick one, rename the other away |
| One name, two shapes across modules | Two concepts wearing one name | Split, and name the second |
| A comment translating a term | The name lost the argument | Rename the code, delete the comment |
| `status` with six string values | Missing concepts, collapsed to a field | Model the states, name each one |
| Stakeholders say a word the code never uses | The model is behind the business | Add the term, then the type |
| The code says a word nobody in the business says | An invented term | Replace it with theirs |
| Two teams need the same word to mean different things | A bounded-context split | Not a naming fix — decide the boundary with the Split or Keep table in [SKILL.md](../SKILL.md) |

## Workflow
1. Harvest terms from the words the people asking actually use — the ticket, the meeting, the support thread. Never invent one that has an owner.
2. For each term, write the entry: definition, one real example, the boundary (what it explicitly is **not**), and the rejected synonyms.
3. Resolve every collision before writing code. One concept, one name; two shapes, two names.
4. Rename the code to match, mechanically and in its own commit — a rename mixed with logic is unreviewable.
5. Put the vocabulary in `CONTEXT.md` at the repo root, and keep the term, the type, and the entry in the same pull request forever after.
6. Use the terms verbatim in tests, errors, and log lines. A message in the old vocabulary re-teaches the old word.

## During a Design Session

Build the model while the conversation happens; do not batch it for later.

| Move | When | Example prompt |
|---|---|---|
| Challenge against the glossary | A term is used differently from its entry | "The glossary defines Cancellation as a whole-order event; you mean one line item. Which is it?" |
| Sharpen fuzzy language | A word is vague or overloaded | "By account, do you mean the Customer or the login User? They differ." |
| Invent edge-case scenarios | A definition or relationship is being agreed | "A Subscription is paused mid-cycle and the plan price changes. Which price applies on resume?" |
| Check claims against the code | Someone states how the system behaves | "The handler refunds the whole order, but you said partial refunds exist. Which is true?" |

Write each resolved term into the glossary immediately; create the file only when the first term is resolved.

## When a Decision Earns an ADR

Offer an ADR only when all three hold; if any is missing, skip it:

1. **Hard to reverse** — changing your mind later has a meaningful cost.
2. **Surprising without context** — a future reader would ask "why on earth this way?"
3. **A real trade-off** — genuine alternatives existed and one was chosen for stated reasons.

Create `docs/adr/` lazily, with the first ADR that passes.

## A Glossary Entry

```markdown
## Subscription
A customer's recurring right to use a plan, billed on a fixed cycle.
Example: acct 4412 on `pro-monthly`, renews on the 3rd.
Not: an Invoice (one charge), nor an Entitlement (what access it grants).
Never called: membership, plan (that is the priced template).
```

Definition, example, boundary, forbidden synonyms. An entry without the boundary is a label; the boundary is the part that stops the next drift.

## Stop
- The business owner of a term disagrees with your definition. Their word wins — this is `starting-dev` work, not a naming preference.
- One word genuinely needs two meanings in two subsystems. Stop renaming; that is a context boundary, and forcing one name across it corrupts both sides.
- The rename touches generated code, a public API, or a persisted schema. Those need a migration path, not a find-and-replace — `data-engineering` owns it.
- Nobody outside the code uses the term. It is an implementation detail, not domain vocabulary; leave it out of the glossary.

## Rules
- Names come from the domain, not from the framework. `OrderPlaced` beats `OrderEventDTOImpl`.
- A glossary nobody has to pass through goes stale in a month. Bind it to the code by renaming, or do not write it.
- The plural matters. If the business says "policies" and the table says `policy_records`, the model has drifted already.
- Do not encode the type in the name. `customerList` re-states what the type says and lies the day it becomes a set.
- Ambiguity is a modeling bug, not a documentation bug. Fix it in the type, then describe it.
- No implementation details in the glossary: no table names, classes, endpoints, or decisions. It defines domain terms and nothing else; decisions go to ADRs.
- Write the entry for a newcomer and for an agent reading `CONTEXT.md` cold — the same audience, in practice. `starting-dev` owns the operational half of that file.
- Update the vocabulary in the pull request that changes the concept. A separate glossary chore is a chore nobody does.
- Short is not the goal; unambiguous is. A longer name that survives the next quarter costs nothing to read.

## Checklist
- [ ] Competing names counted, and every collision resolved to one concept, one name.
- [ ] Each term has a definition, an example, a boundary, and its rejected synonyms.
- [ ] Renames landed as standalone, logic-free commits.
- [ ] Tests, error messages, and logs use the agreed terms verbatim.
- [ ] `CONTEXT.md` updated in the same pull request as the concept it describes.
- [ ] Each ADR offered passes all three tests: hard to reverse, surprising without context, a real trade-off.

Adapted from mattpocock/skills (MIT, © 2026 Matt Pocock).
