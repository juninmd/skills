# Agents

Autonomous subagents that coordinate complex, multi-step engineering work. Each agent runs specialized parallel sub-processes and consolidates findings into structured, actionable output.

## Available Agents

| Agent | Role | Invoke |
|---|---|---|
| [Code Reviewer](./code-reviewer) | Principal-level PR/MR review | `/code-reviewer` |
| [Principal Engineer](./principal-engineer) | Architecture and system design | `/principal-engineer` |
| [DevOps Engineer](./devops-engineer) | Infrastructure, CI/CD, cloud | `/devops-engineer` |
| [Plan Specialist](./plan-specialist) | Task orchestration and planning | `/plan-specialist` |

## How Agents Work

Each agent is defined in a Markdown file with YAML frontmatter:

```yaml
---
name: agent-name
description: "What this agent does. When to use it."
user-invocable: true
disable-model-invocation: false
---
```

Agents can:
- Spawn parallel sub-processes for different analysis dimensions
- Delegate specific sub-tasks to other agents
- Produce structured, consistent output formats (Mermaid diagrams, severity tables, ADRs)

## When to Use Which Agent

```
Writing or reviewing code?         → code-reviewer
Designing a system or API?         → principal-engineer
Setting up infrastructure?         → devops-engineer
Planning a complex multi-step task? → plan-specialist
```

## Parallel Execution Pattern

The `code-reviewer` and `plan-specialist` agents internally spawn parallel sub-reviewers:

```
code-reviewer
├── Security Reviewer    (OWASP, secrets, injection)
├── Architecture Reviewer (SOLID, patterns, debt)
└── Performance Reviewer  (algorithms, N+1, bottlenecks)
         ↓
    Consolidated Report
```

This ensures every review covers all dimensions without the user having to run multiple prompts.
