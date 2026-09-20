---
name: starting-dev
description: |
  Start development: clarify ambiguous requirements into acceptance criteria and PRDs, author AGENTS.md and README, onboard by charting an unfamiliar codebase and its dependencies, break features into vertical slices, and run the dev loop: research, throwaway prototype variants, plan, implement. Use for repository onboarding, backlog issues, task stages, and session handoffs.
---

# Starting Development

## Loading Constraints

Clarification needs a live user. In CI, a scheduled run, `/loop`, or any headless session,
do not interview: write the assumption you would have tested, mark it as a blocker, and
carry on with everything that does not depend on the answer.

**Not this skill:** a request already specific enough to act on (its domain skill), or delivering finished work (`finishing-dev`).

## Preflight
Establish the request, current instructions, worktree ownership, stack, and existing delivery state before writing. Run from the repository root:

```bash
git status --short
git branch --show-current
rg --files --hidden -g AGENTS.md -g CLAUDE.md -g README.md -g package.json -g bun.lock -g bun.lockb -g '*lock*' -g Cargo.toml -g pyproject.toml -g '.github/workflows/*' -g '!.git' -g '!node_modules' -g '!target'
rg --files --hidden .workflow
```
The last probe applies only when `.workflow` exists. Read manifests, CI, and applicable instructions; do not infer runnable commands from filenames. Existing modifications are not a reason to clean or stash somebody else's work.

## Workflow
1. Establish goal, constraints, non-goals, and measurable acceptance criteria. Open with one sentence of what you believe is wanted and an honest confidence number; under 70%, name what is missing on the same line:

   ```
   HYPOTHESIS: they want to answer "how are we doing?" in standup; "dashboard" was the convention
   CONFIDENCE: ~30% - missing: who reads it, which metric, what success looks like
   ```

   Then resolve material missing decisions in one batched clarification, each question carrying your guess so a nod is enough to proceed; continue independent inspection while waiting. Stop interrogating at the point where you can predict the answer, not at the point where you have enough to start. Use [requirements clarification](references/requirements-clarification.md) for ambiguity and [spec workflow](references/spec-workflow.md) for a requested PRD.
2. Map one real flow from entry to response with `file:line` evidence using [codebase mapping](references/codebase-mapping.md). Record owning modules, dependency edges, configuration sources, and actual setup/test/build commands. State when runtime evidence is unavailable.
3. Invoke `web-research` for a new project or a choice involving libraries, APIs, compatibility, or current best practices. Record primary sources and dates. Prefer **Bun → Node.js → Rust → Python** for new work, selecting the first suitable runtime; explain concrete compatibility or workload reasons for a later choice. Preserve an existing repository's runtime and lockfile unless migration is requested.
4. Generate or adapt **AGENTS.md and README.md** when bootstrapping or explicitly requested. Follow [agent instructions](references/agents-md.md); use `documentation` for the README. Derive commands from verified scripts. AGENTS records ownership, authority, checks, and gotchas; README explains purpose, quickstart, configuration, usage, and limits. Preserve project facts and attribution; never claim untested installation works.
5. Plan the smallest vertical slices: each step names target files, verification command, expected result, and dependencies. Use [incremental delivery](references/incremental-delivery.md). Ask `software-architecture` to resolve boundaries and contracts before implementation. Create or mutate tracking issues only within explicit authorization.
6. For an ongoing delivery loop, execute the local stage procedure below, then record its artifact and state. For a scoped planning or onboarding request, return the requested artifact without starting an implementation loop.
7. Delegate implementation to the relevant installed domain skill; use `test-engineering` for meaningful regression gates. Update progress and acceptance evidence after each slice. Send completed implementation to `finishing-dev` for independent reviews and PR delivery.

## Local delivery stages
These are procedures owned here, **not separate skills**. Read only the current stage.

| State / need | Procedure and transition |
|---|---|
| Research | [Research](references/phase-research.md): source-backed constraints → prototype or plan |
| Unresolved product direction | [Prototype](references/phase-prototype.md): disposable alternatives → record selected direction |
| Plan | [Plan](references/phase-plan.md): files, checks, acceptance → implement |
| Implement | [Implementation](references/phase-implement.md): domain work, scoped gates, evidence → finalize |
| Finalize / done | Hand off to `finishing-dev`; PR readiness does not imply merge or deployment |
| Resume / handoff | Read [state contract](references/loop-state.md) and [session handoff](references/session-handoff.md); continue from actual artifacts |

Use durable loop state only for sustained delivery or when existing state already tracks the task. Record skipped stages with a reason. Re-read after a stage; update only after its output exists. No mandatory approval ceremony for routine reversible work already authorized.

## Reference routing
[Reference map](references/TOPIC_MAP.md) selects detailed planning, human setup, triage, worktree, and session procedures. References are local procedures executed by this skill; sibling handoffs name installed skills.

## Stop
- A material product, authority, or compatibility decision cannot be inferred; request that decision while continuing independent work.
- Loop state is corrupt or multiple workspaces match; preserve evidence and resolve identity before advancing.
- A gate fails or a stage stalls; diagnose the cause, keep its state, and report the blocker if it cannot be fixed within scope.
- A proposed step needs credentials or unapproved external writes; complete safe preparation first.

## Rules
- A plan step without an observable check is incomplete.
- Do not force all projects through prototype stages; record why a stage is unnecessary.
- Unrequested publishing, merging, deployment, or external messages are outside starting development.
- Session memory outside the workspace requires an explicit user request; see [session learnings](references/session-learnings.md).

## Checklist
- [ ] Goal, non-goals, acceptance criteria, and uncertain decisions recorded.
- [ ] Real flow and runnable commands backed by repository evidence.
- [ ] Runtime choice preserves existing constraints; new choices follow the stated priority.
- [ ] Requested AGENTS.md and README match actual behavior and commands.
- [ ] Each planned slice has files, a check, and expected results.
- [ ] State reflects artifacts; completed work hands off to `finishing-dev`.
