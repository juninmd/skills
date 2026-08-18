---
name: incremental-delivery
description: |
  Break a large change into small steps that each ship and revert on their own. Use for vertical slicing, tracer bullets, sequencing dependent work, stacked pull requests, keeping trunk releasable, and avoiding a long-lived branch or a big-bang merge.
---

# Incremental Delivery

## Workflow
1. Describe the end state, then find the thinnest path through it that a user could actually exercise.
2. Build that path end to end first as a tracer bullet: real boundaries, narrow behavior, no stubs left behind.
3. Slice the rest vertically. Each slice crosses every layer it needs and leaves the system working.
4. Order slices by what removes the most uncertainty, not by what is easiest to write.
5. Ship each slice behind a flag if it is not ready to be seen, and land it on trunk the same day it is written.
6. After each slice, re-plan from what you learned instead of executing a plan written before you knew anything.

## Rules
- Every step must leave the build green and the product usable. A step that only makes sense with the next one is not a step.
- Horizontal slices lie: all the models, then all the endpoints, then all the UI gives you nothing demonstrable until the end.
- A branch that lives longer than a day or two is a merge conflict accruing interest.
- Prefer several small pull requests stacked in order over one that touches forty files.
- A flag is a commitment to remove it. Note the removal condition when you add it.
- Do not build the abstraction on slice one. Wait until the third case shows you what varies.
- If a slice cannot be reverted alone, split it until it can.

## Checklist
- [ ] The first slice runs end to end through real boundaries.
- [ ] Every step ships independently and leaves trunk releasable.
- [ ] Flags have a stated removal condition.
