# Skills

The catalog contains 30 domain skills. They are intentionally broader than single-tool skills so the model has fewer overlapping routes, while reference files preserve depth. Retired skill names are mapped to their owner in `.agents/retired-skills.json`. The catalog is capped at 35 skills (`pnpm run catalog:check` enforces it); a skill that straddles two domains is split along the domain line rather than stretched.

<!-- skill-catalog:start -->
| Skill | Use it for |
|---|---|
| `3d-models` | Blender cleanup, VRM 0.x/1.0 conversion, VRoid exports, MToon materials, shape keys, ARKit blendshapes, humanoid rigs, and VRM SpringBone hair physics |
| `agent-engineering` | agent loops, tool schemas, step and token bounds, prompt-injection defense, tool guards and hooks, MCP transports, context window pruning, and system prompts for Claude 5 generation models |
| `agent-orchestration` | parallel audits or migrations, verifying subagent claims, goal or loop runs with stop rules and a task file, and supervising headless agents through auth expiry and quotas |
| `agy-image-babysitter` | Keep an agy (Antigravity CLI) conversation generating images unattended: relaunch the headless loop 90s after a 401 token expiry and sleep until quotaResetTimeStamp after a 429 |
| `backend-systems` | NestJS modules, dependency injection, DTO validation, FastAPI, REST/GraphQL OpenAPI contracts, endpoints, controllers, async concurrency, cache invalidation, and backend builds; maintain existing Go and .NET services too |
| `bot-engineering` | a price/deal/release/job-listing tracker, an RSS/API poller, or any bot that watches a source and notifies on change |
| `cloud-devops` | GitHub Actions, Dockerfiles, Terraform, Helm, manual GHCR rollout, deployment sync drift, and safe bash/PowerShell |
| `code-review` | adversarial code review, legacy undocumented code recovery, characterization tests before refactoring, simplifying working code, collapsing unnecessary abstractions, and deleting proven dead code |
| `data-engineering` | PostgreSQL, MySQL, Redis, schema migrations, zero-downtime DDL, pandas profiling, query plans, indexes, and aggregation |
| `documentation` | README, docs verification, Mermaid diagrams as code, ASCII figures, terminal figures, code snippet images, PDF/DOCX generation, and OpenAPI reference |
| `finishing-dev` | finishing a feature branch, review-before-PR delivery, PR descriptions, shipping a completed change, homologação/homologar (prove it works against the real target before calling it done), and final acceptance evidence |
| `frontend-engineering` | React, Next.js, Vite, Tailwind, WCAG accessibility, visual hierarchy, color palettes, anti-slop styling, UI states, and masonry |
| `git-workflow` | branches, worktrees, rebase conflicts, reflog recovery, stash, bisect, conventional commits, semantic version bumps, changelogs, and release tags. PR review and delivery use finishing-dev |
| `goldsrc-modding` | Valve 220 .map geometry, ZHLT/VHLT compile pipelines, BSP30 lump editing, CS 1.6 entity logic, and AMX Mod X/Pawn (.sma/.amxx) scripting: natives, forwards, precache lifecycle, and crash forensics |
| `ios-engineering` | Swift optionals/concurrency/memory, SwiftUI view design, UIKit screens and Auto Layout, Metal rendering, widgets, permissions, and App Store readiness |
| `mobile-engineering` | mobile UI, lifecycle, navigation, permissions, offline behavior, accessibility, localization, device integration, tests, and builds. Native Apple/iOS work (Swift, SwiftUI, UIKit, Metal, WidgetKit) routes to `ios-engineering` |
| `observability` | structured logging, metrics, distributed tracing, alerting, root-cause troubleshooting, postmortems, network failures, timeouts, and on-call response |
| `package-management` | Manage JS and Python package managers and project toolchains: pnpm workspaces, catalogs, overrides, patches, peer deps, aliases, hooks, CLI, config, and store; uv, pyproject |
| `performance-engineering` | endpoint profiling, latency bottlenecks, N+1 query bottlenecks, memory leaks, LCP/INP web vitals, autonomous metric loops, and rightsizing costs |
| `radar-ia` | the daily AI radar and best-posts digests; not for one-paper research or debugging |
| `requirements-planning` | a vague request, a PRD/spec, an AFK agent brief, backlog slicing, or issue classification |
| `security-ops` | end-to-end vulnerability audits, pen tests, CVE scans, Gitleaks remediation, zero-trust reviews, plugin vetting, least privilege, threat modeling, and third-party extension safety |
| `skill-authoring` | a new SKILL.md, a skill that misfires or never triggers, gotchas sections, progressive-disclosure references, skill scripts and persistent data, splitting a skill that straddles domains, and deciding whether a recurring task deserves a skill |
| `software-architecture` | module boundaries, ubiquitous language and domain glossaries (CONTEXT.md), repository layout, Electron multi-process security, ADRs, and circular dependency resolution |
| `stack-selection` | "which should we use", picking a package manager, framework, ORM, linter, or desktop shell, adopting or replacing a dependency, and justifying a deviation |
| `starting-dev` | repository onboarding, worktrees, task stages, and session handoffs |
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
