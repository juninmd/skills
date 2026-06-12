# Getting Started

## Install

```bash
# Install all skills
npx skills add juninmd/skills --all

# Preview the catalog
npx skills add juninmd/skills --list

# Install one skill
npx skills add juninmd/skills --skill backend-node
```

For repository-local discovery:

```bash
git submodule add https://github.com/juninmd/skills .agents
git submodule update --init --recursive
```

## Invoke

Skills can activate from their frontmatter description or be invoked explicitly:

```text
/backend-node
/diagnostics
/test-engineering
/project-lifecycle
```

## Skill Structure

```text
.agents/skills/<name>/
├── SKILL.md
└── references/
```

`SKILL.md` contains the discovery description, core workflow, reference selection, rules, and a concise checklist. Detailed knowledge stays in `references/` and is loaded only when relevant.

## Required Frontmatter

```yaml
---
name: your-skill-name
description: |
  What the skill does and the concrete tasks or contexts where it should be used.
---
```

Only `name` and `description` are allowed in skill frontmatter.

## Validate

```bash
pnpm install --frozen-lockfile
pnpm run validate
pnpm run docs:build
```

The gate checks frontmatter fields, naming, description quality, checklist presence, word budget, local links, catalog consistency, and validator tests.
