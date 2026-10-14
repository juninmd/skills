# Migration from custom agents to skills

The repository distributes skills only. Former role files were consolidated into domain skills so routing, procedures, and validation live in one source of truth.

| Retired role | Owning skill | Procedure boundary |
|---|---|---|
| Code Reviewer | `code-review` and `security-ops` (`.agents/skills/code-review/SKILL.md`, `.agents/skills/security-ops/SKILL.md`) | Diff review owns findings; security assessment follows `security-ops`. |
| DevOps Engineer | `cloud-devops` (`.agents/skills/cloud-devops/SKILL.md`) | CI/CD, containers, infrastructure, rollout, and rollback stay in the skill. |
| Plan Specialist | `requirements-planning` (`.agents/skills/requirements-planning/SKILL.md`) | Acceptance criteria, implementation briefs, and vertical slices stay in the skill. |
| Principal Engineer | `starting-dev` (`.agents/skills/starting-dev/SKILL.md`) and `references/phase-implement.md` | Repository orientation and implementation execution follow the selected domain workflow and validation gates. |

Temporary independent reviewers may still be delegated when the active workflow calls for them. They use the owning skills and leave evidence in the task workspace; no separate role definition is installed or published.
