---
name: gh-cli
description: "pr create, issue comment, release. Triggers: pr create."
argument-hint: "[context] [options]"
---

# GitHub CLI

Use `gh` to inspect and operate on GitHub repositories from the terminal with predictable, scriptable commands.

> Verified against GitHub CLI 2.92.0 official manual and latest release on 2026-05-01.

## When to Use

- Authenticate GitHub access for local or CI workflows.
- Inspect repositories, branches, issues, pull requests, and workflow runs.
- Create or update issues, PRs, releases, labels, and comments.
- Automate GitHub operations with `--json`, `--jq`, and `GH_TOKEN`.

## Core Areas

### Authentication

```bash
gh auth status
gh auth login
gh auth refresh -s repo,workflow
```

- Prefer `GH_TOKEN` or `GITHUB_TOKEN` in CI.
- Use `gh auth setup-git` only when the repo should use GitHub credentials for git operations.

### Repository Operations

```bash
gh repo view owner/repo
gh repo clone owner/repo
gh repo fork owner/repo
gh repo set-default owner/repo
```

- Use `gh repo view --web` when the user needs the browser representation.
- Prefer explicit `owner/repo` when working across multiple repositories.

### Issues

```bash
gh issue list --limit 20
gh issue view 123
gh issue create --title "Bug: login loop" --body-file issue.md
gh issue comment 123 --body "Investigated and reproduced on main."
```

- Use labels, assignees, and milestones at creation time when the workflow depends on issue state.
- Prefer `--body-file` for longer content to keep commands reviewable.

### Pull Requests

```bash
gh pr status
gh pr view 456 --comments
gh pr create --fill
gh pr checkout 456
gh pr merge 456 --squash --delete-branch
```

- Check branch diff and CI state before opening or merging a PR.
- Use `gh pr checks` and `gh pr view --json` for scriptable status checks.

### Workflows and Actions

```bash
gh workflow list
gh run list --limit 10
gh run view 789 --log
gh workflow run ci.yml
```

- Prefer `gh run watch` when you need to follow an active workflow.
- Use `gh run rerun` only after the failure cause is understood.

### Releases

```bash
gh release list
gh release view v1.2.3
gh release create v1.2.3 --generate-notes
gh release upload v1.2.3 dist/*
```

- Confirm the tag exists and release artifacts are final before publishing.
- Use generated notes as a baseline, then edit when the release needs curation.

### Automation Patterns

```bash
gh pr view 456 --json title,mergeStateStatus,reviewDecision
gh issue list --json number,title,labels --jq '.[] | {number, title}'
gh api repos/owner/repo/pulls/456/files
```

- Prefer `--json` and `--jq` over brittle text parsing.
- Use `gh api` when the manual command surface does not expose the needed field.

## Operational Guidance

- Respect repository permissions and protected-branch policies.
- Avoid interactive flows in automation; pass explicit flags and environment variables.
- For destructive actions such as merging, deleting branches, or editing releases, show the exact target before executing.

## Checklist

- [ ] Confirm authentication context, repository target, and permission scope before running write operations.
- [ ] Prefer explicit repository and PR or issue identifiers when working outside the current repo.
- [ ] Use structured output or a follow-up verification command after any mutating action.

## References

- [GitHub CLI Manual](https://cli.github.com/manual/)
- [GitHub CLI Latest Release](https://github.com/cli/cli/releases/latest)
- [gh auth login](https://cli.github.com/manual/gh_auth_login)
- [gh pr](https://cli.github.com/manual/gh_pr)
- [gh workflow](https://cli.github.com/manual/gh_workflow)