---
description: Implement the next slice with a failing check first
argument-hint: <slice or task>
---
Task: $ARGUMENTS

Establish real state (git status, tests, lint) before editing. Write the failing check first, make the smallest correct change, then rerun the check and the linter. Touch only lines the task needs. Stop after three failed attempts on one error and report the evidence.
