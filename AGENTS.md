# AGENTS.md — Global Agent Configuration

This file defines the available agents, skills, rules, and prompts for AI coding assistants operating in this repository. It is read automatically by Claude Code, Gemini CLI, Copilot CLI, and compatible AI assistants.

---

## Agent Discovery

All plugins live under `.agents/`. The assistant resolves them at session start:

```
.agents/
├── agents/    ← autonomous subagents
├── prompts/   ← reusable prompt templates
├── rules/     ← always-on governance instructions
└── skills/    ← on-demand domain knowledge
```

---

## Available Agents

Invoke agents with `/agent-name` or by describing the task — the assistant will select the most appropriate agent automatically.

### `code-reviewer`

**When to invoke:** Any PR/MR review, before merging a feature branch, security audit, design pattern check.

**Capabilities:**
- Parallel Security + Architecture + Performance review
- OWASP Top 10 vulnerability detection
- SOLID and Clean Architecture validation
- Test coverage verification (gates at >80%)
- Structured comments with severity: BLOCKER / HIGH / LOW

**Not for:** Writing new code or implementation. Use `principal-engineer` for design decisions.

---

### `principal-engineer`

**When to invoke:** System design, architecture decisions, technology selection, ADR writing, technical debt strategy, scalability planning.

**Capabilities:**
- System architecture and design patterns (GoF)
- Architecture Decision Records (ADRs)
- Trade-off analysis with explicit pros/cons
- Risk assessment and mitigation strategies
- Technology evaluation with clear recommendations

**Not for:** Line-by-line code review (use `code-reviewer`) or implementation tasks.

---

### `devops-engineer`

**When to invoke:** Infrastructure setup, CI/CD pipeline creation, Dockerfile optimization, Kubernetes manifests, IaC scripts, cloud architecture, observability configuration.

**Capabilities:**
- IaC: Terraform, CloudFormation, Pulumi, Ansible
- Containers: Docker (multi-stage, Distroless, non-root), Kubernetes, Helm
- CI/CD: GitHub Actions, GitLab CI, Jenkins
- Cloud: AWS, GCP, Azure (security-first, cost-aware)
- Observability: Prometheus, Grafana, ELK, distributed tracing

**Not for:** Application-level code. Hands off to `principal-engineer` for system design.

---

### `plan-specialist`

**When to invoke:** Complex multi-step tasks, feature planning, sprint decomposition, risk register creation, scope definition.

**Capabilities:**
- Task triage and work breakdown
- Mermaid architecture and flow diagrams
- Quality gate definition (>90% coverage gate by default)
- Explicit scope: what is IN and what is OUT
- Risk register with likelihood × impact matrix
- Requires approval before any implementation begins

**Constraint:** Produces plans only — never writes production code directly. Delegates to other agents for execution.

---

## Available Skills

Skills are loaded on demand when the task matches their domain. Invoke explicitly with `/skill-name` or let the assistant select based on context.

### Backend Development
- `/developing-node` — Node.js 24 + TypeScript, pnpm, Biome, SWC, Vite 8
- `/developing-python` — Modern Python: uv, ruff, pyproject.toml, PEP 723
- `/modern-python` — Python toolchain: uv, ruff, ty, prek
- `/developing-fastapi` — FastAPI + Pydantic v2, async patterns
- `/developing-go` — Go modules, goroutines, clean architecture
- `/developing-rust` — Rust ownership, safety, Cargo
- `/developing-dotnet` — .NET async/await, EF Core, xUnit
- `/developing-nestjs` — NestJS modular, validation, auth

### Frontend
- `/react-dev` — React 19+, Server Components, useActionState
- `/nextjs-dev` — Next.js 15+, App Router, Turbopack
- `/shadcn-ui` — shadcn/ui components
- `/vite` — Vite 8 + Tailwind CSS v4
- `/vitepress` — VitePress documentation sites
- `/frontend-design` — Production-grade UI interfaces
- `/developing-ui-ux-components` — Accessible, reusable components

### Mobile
- `/flutter-dev` — Flutter 3 + Riverpod + GoRouter
- `/react-native-dev` — React Native + Expo
- `/android-native-dev` — Kotlin + Compose + Material 3
- `/ios-application-dev` — Swift + SwiftUI

### Infrastructure
- `/mastering-docker` — Multi-stage, Distroless, non-root, healthchecks
- `/managing-helm-charts` — Kubernetes Helm charts
- `/managing-iac` — Terraform, Pulumi, Ansible
- `/managing-cloud-infrastructure` — AWS/GCP/Azure resilient architecture
- `/managing-serverless` — Lambda, Vercel, Cloudflare Workers
- `/configuring-ci-cd` — GitHub Actions, GitLab CI
- `/managing-vector-databases` — Vector DBs for RAG

