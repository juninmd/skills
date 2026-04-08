# 🤖 AGENTS.md - Development Protocol Luizalabs

This file is the entrypoint for project standards, contribution workflow, and validation gates.
**PRIMARY INSTRUCTION:** Follow the rules defined in the referenced files below.

> ⚠️ **CONTRIBUTION RULES (ATTENTION TO AGENTS):** ⚠️
> All creations, edits, and modifications of Skills, Rules, or Agents MUST occur STRICTLY within the **`.agents/`** directory. NEVER modify or add files directly in publication directories (like `plugins/`, `skills/`, or `agents/`). The `.agents/` directory acts as the staging/development area that will be processed by repository automation tools.

## 🚀 Project Overview

This repository provides reusable AI development assets for Luizalabs, including:
- **Agents**: task-focused personas and tool constraints
- **Instructions**: standards that apply to specific file patterns
- **Skills**: specialized workflows and domain capabilities
- **Rules**: mandatory security, quality, and engineering constraints
- **Workflows**: step-by-step procedures for common engineering tasks

Core principle: author in `.agents/`, validate locally, and let repository automation materialize publication outputs.

## 🗂️ Repository Structure

```text
.
├── .agents/                # Source of truth for rules, skills, agents, workflows
├── apps/docs/              # Documentation site
├── cli/                    # CLI package for install and automation
├── plugins/                # Published/packaged plugin outputs and metadata
├── scripts/                # Validation and generation scripts
├── docs/                   # Additional docs and implementation plans
├── package.json            # Root scripts (build/lint/test/typecheck)
└── AGENTS.md               # This guidance file
```

Authoring rule:
- Edit and create agent assets only under `.agents/`
- Do not directly edit generated/publication targets under `plugins/` unless explicitly required by project maintainers

---

## 🧠 Persona and Soul
Your persona and behavior definition is in:
- [soul.md](SOUL.md)

## 📜 Rules
The strict guidelines you must follow:
- **Culture**: [.agents/rules/labs_luizalabs_culture.instructions.md](.agents/rules/labs_luizalabs_culture.instructions.md)
- **Security and Quality**: [.agents/rules/security_quality.instructions.md](.agents/rules/security_quality.instructions.md)
- **Git Workflow**: [.agents/rules/git_standards.instructions.md](.agents/rules/git_standards.instructions.md)
- **Makefile**: [.agents/rules/makefile_standards.instructions.md](.agents/rules/makefile_standards.instructions.md)
- **Documentation**: [.agents/rules/labs_documentation_standards.instructions.md](.agents/rules/labs_documentation_standards.instructions.md)
- **Magalu Infrastructure**: [.agents/rules/labs_magalu_infrastructure.instructions.md](.agents/rules/labs_magalu_infrastructure.instructions.md)
- **CI/CD**: [.agents/rules/labs_ci_cd_standards.instructions.md](.agents/rules/labs_ci_cd_standards.instructions.md)
- **Naming**: [.agents/rules/naming_conventions.instructions.md](.agents/rules/naming_conventions.instructions.md)

## 🛠️ Skills
Specialized capabilities to use when needed:
- **VS Code + Copilot**: [.agents/skills/configuring-vscode-copilot/SKILL.md](.agents/skills/configuring-vscode-copilot/SKILL.md)
- **Netskope Config**: [.agents/skills/labs-configuring-netskope/SKILL.md](.agents/skills/labs-configuring-netskope/SKILL.md)
- (And other skills in `.agents/skills/`)

## 🤖 Specialized Agents
Agents with personas, tools, and **subagent** support (VS Code 1.97+):
- **Complete index**: [.agents/agents/index.md](.agents/agents/index.md)
- **Leadership & Architecture**: `principal-engineer`, `design-doc`, `code-reviewer`
- **Security and Operations**: `labs-secops-agent`, `terminal-operator`
- **Technology specialists**: 
  - Backend: `labs-python-engineer`, `nodejs-engineer`, `dotnet-engineer`
  - Frontend: `frontend-expert` (now with React 19.2 features)
  - Mobile: `mobile-engineer`

## 🔄 Workflows
Step-by-step workflows:
- **Design-Doc**: [.agents/workflows/labs-design-doc-workflow.prompt.md](.agents/workflows/labs-design-doc-workflow.prompt.md)

## 🧪 Setup and Validation Commands

Use `pnpm` from repository root.

```bash
# Install dependencies
pnpm install

# Mandatory validation after any code change
pnpm build

# Full lint suite
pnpm lint

# Tests
pnpm test

# Type checks
pnpm typecheck

# Optional targeted validations
pnpm run lint:skills
pnpm run lint:agents
pnpm run lint:plugins
pnpm run lint:yaml
pnpm run lint:shell
pnpm run lint:frontmatter:inline
```

## 🛠️ Contribution Workflow (Agent Assets)

When adding or changing Agents, Instructions, Skills, Rules, or Workflows:
1. Read this file and the relevant source under `.agents/`
2. Implement changes only in `.agents/`
3. Keep naming, frontmatter, and folder conventions consistent
4. Run mandatory validation: `pnpm build`
5. Run focused checks when applicable (`lint:skills`, `lint:agents`, etc.)
6. Confirm documentation and generated artifacts remain consistent

## ✅ Review Checklist

Before finishing a contribution, verify:
- Changes were made in `.agents/` (not directly in publication directories)
- Referenced files and links exist and are correct
- Required frontmatter fields are present and valid
- Naming follows repository conventions
- `pnpm build` completed successfully
- Additional lint/test checks ran when relevant to the change

## 🔐 Non-Negotiable Guardrails

- Do not invent rules. Use the referenced sources of truth.
- Do not bypass security or quality standards.
- Do not commit secrets, tokens, or internal credentials.
- Do not skip validation after modifications.

---
**Note**: This file is a navigation and execution guide. Detailed standards live in the referenced files above.

## Important
After any code modification, run `pnpm build` to validate that nothing was broken.