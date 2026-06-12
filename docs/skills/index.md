# Skills

On-demand domain knowledge modules. Each skill is a focused knowledge set that loads when you invoke it explicitly or when the task matches its trigger keywords.

## Categories

| Category | Skills | Description |
|---|---|---|
| [Backend](./backend) | 7 | Node.js, Python, FastAPI, Go, Rust, .NET, NestJS |
| [Frontend](./frontend) | 8 | React, Next.js, shadcn/ui, Vite |
| [Mobile](./mobile) | 4 | Flutter, React Native, Android, iOS |
| [Infrastructure](./infrastructure) | 8 | Docker, Helm, IaC, Cloud, Serverless, CI/CD, Zero Trust |
| [Code Quality](./code-quality) | 9 | Auditing, TypeScript, Design Principles, Clean Code |
| [Architecture](./architecture) | 7 | Distributed Systems, Electron, AI Agents, MCP |
| [Build & Testing](./build-testing) | 6 | pnpm, Vitest, TDD, Generative Testing |
| [Database](./database) | 3 | PostgreSQL, MongoDB, Redis, Vector DBs |
| [Git & Workflow](./git-workflow) | 8 | Cleanup, Worktrees, Gitleaks, Triage, Plans |
| [Specialized](./specialized) | 11 | Agentic AI, Accessibility, Networking, Observability |

**Total: 71 skills**

## How Skills Work

Each skill lives in `.agents/skills/<name>/SKILL.md` with a YAML frontmatter declaring its name, description, and trigger keywords:

```yaml
---
name: developing-node
description: "Node.js/TypeScript with pnpm. Triggers: node, typescript."
argument-hint: "[file/module] [options]"
---
```

When an AI assistant encounters a task matching the triggers, it loads the skill's content and follows its instructions. Skills override default assistant behavior for their domain.

## Invoke Syntax

```
/skill-name [optional arguments]
```

Examples:
```
/developing-node
/mastering-docker
/react-dev
/flutter-dev src/screens/home
```
