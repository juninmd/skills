# Getting Started

## Install via symlink

The supported install links one checkout into every client, so edits in the repository are live without a reinstall.

```bash
git clone https://github.com/juninmd/skills && cd skills
node .agents/tools/install.mjs --dry-run   # show the plan
node .agents/tools/install.mjs all         # or: claude | codex | agy
```

| Client | Skills | Instructions | Config |
|---|---|---|---|
| Claude Code | `~/.claude/skills/<name>` | `~/.claude/CLAUDE.md` | `~/.claude/settings.json` |
| Codex | `~/.codex/skills/<name>` | `~/.codex/AGENTS.md` | `~/.codex/config.toml` |
| Antigravity (agy) | `~/.gemini/config/skills/<name>` | `~/.gemini/GEMINI.md` | — |

Existing real files are renamed to `*.bak-<timestamp>` before linking. Links that point at retired skills are pruned. `--no-config` links skills and instructions only. On Windows, skill directories become junctions (no privilege needed); file links need Developer Mode or an elevated shell. Without it, `CLAUDE.md` and `GEMINI.md` get a one-line `@path` import stub that tracks the repo the same way, and the config files are left untouched until you rerun elevated.

## Claude Code plugin

Installs all skills and the 4 agents as one plugin (`juninmd:<name>`). The marketplace is [`.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json); the plugin root is `.agents/`.

```bash
claude plugin marketplace add juninmd/skills            # or a local checkout path
claude plugin install juninmd@skills                    # --scope user | project | local
claude plugin details juninmd@skills                    # inventory and always-on token cost
```

Claude Code copies plugins into `~/.claude/plugins/cache`, so run `claude plugin marketplace update skills` and reinstall to pick up repo edits. Updates follow the default branch unpinned: read the diff before updating. Plugin skills are namespaced and coexist with symlinked personal skills; use one install method per client to avoid loading every skill description twice.

## Install by copy

```bash
npx skills add juninmd/skills --list                    # preview the catalog
npx skills add juninmd/skills --skill backend-systems   # copy one skill
```

Copies do not follow the repository and do not include the agents or operating instructions.

## Invoke

Skills activate from their frontmatter description or explicitly:

```text
/backend-systems
/observability
/test-engineering
/starting-dev
```

## Skill Structure

```text
.agents/skills/<name>/
├── SKILL.md
└── references/
```

`SKILL.md` holds the discovery description, preflight, numbered workflow, a decision table, a real command block, stop conditions, rules, and a checklist. Detailed knowledge stays in `references/` and is loaded only when relevant.

## Frontmatter

```yaml
---
name: your-skill-name
description: |
  What the skill does and the concrete tasks or contexts where it should be used.
license: MIT
metadata:
  version: 1.0.0
compatibility: any notes on required tools or platforms
---
```

Allowed fields: `name`, `description`, `license`, `allowed-tools`, `metadata`, `compatibility`. The name must equal the folder name.

## Validate

```bash
pnpm install --frozen-lockfile
pnpm run validate
pnpm run docs:build
```

The gate checks frontmatter, required sections, token budgets, routing evals, retired skill names, catalog consistency, spelling, local links, and validator tests.
