---
name: code-simplification
description: |
  Refactor, simplify, and review code for clarity, defects, and legacy modernization. Use for code reviews, collapsing abstractions, characterization tests, undocumented legacy recovery, bug sweeps, and deleting dead code.
---


# Code Simplification

## Preflight
```bash
git stash list && git status --porcelain     # start clean; this work is many small commits
rg -w "symbolName" --glob '!*.min.*'         # callers by symbol
rg -F "'symbolName'" -F '"symbolName"'       # callers by string: DI, reflection, dispatch
```

For behavior-bearing simplification, establish characterization coverage first. Route genuinely untested behavior to legacy-refactoring; mechanical cleanup may proceed with focused checks.

## Workflow
1. For behavior-bearing changes, confirm coverage before touching it. For mechanical cleanup, use a focused check and proceed.
2. Delete before you rewrite: unreachable branches, unused exports, commented-out blocks, options nobody passes.
3. Collapse indirection with exactly one caller and no second one on the horizon.
4. Replace conditional thickets with early returns; replace flag parameters with two named functions.
5. Rename until the comment explaining the code is redundant, then delete the comment.
6. Re-run relevant tests after meaningful changes; keep separate commits when independent rollback matters.

## Proving Code Is Dead
A grep for the symbol is not proof. These are the paths that make deleted-but-live code an incident.

| Check | Command |
|---|---|
| Direct callers | `rg -w 'symbolName' --glob '!*.min.*'` |
| String-keyed dispatch, reflection, DI | `rg -F "'symbolName'" -F '"symbolName"'` |
| Public export surface | is it in `index.*`, `__all__`, or the package `exports` map? |
| External consumers | is this a published package or a versioned API? |
| Feature flags | is a flag guarding it currently off — but still flippable? |
| Scheduled work | cron, queue consumer, or a monthly job that has not run yet |
| Runtime confirmation | add a counter, ship it, wait a full traffic cycle |

**Absent coverage is not evidence of dead code.** Untested and unused are different claims; only the second justifies deletion.

## What Actually Simplifies

| Do | Not |
|---|---|
| Delete the branch nobody reaches | Rewrite it more cleverly |
| Two named functions | One function with a boolean flag |
| Early return, flat body | Nested `if` pyramid |
| Inline the single-caller wrapper | Keep it "for symmetry" |
| Hard-code the only value ever passed | Keep the config option nobody sets |
| One clear loop | A dense chain that fits on one line |

Shorter is not automatically simpler. A clever one-liner trades reading time for line count, and reading happens far more often than writing.

See [Reference Map](references/TOPIC_MAP.md) for specialized references and sub-domain guides.

## Stop
- Behavior is uncertain and lacks coverage. Route characterization to legacy-refactoring before changing semantics.
- A deletion cannot be proven dead across callers, strings, exports, flags, and scheduled work. Leave it and say why.
- Behavior changed. That is a bug fix or a feature, not a simplification — split it into its own commit.

## Rules
- Hand off verification tests to `test-engineering`, codebase mapping to `codebase-mapping`, and system architecture to `software-architecture`.
- Behavior must not change. If it does, that is a bug fix or a feature, and it belongs in its own commit with its own test.
- The best simplification is deletion. Ask whether the code needs to exist before asking how to improve it.
- One caller is not a pattern. Wait for the third before extracting a shared abstraction — the second one is usually a coincidence, and abstracting on it costs more than the duplication would have.
- A wrapper that only forwards arguments earns nothing and costs a hop of indirection every reader must follow.
- Configuration nobody configures is dead weight with a support cost. Remove the option and hard-code the used value.
- Leave the tests alone. Rewriting a test to match simplified code hides exactly the regression it exists to catch.
- Measure branching rather than eyeballing length: a 200-line function with no branches reads fine; a 40-line one with eight independent conditions does not.
- A diff that both simplifies and moves files is unreviewable. Land the move separately — project-structure owns it.

## Excuses

| Excuse | Why it is false |
|---|---|
| "Nothing covers it, so it must be dead" | Untested and unused are different claims; only the second justifies deletion |
| "`rg` found no callers" | String dispatch, DI, reflection, feature flags, and monthly jobs do not grep |
| "I will simplify while I am in here fixing the bug" | A diff that both fixes and simplifies proves neither to the reviewer |
| "There are two call sites now, extract it" | The second one is usually coincidence; wait for the third |
| "The one-liner is shorter, so it is simpler" | Reading happens far more often than writing |

## Checklist
- [ ] Behavior covered by tests before the first edit; tests untouched throughout.
- [ ] Every deletion proven dead across callers, strings, exports, flags, and scheduled work.
- [ ] Indirection with one caller collapsed; unused options removed, not merely documented.
- [ ] No clever compression traded for readability.
- [ ] Each simplification a separate, revertible commit; no behavior change hidden among them.
