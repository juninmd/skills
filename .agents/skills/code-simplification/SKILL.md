---
name: code-simplification
description: |
  Make working code smaller and plainer without changing what it does. Use for deleting dead paths, collapsing premature abstraction, removing speculative options, shortening long functions, and reviewing a diff for what could be less code.
---

# Code Simplification

## Workflow
1. Confirm the behavior is covered before touching it; without a test, characterize it first.
2. Delete before you rewrite: unreachable branches, unused exports, commented-out blocks, options nobody passes.
3. Collapse indirection that has exactly one caller and no second one on the horizon.
4. Replace conditional thickets with early returns, and replace flag parameters with two named functions.
5. Rename until the comment explaining the code becomes redundant, then delete the comment.
6. Re-run the tests after each step and keep the steps in separate commits so any one can be reverted.

## Rules
- Behavior must not change. If it does, that is a bug fix or a feature, and it belongs in its own commit.
- The best simplification is deletion. Ask whether the code needs to exist before asking how to improve it.
- One caller is not a pattern. Wait for the third before extracting a shared abstraction.
- A wrapper that only forwards arguments earns nothing and costs a hop of indirection.
- Configuration nobody configures is dead weight with a support cost; remove the option and hard-code the used value.
- Shorter is not automatically simpler. Clever one-liners and dense chains trade reading time for line count.
- Leave the tests alone. Rewriting a test to match simplified code hides the regression it exists to catch.

## Checklist
- [ ] Behavior is unchanged and proven by existing tests.
- [ ] Dead code and unused options are deleted, not just tidied.
- [ ] Each simplification is a separate revertible commit.
