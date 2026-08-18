<div align="center">

<img src="./docs/public/images/hero-banner.svg" alt="Agent skills with reproducible engineering checks" width="100%" />

<h3>Compact engineering skills with focused procedures and reproducible checks.</h3>

<p><strong>46 skills · 4 agents · 4 prompts</strong> for coding assistants that inspect first, change narrowly, and finish with evidence.</p>

</div>

## Why this exists

Generic skill catalogs often fail in two ways:

- Many narrow skills overlap and waste context.
- Broad skills contain generic advice, stale links, or no executable workflow.

This catalog uses 46 domain skills. Every skill has:

- Frontmatter limited to the fields the Agent Skills spec allows.
- A description that states what the skill does and when to use it.
- A short operational workflow.
- Conditional links to real local references.
- A concise completion checklist.
- A maximum of 400 words in `SKILL.md`.
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
| `api-design` | resource modeling, request and response shapes, versioning, pagination, idempotency, error envelopes, breaking-change review, and deprecation policy |
| `backend-node` | NestJS services, pnpm workspaces, strict TypeScript, REST or GraphQL APIs, DTO validation, tests, builds, and API contracts |
| `backend-python` | uv and pyproject setup, Ruff, typed Python, Pydantic v2, async boundaries, pytest, and Alembic integration |
| `backend-systems` | APIs, concurrency, cancellation, error handling, EF Core, resource lifetimes, performance-sensitive code, tests, and builds |
| `caching-strategy` | cache key design, TTL and invalidation, stale-while-revalidate, stampede protection, CDN rules, and reasoning about acceptable staleness |
| `cloud-devops` | pipelines, Dockerfiles, Terraform or Pulumi, deployment safety, logs, metrics, and traces |
| `code-simplification` | deleting dead paths, collapsing premature abstraction, removing speculative options, shortening long functions, and reviewing a diff for what could be less code |
| `codebase-mapping` | onboarding to new repos, understanding architecture, finding where a change belongs, and dependency graphs |
| `context-engineering` | long sessions, context overflow, memory strategies, sliding windows, and keeping the right files in context |
| `cost-engineering` | cost attribution, rightsizing, egress and storage tiering, caching economics, token budgets, model routing, and budget guardrails |
| `data-engineering` | PostgreSQL, MongoDB, Redis, query plans, indexes, locks, rollback, backups, and vector database performance |
| `design-systems` | design tokens, theming and dark mode, component API and variant design, composition over configuration, Figma-to-code parity, library documentation, and versioning a published UI package |
| `diagnostics` | bugs, regressions, flaky tests, crashes, timeouts, DNS, ports, HTTP, TLS, and root-cause analysis |
| `docs-verification` | checking if a library API, config, or best practice is outdated, reading docs before answering, and updating stale local knowledge |
| `document-generation` | docx, xlsx, pptx, and pdf creation, templating, tables, charts, formatting, and document extraction |
| `documentation` | project onboarding docs, OpenAPI-derived reference, decision records, release notes, and doc drift prevention |
| `expert-review` | pull-request review, design review, plan stress-testing, risk analysis, and evidence-based findings |
| `frontend-design` | layout, typography, color, spacing, visual hierarchy, motion, and avoiding generic AI slop |
| `frontend-engineering` | React, Next.js, Vite, Tailwind, shadcn/ui, responsive design, component systems, browser performance, hydration, keyboard behavior, and accessibility |
| `git-workflow` | bisect, cherry-pick, reflog, submodules, hooks, stash, rebase, amend, detached HEAD, conflict resolution, and history rewrite safety |
| `incident-response` | outages, error spikes, failed deploys, rollback decisions, data-integrity incidents, on-call triage, severity assessment, and corrective-action follow-up |
| `incremental-delivery` | vertical slicing, tracer bullets, sequencing dependent work, stacked pull requests, keeping trunk releasable, and avoiding a long-lived branch or a big-bang merge |
| `knowledge-freshness` | dependency and framework version checks before adding, upgrade planning, changelog tracking, and end-of-life dates |
| `legacy-refactoring` | characterization tests, finding seams, breaking hidden dependencies, sprout and wrap techniques, strangling a legacy subsystem behind a facade, and getting a feature into a module nobody dares to touch |
| `mcp-integration` | MCP tool and resource design, JSON Schema inputs, stdio and HTTP transports, authentication, pagination of large results, error contracts, and server testing |
| `migration-engineering` | expand/contract rollouts, backfills, dual writes, codemods, framework upgrades, cutover planning, and rollback strategy |
| `mobile-engineering` | mobile UI, lifecycle, navigation, permissions, offline behavior, accessibility, device integration, tests, and builds |
| `observability` | structured logging, SLO/SLI definition, dashboard design, alert thresholds, tracing, log retention, and incident signal quality |
| `performance-engineering` | slow endpoints, N+1 queries, memory leaks, event-loop blocking, bundle size, load testing, caching decisions, and performance regressions |
| `pr-delivery` | finishing development work, PR descriptions, GitHub CLI, and delivery evidence |
| `project-lifecycle` | PRDs, implementation plans, issue slicing, scope cuts, GitHub backlog triage, and worktree setup for planned work |
| `release-management` | version bumps, conventional commits, changelog generation, release branches, and GitHub Releases |
| `requirements-clarification` | ambiguous tickets, unstated assumptions, missing acceptance criteria, conflicting stakeholder input, undefined edge cases, and deciding what questions to ask before any planning starts |
| `security-ops` | CVE or SBOM scans, Gitleaks findings, secret rotation, access control, injection risk, least privilege, and zero-trust reviews |
| `skill-creator` | SKILL.md authoring, frontmatter, workflow and checklist design, reference routing, token budgets, and validating skills against the spec |
| `software-architecture` | modularization, dependency direction, technical debt, distributed systems, Electron architecture, failure modes, and ADRs |
| `sql-authoring` | PostgreSQL, MySQL, SQLite, and MongoDB query authoring, schema and index design, ORM query translation, window functions, CTEs, joins, and migration-safe model changes |
| `test-engineering` | TDD, Vitest, pytest, unhappy paths, flaky tests, fixtures, mocks, fuzzing, coverage gaps, and regression benchmarks |
| `tooling-dev` | CLI arguments, exit codes, non-interactive execution, config discovery, structured output, packaging, and integration tests |
| `ui-state-design` | loading skeletons, empty states, error and retry, partial and stale data, offline behavior, optimistic updates, form validation feedback, and confirming destructive actions |
| `web-performance` | Core Web Vitals, LCP, INP and CLS, the critical rendering path, image and font loading, code splitting, hydration cost, third-party scripts, and reading field data from RUM or Lighthouse |
| `web-research` | multi-source web search, fetching pages, verifying claims, synthesizing findings, and citing sources. Keeps answers current instead of relying on memory |
| `web-scraping` | HTML parsing, pagination, rate limiting, retries, selector stability, API fallbacks, and saving structured results |
| `webapp-testing` | Playwright and browser automation, E2E flows, form submission, authentication flows, responsive checks, and visual regression |
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
- 400-word skill budget.
- 1024-character description limit (Agent Skills spec).
- Local reference links and no orphan reference files.
- Linked topic maps for large reference collections.
- Routing evals: every skill has positive and negative prompts, wins the ones it
  owns, never steals a sibling's, is reachable at all, and no two descriptions
  collide. Ratcheted at 95% rank-1 (`pnpm run evals` for the report).
- Token budgets: tier-1 catalog ≤ 3000 tokens with a ≤ 70-token ceiling per
  description, each `SKILL.md` ≤ 700 tokens (`pnpm run tokens:report` for the
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
