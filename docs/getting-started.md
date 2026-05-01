# Getting Started

## What is this?

**Agent Plugins** is a curated plugin library for AI coding assistants. It packages production-grade engineering knowledge into reusable **skills**, **autonomous agents**, **prompt templates**, and **governance rules** that extend the assistant's capabilities beyond its defaults.

All plugins live under `.agents/` and are automatically discovered by Claude Code, Gemini CLI, Copilot CLI, and any compatible assistant.

## Installation

### Option 1 — Git Submodule (recommended)

Add to an existing project so plugins stay versioned with your repo:

```bash
git submodule add https://github.com/juninmd/skills .agents
git submodule update --init --recursive
```

### Option 2 — Clone Directly

```bash
git clone https://github.com/juninmd/skills
```

### Option 3 — Partial Copy

Copy only the categories you need into your project's `.agents/` folder. The structure is flat — each folder is self-contained.

## Directory Layout

```
.agents/
├── agents/          # Autonomous subagents
├── prompts/         # Reusable prompt templates
├── rules/           # Always-on governance rules
└── skills/          # Domain knowledge modules
    └── skill-name/
        ├── SKILL.md         # Main skill content + frontmatter
        └── assets/          # Optional diagrams, references
```

## Invoking Skills

In Claude Code, use the `/skill-name` syntax:

```
/developing-node
/mastering-docker
/react-dev
/flutter-dev
/code-reviewer
/principal-engineer
```

Skills activate automatically when the task matches their trigger keywords. You can also invoke them explicitly to force-load a specific knowledge module.

## Invoking Agents

Agents are invoked the same way:

```
/code-reviewer        # Multi-perspective PR/MR review
/principal-engineer   # Architecture and system design
/devops-engineer      # Infrastructure and CI/CD
/plan-specialist      # Task planning and orchestration
```

## Using Prompt Templates

Prompt templates wrap a common task pattern:

```
/explain              # Explain selected code step by step
/refactor             # Refactor using Clean Code principles
/generate-tests       # Generate unit tests (Vitest/Jest)
/generate-dockerfile  # Generate a production Dockerfile
```

## How Rules Work

Rules are always active — no invocation needed. They constrain and guide all AI responses in the session:

- `security.instructions.md` — blocks merges with OWASP Top 10 vulnerabilities
- `git-workflow.instructions.md` — enforces feature branches and Conventional Commits
- `testing.instructions.md` — requires >80% test coverage

See [Rules](/rules/) for the full list.

## Frontmatter Format

Every plugin uses YAML frontmatter to declare its metadata.

### Skill

```yaml
---
name: your-skill-name
description: "Short description. Triggers: keyword1, keyword2."
argument-hint: "[optional] [args]"
---
```

### Agent

```yaml
---
name: your-agent-name
description: "What this agent does. When to invoke it."
user-invocable: true
disable-model-invocation: false
---
```

### Rule

```yaml
---
description: Brief rule summary
globs: ["**/*.ts", "**/*.tsx"]
alwaysApply: true
---
```

## Contributing

1. Fork the repository
2. Add your skill under `.agents/skills/your-skill-name/SKILL.md`
3. Follow the frontmatter format above
4. Run `pnpm docs:dev` to preview the docs locally
5. Open a pull request

## Browse the Docs

```bash
pnpm install
pnpm docs:dev
```

Open `http://localhost:5173` in your browser.
