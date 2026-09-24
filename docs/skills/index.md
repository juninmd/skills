# Skills

The catalog contains 30 domain skills. They are intentionally broader than single-tool skills so the model has fewer overlapping routes, while reference files preserve depth. Retired skill names are mapped to their owner in `.agents/retired-skills.json`. The catalog is capped at 35 skills (`pnpm run catalog:check` enforces it); a skill that straddles two domains is split along the domain line rather than stretched.

<!-- skill-catalog:start -->
| Skill | Use it for |
|---|---|
| `3d-models` | Blender cleanup, VRM 0.x/1.0 conversion, VRoid exports, MToon materials, shape keys, ARKit blendshapes, humanoid rigs, and VRM SpringBone hair physics |
| `agent-engineering` | agent loops, tool schemas, step and token bounds, prompt-injection defense, tool guards and hooks, MCP transports, context pruning, and system prompts for Claude 5 models |
| `agent-orchestration` | fan-out subagents in isolated workspaces, dynamic workflows, adversarial verification, tournaments, model councils, stop rules with a task file, and headless runs through auth expiry and quotas |
| `agy-image-babysitter` | Keep an agy (Antigravity CLI) conversation generating images unattended: relaunch the headless loop 90s after a 401 token expiry and sleep until quotaResetTimeStamp after a 429 |
| `backend-systems` | NestJS modules, DI, DTO validation, FastAPI, REST/GraphQL OpenAPI contracts, endpoints and controllers, async concurrency, and cache invalidation |
| `bot-engineering` | dedupe/seen-state, rate-limit backoff, keyless endpoints, CronJob scheduling, Telegram/Discord/WhatsApp delivery, and optional LLM steps |
| `cloud-devops` | GitHub Actions, Dockerfiles, Terraform, Helm, manual GHCR rollout, deployment sync drift, and safe bash/PowerShell |
| `code-review` | adversarial review, sibling bug variants, legacy code recovery, characterization tests, simplifying working code, and deleting proven dead code |
| `data-engineering` | PostgreSQL, MySQL, Redis, schema migrations, zero-downtime DDL, query plans, indexes, pandas profiling, and aggregation |
| `documentation` | README, docs verification, Mermaid diagrams as code, ASCII and terminal figures, code snippet images, PDF/DOCX generation, and OpenAPI reference |
| `finishing-dev` | review-before-PR delivery, PR descriptions, homologação/homologar (prove it works on the real target), and acceptance evidence |
| `frontend-engineering` | React, Next.js, Vite, Tailwind, WCAG accessibility, visual hierarchy, color palettes, anti-slop styling, animation, easing, motion, UI states, and masonry |
| `git-workflow` | branches, worktrees, rebase conflicts, reflog recovery, stash, bisect, conventional commits, semantic version bumps, changelogs, and release tags |
| `goldsrc-modding` | Valve 220 .map geometry, ZHLT/VHLT compiles, BSP30 lumps, CS 1.6 entities, and Pawn (.sma/.amxx) natives, forwards, precache, and crash forensics |
| `ios-engineering` | Swift optionals, concurrency and memory, SwiftUI views, UIKit and Auto Layout, Metal shaders, WidgetKit, iOS permissions and system integration, and App Store readiness |
| `mobile-engineering` | React Native, Expo, Flutter, and native Android UI, lifecycle, navigation, permissions, offline behavior, accessibility, localization, device integration, tests, and builds |
| `observability` | structured logging, metrics, distributed tracing, alerting, root-cause troubleshooting, postmortems, network failures, timeouts, and on-call response |
| `package-management` | pnpm workspaces, catalogs, overrides, patches, and peer deps; uv, pyproject.toml, PEP 723 scripts, Ruff, prek/pre-commit, Dependabot update PRs, lockfile hygiene, and CI install caching |
| `performance-engineering` | endpoint profiling, bottlenecks, N+1 queries, memory leaks, LCP/INP, autonomous metric loops, and rightsizing costs |
| `radar-ia` | the daily AI radar and best-posts digests; not for one-paper research or debugging |
| `requirements-planning` | acceptance criteria, PRDs and specs, agent briefs with finish lines, vertical-slice backlog issues, and triage of incoming issues |
| `security-ops` | end-to-end vulnerability audits, pen tests, CVE scans, Gitleaks remediation, zero-trust reviews, least privilege, threat modeling, and plugin or MCP server vetting |
| `skill-authoring` | a new SKILL.md, gotchas sections, progressive-disclosure references, skill scripts and persistent data, splitting a skill that straddles domains, and deciding whether a recurring task deserves a skill |
| `software-architecture` | module boundaries, ubiquitous language and CONTEXT.md glossaries, repository layout, Electron multi-process security, ADRs, and circular dependencies |
| `stack-selection` | TypeScript, Bun versus Node, pnpm, uv, NestJS, Biome, Scalar versus Swagger, an LLM SDK, Tauri versus Electron, picking a package manager, framework, ORM, linter, or UI library (toasts), and adopting or replacing a dependency |
| `starting-dev` | AGENTS.md or CLAUDE.md project instructions and README, onboarding by charting an unfamiliar codebase and its dependencies, the dev loop (research, throwaway prototype variants, plan, implement), worktrees, task stages, and session handoffs |
| `test-engineering` | unit and integration tests, Vitest, pytest, Playwright E2E, flaky test elimination, LLM gateway conformance, and coverage |
| `threejs` | GLTF/GLB model viewers, cameras, lighting, raycasting, shaders, animation, WebGL/WebGPU rendering, asset loading, scene performance, and GPU resource cleanup |
| `tooling-dev` | CLI arguments, exit codes, non-interactive execution, config discovery, signals, structured output, packaging, and integration tests |
| `web-research` | multi-source search, HTML table and listing scraping, latest stable library versions, changelog tracking, and citations |
<!-- skill-catalog:end -->

## How Discovery Works

The frontmatter description states what the skill does and when it applies. The workflow and references load only after the skill is selected.

Use explicit invocation when you need to force a domain:

```text
/security-ops
/software-architecture
/mobile-engineering
```
