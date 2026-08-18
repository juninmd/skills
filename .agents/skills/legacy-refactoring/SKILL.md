---
name: legacy-refactoring
description: |
  Change untested code without breaking it. Use for characterization tests, finding seams, breaking hidden dependencies, sprout and wrap techniques, strangling a legacy subsystem behind a facade, and getting a feature into a module nobody dares to touch.
---

# Legacy Refactoring

## Workflow
1. Pin current behavior with characterization tests: assert what the code does today, bugs included, not what it should do.
2. Find a seam — a place where behavior can be swapped without editing the code around it: a parameter, an interface, a module boundary.
3. Break the dependency at that seam so the unit becomes constructible in a test.
4. Sprout the new behavior in a fresh, tested function or class, then call it from the old code with one line.
5. When replacing a whole subsystem, strangle it: route callers through a facade and move them across one at a time.
6. Delete the old path only after every caller is moved and the characterization tests still pass.

## Rules
- Never refactor and change behavior at once. Land the safety net first, always in its own commit.
- Characterization tests document reality. When one asserts something wrong, keep it and note the bug separately.
- Wrap rather than edit when the existing method is too tangled to test: keep the old body, add behavior around it.
- Prefer the smallest seam that works. Do not restructure a package to test one function.
- Do not rewrite from scratch. A rewrite discards undocumented behavior that production depends on.
- Keep the facade in place through the whole strangling; a partial cutover with two live paths is where data diverges.
- Boy-scout only what you touched. A cleanup sweep across untested code is a rewrite in disguise.

## Checklist
- [ ] Characterization tests pin current behavior before any edit.
- [ ] The dependency is broken at a real seam, not by rewriting the module.
- [ ] Old paths are removed only after all callers move and tests pass.
