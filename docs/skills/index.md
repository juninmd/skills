# Skills

The catalog contains 25 domain skills. They are intentionally broader than single-tool skills so the model has fewer overlapping routes, while reference files preserve depth. Retired skill names are mapped to their owner in `.agents/retired-skills.json`.

<!-- skill-catalog:start -->
| Skill | Use it for |
|---|---|
| `3d-models` | Blender cleanup, VRM 0.x/1.0 conversion, VRoid exports, MToon materials, shape keys, ARKit blendshapes, humanoid rigs, and VRM SpringBone hair physics |
| `agent-engineering` | agent loops, MCP tools, context window pruning, parallel subagents, concurrent workspaces, headless resilience, and authoring new skills with eval benchmarks |
| `agy-image-babysitter` | Keep an agy (Antigravity CLI) conversation generating images unattended: relaunch the headless loop 90s after a 401 token expiry and sleep until quotaResetTimeStamp after a 429 |
| `backend-systems` | NestJS modules, dependency injection, DTO validation, FastAPI, REST/GraphQL OpenAPI contracts, endpoints, controllers, pnpm, uv, async concurrency, cache invalidation, and backend builds; maintain existing Go and .NET services too |
| `bot-engineering` | a price/deal/release/job-listing tracker, an RSS/API poller, or any bot that watches a source and notifies on change |
| `cloud-devops` | GitHub Actions, Dockerfiles, Terraform, Helm, manual GHCR rollout, deployment sync drift, and safe bash/PowerShell |
| `code-review` | adversarial code review, legacy undocumented code recovery, characterization tests before refactoring, simplifying working code, collapsing unnecessary abstractions, and deleting proven dead code |
| `data-engineering` | PostgreSQL, MySQL, Redis, schema migrations, zero-downtime DDL, pandas profiling, query plans, indexes, and aggregation |
| `documentation` | README, docs verification, Mermaid diagrams as code, ASCII figures, terminal figures, code snippet images, PDF/DOCX generation, and OpenAPI reference |
| `finishing-dev` | finishing a feature branch, review-before-PR delivery, PR descriptions, shipping a completed change, homologação/homologar (prove it works against the real target before calling it done), and final acceptance evidence |
| `frontend-engineering` | React, Next.js, Vite, Tailwind, WCAG accessibility, visual hierarchy, color palettes, anti-slop styling, UI states, and masonry |
| `git-workflow` | branches, worktrees, rebase conflicts, reflog recovery, stash, bisect, conventional commits, semantic version bumps, changelogs, and release tags. PR review and delivery use finishing-dev |
| `goldsrc-modding` | Valve 220 .map geometry, ZHLT/VHLT compile pipelines, BSP30 lump editing, CS 1.6 entity logic, and AMX Mod X/Pawn (.sma/.amxx) scripting: natives, forwards, precache lifecycle, and crash forensics |
| `mobile-engineering` | mobile UI, lifecycle, navigation, permissions, offline behavior, accessibility, device integration, tests, and builds |
| `observability` | structured logging, metrics, distributed tracing, alerting, root-cause troubleshooting, postmortems, network failures, timeouts, and on-call response |
| `performance-engineering` | endpoint profiling, latency bottlenecks, N+1 query bottlenecks, memory leaks, LCP/INP web vitals, autonomous metric loops, and rightsizing costs |
| `radar-ia` | the daily AI radar and best-posts digests; not for one-paper research or debugging |
| `security-ops` | end-to-end vulnerability audits, pen tests, CVE scans, Gitleaks remediation, zero-trust reviews, plugin vetting, least privilege, threat modeling, and third-party extension safety |
| `software-architecture` | module boundaries, ubiquitous language and domain glossaries (CONTEXT.md), repository layout, Electron multi-process security, ADRs, and circular dependency resolution |
| `stack-selection` | "which should we use", picking a package manager, framework, ORM, linter, or desktop shell, adopting or replacing a dependency, and justifying a deviation |
| `starting-dev` | repository onboarding, backlog issues, task stages, and session handoffs |
| `test-engineering` | unit/integration tests, Vitest, pytest, flaky test elimination, Playwright E2E, LLM gateway conformance, and test coverage |
| `threejs` | canvas 3D graphics, scene performance, and asset loading |
| `tooling-dev` | CLI arguments, exit codes, non-interactive execution, config discovery, signals, structured output, packaging, and integration tests |
| `web-research` | multi-source search, HTML table/listing scraping, verifying latest library stable versions, changelog tracking, and citations |
<!-- skill-catalog:end -->

## How Discovery Works

The frontmatter description states what the skill does and when it applies. The workflow and references load only after the skill is selected.

Use explicit invocation when you need to force a domain:

```text
/security-ops
/software-architecture
/mobile-engineering
```
