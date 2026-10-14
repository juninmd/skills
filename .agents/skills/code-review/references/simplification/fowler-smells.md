# Additional Smells: Fowler's Catalog

Companion to [simplification.md](simplification.md), covering four smells from Martin Fowler's *Refactoring: Improving the Design of Existing Code* that a structural-complexity scan does not surface, because they are visible only across functions or files, not inside one.

## Preflight

```bash
rg -n 'class \w+' -g '*.{ts,py}' | wc -l   # candidate classes to check for feature envy
git log --format= --name-only --since='6 months ago' | sort | uniq -c | sort -rn | head -20   # shotgun-surgery candidates: files that always change together
```

## The smells

| Smell | Signal | Refactor (Fowler) |
|---|---|---|
| Feature envy | A method reads more fields or methods of another class than of its own | Move Method to the class it is envious of; or Extract Method, then move the extracted piece |
| Shotgun surgery | One conceptual change requires editing many unrelated files or classes each time | Move Method / Move Field to consolidate the scattered logic into one place; the churn-by-file command above finds the candidates |
| Primitive obsession | A domain concept (money, email, percentage, ID) is passed around as a raw string, number, or float, with validation repeated at each call site | Replace Primitive with Object, or a branded/value type in a typed language; centralize validation and formatting in the new type |
| Divergent change | One class changes for many unrelated reasons — a new payment provider and an unrelated UI tweak both touch the same file | Extract Class along the axes of change, so each reason to change has its own class |

## Matching symptom to refactor

| Symptom in review | Likely smell | Safe refactor |
|---|---|---|
| A service or manager method takes an object and mostly calls getters on it | Feature envy | Move the method onto the object it is calling into |
| The same bug fix needs the same edit in five files | Shotgun surgery | Consolidate before fixing the sixth occurrence, not after |
| A function signature has three string parameters that are actually a user ID, a tenant ID, and a document ID | Primitive obsession | Introduce distinct types so the compiler catches an argument-order mistake; see also the argument-order note in [regression-review.md](../regression-review.md) |
| Every unrelated feature PR touches the same large file | Divergent change | Split by responsibility before adding the next feature, per the repository's file-size convention |

## Rules

- Fowler's own caveat applies: a smell is a prompt to look, not an automatic verdict. A short class with duplicated getters called from one place is not feature envy worth fixing.
- Fix the smell in its own commit, separate from the feature or bug fix that made you notice it — same discipline as [simplification.md](simplification.md)'s incremental-change step.
- These four smells surface across files; run them as their own pass, not folded into a single-file read.
