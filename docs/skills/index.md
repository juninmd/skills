# Skills

On-demand domain knowledge modules. Each skill is a focused knowledge set that loads when you invoke it explicitly or when the task matches its trigger keywords.

## Categories

| Category | Skills | Description |
|---|---|---|
| [Backend](./backend) | 8 | Node.js, Python, FastAPI, Go, Rust, .NET, NestJS |
| [Frontend](./frontend) | 8 | React, Next.js, shadcn/ui, Vite, VitePress |
| [Mobile](./mobile) | 4 | Flutter, React Native, Android, iOS |
| [Infrastructure](./infrastructure) | 8 | Docker, Helm, IaC, Cloud, Serverless, CI/CD |
| [Code Quality](./code-quality) | 5 | Auditing, TypeScript, Design Principles |
| [Architecture](./architecture) | 6 | Distributed Systems, Electron, AI Agents, MCP |
| [Build & Testing](./build-testing) | 4 | pnpm, tsdown, Vitest |
| [Database](./database) | 1 | PostgreSQL, MongoDB, Redis |
| [Git & Workflow](./git-workflow) | 6 | Cleanup, Worktrees, Gitleaks, Triage |
| [Specialized](./specialized) | 9 | Accessibility, Networking, RabbitMQ, APK scanning |

**Total: 100 skills**

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
