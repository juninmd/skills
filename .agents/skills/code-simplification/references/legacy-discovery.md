
# Legacy Discovery

## Preflight
```bash
git log --format= --name-only --since='2 years ago' | sort | uniq -c | sort -rn | head -30
git log --format='%an' --since='1 year ago' | sort | uniq -c | sort -rn | head
ls docs/ README* 2>/dev/null                    # what documentation exists at all
```

Create the checklist file first — this work spans sessions and will be interrupted.

## Set Up First
A living checklist file at the project root, listing every phase task, plus the spec organization strategy — by module, endpoint, use case, or feature. Update it as work completes. **The checklist is the resume point**, not an end-of-project deliverable: this work spans sessions and will be interrupted.

## Scope Gate — Before Any Deep Dive
Unbounded, the deliverable list is infinite and the project never ends.

```bash
# Rank by change frequency: churn names what actually matters
git log --format= --name-only --since='2 years ago' \
  | sort | uniq -c | sort -rn | head -30

# Cross it with size, and with who still works here
git log --format='%an' --since='1 year ago' -- <module> | sort | uniq -c | sort -rn
```

Sample from the top, then **agree a bound with the user**: which modules, how deep, which deliverables. Write it in the checklist.

## Workflow — The Five Phases

| Phase | Produces | Method |
|---|---|---|
| 1 · Reconnaissance | structure, stack, entry points, config, CI | delegate to `codebase-mapping`; record its output, never re-derive it |
| 2 · Excavation | per-module responsibilities, data flows, boundaries | read the code in scope, trace real flows |
| 3 · Interpretation | business rules, state machines, permission matrix, retroactive decision records, C4 and ER diagrams | git archaeology plus code reading |
| 4 · Generation | design doc per component, API spec, user stories, traceability matrix | write from phases 2–3, citing sources |
| 5 · Review | confidence report per area, gaps resolved with the user | cross-review the specs against the code |

Then fork: rewrite or replatform to `migration-engineering`; in-place cleanup to `legacy-refactoring`.

## Git Archaeology

```bash
git log --follow -- path/to/file        # survives renames
git log -S 'MAGIC_THRESHOLD' --oneline  # when did this value first appear?
git log -G 'regex' --oneline            # when did code matching this change?
git blame -w -C -- file                 # ignore whitespace, detect copies
git log --merges --oneline -- path      # which features touched it
```

`git log -S` on a magic constant usually finds the commit message or ticket that explains **why** it is 300 and not 500 — the single highest-yield move in this whole skill.

## Prove Reachability Before Recording a Rule
Documenting dead behavior as a live business rule is the most expensive error here: it gets carried into the rewrite and defended for years.

| Signal | Verdict |
|---|---|
| No caller by symbol **or** by string | dead |
| Route not in the router, or unreferenced | dead |
| Feature flag off in every environment | dead |
| Scheduled job disabled | dead |
| No production log or metric on that path | dead — verify against real telemetry |
| Reachable, with traffic | a live rule — record it |

Label the dead ones **as dead**, in the deliverable. That is information too.

## Stop
- No scope bound has been agreed with the user. Stop; unbounded, the deliverable list is infinite.
- A business rule cannot be proven reachable. Label it dead rather than recording it as a rule.
- A rule is being inferred rather than read. Mark the ambiguity for the phase-5 review; never guess it into a spec.

## Rules
- Never guess an implicit rule. Mark the ambiguity explicitly and take it to the user in the phase-5 review.
- Every claim cites a source file, line, or commit. Unverified inference gets labeled as inference, in the text, where it cannot be mistaken for a finding.
- Diagrams live as text in the repository, never as binary exports — `diagrams-as-code` owns the mechanics.
- A confidence report per area is a deliverable, not a courtesy: the reader must know which parts of the spec are solid and which are reconstructed.
- Do not start a rewrite from this output alone. The fork decision comes after review, with the user.

## Checklist
- [ ] Checklist file and spec organization strategy in place before any reading.
- [ ] Scope bound agreed with the user, based on churn and criticality.
- [ ] Phase 1 delegated to `codebase-mapping` and recorded, not re-derived.
- [ ] Every business rule proven reachable; dead paths labeled as dead.
- [ ] Every claim cites a file, line, or commit; inference labeled as inference.
- [ ] All five phases executed, confidence report published, fork chosen with the user.
