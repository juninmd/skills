<div align="center">

# Skills

<img src="./docs/public/images/agents-ecosystem.png" alt="Agents ecosystem" width="512" height="512" />

### Production-grade agent customizations for serious software work.

**Agents, skills, prompts, and rules that turn generic AI coding assistants into disciplined engineering partners.**

[![VS Code Agent Plugin](https://img.shields.io/badge/VS%20Code-Agent%20Plugin-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/docs/copilot/customization/agent-plugins)
[![Copilot CLI Ready](https://img.shields.io/badge/Copilot%20CLI-Ready-24292F?style=for-the-badge&logo=github&logoColor=white)](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)
[![License MIT](https://img.shields.io/badge/License-MIT-16A34A?style=for-the-badge)](#license)

**Install once. Enforce scope, safety, tests, and senior-level judgment everywhere.**

</div>

---

## Why This Exists

Most AI coding assistants are powerful but generic. This repository turns them into a more consistent engineering partner by packaging battle-tested guidance as installable agent customizations.

It includes specialist agents, domain skills, reusable prompts, and governance rules for real software work: reviews, architecture, testing, infrastructure, frontend, mobile, backend, security, and delivery.

The core is [`AGENTS.md`](./AGENTS.md): a compact operating contract that forces better defaults before code is written, while work is being changed, and before anything is considered done.

> **Validated with Microsoft Waza:** All skills in this repository have been audited and optimized using the [Microsoft Waza](https://github.com/microsoft/waza) CLI framework to guarantee High Compliance, token budget efficiency, and test readiness.

## At a Glance

| Capability | Count | What you get |
|---|---:|---|
| [Skills](#skills) | 72 | Domain playbooks for Node, Python, React, Docker, mobile, cloud, databases, security, observability, testing, AI-assisted review, performance profiling, and more |
| [Agents](#agents) | 4 | Focused assistants for review, architecture, DevOps, and planning |
| [Prompts](#prompts) | 4 | Ready-to-use workflows for explain, refactor, tests, and Dockerfiles |
| [Rules](#rules) | 15 | Always-on engineering standards for security, testing, naming, privacy, and delivery |

## AGENTS.md Quality Contract

[`AGENTS.md`](./AGENTS.md) is designed to make assistants act less like autocomplete and more like senior engineers with guardrails.

| Quality | What it enforces |
|---|---|
| **Clear judgment** | State assumptions, ask when unclear, and push back on risky or overbuilt paths |
| **Small diffs** | Touch only required files and keep every changed line tied to the request |
| **Simplicity first** | Avoid speculative features, premature abstractions, and unnecessary configurability |
| **Verified work** | Run lint, scoped tests, and a smoke check before marking work done |
| **Safety by default** | No destructive commands, no secret exposure, no git mutations without confirmation |
| **Efficient context** | Read narrowly, search with `rg`, cap noisy output, and avoid full-file dumps |

## Highlights

- **One repository, many assistants**: VS Code Agent Plugin, Copilot CLI, Claude Code, Gemini CLI, and compatible tools.
- **Senior-engineering defaults**: scope control, security, type safety, clean design, observability, and test discipline.
- **Quality gates built in**: lint, tests, smoke checks, secrets handling, and command safety are explicit.
- **Practical by design**: focused instructions, small patches, and domain skills instead of giant generic prompts.
- **Easy to extend**: add agents, skills, prompts, and rules under the predictable `.agents/` layout.

## Quick Install

### VS Code Agent Plugin

Install from source:

1. Enable `chat.plugins.enabled` in VS Code.
2. Run `Chat: Install Plugin From Source`.
3. Use this repository URL:

```text
https://github.com/juninmd/skills
```

For local development, register your checkout directly:

```json
{
  "chat.pluginLocations": {
    "C:\\path\\to\\skills": true
  }
}
```

Use this repository as a plugin marketplace:

```json
{
  "chat.plugins.marketplaces": [
    "juninmd/skills"
  ]
}
```

### Skills CLI

Install all skills:

```bash
npx skills add juninmd/skills --all
```

List available skills without installing:

```bash
npx skills add juninmd/skills --list
```

Install a specific skill:

```bash
npx skills add juninmd/skills --skill developing-node
```

Install from a local checkout:

```bash
npx skills add /path/to/skills --all
```

### Copilot CLI

```bash
copilot plugin install juninmd/skills
copilot plugin install /path/to/skills
```

### Claude Code / Compatible Assistants

```bash
# Install the skills into your project
npx skills add juninmd/skills --all

# Or install a specific skill
npx skills add juninmd/skills --skill developing-node
```

## Try It

Invoke a skill:

```text
/developing-node      # Node.js + TypeScript best practices
/mastering-docker     # Production-ready Dockerfile generation
/react-dev            # React 19+ patterns
/flutter-dev          # Flutter + Riverpod guidance
```

Invoke an agent:

```text
/code-reviewer        # Multi-perspective PR/MR review
/principal-engineer   # Architecture and system design
/devops-engineer      # CI/CD, IaC, containers, cloud
/plan-specialist      # Scope, planning, risk, quality gates
```

## Plugin Layout

```text
.
|-- plugin.json                         # VS Code / Copilot plugin manifest
|-- .github/plugin/marketplace.json     # Marketplace metadata
|-- .agents/
|   |-- agents/                         # 4 custom agents
|   |-- prompts/                        # 4 reusable prompt templates
|   |-- rules/                          # 15 governance instruction files
|   |-- skills/                         # 62 domain skills
|   `-- tools/                          # Validation scripts
`-- docs/                               # VitePress documentation
```

## Validate

```bash
pnpm install
pnpm run validate
```

The validation checks plugin metadata and all primary agent/skill files.

---

## Skills

### Backend & API

| Skill | Description |
|---|---|
| `developing-node` | Node.js 24 + TypeScript, pnpm, Biome, SWC, Vite 8 |
| `developing-python` | Modern Python: uv, ruff, pyproject.toml, PEP 723 |
| `modern-python` | Python tools ecosystem: uv, ruff, ty, prek |
| `developing-fastapi` | FastAPI + Pydantic v2, async, modular architecture |
| `developing-go` | Go modules, goroutines, clean architecture |
| `developing-rust` | Rust ownership, safety patterns, Cargo |
| `developing-dotnet` | .NET async/await, SOLID, EF Core, xUnit |
| `developing-nestjs` | NestJS modular, validation, auth |

### Frontend & UI

| Skill | Description |
|---|---|
| `react-dev` | React 19+, Server Components, useActionState, use() hook |
| `nextjs-dev` | Next.js 16+, App Router, React 19, Turbopack |
| `shadcn-ui` | shadcn/ui component discovery, installation, customization |
| `vite` | Vite 8 + Tailwind CSS v4 build configuration |
| `vitepress` | VitePress documentation sites with Vue |
| `frontend-design` | Production-grade distinctive UI interfaces |
| `frontend-craftsmanship` | React/Next performance, UI quality, accessibility review |
| `developing-ui-ux-components` | Accessible, reusable UI components |

### Mobile

| Skill | Description |
|---|---|
| `flutter-dev` | Flutter 3 + Dart, Riverpod, GoRouter, performance patterns |
| `react-native-dev` | React Native + Expo, iOS/Android |
| `android-native-dev` | Kotlin + Jetpack Compose, Material 3 |
| `ios-application-dev` | Swift + SwiftUI for iPhone/iPad |

### Infrastructure & DevOps

| Skill | Description |
|---|---|
| `mastering-docker` | Multi-stage builds, Distroless, non-root, healthchecks |
| `managing-helm-charts` | Kubernetes Helm chart creation and optimization |
| `managing-iac` | Infrastructure as Code: Terraform, Pulumi, Ansible |
| `managing-cloud-infrastructure` | Resilient cloud architecture on AWS, GCP, and Azure |
| `managing-serverless` | Lambda, Vercel, Cloudflare Workers deployment |
| `configuring-ci-cd` | GitHub Actions and GitLab CI pipelines |
| `github-actions-docs` | Official GitHub Actions documentation lookup and YAML guidance |
| `managing-vector-databases` | Vector DBs for similarity search and RAG |

### Code Quality & Analysis

| Skill | Description |
|---|---|
| `audit-context-building` | Ultra-granular line-by-line vulnerability analysis |
| `auditing-code` | Static analysis, linting, code smell detection |
| `diagnosing-bugs` | Evidence-driven debugging for defects, flaky behavior, and regressions |
| `validating-typescript` | Strict TypeScript type safety enforcement |
| `applying-design-principles` | Clean Code, SOLID, DRY, KISS, YAGNI refactoring |
| `karpathy-guidelines` | Avoid common LLM coding mistakes |

### Architecture & System Design

| Skill | Description |
|---|---|
| `architecting-distributed-systems` | Microservices, message queues, distributed patterns |
| `architecting-electron` | Electron apps with Main, Renderer, and Native layers |
| `developing-ai-agents` | Autonomous AI agents, tool calling, context management |
| `developing-mcp-servers` | Model Context Protocol server implementation |
| `improving-codebase-architecture` | Practical architecture improvements for testability, locality, and change safety |
| `mcp-builder` | Full MCP server build workflow |
| `spec-first-design` | Temporary validated design specs and implementation plans before code changes |

### Build Tools & Testing

| Skill | Description |
|---|---|
| `pnpm` | pnpm package manager, workspaces, strict resolution |
| `tsdown` | Bundle TS/JS libraries with Rolldown |
| `vitest` | Vitest unit testing, Jest-compatible API |
| `test-driven-development` | Behavior-first red/green/refactor workflow with vertical slices |
| `developing-tooling` | CLI tools, automation scripts, utilities |

### Database & Data

| Skill | Description |
|---|---|
| `administrating-databases` | PostgreSQL and MongoDB/Redis administration |

### Git & Workflow

| Skill | Description |
|---|---|
| `git-cleanup` | Safe git branch and worktree cleanup |
| `executing-plans` | Execute written implementation plans with validations and cleanup |
| `finishing-a-development-branch` | Complete development cycle: merge, PR, cleanup |
| `using-git-worktrees` | Isolated git worktrees for parallel feature work |
| `fix-gitleaks` | Fix gitleaks CI failures and triage secrets |
| `github-triage` | Issue triage state machine with labels |

### Specialized

| Skill | Description |
|---|---|
| `implementing-accessibility` | Web accessibility standards and auditing |
| `diagnosing-networks` | DNS, HTTP, connectivity troubleshooting |
| `diagnosing-rabbitmq` | RabbitMQ queue diagnosis, consumers, DLQ |
| `firebase-apk-scanner` | APK security misconfiguration scanning |
| `using-superpowers` | Skill discovery and usage overview |
| `trailmark-summary` | Quick codebase summary: languages, entry points, graph |
| `vscode-auto-update` | Auto-update VS Code on Debian/Ubuntu |
| `caveman` | Terse response mode: substance over fluff |

---

## Agents

### `code-reviewer`

Principal-level code reviewer for PR/MR review, security auditing, architecture feedback, regression spotting, and structured review comments.

### `principal-engineer`

Architecture-focused agent for system design, ADRs, trade-off analysis, technical debt strategy, and scalability planning.

### `devops-engineer`

Infrastructure agent for CI/CD, Docker, Kubernetes, Helm, IaC, cloud platforms, and observability.

### `plan-specialist`

Planning agent for decomposition, scope definition, Mermaid diagrams, quality gates, and risk registers.

---

## Prompts

| Prompt | Trigger | Description |
|---|---|---|
| `explain` | `/explain` | Step-by-step code explanation with context and edge cases |
| `refactor` | `/refactor` | Clean Code refactoring without changing business logic |
| `generate-tests` | `/generate-tests` | Unit tests with happy paths, edge cases, and errors |
| `generate-dockerfile` | `/generate-dockerfile` | Production-ready multi-stage Dockerfiles |

---

## Rules

| Rule | Enforces |
|---|---|
| `security` | OWASP Top 10, Zod validation, no hardcoded secrets |
| `git-workflow` | Feature branches only, Conventional Commits, PR-first |
| `testing` | >80% coverage, unit + integration, meaningful assertions |
| `code-design-principles` | Clean Code, SOLID, DRY, KISS, YAGNI |
| `error-handling` | Meaningful errors, graceful degradation |
| `naming-conventions` | Self-documenting names, language-consistent patterns |
| `observability` | Structured logging, metrics, distributed tracing |
| `data-privacy` | PII handling, GDPR compliance |
| `dependency-management` | Managed versioning, security audits |
| `dockerfile-standards` | Multi-stage, minimal images, non-root |
| `env-secrets` | Environment variables for secrets, no hardcoding |
| `shell-scripting` | Bash best practices, error handling, portability |
| `command-safety` | Safe execution, no destructive ops without permission |
| `context-efficiency` | Minimal context, targeted reads, efficient search |
| `workspace-nav` | Codebase navigation, file finding, context awareness |

---

## Documentation

Browse the documentation locally:

```bash
pnpm install
pnpm docs:dev
```

Then open [http://localhost:5173](http://localhost:5173).

---

## Contributing

1. Fork the repository.
2. Add your skill, agent, rule, or prompt under `.agents/`.
3. Follow the existing frontmatter format.
4. Run `pnpm run validate`.
5. Open a pull request explaining when the customization should activate.

### Skill Frontmatter

```yaml
---
name: your-skill-name
description: "Short description. Triggers: comma, separated, keywords."
argument-hint: "[optional] [args]"
---
```

### Agent Frontmatter

```yaml
---
name: your-agent-name
description: "What this agent does. When to invoke it."
user-invocable: true
disable-model-invocation: false
---
```

---

## License

MIT. Free to use, fork, and adapt.

---

Maintained by [Antonio Junior](https://github.com/juninmd).
