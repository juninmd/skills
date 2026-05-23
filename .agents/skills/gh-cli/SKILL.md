---
name: gh-cli
description: |
  **UTILITY SKILL** - Operate GitHub via CLI (gh).
  USE FOR: GitHub auth, creating issues/PRs, merging PRs, triggering workflows, releases, repo automation (JSON/JQ).
  DO NOT USE FOR: general git (use finishing-a-development-branch), non-GitHub hosting, complex rebase conflicts.
  INVOKES: gh cli, git.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Windows, Linux, macOS"
allowed-tools: [run_shell_command, read_file]
---

# GitHub CLI

Expert guide for inspecting and operating on GitHub repositories using the `gh` CLI.

**USE FOR:**
- Authenticating access for local or CI/CD.
- Managing issues and pull requests via terminal.
- Triggering and monitoring workflow runs.
- Creating and publishing software releases.
- Automating operations using JSON and the GitHub API.

**DO NOT USE FOR:**
- Basic git commands that don't need GitHub API.
- Interacting with non-GitHub servers.

**INVOKES:**
- `gh`, `git` CLI tools.

## Methodology
Implementation details are in:
1. [Auth & Setup](references/gh-setup.md) | [Issues & PRs](references/gh-workflows.md)
2. [Releases & Actions](references/gh-releases.md) | [Automation](references/gh-automation.md)

## Core Principles
1. **Machine-First:** Use `--json` and `--jq` in scripts.
2. **Context-Aware:** Verify auth and default repo first.
3. **Safety:** Show targets before destructive actions.

## Checklist
- [ ] Confirm auth/permission scope before write operations.
- [ ] Use explicit `owner/repo` outside local context.
- [ ] Verify CI checks and diffs before merging.
- [ ] Validate release artifacts before publishing.
