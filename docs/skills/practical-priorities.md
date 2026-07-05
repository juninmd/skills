# Practical Skill Priorities

This map ranks the skills to optimize first for real development work. Ranking uses current repo evidence: local mentions observed during the audit, common coding-agent workflows, and blast radius when the skill behaves poorly. No runtime telemetry was available, so this is an evidence-weighted prioritization, not a usage analytics report.

## Usage Signals

Initial local mention scan, before this optimization added the priority table:

| Mentions | Skills |
|---|---|
| 8 | `diagnostics` |
| 5 | `backend-node`, `expert-review`, `project-lifecycle`, `software-architecture`, `test-engineering` |
| 4 | `agent-engineering`, `cloud-devops`, `frontend-engineering`, `mobile-engineering`, `security-ops`, `tooling-dev` |
| 3 | `backend-python`, `backend-systems`, `data-engineering` |

| Priority | Skill | Why it matters | Current optimization |
|---|---|---|---|
| 1 | `diagnostics` | Most mentioned locally; every bug fix depends on evidence quality. | Added practical failure casebook for UI/runtime, tests, timeout/perf, and network/TLS triage. |
| 2 | `backend-node` | Common stack for TypeScript/NestJS/pnpm services. | Added service/API casebook covering endpoints, NestJS providers, workspaces, and integrations. |
| 3 | `expert-review` | Guards PRs, plans, specs, and risky changes before implementation. | Added review casebook with finding quality, architecture, security-sensitive changes, and no-finding output. |
| 4 | `test-engineering` | Converts changes into regression proof. | Added real-case testing guide for bug fixes, contracts, frontend interaction, flaky tests, and performance claims. |
| 5 | `project-lifecycle` | Turns vague goals into executable, verifiable work. | Added delivery casebook for product requests, plans, issue slicing, and finish checks. |
| 6 | `software-architecture` | High blast radius when abstractions or boundaries are wrong. | Added architecture casebook for refactors, module boundaries, async systems, and ADRs. |
| 7 | `frontend-engineering` | Fast-moving stack and high UX risk. | Added frontend casebook covering React state, Next.js data boundaries, forms, hydration, and performance. |
| 8 | `security-ops` | Highest consequence when evidence leaks or remediation order is wrong. | Added casebook for secrets, dependency CVEs, auth/tenant boundaries, and CI hardening. |
| 9 | `cloud-devops` | Small YAML/IaC mistakes can mutate production or hide broken workloads. | Added operations casebook for CI, Docker, Kubernetes/Helm, and Terraform/Pulumi. |
| 10 | `backend-python` | Common API stack with quality-gate drift across Ruff, type checkers, uv, and FastAPI. | Added Python service casebook and normalized type-checker guidance to the repo-selected checker. |
| 11 | `agent-engineering` | Agent bugs can cross tool, memory, and authority boundaries. | Added casebook for schema drift, prompt injection, memory/context, and evaluations. |
| 12 | `tooling-dev` | CLIs and generators fail quietly when output streams, exit codes, or paths are wrong. | Added tooling casebook for CLI contracts, file rewriting, cross-platform scripts, and integrations. |
| 13 | `data-engineering` | Data changes need evidence before index, migration, cache, or vector-store mutation. | Added data casebook for slow queries, migrations, Redis/cache issues, and vector search. |
| 14 | `backend-systems` | Concurrency, cancellation, and resource lifetimes have high defect density. | Added systems casebook for APIs/workers, concurrency bugs, resource cleanup, and performance work. |
| 15 | `mobile-engineering` | Mobile failures hide in lifecycle, permissions, offline, and release builds. | Added mobile casebook for screens, native capabilities, offline sync, and release build issues. |

## Next Optimization Queue

- `mobile-engineering`: split large reference files only after repeated tasks prove `reference-routing.md` is not enough.
- `backend-python`: keep watching official `ty` maturity and update only when project migration guidance changes.
- `frontend-engineering`: refresh framework-specific references when Next.js, React, Vite, Tailwind, or shadcn/ui tasks expose drift.
- `cloud-devops`: add provider-specific references only after repeated real tasks justify the context cost.

## Source Checks

Use official docs for drift-prone stack guidance:

| Area | Checked source | Guidance encoded |
|---|---|---|
| Python type checking | Astral `ty` docs | `ty` is active and useful for new `uv` projects; preserve Pyright/mypy when already configured. |
| Ruff | Astral Ruff docs | Ruff config belongs in `pyproject.toml`, `ruff.toml`, or `.ruff.toml`; preview rules remain an explicit migration choice. |
| React/Next frontend | React and Next.js docs | Treat state reset, Server/Client boundaries, and caching as explicit design choices. |
| Expo/React Native | Expo docs | Check SDK-specific New Architecture and React Compiler behavior before changing app setup. |
| iOS design | Apple Human Interface Guidelines | Verify current HIG for Liquid Glass, materials, layout, and new platform controls. |

## Update Rule

When a skill is used in a real task and the agent hesitates, over-edits, skips proof, or needs repeated prompting, update the relevant casebook with the missing decision rule. Keep `SKILL.md` short; put reusable details in `references/`.
