# Implementation procedure
Owned and executed by `starting-dev`; this file is not a standalone skill.

1. Read the accepted task criteria, plan, local instructions, and current Git state. Preserve unrelated modifications and declared ownership boundaries.
2. Select the installed domain owner: `backend-systems`, `frontend-engineering`, `threejs`, `mobile-engineering`, `data-engineering`, `cloud-devops`, or another relevant sibling. Supply one bounded slice, target paths, dependencies, and acceptance checks.
3. Reproduce defects before changing behavior. Use `test-engineering` when behavior coverage is missing, and implement the smallest coherent correction.
4. Run configured scoped checks and a representative smoke test. Diagnose failures; never weaken assertions or skip a check merely to advance.
5. Record `progress.md`: slice, changed files, command/result evidence, known limits, plan drift, and remaining work. Keep the plan consistent with actual authorized scope.
6. Iterate until acceptance criteria are met. Then set the stage to finalize and hand off to `finishing-dev` for independent code/security reviews **before** PR creation.

Do not create a PR during this procedure. Commit or push only when previously authorized and delegated to `git-workflow`; no stage name grants authority. Record scratch assets and worktrees at creation. A green build alone is not runtime proof.
