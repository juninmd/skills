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

## ⚠️ EXECUTION GOLDEN RULES (MRs)
When acting on a full GitLab URL (e.g., `https://gitlab.luizalabs.com/my-group/my-repo/-/merge_requests/280`), you **MUST strictly follow this format**:

**FORMAT**: `glab mr <ACTION> <MR_ID> -R <FULL_URL_BEFORE_/-/ >`
**EXAMPLE**: `glab mr view 280 -R https://gitlab.luizalabs.com/my-group/my-repo`

**🛑 ANTI-PATTERNS (NEVER DO THIS):**
- ❌ No Shell Variables (`$id`, `$repo`)
- ❌ No Missing Host/Context (Always use `-R <URL>`)
- ❌ No Brackets (`<id>`, `{id}`)

## Tips
- **Obtaining MR Diff**: Use `mcp_gitlab-labs_glab_api` with GET on `/projects/123/merge_requests/456/changes` (use real IDs) or run `glab mr diff 456 -R https://...`.
- When a review spans multiple perspectives, invoke parallel subagents.
- Prefer non-interactive CLI usage and deterministic commands.
- **Posting Comments**: Run `glab mr note 280 -R https://... --message "$(cat file)"` to avoid multiline string escaping issues.

## Command Reference

See the full command reference at [references/commands.md](references/commands.md).

## Specific Luizalabs Workflows

*   **List Squad Repos:** `glab repo list --per-page 20`
*   **Check Pipeline Status:** `glab ci status`
*   **Trace Job Logs:** `glab ci trace`
*   **Create MR:**
    ```bash
    glab mr create \
      --title "feat: add user authentication" \
      --description "Closes #123" \
      --label "squad-auth"
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