---
name: operating-gitlab-cli
description: Specialized skill to operate the GitLab CLI (glab) within the Luizalabs infrastructure. Use to manage projects, merge requests, and pipelines specifically on gitlab.luizalabs.com.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/cluster] [options]"
disable-model-invocation: true
---

# Operating GitLab CLI at Luizalabs

This skill provides the operational knowledge to use `glab` in the Luizalabs ecosystem (`gitlab.luizalabs.com`).

## Installation for Luizalabs Engineers

Ensure that `glab` is installed and available in your PATH.

1.  **Check installation:** `glab --version`
2.  **Internal Binary Install (Linux):**
    ```bash
    cd /tmp && \
    curl -sL https://gitlab.com/gitlab-org/cli/-/releases/v1.86.0/downloads/glab_1.86.0_linux_amd64.tar.gz -o glab.tar.gz && \
    tar -xzf glab.tar.gz bin/glab && \
    mv bin/glab ~/.local/bin/glab && \
    rm glab.tar.gz && rm -rf bin
    ```

## Authentication and Luizalabs Configuration

The GitLab CLI must be explicitly configured for the internal instance.

1.  **Force Luizalabs Host:**
    ```bash
    glab config set host gitlab.luizalabs.com
    ```
2.  **Authentication (non-interactive):**
  Use a Personal Access Token (PAT) with `api` and `write_repository` scopes.
    ```bash
    glab auth login --hostname gitlab.luizalabs.com --token "<YOUR_PAT>" --api-protocol https
    ```
  **Important:** If your token begins with the prefix `donotsave`, do not remove that prefix; keep the token exactly as provided.

3.  **Telemetry Note:**
  `401 Unauthorized` telemetry errors are expected because the internal instance blocks usage tracking. Authentication remains valid.

## Tips
- **Obtaining MR Content**: Use `mcp_gitlab-labs_glab_api` with GET on `/projects/<project>/merge_requests/<id>/changes` to fetch the diff JSON; alternatively, use `run_in_terminal` with `glab mr view <id>` for summary or `glab mr diff <id>` for diff output. The `glab` command will automatically use the correct repository and host context when executed within the project directory.
- **Dynamic Host Resolution**: When the user provides a full GitLab URL (e.g., `https://gitlab.luizalabs.com/group/project/-/merge_requests/123`), extract the host and repository path. Use the `-R` or `--repo` flag with the full URL (or `namespace/repo`) to ensure `glab` targets the correct instance and project, regardless of the default configured host.
- When a review spans multiple perspectives, invoke parallel subagents for Security, Architecture, Testing, Performance, and Quality, then consolidate the findings into a single verdict.
- If the user explicitly asks to post the review, publish the final consolidated comment with the appropriate CLI instead of only drafting it in chat.
- Prefer non-interactive CLI usage and deterministic commands so the review can be reproduced.
- **Posting Comments**: Use `run_in_terminal` with `glab mr note <MR_ID> --message "<comment>"` for GitLab MRs. For cross-instance or specific repository targeting, always append `-R <URL_OR_PATH>` (e.g., `-R https://gitlab.luizalabs.com/luizalabs/base-webapp`) to ensure the command hits the correct target. For long comments, save to a temporary file and use `$(cat file)`.

## Command Reference

See the full command reference at [references/commands.md](references/commands.md).

## Specific Luizalabs Workflows

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
