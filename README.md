<div align="center">

<img src="./docs/public/images/hero-banner.svg" alt="Agent skills with reproducible engineering checks" width="100%" />

<h3>Compact engineering skills with focused procedures and reproducible checks.</h3>

<p><strong>83 skills · 4 agents · 4 prompts</strong> for coding assistants that inspect first, change narrowly, and finish with evidence.</p>

</div>

## Why this exists

Generic skill catalogs often fail in two ways:

- Many narrow skills overlap and waste context.
- Broad skills contain generic advice, stale links, or no executable workflow.

This catalog uses 80 domain skills. Every skill has:

- Frontmatter limited to the fields the Agent Skills spec allows.
- A description that states what the skill does and when to use it.
- A short operational workflow.
- Conditional links to real local references.
- A concise completion checklist.
- A maximum of 1000 words in `SKILL.md`.
- [Routing evals](.agents/evals/README.md) proving the description reaches the
  prompts it owns and loses the prompts it does not.

## Install

```bash
# Everything
npx skills add juninmd/skills --all

# Inspect available skills
npx skills add juninmd/skills --list

# Install one domain
npx skills add juninmd/skills --skill diagnostics
```

The repository also works as a VS Code/Copilot plugin or as an `.agents` directory:

```bash
git submodule add https://github.com/juninmd/skills .agents
```

## Skill Catalog

