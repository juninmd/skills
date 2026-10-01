# Implementation procedure
Owned and executed by `starting-dev`; this file is not a standalone skill.

1. Compare the plan with current code reality (APIs, scripts, layout), then read the accepted criteria, local instructions, and current Git state. Mirror the plan's slices into the workspace `tasks.md` and follow them in order. Preserve unrelated modifications and declared ownership boundaries.
2. Select the installed domain owner: `backend-systems`, `frontend-engineering`, `threejs`, `mobile-engineering`, `data-engineering`, `cloud-devops`, or another relevant sibling. Supply one bounded slice, target paths, dependencies, and acceptance checks.
3. Reproduce defects before changing behavior. Use `test-engineering` when behavior coverage is missing, and implement the smallest coherent correction.
4. Run configured scoped checks and a representative smoke test. Diagnose failures; never weaken assertions or skip a check merely to advance.
5. Record `progress.md` in the workspace: slice, changed files, command/result evidence, known limits, plan drift, and remaining work. Keep the plan consistent with actual authorized scope.
6. Iterate until acceptance criteria are met. Then set the stage to finalize and hand off to `finishing-dev` for independent code/security reviews **before** PR creation.

Pause and report when a dependency or credential is missing, a destructive command lacks approval, a check fails repeatedly, or the plan names a resource that does not exist. After the last slice run the broad gates (lint, test, build) once.

Do not create a PR during this procedure. Commit or push only when previously authorized and delegated to `git-workflow`; no stage name grants authority. Record scratch assets and worktrees at creation. A green build alone is not runtime proof.
