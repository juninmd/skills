---
layout: home

hero:
  name: "Agent Plugins"
  text: "Skills, Agents & Rules"
  tagline: Extend your AI coding assistant with production-grade engineering knowledge — 58 skills, 4 agents, 15 rules, 4 prompt templates.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Browse Skills
      link: /skills/
    - theme: alt
      text: View on GitHub
      link: https://github.com/juninmd/skills

features:
  - icon: 🤖
    title: 4 Autonomous Agents
    details: Code Reviewer, Principal Engineer, DevOps Engineer, and Plan Specialist — each with parallel sub-processes and structured output.
    link: /agents/
    linkText: Browse agents

  - icon: ⚡
    title: 58 Domain Skills
    details: On-demand knowledge modules covering Node.js, Python, React, Flutter, Docker, Kubernetes, and more — all following 2026 best practices.
    link: /skills/
    linkText: Browse skills

  - icon: 📋
    title: 15 Governance Rules
    details: Always-on instructions enforcing security, testing standards, naming conventions, and Git workflow across every task.
    link: /rules/
    linkText: Browse rules

  - icon: 📝
    title: 4 Prompt Templates
    details: Reusable templates for code explanation, refactoring, test generation, and Dockerfile creation.
    link: /prompts/
    linkText: Browse prompts

  - icon: 🔒
    title: Security First
    details: OWASP Top 10 enforcement, Zod validation, no hardcoded secrets, parameterized queries — baked into every skill and agent.

  - icon: 🌐
    title: Multi-Platform
    details: Works with Claude Code, Gemini CLI, Copilot CLI, and any AI assistant that reads `.agents/` or `AGENTS.md`.
---

## Quick Setup

```bash
# Add as git submodule
git submodule add https://github.com/juninmd/skills .agents

# Or clone directly
git clone https://github.com/juninmd/skills .agents-plugins
```

Then in your AI assistant session, skills and agents are automatically discovered.

## Invoke a Skill

```
/developing-node       # Node.js + TypeScript best practices
/mastering-docker      # Production-ready Dockerfiles
/react-dev             # React 19+ patterns
/flutter-dev           # Flutter 3 + Riverpod
/code-reviewer         # Multi-perspective code review
```

## Stack Defaults (2026)

| Domain | Stack |
|---|---|
| Node.js | pnpm · TypeScript strict · Biome · SWC · Vite 8 |
| Python | uv · ruff · ty · pyproject.toml · pytest |
| React | React 19+ · Server Components · useActionState |
| Next.js | App Router · Turbopack · async APIs |
| Docker | Multi-stage · Distroless · non-root · healthchecks |
| Mobile | Flutter (Riverpod) · React Native (Expo) |