<!-- skill-catalog:start -->
| Skill | Use it for |
|---|---|
| `accessibility` | WCAG conformance, semantic HTML, ARIA, focus management, color contrast, reduced motion, accessible forms, and a11y regression tests |
| `agent-engineering` | agent loops, tool schemas, handoffs, prompt-injection defenses, tracing, and agent evaluations |
| `agents-md` | writing or trimming AGENTS.md, per-package context in a monorepo, and pointer files keeping one source of truth |
| `ai-ecosystem-radar` | a daily or weekly radar backed by raw per-source dumps |
| `api-design` | the OpenAPI contract for a public REST API, resource modeling, request and response shapes, versioning, pagination, idempotency, error envelopes, breaking-change review, and deprecation policy |
| `ascii-figures` | sketching a sequence, a timeline, a before-and-after, or a hierarchy where no renderer is guaranteed |
| `backend-node` | NestJS modules and dependency injection, pnpm workspaces, strict TypeScript, REST or GraphQL APIs, DTO validation, tests, builds, and API contracts |
| `backend-python` | uv and pyproject setup, Ruff, typed Python, Pydantic v2, async boundaries, pytest, and Alembic integration |
| `backend-systems` | APIs, concurrency, cancellation, error handling, EF Core, resource lifetimes, performance-sensitive code, tests, and builds |
| `caching-strategy` | cache key design, TTL and invalidation, stale-while-revalidate, stampede protection, CDN rules, and reasoning about acceptable staleness |
| `cloud-devops` | GitHub Actions deployment workflows, pipelines, Dockerfiles, Terraform or Pulumi modules, deployment safety, health checks, rollback paths, and release verification |
| `code-simplification` | deleting dead paths, collapsing premature abstraction, removing speculative options, shortening long functions, and reviewing a diff for what could be less code. See expert-review for defects |
| `code-snippet-images` | README hero images, slide decks and PR descriptions, tuning theme, font, padding and window chrome, and capturing the export node |
| `codebase-mapping` | onboarding to a new repository, getting a quick map of an unfamiliar repo before touching it, understanding how it is organized, locating the code that owns a behavior, and dependency graphs |
| `context-engineering` | long sessions, context overflow, memory strategies, sliding windows, and keeping the right files in context |
| `cost-engineering` | cutting the cloud bill, idle and orphaned resources, cost attribution, rightsizing, egress and storage tiering, caching economics, token budgets, model routing, and budget guardrails |
| `cs16-map-gamemodes` | the as_, de_, cs_ and es_ prefixes, bomb targets, hostages, VIP escort, buy zones, spawn counts per team, and a round that never ends |
| `data-analysis` | csvstat, csvlook, jq, describe, groupby, pivot tables, nulls and duplicates, and scrubbing identifiers before sharing |
| `data-engineering` | PostgreSQL, MongoDB, Redis, query plans, indexes, locks, rollback, backups, and vector database performance |
| `deploy-ghcr-manual` | Build a container, push it to a registry and roll it out by hand as an escape hatch, when CI cannot build at all |
| `deploy-sync-guard` | verifying an app is deployed at the latest commit, and for the failure GitOps reports as Synced: a mutable latest tag plus a failed build, so the pod keeps old code |
| `design-systems` | design tokens, theming and dark mode, component API and variant design, Figma-to-code parity, library documentation, and versioning a published UI package |
| `dev-loop` | starting a loop, resuming an interrupted one, or checking which stage is waiting on you |
| `diagnostics` | bugs, regressions, flaky tests, crashes, a service refusing connections, timeouts, DNS, ports, HTTP, TLS, and root-cause analysis |
| `diagrams-as-code` | .mmd files, the mermaid CLI, moving diagram blocks out of Markdown, updating one in place, and batch rendering |
| `docs-verification` | checking if a library API, config, or best practice is outdated, reading docs before answering, and updating stale local knowledge. See knowledge-freshness |
| `document-generation` | docx, xlsx, pptx, and pdf creation, templating, tables, charts, formatting, and document extraction |
| `documentation` | project onboarding docs, OpenAPI-derived reference, decision records, release notes, and doc drift prevention |
| `domain-modeling` | a glossary, naming a concept, the same thing called three names, business terms that do not match the types, and writing CONTEXT.md so people and tools share one language |
| `electron-architecture` | process boundaries, inter-process messaging, preload bridges, context isolation, sandboxing, native OS integration, and desktop startup cost |
| `expert-review` | pull-request review, design review, plan stress-testing, risk analysis, and evidence-based findings. See code-simplification to shrink code |
| `finishing-dev` | finishing development work, drafting the pull request body and summarizing what changed, GitHub CLI, and delivery evidence |
| `frontend-design` | layout, picking a color palette and type scale, typography, spacing, visual hierarchy, motion, and avoiding generic AI slop |
| `frontend-engineering` | React, Next.js App Router, Vite, Tailwind, shadcn/ui, server and client boundaries, component systems, responsive layout, hydration mismatches, and keyboard behavior |
| `git-workflow` | bisect, cherry-pick, reflog, cleaning up stale branches and worktrees, submodules, hooks, stash, rebase, amend, detached HEAD, conflict resolution, and history rewrite safety |
| `goldsrc-bsp-maintenance` | ripent, editing the entity lump without recompiling, BSP30 parsing, engine limit audits, and spawn points buried inside geometry |
| `goldsrc-map-authoring` | writing brushes, walls with door openings, plane winding, texture axes, mirrored sign text, textures tiling instead of fitting, CSG rules, and brushes that disappear |
| `goldsrc-map-compiling` | hlcsg, hlbsp, hlvis and hlrad errors, a wad file it could not open, LEAK, AllocBlock full, a fullbright map, black outdoor shadows, and running the tools on Windows |
| `headless-agent-supervision` | supervising an unattended batch run and for relaunch-on-401, sleep-until-reset-on-429 loops |
| `human-step-wizard` | browser sign-in and consent screens, two-factor enrolment, vendor dashboards, hardware, and any manual step that must be handed to a human and then verified |
| `incident-response` | outages, error spikes, failed deploys, rollback decisions, data-integrity incidents, on-call triage, severity assessment, and corrective-action follow-up. CI flaky tests: test-engineering |
| `incremental-delivery` | vertical slicing, tracer bullets, sequencing dependent work, stacked pull requests, keeping trunk releasable, and avoiding a long-lived branch or a big-bang merge |
| `knowledge-freshness` | dependency and framework version checks before adding, upgrade planning, changelog tracking, and end-of-life dates. See docs-verification for API checks |
| `legacy-discovery` | mapping an inherited codebase, recovering implicit business rules, writing retroactive decision records, producing design docs and API specs from source, or planning a rewrite |
| `legacy-refactoring` | characterization tests, finding seams, breaking hidden dependencies, sprout and wrap, strangling a legacy subsystem behind a facade, and a feature in a module nobody dares to touch |
| `llm-gateway-testing` | auditing which models emit tool calls, catching regressions after a gateway upgrade, screening a new model catalog, and triaging 4xx/429/5xx responses |
| `masonry-layouts` | gallery and feed layouts, items splitting across columns, and a grid that jumps as images load |
| `mcp-integration` | MCP tool and resource design, JSON Schema inputs, stdio and HTTP transports, authentication, pagination of large results, error contracts, and server testing |
| `metric-loop` | optimizing a mechanical metric such as a benchmark score, bundle size, latency or error count, and for knowing when the loop has plateaued. See regression-gate for ship verdicts |
| `migration-engineering` | expand/contract rollouts, backfills, dual writes, codemods, framework upgrades, cutover planning, and rollback strategy |
| `mobile-engineering` | mobile UI, lifecycle, navigation, permissions, offline behavior, accessibility, device integration, tests, and builds |
| `observability` | structured logging, SLO/SLI definition, dashboard design, alert thresholds, tracing, log retention, and incident signal quality |
| `parallel-subagents` | fanning out independent fixes, writing the brief each parallel worker gets, isolating writers so they cannot collide on a file, and capping the spend |
| `performance-engineering` | slow endpoints, N+1 queries, memory leaks, event-loop blocking, load testing, and performance regressions |
| `phase-done` | handing the pull request to human review, closing the tracking issue, filing follow-ups, and archiving the finished loop workspace |
| `phase-finalize` | hardening a shipped pull request by making two reviewers spar over it, each refuting the other, and resolving whatever survives before code review |
| `phase-implement` | executing the approved plan step by step, opening the pull request, handing over a branch to test locally, and iterating on comments until ship it |
| `phase-plan` | asking every open decision in one batched questionnaire instead of one at a time, then writing the executable plan with its verification steps |
| `phase-prototype` | building three throwaway variants A, B and C so a direction is chosen before any planning starts |
| `phase-research` | opening the tracking issue and mapping the codebase and prior art before anything is built |
| `plugin-vetting` | reading it at a pinned commit, hunting hidden instructions and exfiltration, sizing the permissions it asks for, and re-checking it on every version bump |
| `project-lifecycle` | PRDs, implementation plans, issue slicing, scope cuts, GitHub backlog triage, and worktree setup for planned work. Defers to dev-loop |
| `project-structure` | new repository layout, deciding where a new module should live, feature-first frontend splits, Go and Python packages, junk-drawer folders, and safe restructuring |
| `quiet-checks` | choosing the right --quiet, -q, --silent or reporter flag per tool, capping log output, keeping the exit status readable, and re-running only the failure verbosely |
| `regression-gate` | a one-shot stability verdict before release, green-to-red detection, flaky versus real failures, and performance or size gates. See metric-loop for tuning |
| `release-management` | version bumps, conventional commits, changelog generation, release branches, and GitHub Releases |
| `requirements-clarification` | ambiguous tickets, unstated assumptions, missing acceptance criteria, conflicting stakeholder input, undefined edge cases, and deciding what questions to ask before any planning starts |
| `screenshot-capture` | visual evidence of a UI change, before and after layout comparisons, proving a page renders, or full-page capture of a route. E2E suites: webapp-testing |
| `security-ops` | CVE or SBOM scans, rotating a leaked credential Gitleaks found, access control, injection risk, least privilege, and zero-trust reviews |
| `session-handoff` | pausing mid-task, passing unfinished work to a teammate or a fresh window, and recording decisions, dead ends, and the exact next command |
| `session-learnings` | recalling context at session start, recording an error and its fix, promoting recurring lessons into project rules, or purging them |
| `shell-operations` | rm -rf safety, permissions, timeouts, shellcheck, PSScriptAnalyzer |
| `skill-creator` | SKILL.md authoring, frontmatter, workflow and checklist design, reference routing, token budgets, and validating skills against the spec |
| `software-architecture` | deciding whether something is a separate service or stays a module, modularization, dependency direction, circular dependencies, technical debt, distributed systems, failure modes, and ADRs |
| `sql-authoring` | PostgreSQL, MySQL, SQLite, and MongoDB query authoring, schema and index design, ORM query translation, window functions, CTEs, joins, and pagination |
| `test-engineering` | TDD, writing the failing test before the fix, Vitest, pytest, unhappy paths, flaky tests, fixtures, mocks, fuzzing, coverage gaps, and regression benchmarks |
| `tooling-dev` | CLI arguments, exit codes, non-interactive execution, config discovery, signals, structured output, packaging, and integration tests |
| `ui-state-design` | loading skeletons, empty and forbidden states, error and retry, stale data, response races, offline behavior, optimistic updates, and undo |
| `variant-analysis` | the same mistake repeated elsewhere, copy-paste propagation, a misused API, and writing the lint rule that stops the pattern from returning |
| `web-performance` | Core Web Vitals, improving LCP, INP and CLS on a slow page, critical rendering path, image and font loading, code splitting, hydration, third-party scripts, and RUM data |
| `web-research` | multi-source web search, search operators, fetching pages, verifying claims, resolving conflicting sources, synthesizing findings, and citing them with dates |
| `web-scraping` | extracting listings and tables into CSV or JSON, HTML parsing, JavaScript-rendered pages, pagination, rate limiting, retries, block detection, selectors that keep breaking, and structured output |
| `webapp-testing` | Playwright and browser automation, E2E flows, reusing authenticated sessions, parallel isolation, responsive checks, visual regression, and CI-only failures. One-off shots: screenshot-capture |
<!-- skill-catalog:end -->

