# Implementation procedure
Owned and executed by `starting-dev`; this file is not a standalone skill.

1. Compare the accepted plan with current code reality (APIs, scripts, layout), then read criteria, local instructions, and current Git state. Resume the next incomplete milestone, mirror its slices into the workspace `tasks.md`, and preserve unrelated modifications and declared ownership boundaries. An existing actionable plan needs no new approval for authorized implementation.
2. Select the installed domain owner: `backend-systems`, `frontend-engineering`, `threejs`, `mobile-engineering`, `data-engineering`, `cloud-devops`, or another relevant sibling. Supply one bounded slice, target paths, dependencies, and acceptance checks.
3. Reproduce defects before changing behavior. Use `test-engineering` when behavior coverage is missing, and implement the smallest coherent correction. Let `software-architecture` resolve durable module boundaries; the domain owner implements local interfaces and dependency injection only where needed. Prefer composition, cohesive modules, and simple contracts over speculative foundations. Validate inputs at trust boundaries, parameterize database queries, keep credentials out of code, and preserve contextual errors rather than swallowing them. Implement the plan's log levels and context fields without exposing secrets.
4. Run configured scoped checks and a representative smoke test. Diagnose failures; never weaken assertions or skip a check merely to advance.
5. Mark a milestone complete in the plan only after its checks pass. Record `progress.md` in the workspace: slice, changed files, command/result evidence, known limits, plan drift, and remaining work. Report what changed, what is verified, and what remains after each milestone; continue authorized work without a routine approval pause. Keep the plan consistent with actual authorized scope.
6. Iterate until acceptance criteria are met. Then set the stage to finalize and hand off to `finishing-dev` for independent code/security reviews **before** PR creation.

Pause and report when a dependency or credential is missing, a destructive command lacks approval, a check fails repeatedly, or the plan names a resource that does not exist. After the last slice run the broad gates (lint, test, build) once.

When the plan proves incompatible with actual code, record the reachable blocker, evidence, and minimal proposed correction in the plan. Resolve routine implementation details in scope; request a decision only when the correction materially changes scope, acceptance, authority, or architecture. Do not use a workaround that hides a security flaw or broken contract merely to check off a milestone.

Do not create a PR during this procedure. Commit or push only when previously authorized and delegated to `git-workflow`; no stage name grants authority. Record scratch assets and worktrees at creation. A green build alone is not runtime proof.

**Exit criterion:** every acceptance criterion in `plan.md` has command evidence in `progress.md`, broad gates ran once after the last slice, and no PR was created.

**Output shape:**
```
Slice 1: done | files: <paths> | evidence: <command> -> pass | limits: <none|list>
```
