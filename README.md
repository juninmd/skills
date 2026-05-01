# Agent Plugins — Skills, Agents & Rules for AI Coding Assistants

A curated collection of **skills**, **subagents**, **prompt templates**, and **governance rules** designed to extend AI coding assistants (Claude Code, Gemini CLI, Copilot CLI) with production-grade engineering knowledge.

> Built for teams that want consistent, high-quality AI-assisted development across every language, framework, and infrastructure concern.

---

## What's Inside

| Category | Count | Description |
|---|---|---|
| [Skills](#skills) | 58 | Domain-specific knowledge modules (Node, Python, React, Docker, etc.) |
| [Agents](#agents) | 4 | Autonomous subagents for complex multi-step tasks |
| [Prompts](#prompts) | 4 | Reusable prompt templates for common operations |
| [Rules](#rules) | 15 | Governance instructions enforced across all work |

---

## Quick Start

### Using with Claude Code

Skills and agents are loaded automatically from `.agents/` by Claude Code when present in your project. Clone this repo (or add it as a submodule) and the AI assistant will discover all plugins at session start.

```bash
# Clone into your project root
git clone https://github.com/juninmd/skills .agents-plugins

# Or as a git submodule
git submodule add https://github.com/juninmd/skills .agents
```

### Invoking a Skill

```
/developing-node      # Node.js + TypeScript best practices
/mastering-docker     # Production-ready Dockerfile generation
/react-dev            # React 19+ patterns
/flutter-dev          # Flutter 3 + Riverpod
```

### Invoking an Agent

```
/code-reviewer        # Multi-perspective PR/MR review
/principal-engineer   # Architecture and system design
/devops-engineer      # CI/CD, IaC, and infrastructure
/plan-specialist      # Task orchestration and planning
```

---

## Directory Structure

```
.agents/
├── agents/          # Autonomous subagents (4)
│   ├── code-reviewer.agent.md
│   ├── devops-engineer.agent.md
│   ├── plan-specialist.agent.md
│   └── principal-engineer.agent.md
│
├── prompts/         # Reusable prompt templates (4)
│   ├── explain.prompt.md
│   ├── refactor.prompt.md
│   ├── generate-tests.prompt.md
│   └── generate-dockerfile.prompt.md
│
├── rules/           # Governance instructions (15)
│   ├── security.instructions.md
│   ├── git-workflow.instructions.md
│   ├── testing.instructions.md
│   └── ...
│
└── skills/          # Domain knowledge modules (58)
    ├── developing-node/
    ├── developing-python/
    ├── react-dev/
    ├── mastering-docker/
    └── ...
```

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
| `nextjs-dev` | Next.js 15+, App Router, Turbopack, uncached by default |
| `shadcn-ui` | shadcn/ui component discovery, installation, customization |
| `vite` | Vite 8 + Tailwind CSS v4 build configuration |
| `vitepress` | VitePress documentation sites with Vue |
| `frontend-design` | Production-grade distinctive UI interfaces |
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
| `managing-cloud-infrastructure` | Resilient cloud architecture (AWS/GCP/Azure) |
| `managing-serverless` | Lambda, Vercel, Cloudflare Workers deployment |
| `configuring-ci-cd` | GitHub Actions and GitLab CI pipelines |
| `managing-vector-databases` | Vector DBs for similarity search and RAG |

### Code Quality & Analysis

| Skill | Description |
|---|---|
| `audit-context-building` | Ultra-granular line-by-line vulnerability analysis |
| `auditing-code` | Static analysis, linting, code smell detection |
| `validating-typescript` | Strict TypeScript type safety enforcement |
| `applying-design-principles` | Clean Code, SOLID, DRY, KISS, YAGNI refactoring |
| `karpathy-guidelines` | Avoid common LLM coding mistakes |

### Architecture & System Design

| Skill | Description |
|---|---|
| `architecting-distributed-systems` | Microservices, message queues, distributed patterns |
| `architecting-electron` | Electron apps with Main/Renderer/Native layers |
| `developing-ai-agents` | Autonomous AI agents, tool calling, context management |
| `developing-mcp-servers` | Model Context Protocol server implementation |
| `mcp-builder` | Full MCP server build workflow (4-phase) |

### Build Tools & Testing

| Skill | Description |
|---|---|
| `pnpm` | pnpm package manager, workspaces, strict resolution |
| `tsdown` | Bundle TS/JS libraries with Rolldown |
| `vitest` | Vitest unit testing, Jest-compatible API |
| `developing-tooling` | CLI tools, automation scripts, utilities |

### Database & Data

| Skill | Description |
|---|---|
| `administrating-databases` | PostgreSQL and MongoDB/Redis administration |

### Git & Workflow

| Skill | Description |
|---|---|
| `git-cleanup` | Safe git branch and worktree cleanup |
| `finishing-a-development-branch` | Complete development cycle: merge, PR, cleanup |
| `using-git-worktrees` | Isolated git worktrees for parallel feature work |
| `fix-gitleaks` | Fix gitleaks CI failures and triage secrets |
| `github-triage` | Issue triage state machine with labels |

### Specialized

| Skill | Description |
|---|---|
| `implementing-accessibility` | Web accessibility (a11y) standards and auditing |
| `diagnosing-networks` | DNS, HTTP, connectivity troubleshooting |
| `diagnosing-rabbitmq` | RabbitMQ queue diagnosis, consumers, DLQ |
| `firebase-apk-scanner` | APK security misconfiguration scanning |
| `using-superpowers` | Skill discovery and usage overview |
| `trailmark-summary` | Quick codebase summary: language, entry points, graph |
| `vscode-auto-update` | Auto-update VS Code on Debian/Ubuntu |
| `caveman` | Respond tersely; substance over fluff |

---

## Agents

Autonomous subagents that coordinate complex multi-step work. Each agent runs specialized parallel sub-processes and consolidates findings.

### `code-reviewer`

Principal-level code reviewer. Runs parallel Security, Architecture, and Performance reviewers, then consolidates into structured PR/MR comments.

- Security audits (OWASP Top 10)
- Architecture validation (SOLID, Clean Architecture)
- Test coverage verification (>80% gate)
- Performance bottleneck detection
- Mentorship-focused feedback with severity levels

### `principal-engineer`

Architect-level guidance for system design, ADRs, and technology selection.

- System architecture and design patterns (GoF)
- Architecture Decision Records (ADRs)
- Trade-off analysis and risk assessment
- Technical debt strategy
- Scalability and performance architecture

### `devops-engineer`

Infrastructure and CI/CD expert. Handles IaC, containerization, cloud, and observability.

- IaC: Terraform, CloudFormation, Pulumi, Ansible
- Containers: Docker, Kubernetes, Helm
- CI/CD: GitHub Actions, GitLab CI, Jenkins
- Cloud: AWS, GCP, Azure
- Observability: Prometheus, Grafana, ELK

### `plan-specialist`

Senior orchestrator for multi-step tasks. Produces plans, Mermaid diagrams, quality gates, and risk registers — without writing production code.

- Task triage and decomposition
- Architecture diagramming (Mermaid)
- Quality gate enforcement (>90% coverage gate)
- Risk register and mitigation
- Explicit scope definition (IN / OUT)

---

## Prompts

Reusable prompt templates invoked with `/explain`, `/refactor`, etc.

| Prompt | Trigger | Description |
|---|---|---|
| `explain` | `/explain` | Step-by-step code explanation with context and edge cases |
| `refactor` | `/refactor` | Clean Code refactoring without changing business logic |
| `generate-tests` | `/generate-tests` | Comprehensive unit tests (Vitest/Jest) with edge cases |
| `generate-dockerfile` | `/generate-dockerfile` | Production-ready multi-stage Dockerfiles |

---

## Rules

Governance instructions automatically enforced across all AI-assisted work. No manual invocation required.

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
| `context-efficiency` | Minimize token usage, efficient search patterns |
| `workspace-nav` | Codebase navigation, file finding, context awareness |

---

## Documentation

Browse the full documentation locally:

```bash
pnpm install
pnpm docs:dev
```

Then open [http://localhost:5173](http://localhost:5173).

---

## Contributing

1. Fork the repository
2. Add your skill/agent/rule to the appropriate folder under `.agents/`
3. Follow the existing frontmatter format (see any `SKILL.md` for reference)
4. Open a pull request with a description of what your plugin does and when it activates

### Skill Frontmatter Template

```yaml
---
name: your-skill-name
description: "Short description. Triggers: comma, separated, keywords."
argument-hint: "[optional] [args]"
---
```

### Agent Frontmatter Template

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

MIT — free to use, fork, and adapt.

---

> Maintained by [Antonio Junior](https://github.com/juninmd). Contributions welcome.