## Skill Example

```yaml
---
name: diagnostics
description: |
  Reproduce and isolate software, test, performance, and network failures. Use for bugs, regressions, flaky tests, DNS, HTTP, TLS, timeouts, and root-cause analysis.
---
```

The description is the discovery signal. The body loads only after the skill is selected.

## Quality Contract

[`AGENTS.md`](./AGENTS.md) defines the shared operating contract:

- SecOps before QA, QA before DevOps, DevOps before SWE.
- Read before write.
- Minimum, surgical changes.
- Reproduce bugs before fixing.
- No destructive Git, database, or infrastructure operations without confirmation.
- No claim of completion without lint, scoped tests, and a smoke check.

## Validate

```bash
pnpm install --frozen-lockfile
pnpm run validate
pnpm run docs:build
```

`pnpm run validate` checks:

- Plugin manifest and referenced directories.
- Skill name/folder consistency.
- YAML-parsed frontmatter limited to `name` and `description`.
- Useful description and valid skill name.
- `## Checklist` presence.
- 1000-word skill budget.
- 1024-character description limit (Agent Skills spec).
- Local reference links and no orphan reference files.
- Linked topic maps for large reference collections.
- Routing evals: every skill has positive and negative prompts, wins the ones it
  owns, never steals a sibling's, is reachable at all, and no two descriptions
  collide. Ratcheted at 95% rank-1 (`pnpm run evals` for the report).
- Token budgets: tier-1 catalog ≤ 5100 tokens with a ≤ 100-token ceiling per
  description, each `SKILL.md` ≤ 1650 tokens (`pnpm run tokens:report` for the
  full breakdown). The catalog grows by adding skills, never by fattening
  descriptions.
- Generated README catalog consistency.
- Validator unit tests.

## Layout

```text
.
├── plugin.json
├── AGENTS.md
├── .agents/
│   ├── agents/
│   ├── evals/
│   ├── prompts/
│   ├── skills/
│   └── tools/
└── docs/
```

## Contributing

1. Add or update `.agents/skills/<name>/SKILL.md`.
2. Keep `name` equal to the folder.
3. State what the skill does and when to use it in `description`.
4. Link detailed material from `references/`; do not duplicate it in `SKILL.md`.
5. Add `.agents/evals/<name>.json` with at least 3 positive and 2 negative prompts.
6. Run `pnpm run catalog:generate` after adding or renaming a skill.
7. Run `pnpm run validate` and `pnpm run docs:build`.

## License

MIT.
compare https://github.com/msitarzewski/agency-agents