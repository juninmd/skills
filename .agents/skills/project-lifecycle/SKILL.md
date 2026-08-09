---
name: project-lifecycle
description: |
  Turn product or engineering goals into validated specs, plans, issues, branches, and pull requests. Use for PRDs, implementation plans, issue slicing, GitHub triage, worktrees, branch completion, and delivery documentation.
---

# Project Lifecycle

## Workflow
1. Establish goal, users, constraints, non-goals, current evidence, and measurable acceptance criteria.
2. Choose the smallest deliverable vertical slice and identify dependencies and rollback.
3. Write an executable plan whose steps name files/surfaces and verification commands.
4. Convert work into independently verifiable issues only when issue tracking is requested.
5. During execution, keep one active step, record plan drift, and validate each completed slice.
6. Before PR/release, verify diff scope, tests, docs, migration/ops notes, and reviewer context.

## Reference Routing
- Real delivery cases: [real-world-cases.md](references/real-world-cases.md)
- Specs: [spec-workflow.md](references/spec-workflow.md), [spec-templates.md](references/spec-templates.md)
- Execution: [execution-guidelines.md](references/execution-guidelines.md), [karpathy-methodology.md](references/karpathy-methodology.md)
- Issues and triage: [to-issues-process.md](references/to-issues-process.md), [triage-workflow.md](references/triage-workflow.md), [triage-logic.md](references/triage-logic.md), [triage-standards.md](references/triage-standards.md), [OUT-OF-SCOPE.md](references/OUT-OF-SCOPE.md)
- Worktrees: [worktree-setup.md](references/worktree-setup.md), [worktree-standards.md](references/worktree-standards.md), [worktree-workflow.md](references/worktree-workflow.md)
- Docs strategy: [docs-strategy.md](references/docs-strategy.md), [docs-guidelines.md](references/docs-guidelines.md)
- GitHub Actions docs map: [topic-map.md](references/topic-map.md)
- Branch completion: [git-finish-workflow.md](references/git-finish-workflow.md), [git-best-practices.md](references/git-best-practices.md)
- Agent briefs: [AGENT-BRIEF.md](references/AGENT-BRIEF.md)

## Rules
- No commit, push, rebase, merge, branch deletion, or PR mutation without explicit confirmation.
- Do not create documentation artifacts the user did not request.
- Plans must include checks, not just implementation prose.
- If requirements are vague, interview before planning: ask one decision-relevant question at a time, state assumptions, and iterate until acceptance criteria are measurable.

## Checklist
- [ ] Acceptance criteria and non-goals are explicit.
- [ ] Work is independently verifiable.
- [ ] Delivery evidence matches the actual diff.
