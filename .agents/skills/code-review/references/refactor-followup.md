# Refactor Follow-up

Run this once a refactor, or a series of related pull requests, is already merged. The only question
is whether the code it touched ended up simpler, just as safe, and still tested, or whether the
move left loose ends. Review before merging is [expert-review.md](expert-review.md); diff patterns
that tend to precede incidents are in [regression-review.md](regression-review.md). Decisions that
were merged stay decided; this pass does not reargue them.

## Preflight
```bash
LAST_TAG=$(git -c versionsort.suffix=- tag --merged HEAD^ --list 'v[0-9]*' --sort=-v:refname | head -n 1)   # newest release reachable from HEAD^
FROM=${LAST_TAG:-HEAD~8}
git log --first-parent --oneline "$FROM..HEAD"
git diff --stat "$FROM..HEAD"
git diff --name-only "$FROM..HEAD" | rg -n '(lock|go\.sum|package\.json|pyproject|Cargo\.toml|migrations?/|schema)'
```

## Workflow
1. Choose the smallest range that covers the work: the one the user gave; otherwise, right after a
   release, the previous tag up to `HEAD`; otherwise the handful of commits that belong together.
   When the range touches unrelated areas, split it and follow up on each area separately.
2. Inventory the change: files grouped by area, dependency, config and schema edits, tests that
   were added or edited, and anything public or visible to users.
3. Run the checks the project itself defines (format, lint, tests, dependency audit), taken from its
   docs or CI. Do not bring in a toolchain the project does not use.
4. Read the changed source for the leftovers listed below.
5. Read the changed tests for weaker assertions and new flakiness.
6. Sort the findings, fix what belongs to this range, and open issues for the rest.

## Unrun checks are reported as unrun

Write down every check with what it actually returned. When a tool is missing or not configured, say
so on its own line, for example "`cargo audit`: not run, tool missing", next to "tests: green".
Leaving it out lets the reader assume it passed.

## Leftovers to look for

| What you see | Why it is a problem |
|---|---|
| Old and new versions of the same helper both still present | the migration stopped partway, and the two copies will diverge |
| A magic number back where a named constant used to be | the name explained the value; the bare number does not |
| A guard, limit, timeout, or permission check missing after code moved | moved blocks look unchanged, so what got dropped is rarely noticed |
| An error that used to fail now logged and ignored | see the failure-handling part of [regression-review.md](regression-review.md) |
| Comments, docstrings, or README text describing the old layout | wrong docs mislead more than absent docs |
| A public name or signature changed with no deprecation | external callers break on the next release |
| Unused exports, unreachable branches, config keys nobody reads | debris from the move; confirm nothing uses it before removal, per [legacy-refactoring.md](legacy-refactoring.md) |

## Tests after the move

- A test changed in the same commit as the code it checks: compare the assertion before and after
  (an exact value turned into "truthy", an exact count turned into "not empty").
- Error-path coverage that went down while the main path stayed green.
- New sleeps, retries, or fixtures that depend on run order. Flaky means broken.
- Snapshot updates committed without anyone reading what changed in them.

## Sorting findings

| Kind | What to do |
|---|---|
| Behavior regressed or a protection got weaker | fix now, starting from a failing test |
| Cleanup inside this range | fix now when it is small and keeps behavior; see [simplification.md](simplification/simplification.md) |
| Debt outside the range, or a design question | open an issue with the evidence; keep the range as it is |
| Preference only | leave out |

## Stop
- No commit range can be pinned; say what is missing.
- A fix would alter behavior no test pins down; add that test first.
- The issue is architectural; hand it to `software-architecture` instead of refactoring here.

## Report

```text
Range:      <base>..<head> (<n> commits, <areas>)
Checks:     <check> -> <result>   (one line each, unrun ones included)
Findings:   <severity> <file:line> <leftover> -> <fixed | issue #n>
Tests:      <weakened assertions, lost coverage, flakiness>
Next:       <one suggested step, or none>
```
