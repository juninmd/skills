<div align="center">

<img src="./docs/public/images/hero-banner.svg" alt="Agent skills with reproducible engineering checks" width="100%" />

<h3>Compact engineering skills with focused procedures and reproducible checks.</h3>

<p><strong>15 skills · 4 agents · 4 prompts</strong> for coding assistants that inspect first, change narrowly, and finish with evidence.</p>

</div>

## Why this exists

Generic skill catalogs often fail in two ways:

- Many narrow skills overlap and waste context.
- Broad skills contain generic advice, stale links, or no executable workflow.

This catalog uses 15 domain skills. Every skill has:

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

| Skill | Use it for |
|---|---|
| `agent-engineering` | Agents, MCP tools, context, memory, safety, tracing, evaluations |
| `backend-node` | Node.js, TypeScript, NestJS, pnpm, API contracts |
| `backend-python` | Python, uv, Ruff, FastAPI, Pydantic, pytest |
| `backend-systems` | Go, Rust, and .NET backend systems |
| `cloud-devops` | CI/CD, Docker, Kubernetes, Helm, IaC, cloud, observability |
| `data-engineering` | Database operations, query tuning, migrations, vector storage |
| `diagnostics` | Bugs, regressions, flaky tests, DNS, HTTP, TLS, timeouts |
| `expert-review` | Code, diff, plan, and design review |
| `frontend-engineering` | React, Next.js, Vite, UI systems, accessibility |
| `mobile-engineering` | iOS, Android, React Native, and Flutter |
| `project-lifecycle` | Specs, plans, issues, worktrees, PR preparation |
| `security-ops` | CVEs, SBOMs, secrets, access control, security auditing |
| `software-architecture` | Boundaries, technical debt, distributed systems, Electron |
| `test-engineering` | TDD, Vitest, unhappy paths, property and performance tests |
| `tooling-dev` | CLIs, automation, generators, documentation extraction |

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
- Frontmatter limited to `name` and `description`.
- Useful description and valid skill name.
- `## Checklist` presence.
- 400-word skill budget.
- Local reference links.
- README catalog consistency.
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
5. Run `pnpm run validate` and `pnpm run docs:build`.

## License

MIT.
