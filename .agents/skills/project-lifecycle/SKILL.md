---
name: project-lifecycle
description: |
  Plan project scope, clarify ambiguous requirements, guide human steps, and maintain context memory. Use for PRDs, vague requests, acceptance criteria, backlog triage, session handoffs, AGENTS.md authoring, interactive human wizards, and session learnings.
---



# Project Lifecycle

## Preflight
```bash
gh issue list --limit 20 --json number,title,labels 2>/dev/null
ls .workflow/*/loop-state.json 2>/dev/null    # is a dev-loop already driving this?
```

An active loop state file means this skill defers — `dev-loop` and its stage skills own delivery there.

## Workflow
1. Establish goal, users, constraints, non-goals, current evidence, and **measurable** acceptance criteria. Vague requirements go through requirements-clarification first — one batched round, never a question at a time.
2. Choose the smallest deliverable vertical slice, and name its dependencies and its rollback.
3. Write an executable plan: every step names the files or surfaces it touches and the command that verifies it.
4. Convert work into independently verifiable issues **only when issue tracking is requested**.
5. During execution, keep one step active, record plan drift as it happens, and validate each completed slice.
6. Before the pull request, verify diff scope, tests, docs, migration and ops notes, and reviewer context.

## A Plan Step Is Not a Sentence
An "executable plan" means each step is independently checkable by someone who was not in the conversation.

| Field | Example |
|---|---|
| Intent | "Reject checkout when the cart is empty" |
| Files | `src/checkout/validate.ts`, `src/checkout/validate.test.ts` |
| `verify:` | `pnpm vitest run src/checkout/validate.test.ts` |
| Expected | "2 tests pass; empty cart returns 422 with code `CART_EMPTY`" |
| Confirmation needed | no |

A step with no `verify:` command is not a step — it is a hope with a checkbox.

## Non-Goals Are the Cheapest Scope Control
Write down what this work explicitly does **not** cover, before planning. Every hour spent on an unstated non-goal is an hour nobody asked for, and the argument about whether it was in scope happens either way — better before than at review.

## Plan Drift
Reality contradicts the plan on any non-trivial work. That is information, not failure.

| Situation | Do |
|---|---|
| A step turns out unnecessary | strike it, record why |
| A step reveals hidden work | add it, and re-check the total scope with the user |
| The approach is wrong | stop, re-plan, do not push through |
| Scope grows | surface it explicitly — silent expansion is how deadlines die |

Record drift in the plan file as it happens. A plan quietly diverging from the work is worse than no plan, because it is still trusted.

## Slicing Into Issues
Only when issue tracking was requested. Each issue must be independently verifiable and independently valuable.

| Test | Failing means |
|---|---|
| Can it be verified alone? | it is a task, not an issue — merge it into its parent |
| Does it deliver something? | it is a step of another issue |
| Would you close it on its own? | the boundary is wrong |
| Does it name its acceptance criteria? | it will be argued about at review |

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

See [Reference Map](references/TOPIC_MAP.md) for specialized references and sub-domain guides.

## Stop
- Requirements are vague. Clarify with requirements-clarification before planning; a plan on assumptions is rework with a schedule.
- A step has no verification command. It is an intention with a checkbox.
- Scope grew without being surfaced. Say it out loud — silent expansion is how deadlines die.

## Rules
- Hand off execution loop to `dev-loop`, domain architecture to `software-architecture`, and documentation to `documentation`.
- No commit, push, rebase, merge, branch deletion, or pull-request mutation without explicit confirmation.
- Do not create documentation artifacts the user did not request. A plan is not a deliverable unless someone asked for one.
- With an active `dev-loop` state file, defer to the loop — its stage skills own delivery there. This skill is for standalone work.
- Acceptance criteria live where the work lives — the issue, or a repository note linked from the pull request. Criteria that live only in chat are gone next session.
- Slicing the delivery into shippable steps belongs to incremental-delivery; the pull request itself to finishing-dev.

## Checklist
- [ ] Goal, users, constraints, and **non-goals** written down.
- [ ] Acceptance criteria measurable and recorded durably.
- [ ] Every plan step names files and a `verify:` command with an expected result.
- [ ] Smallest vertical slice chosen; dependencies and rollback identified.
- [ ] Plan drift recorded as it happened, not reconstructed afterwards.
- [ ] Delivery evidence matches the actual diff.
