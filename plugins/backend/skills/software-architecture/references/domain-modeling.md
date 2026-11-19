# Domain Modeling

## Preflight
```bash
ls CONTEXT.md GLOSSARY.md docs/glossary.md docs/adr 2>/dev/null   # existing vocabulary and decisions
TERMS='Customer|Account|User'   # replace with the competing names from the ticket or glossary
rg -o -w "$TERMS" -g '!*.lock' | sort | uniq -c | sort -rn | head -n 30
rg -n 'i\.e\.|aka|also called|formerly' --glob '*.md'    # prose translating one term to another
```

Count the competing names before coining a new one. Each synonym you find is either a rename still owed or a distinction you have not grasped yet.

## Drift, and What It Means

| Symptom | Underlying cause | Action |
|---|---|---|
| Two types with the same fields under different names | One concept, two names | Choose one name and rename the other away |
| One name with different shapes in different modules | Two concepts sharing a name | Split them and name the second |
| A comment that translates a term | The name lost the argument | Rename the code, delete the comment |
| `status` holding six string values | Missing concepts squeezed into a field | Model each state and name it |
| Stakeholders use a word the code never does | The model lags the business | Add the term, then the type |
| The code uses a word no one in the business says | An invented term | Replace it with theirs |
| Two teams need one word to mean different things | A bounded-context split | Not a naming fix: set the boundary with the Split or Keep table in [SKILL.md](../SKILL.md) |

## Workflow
1. Collect terms from the people who asked: the ticket, the meeting, the support thread. Never invent a term that already has an owner.
2. Write an entry per term: definition, one real example, the boundary (what it is explicitly **not**), and the rejected synonyms.
3. Settle every collision before coding. One concept gets one name; two shapes get two names.
4. Rename the code to match, mechanically, in its own commit. A rename mixed with logic cannot be reviewed.
5. Keep the vocabulary in `CONTEXT.md` at the repo root, and from then on change the term, the type, and the entry in the same pull request.
6. Use the terms verbatim in tests, errors, and log lines. A message in the old vocabulary teaches the old word again.

## During a Design Session

Build the model live in the conversation instead of saving it for later.

| Move | Trigger | Example prompt |
|---|---|---|
| Challenge against the glossary | A term is used differently from its entry | "The glossary defines Cancellation as a whole-order event; you mean one line item. Which is it?" |
| Sharpen vague language | A word is fuzzy or overloaded | "By account, do you mean the Customer or the login User? They differ." |
| Invent edge-case scenarios | A definition or relationship is being agreed | "A Subscription is paused mid-cycle and the plan price changes. Which price applies on resume?" |
| Check claims against the code | Someone describes system behavior | "The handler refunds the whole order, but you said partial refunds exist. Which is true?" |

Add each resolved term to the glossary at once. Create the file when the first term is resolved, not before.

## When a Decision Earns an ADR

Offer an ADR only if all three hold; otherwise skip it:

1. **Hard to reverse:** changing course later carries real cost.
2. **Surprising without context:** a future reader would ask "why on earth this way?"
3. **A real trade-off:** genuine alternatives existed and one won for stated reasons.

Create `docs/adr/` with the first ADR that qualifies.

## A Glossary Entry

```markdown
## Subscription
A customer's recurring right to use a plan, billed on a fixed cycle.
Example: acct 4412 on `pro-monthly`, renews on the 3rd.
Not: an Invoice (one charge), nor an Entitlement (what access it grants).
Never called: membership, plan (that is the priced template).
```

Definition, example, boundary, forbidden synonyms. Without the boundary an entry is only a label; the boundary is what blocks the next drift.

## Stop
- The business owner of a term rejects your definition. Their word wins; this is `starting-dev` work, not a naming preference.
- One word truly needs two meanings in two subsystems. Stop renaming: that is a context boundary, and forcing one name across it damages both sides.
- The rename reaches generated code, a public API, or a persisted schema. That needs a migration path, not find-and-replace; `data-engineering` owns it.
- Nobody outside the code uses the term. It is an implementation detail, not domain vocabulary; keep it out of the glossary.

## Rules
- Take names from the domain, not the framework. `OrderPlaced` beats `OrderEventDTOImpl`.
- A glossary nothing is forced through goes stale within a month. Tie it to the code by renaming, or do not write it.
- Plurals matter. If the business says "policies" and the table says `policy_records`, the model has already drifted.
- Never put the type in the name. `customerList` repeats the type and lies once it becomes a set.
- Ambiguity is a modeling bug, not a documentation bug. Fix the type first, then describe it.
- Keep implementation details out of the glossary: no tables, classes, endpoints, or decisions. It defines domain terms only; decisions go in ADRs.
- Write each entry for a newcomer and for an agent reading `CONTEXT.md` cold, which is the same reader. `starting-dev` owns the operational half of that file.
- Update the vocabulary in the pull request that changes the concept. A separate glossary chore never gets done.
- Aim for unambiguous, not short. A longer name that lasts the quarter costs nothing to read.

## Checklist
- [ ] Competing names counted; every collision resolved to one concept, one name.
- [ ] Each term has a definition, an example, a boundary, and rejected synonyms.
- [ ] Renames landed as standalone, logic-free commits.
- [ ] Tests, error messages, and logs use the agreed terms verbatim.
- [ ] `CONTEXT.md` updated in the same pull request as the concept it describes.
- [ ] Each ADR offered passes all three tests: hard to reverse, surprising without context, a real trade-off.
