# Project Lifecycle Real-World Cases

Use this first for turning vague work into executable, reviewable delivery.

## Vague Product Request
- Convert the request into outcome, users, non-goals, constraints, success checks, and release risk.
- Ask only for missing decisions that change implementation.
- Slice work so the first increment proves the riskiest assumption.

## Implementation Plan
- List steps with a verification command or artifact for each step.
- Include data migration, rollback, observability, feature flag, and support impact when relevant.
- Keep dependencies explicit; avoid parallel work that touches the same ownership boundary.

## Issue or PR Breakdown
- Create issues around independently testable behavior, not file areas.
- Put acceptance criteria and validation commands in each issue.
- Mark sequencing, blockers, and shared fixtures up front.

## Finish Work
- Verify working tree, tests, docs, changelog/release notes if needed, and deployment readiness.
- Do not commit, push, merge, rebase, or clean branches without explicit confirmation.
