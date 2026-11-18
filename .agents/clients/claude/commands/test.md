---
description: Run and extend the checks that prove the change
argument-hint: <area or change to verify>
---
Scope: $ARGUMENTS

Run the repository tests for the changed area and report the real output. Add missing cases: empty, null, boundary, unicode, large input, concurrency, partial failure, idempotent retry. A flaky test is a defect: find the cause, do not retry or skip it.
