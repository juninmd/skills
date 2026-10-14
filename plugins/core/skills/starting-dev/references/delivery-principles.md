# Delivery principles

Caution and simplicity rules plus worked lifecycle cases. Open during plan and implement, or when turning a vague ask into reviewable delivery.

## Contents
- Principles
- Lifecycle cases

## Principles
- **Think first:** state assumptions; present competing interpretations instead of choosing silently; push back with a simpler approach; stop when confused.
- **Simplicity:** implement only what was requested; no single-use abstractions or just-in-case flexibility; if 50 lines replace 200, rewrite.
- **Surgical:** touch only required lines; match local style even if non-standard; remove only dead code your change created.
- **Goal-driven:** turn each task into a verifiable check (a reproduction test first for bugs); step-by-verify plans; iterate until the check passes.

## Lifecycle cases

| Case | Do |
|---|---|
| Vague product request | Convert to outcome, users, non-goals, constraints, success checks, release risk. Ask only what changes implementation. Slice so the first increment proves the riskiest assumption. |
| Implementation plan | One verification command or artifact per step. Include migration, rollback, observability, feature flag, and support impact when relevant. Explicit dependencies; no parallel work across one ownership boundary. |
| Issue or PR breakdown | Issues around independently testable behavior, not file areas. Acceptance criteria and validation commands in each. Sequencing, blockers, and shared fixtures up front. |
| Finish work | Hand off to `finishing-dev`. No commit, push, merge, rebase, or branch cleanup without explicit confirmation. |
