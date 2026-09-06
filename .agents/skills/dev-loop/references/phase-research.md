
# Stage 1 — Research

## Preflight
```bash
gh issue view <n> --json title,body 2>/dev/null || echo 'no tracker: use a dated slug'
ls .workflow/ 2>/dev/null                # is a loop already open for this?
```

This is the only stage that creates `.workflow/<slug>/`. Confirm none exists for this request before creating one.

## Contract
- **Entry:** a one-line request. Create or link a tracking issue; `<slug>` = `<issue>-<kebab-title>`.
- **No tracker:** set `issue: null` and use `<slug>` = `<YYYY-MM-DD>-<kebab-title>`.
- **Only this stage** creates `.workflow/<slug>/` and its `loop-state.json`.
- **Output:** `research.md`. Unattended — advance to `phase-prototype` without waiting for the user.

```json
{
  "issue": 412, "slug": "412-checkout-empty-cart",
  "stage": "research", "awaiting": null,
  "artifacts": [], "rounds": {}, "skipped": [], "scratch": []
}
```

## Workflow
1. Restate the request on the issue as goal, non-goals, and measurable acceptance criteria.
2. Map the codebase: entry points, call sites, data model, tests, local conventions. Cite `path:line` for every claim — delegate the sweep to `codebase-mapping`.
3. Research prior art: how comparable products and libraries solve this. Capture patterns, tradeoffs, and links.
4. Record constraints: runtime, versions, auth boundaries, migrations, backward compatibility.
5. List unknowns and rank them by blast radius. Each becomes a prototype variant or a questionnaire item — **never a guess**.
6. Write `research.md` to the fixed skeleton.
7. Set `stage: "prototype"`, append the artifact, and notify that the loop advanced.

## `research.md` Skeleton

| Section | Contains |
|---|---|
| Goal | one sentence, from the user's words |
| Non-goals | what this explicitly does not cover |
| Acceptance criteria | observable behavior — provisional until `plan.md` |
| Codebase map | entry points, owning modules, data flow, each as `path:line` |
| Prior art | how others solved it, with links and tradeoffs |
| Constraints | runtime, versions, auth, migrations, compatibility |
| Risks | ranked by blast radius |
| Open questions | queued for the plan questionnaire, never asked here |

## Unknowns Become Work, Not Assumptions

| Unknown | Routes to |
|---|---|
| Which direction the UX should take | a prototype variant |
| A product or scope decision | a questionnaire item |
| How an API actually behaves | verify now with `docs-verification` |
| Whether the data supports it | check now; it is a fact, not an opinion |

An unknown resolved by guessing here surfaces three stages later as rework.

## Stop
- A question would be asked of the user now. Queue it for the `phase-plan` questionnaire instead — batching is the loop's whole point.
- An unknown is about to be resolved by guessing. Route it to a prototype variant or a questionnaire item.
- Anything outside `.workflow/` would be modified. This stage is read-only.

## Rules
- **Read-only stage.** No production edits, no refactors, no "while I'm here" fixes.
- Do not interrupt the user with questions. Queue every one for the `phase-plan` questionnaire — that batching is the loop's whole point.
- Every claim carries a source: a file path, command output, or a URL. Unsourced research is opinion with citations missing.
- Acceptance criteria written here are provisional; `plan.md` supersedes them wherever they disagree.
- Verify library and API behavior against current docs, never memory.
- Prior art means reading how it was actually solved, not recalling that it has been.

## Checklist
- [ ] Issue created or linked, or `issue: null` with a dated slug.
- [ ] `.workflow/<slug>/` created and `loop-state.json` initialized with every field.
- [ ] Goal, non-goals, and measurable acceptance criteria written.
- [ ] Codebase map cited as `path:line` throughout.
- [ ] Prior art captured with links and tradeoffs.
- [ ] Unknowns routed to a variant or a questionnaire item; none guessed.
- [ ] Nothing outside `.workflow/` was modified.
- [ ] Stage advanced to `prototype` unattended.
