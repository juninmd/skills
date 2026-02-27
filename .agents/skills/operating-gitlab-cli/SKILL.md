---
name: operating-gitlab-cli
description: Specialized skill for operating the GitLab CLI (glab) within the Luizalabs infrastructure. Use this to manage projects, merge requests, and pipelines specifically on gitlab.luizalabs.com.
---

# Operating GitLab CLI at Luizalabs

This skill provides the procedural knowledge for using `glab` within the Luizalabs ecosystem (`gitlab.luizalabs.com`).

## Installation for Luizalabs Engineers

Ensure `glab` is installed and available in your PATH.

1.  **Check installation:** `glab --version`
2.  **Internal Binary Install (Linux):**
    ```bash
    cd /tmp && \
    curl -sL https://gitlab.com/gitlab-org/cli/-/releases/v1.86.0/downloads/glab_1.86.0_linux_amd64.tar.gz -o glab.tar.gz && \
    tar -xzf glab.tar.gz bin/glab && \
    mv bin/glab ~/.local/bin/glab && \
    rm glab.tar.gz && rm -rf bin
    ```

## Luizalabs Authentication & Config

The GitLab CLI must be explicitly configured for the internal instance.

1.  **Force Luizalabs Host:**
    ```bash
    glab config set host gitlab.luizalabs.com
    ```
2.  **Authentication (Non-interactive):**
    Luizalabs engineers should use a Personal Access Token (PAT) with `api` and `write_repository` scopes.
    ```bash
    glab auth login --hostname gitlab.luizalabs.com --token "<YOUR_PAT>" --api-protocol https
    ```
3.  **Telemetry Note:**
    When authenticating, you might see `401 Unauthorized` for telemetry. This is expected as the internal instance may block usage data tracking. The authentication remains valid.

## Command Reference

A complete reference of available commands for Luizalabs projects can be found here:
*   [references/commands.md](references/commands.md)

## Luizalabs Specific Workflows

*   **List Squad Repos:** `glab repo list --per-page 20`
*   **Check Pipeline Status:** `glab ci status` (Crucial for CI/CD checks before merging).
*   **Merge Request for Luizalabs:**
    ```bash
    glab mr create --title "feat: <description>" --description "Closes #<issue_id>" --label "squad-name"
    ```

## GitLab MCP (Model Context Protocol)

The `glab` binary (v1.86+) includes a built-in MCP server to expose GitLab tools to AI assistants like GitHub Copilot.

### VSCode Configuration (mcp.json)

To enable GitLab tools in VSCode Copilot Chat, add the following to your `mcp.json` (found in `~/.config/Code/User/mcp.json` on Linux):

```json
{
  "inputs": [
		{
			"id": "GITLAB_TOKEN",
			"type": "promptString",
			"description": "Personal Access Token for GitLab (GITLAB_TOKEN)",
			"password": true
		}
	],
  "servers": {
    "gitlab-labs": {
      "type": "stdio",
      "command": "glab",
      "args": [
        "mcp",
        "serve"
      ],
      "env": {
        "GITLAB_TOKEN": "${input:GITLAB_TOKEN}",
        "GITLAB_HOST": "https://gitlab.luizalabs.com/"
      },
      "gallery": true
    }
  }
}
```

### Automatic Setup via CLI

Luizalabs engineers can use the internal CLI to automate this:
```bash
padrao-labs-agents install --tools copilot
```
This command automatically merges the `gitlab-labs` configuration into the correct VSCode path.

