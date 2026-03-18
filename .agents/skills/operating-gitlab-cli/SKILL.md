---
name: operating-gitlab-cli
description: Specialized skill for operating the GitLab CLI (glab) within the Luizalabs infrastructure. Use this to manage projects, merge requests, and pipelines specifically on gitlab.luizalabs.com.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
argument-hint: "[resource/cluster] [options]"
disable-model-invocation: true
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
    Use a Personal Access Token (PAT) with `api` and `write_repository` scopes.
    ```bash
    glab auth login --hostname gitlab.luizalabs.com --token "<YOUR_PAT>" --api-protocol https
    ```
3.  **Telemetry Note:**
    `401 Unauthorized` errors for telemetry are expected — the internal instance blocks usage tracking. Authentication remains valid.

## Command Reference

See the full command reference at [references/commands.md](references/commands.md).

## Luizalabs Specific Workflows

*   **List Squad Repos:** `glab repo list --per-page 20`
*   **Check Pipeline Status:** `glab ci status` (crucial before merging)
*   **Trace Job Logs:** `glab ci trace` (tail logs in real time)
*   **Create MR:**
    ```bash
    glab mr create \
      --title "feat: <description>" \
      --description "Closes #<issue_id>" \
      --label "<squad-name>"
    ```

## MCP (Model Context Protocol) — GitHub Copilot

Exposes GitLab tools to VS Code Copilot Chat via `glab`'s built-in MCP server (v1.86+).

**Config file:** `~/.config/Code/User/mcp.json`
```json
{
  "inputs": [{
    "id": "GITLAB_TOKEN",
    "type": "promptString",
    "description": "Personal Access Token for GitLab (GITLAB_TOKEN)",
    "password": true
  }],
  "servers": {
    "gitlab-labs": {
      "type": "stdio",
      "command": "glab",
      "args": ["mcp", "serve"],
      "env": {
        "GITLAB_TOKEN": "${input:GITLAB_TOKEN}",
        "GITLAB_HOST": "https://gitlab.luizalabs.com/"
      },
      "gallery": true
    }
  }
}
```

**Automatic Setup:**
```bash
padrao-labs-agents install --tools copilot
```
This command automatically merges the `gitlab-labs` configuration into the correct VSCode path.
