# GitHub CLI Automation Patterns

Using structured data and the GitHub API for scriptable operations.

## 1. JSON and JQ Integration
- **Patterns:** Always prefer `--json` for predictable parsing.
- **Example:** `gh pr list --json number,title --jq '.[] | {n: .number, t: .title}'`.

## 2. GitHub API Access
- **Direct Calls:** `gh api repos/:owner/:repo/pulls`.
- **Use Case:** Access fields or endpoints not exposed by high-level `gh` commands.
