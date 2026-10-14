# Skill timeline

When to reach for each skill, in the order a piece of work usually moves. Skills route themselves from their descriptions; this page is the map, not the router.

```text
0 DECIDE      1 START + PLAN       2 BUILD              3 VERIFY             4 SHIP + OPERATE
stack-        requirements-        domain skills        test-engineering     finishing-dev
selection     planning             (see Build)          code-review          git-workflow
              starting-dev         + tooling-dev        security-ops         cloud-devops
              software-architecture                     performance-         observability
              web-research                              engineering

cross-cutting: documentation · agent-orchestration · agent-engineering · skill-authoring · package-management
```

## Task state lives outside the repo

Task list, loop state, and stage artifacts go in `<tmpdir>/starting-dev/<session-id>/` (`tasks.md`, `loop-state.json`, `research.md`, `plan.md`, `progress.md`). Never `TASKS.md` or `.workflow/` inside the repository. A new session resumes from the path recorded in the handoff.

## 0. Decide

| Moment | Skill |
|---|---|
| Nothing exists yet: runtime, package manager, framework, ORM, linter, UI library, or adopting a dependency | `stack-selection` |
| A fact must be current: versions, changelogs, a claim to verify, a page to scrape | `web-research` |

## 1. Start and plan

| Moment | Skill |
|---|---|
| The ask is ambiguous: acceptance criteria, PRD, agent brief, backlog slices, issue triage | `requirements-planning` |
| First day in a repo, writing AGENTS.md, the research / prototype / plan / implement loop, a handoff | `starting-dev` |
| Module boundaries, import cycles, repo layout, domain language, ADRs | `software-architecture` |

Order inside this phase: `requirements-planning` turns the ask into criteria, `starting-dev` maps the code and runs the loop, `software-architecture` is pulled in when a boundary or contract must change.

## 2. Build

| Work | Skill |
|---|---|
| Services, APIs, caches (Bun, Node, Rust, Python; Go and .NET maintenance) | `backend-systems` |
| Schemas, migrations, slow queries, backups, Redis, vector stores | `data-engineering` |
| Web UI: React, Next, Vite, styling, accessibility | `frontend-engineering` |
| React Native, Expo, Flutter, native Android | `mobile-engineering` |
| Swift, SwiftUI, UIKit, Metal, WidgetKit | `ios-engineering` |
| Three.js and React Three Fiber scenes | `threejs` |
| VRM, VRoid, and Blender asset preparation | `3d-models` |
| Counter-Strike 1.6 maps and AMX Mod X plugins | `goldsrc-modding` |
| A distributable CLI, generator, or developer automation | `tooling-dev` |
| Scheduled scraper, monitor, or notification bot | `bot-engineering` |
| Agent loop, tool schemas, MCP server, guards | `agent-engineering` |
| Daily or weekly AI ecosystem digest | `radar-ia` |
| Operating pnpm, uv, Ruff, prek, Dependabot on an existing stack | `package-management` |

## 3. Verify

| Moment | Skill |
|---|---|
| Tests first, flaky tests, E2E, coverage, regression gate | `test-engineering` |
| A diff or PR needs adversarial review, safe simplification, or dead-code deletion | `code-review` |
| Secrets, CVEs, supply chain, least privilege, privacy questions, plugin vetting | `security-ops` |
| Profiling, load tests, memory leaks, Core Web Vitals, cost | `performance-engineering` |

## 4. Ship and operate

| Moment | Skill |
|---|---|
| Branch is ready: independent reviews, evidence, PR | `finishing-dev` |
| Rebase conflicts, reflog recovery, bisect, commits, version bumps, release tags | `git-workflow` |
| CI/CD, Dockerfile, Kubernetes, Helm, Terraform, rollouts, drift | `cloud-devops` |
| Production diagnosis, logs, metrics, traces, SLOs, incidents, product analytics | `observability` |
| An unattended agy image run needs relaunching after 401 or 429 | `agy-image-babysitter` |

## Cross-cutting

| Moment | Skill |
|---|---|
| README, runbook, diagrams as code, generated PDF or DOCX | `documentation` |
| Fan out subagents, verify claims adversarially, run overnight | `agent-orchestration` |
| Write, split, or tune a skill and its routing evals | `skill-authoring` |

## Handoff rules

- Planning ends where `starting-dev` begins; delivery starts where `finishing-dev` begins. `finishing-dev` calls `code-review` for the correctness pass.
- Acceptance criteria belong to `requirements-planning`; the dev loop belongs to `starting-dev`.
- Runtime and library choices belong to `stack-selection`; operating a chosen toolchain belongs to `package-management`.
- Worktrees are opt-in: suggested only when warranted, created only after you accept.