### Code Quality
- `/audit-context-building` — Line-by-line vulnerability analysis
- `/auditing-code` — Static analysis, linting, code smells
- `/diagnosing-bugs` — Evidence-driven debugging and regression loops
- `/validating-typescript` — Strict TypeScript type safety
- `/applying-design-principles` — Clean Code, SOLID, DRY, KISS
- `/karpathy-guidelines` — Avoid common LLM coding mistakes

### Architecture
- `/architecting-distributed-systems` — Microservices, message queues
- `/architecting-electron` — Electron Main/Renderer/Native
- `/developing-ai-agents` — Autonomous AI agents, tool calling
- `/developing-mcp-servers` — Model Context Protocol servers
- `/improving-codebase-architecture` — Practical architecture improvements
- `/mcp-builder` — Full MCP server build workflow

### Build & Testing
- `/pnpm` — pnpm workspaces, strict resolution
- `/tsdown` — TS/JS library bundling with Rolldown
- `/vitest` — Vitest unit testing
- `/test-driven-development` — Behavior-first red/green/refactor loop
- `/developing-tooling` — CLI tools, automation

### Database
- `/administrating-databases` — PostgreSQL, MongoDB, Redis

### Git & Workflow
- `/git-cleanup` — Safe branch and worktree cleanup
- `/finishing-a-development-branch` — Complete development cycle
- `/using-git-worktrees` — Isolated parallel feature work
- `/fix-gitleaks` — Fix gitleaks CI failures
- `/github-triage` — Issue triage state machine

### Specialized
- `/implementing-accessibility` — Web a11y standards
- `/diagnosing-networks` — DNS, HTTP, connectivity troubleshooting
- `/diagnosing-rabbitmq` — RabbitMQ diagnosis
- `/firebase-apk-scanner` — APK security scanning
- `/trailmark-summary` — Codebase summary
- `/using-superpowers` — Skill discovery

---

## Active Rules

The following rules are always active. They apply to all tasks without explicit invocation.

| Rule | What It Enforces |
|---|---|
| `security` | OWASP Top 10, Zod validation, no hardcoded secrets, parameterized queries |
| `git-workflow` | Feature branches only; Conventional Commits; no direct commits to main; use `git status -s` |
| `testing` | >80% coverage; unit + integration tests; meaningful assertions |
| `code-design-principles` | Clean Code, SOLID, DRY, KISS, YAGNI |
| `error-handling` | Meaningful errors, graceful degradation, no silent failures |
| `naming-conventions` | Self-documenting names, language-consistent patterns |
| `observability` | Structured logging, metrics, distributed tracing |
| `data-privacy` | PII handling, GDPR compliance, secure data practices |
| `dependency-management` | Managed versioning, security audits, deprecation tracking |
| `dockerfile-standards` | Multi-stage builds, minimal images, non-root users |
| `env-secrets` | Secrets via environment variables; never hardcoded |
| `shell-scripting` | Bash best practices, error handling, portability |
| `command-safety` | No destructive operations without explicit confirmation |
| `context-efficiency` | Minimal token usage; targeted reads; efficient search |
| `workspace-nav` | Efficient codebase navigation and context awareness |

---

## Prompt Templates

| Template | Invoke | Description |
|---|---|---|
| `explain` | `/explain` | Step-by-step code explanation with context and edge cases |
| `refactor` | `/refactor` | Clean Code refactoring, no business logic changes |
| `generate-tests` | `/generate-tests` | Vitest/Jest unit tests: happy path, edge cases, error handling |
| `generate-dockerfile` | `/generate-dockerfile` | Production-ready multi-stage Dockerfile |

---

## Instruction Priority

When conflicts arise between instructions:

1. **User's explicit instructions** (this file, CLAUDE.md, direct requests) — highest priority
2. **Skill / Agent instructions** — override default behavior
3. **Default assistant behavior** — lowest priority

---

## Quality Gates

These are the non-negotiable quality thresholds enforced across all work:

- **Test coverage:** >80% (agents default to >90% gate)
- **TypeScript:** strict mode, no `any`, Zod for all external inputs
- **Security:** zero known vulnerabilities before merge
- **Code size:** functions and components under 100 lines
- **Commits:** Conventional Commits format; feature branches only
- **Secrets:** never committed; always via environment variables
