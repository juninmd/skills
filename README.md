<div align="center">

<img src="./docs/public/images/hero-banner.svg" alt="Agent skills with reproducible engineering checks" width="100%" />

<h3>Compact engineering skills with focused procedures and reproducible checks.</h3>

<p><strong>30 skills · 4 agents · 4 prompts</strong> for coding assistants that inspect first, change narrowly, and finish with evidence.</p>

</div>

## Why this exists

Generic skill catalogs often fail in two ways:

- Many narrow skills overlap and waste context.
- Broad skills contain generic advice, stale links, or no executable workflow.

This catalog uses 30 domain skills. Every skill has:

- Spec-compliant frontmatter containing only `name` and `description`.
- A description that states what the skill does and when to use it.
- A short operational workflow.
- Conditional links to real local references.
- A concise completion checklist.
- A maximum of 400 words in `SKILL.md`.

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
| `agent-engineering` | agent loops, tool schemas, handoffs, prompt-injection defenses, tracing, and agent evaluations |
| `backend-node` | NestJS services, pnpm workspaces, strict TypeScript, REST or GraphQL APIs, DTO validation, tests, builds, and API contracts |
| `backend-python` | uv and pyproject setup, Ruff, typed Python, Pydantic v2, async boundaries, pytest, and Alembic integration |
| `backend-systems` | APIs, concurrency, cancellation, error handling, EF Core, resource lifetimes, performance-sensitive code, tests, and builds |
| `cloud-devops` | pipelines, Dockerfiles, Terraform or Pulumi, deployment safety, logs, metrics, and traces |
| `codebase-mapping` | onboarding to new repos, understanding architecture, finding where a change belongs, and dependency graphs |
| `context-engineering` | long sessions, context overflow, memory strategies, sliding windows, and keeping the right files in context |
| `data-engineering` | PostgreSQL, MongoDB, Redis, query plans, indexes, locks, rollback, backups, and vector database performance |
| `diagnostics` | bugs, regressions, flaky tests, crashes, timeouts, DNS, ports, HTTP, TLS, and root-cause analysis |
| `document-generation` | docx, xlsx, pptx, and pdf creation, templating, tables, charts, formatting, and document extraction |
| `documentation` | project onboarding docs, OpenAPI-derived reference, decision records, release notes, and doc drift prevention |
| `expert-review` | pull-request review, design review, plan stress-testing, risk analysis, and evidence-based findings |
| `frontend-design` | layout, typography, color, spacing, visual hierarchy, motion, and avoiding generic AI slop |
| `frontend-engineering` | React, Next.js, Vite, Tailwind, shadcn/ui, responsive design, component systems, browser performance, hydration, keyboard behavior, and accessibility |
| `git-workflow` | bisect, cherry-pick, reflog, submodules, hooks, stash, rebase, amend, detached HEAD, conflict resolution, and history rewrite safety |
| `incident-response` | outages, error spikes, failed deploys, rollback decisions, data-integrity incidents, on-call triage, severity assessment, and corrective-action follow-up |
| `mobile-engineering` | mobile UI, lifecycle, navigation, permissions, offline behavior, accessibility, device integration, tests, and builds |
| `observability` | structured logging, SLO/SLI definition, dashboard design, alert thresholds, tracing, log retention, and incident signal quality |
| `performance-engineering` | slow endpoints, N+1 queries, memory leaks, event-loop blocking, bundle size, load testing, caching decisions, and performance regressions |
| `pr-delivery` | finishing development work, PR descriptions, GitHub CLI, and delivery evidence |
| `project-lifecycle` | PRDs, implementation plans, issue slicing, GitHub triage, worktrees, branch completion, and delivery documentation |
| `release-management` | version bumps, conventional commits, changelog generation, release branches, and GitHub Releases |
| `security-ops` | CVE or SBOM scans, Gitleaks findings, secret rotation, access control, injection risk, least privilege, and zero-trust reviews |
| `skill-creator` | SKILL.md authoring, frontmatter, workflow and checklist design, reference routing, token budgets, and validating skills against the spec |
| `software-architecture` | modularization, dependency direction, technical debt, distributed systems, Electron architecture, failure modes, and ADRs |
| `sql-authoring` | PostgreSQL, MySQL, SQLite, and MongoDB query authoring, schema and index design, ORM query translation, window functions, CTEs, joins, and migration-safe model changes |
| `test-engineering` | TDD, Vitest, pytest, unhappy paths, flaky tests, fixtures, mocks, fuzzing, coverage gaps, and regression benchmarks |
| `tooling-dev` | CLI arguments, exit codes, non-interactive execution, config discovery, structured output, packaging, and integration tests |
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
- Token budgets: tier-1 catalog ≤ 2000 tokens, each `SKILL.md` ≤ 700 tokens (`pnpm run tokens:report` for the full breakdown).
- Generated README catalog consistency.
- Validator unit tests.

## Layout

```text
.
├── plugin.json
├── AGENTS.md
├── .agents/
│   ├── agents/
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
5. Run `pnpm run catalog:generate` after adding or renaming a skill.
6. Run `pnpm run validate` and `pnpm run docs:build`.

## License

MIT.
