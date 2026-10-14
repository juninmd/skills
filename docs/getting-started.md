# Getting Started

## Install via symlink

The supported install links one checkout into every client, so edits in the repository are live without a reinstall.

```bash
git clone https://github.com/juninmd/skills && cd skills
node .agents/tools/install.mjs --dry-run   # show the plan
node .agents/tools/install.mjs all         # or: claude | codex | agy | opencode
```

| Client | Skills | Instructions | Config |
|---|---|---|---|
| Claude Code | `~/.claude/skills/<name>` | `~/.claude/CLAUDE.md` | `~/.claude/settings.json` |
| Codex | `~/.codex/skills/<name>` | `~/.codex/AGENTS.md` | `~/.codex/config.toml` |
| Antigravity (agy) | `~/.gemini/config/skills/<name>` | `~/.gemini/GEMINI.md` | — |
| opencode | `~/.config/opencode/skills/<name>` | — | — |

Existing real files are renamed to `*.bak-<timestamp>` before linking. Links that point at retired skills are pruned. `--no-config` links skills and instructions only. On Windows, skill directories become junctions (no privilege needed); file links need Developer Mode or an elevated shell. Without it, `CLAUDE.md` and `GEMINI.md` get a one-line `@path` import stub that tracks the repo the same way, and the config files are left untouched until you rerun elevated.

## Claude Code plugins

Install either the full bundle or only the domains you need from the [`.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json) marketplace:

- `juninmd@skills`: Full bundle (all 32 skills).
- `juninmd-core@skills`: Core workflow, requirements, review, testing, documentation.
- `juninmd-web@skills`: Frontend, mobile, iOS, design tokens, motion, 3D.
- `juninmd-backend@skills`: Backend, database, architecture, packaging, CLI tooling.
- `juninmd-devops@skills`: Cloud infrastructure, CI/CD, observability, security.
- `juninmd-ai@skills`: Agent engineering, orchestration, skill authoring, AI radar.

```bash
claude plugin marketplace add juninmd/skills            # or a local checkout path

# Install full bundle or targeted contexts:
claude plugin install juninmd@skills                    # --scope user | project | local
claude plugin install juninmd-web@skills
claude plugin details juninmd@skills                    # inventory and always-on token cost
```

Claude Code copies plugins into `~/.claude/plugins/cache`, so run `claude plugin marketplace update skills` and reinstall to pick up repo edits. Updates follow the default branch unpinned: read the diff before updating. Claude Code uses one install method at a time: while a plugin from this repo is installed, `install.mjs claude` removes the skill links that point into this repo and skips creating new ones, so no skill loads twice. To switch back, run `claude plugin uninstall <plugin>`, then `node .agents/tools/install.mjs claude`.

## Install by copy

```bash
npx skills add juninmd/skills --list                    # preview the catalog
npx skills add juninmd/skills --skill backend-systems   # copy one skill
```

Copies do not follow the repository and do not include the repository operating instructions.

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
