---
name: operating-gitlab-cli
description: Specialized skill to operate the GitLab CLI (glab) within the MyProject infrastructure. Use to manage projects, merge requests, and pipelines specifically on gitlab.com.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/cluster] [options]"
disable-model-invocation: true
---

# Operating GitLab CLI at MyProject

This skill provides the operational knowledge to use `glab` in the MyProject ecosystem (`gitlab.com`).

## Installation for MyProject Engineers

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

## Authentication and MyProject Configuration

The GitLab CLI must be explicitly configured for the internal instance.

1.  **Force MyProject Host:**
    ```bash
    glab config set host gitlab.com
    ```
2.  **Authentication (non-interactive):**
  Use a Personal Access Token (PAT) with `api` and `write_repository` scopes.
    ```bash
    glab auth login --hostname gitlab.com --token "<YOUR_PAT>" --api-protocol https
    ```
  **Important:** If your token begins with the prefix `donotsave`, do not remove that prefix; keep the token exactly as provided.

3.  **Telemetry Note:**
  `401 Unauthorized` telemetry errors are expected because the internal instance blocks usage tracking. Authentication remains valid.

## ⚠️ EXECUTION GOLDEN RULES (MRs)
When acting on a full GitLab URL (e.g., `https://gitlab.com/my-group/my-repo/-/merge_requests/280`), you **MUST strictly follow this format**:

**FORMAT**: `NO_COLOR=1 GIT_PAGER=cat glab mr <ACTION> <MR_ID> -R <FULL_URL_BEFORE_/-/>`
**EXAMPLE (diff)**: `NO_COLOR=1 GIT_PAGER=cat glab mr diff 280 -R https://gitlab.com/my-group/my-repo > /tmp/mr280.diff`
**EXAMPLE (metadata)**: Use `mcp_gitlab_glab_api` → `args: ["/projects/my-group%2Fmy-repo/merge_requests/280"]`

**🛑 ANTI-PATTERNS (NEVER DO THIS):**
- ❌ No Shell Variables (`$id`, `$repo`)
- ❌ No Missing Host/Context (Always use `-R <URL>`)
- ❌ No Brackets (`<id>`, `{id}`)
- ❌ Never run `glab mr view` — it ALWAYS opens a pager regardless of env vars. Use `mcp_gitlab_glab_api` instead.
- ❌ Never run `glab mr diff` without redirecting to a file or piping — e.g. `> /tmp/mr.diff` or `| head -N`

## 🔑 MANDATORY APPROACH FOR DATA COLLECTION
```
MR Metadata → mcp_gitlab_glab_api (zero pager risk)
MR Diff     → glab mr diff <ID> -R <URL> > /tmp/mr<ID>.diff (redirect to file)
```
Without file redirect, `glab mr diff` may open the pager in terminal (hangs execution).

## Post-Review Actions (Labels + Emoji)

After posting a review, apply the appropriate labels and emoji reaction using `mcp_gitlab_glab_api`. All operations are non-interactive (no terminal pager risk).

### Award Emoji Reaction
```
POST /projects/group%2Frepo/merge_requests/<IID>/award_emoji
field: ["name=thumbsdown"]   # for REJECTED / needs changes
field: ["name=thumbsup"]     # for APPROVED
```

### Add Labels to MR
```
PUT /projects/group%2Frepo/merge_requests/<IID>
field: ["add_labels=Pending Changes,In Review"]   # REJECTED
field: ["add_labels=In Review"]                   # APPROVED
```
- **"Pending Changes"** (🟠 laranja `#FF6600`): MR rejeitado, requer alterações.
- **"In Review"** (🔵 azul `#0052CC`): MR em revisão (adicionar em ambos os casos).
- Usar `add_labels` (não `labels`) para não sobrescrever labels existentes.

### Create Labels (if they don't exist yet)
```
POST /projects/group%2Frepo/labels
field: ["name=Pending Changes", "color=#FF6600", "description=MR requer alteracoes"]
field: ["name=In Review", "color=#0052CC", "description=MR em processo de revisao"]
```

### Full Post-Review Workflow
| Veredicto | Emoji | Labels |
|:----------|:------|:-------|
| 🔴 REJEITADO | `thumbsdown` | `Pending Changes` + `In Review` |
| 🟡 APROVADO COM RESSALVAS | `thumbsup` | `In Review` |
| ✅ APROVADO | `thumbsup` | `In Review` |

## Tips
- **Obtaining MR metadata (PREFERRED — no pager)**: Use MCP tool `mcp_gitlab_glab_api`:
  ```
  args: ["/projects/group%2Frepo/merge_requests/280"]
  flags: {"hostname": "gitlab.com"}
  ```
  The `%2F` encodes `/` in the project path. Example: `example-org/base-webapp` → `example-org%2Fbase-webapp`
- **Obtaining MR Diff (from terminal)**: Redirect output to a file to avoid pager:
  ```bash
  NO_COLOR=1 GIT_PAGER=cat glab mr diff 280 -R https://gitlab.com/group/repo > /tmp/mr280.diff 2>&1
  cat /tmp/mr280.diff | head -300
  ```
  **⚠️ NEVER** run `glab mr view` or `glab mr diff` without `> file` redirect or `| head -N` pipe in the same command — glab opens a pager (alternate buffer) that hangs the terminal.
- **Why `glab mr view` fails**: `glab mr view` always opens a pager when stdout is a TTY, regardless of env vars. Use `mcp_gitlab_glab_api` instead for MR metadata.
- When a review spans multiple perspectives, invoke parallel subagents.
- Prefer non-interactive CLI usage and deterministic commands.
- **Posting Comments (multi-line)**: Write review to a temp file first, then post:
  ```bash
  cat > /tmp/mr_review.md << 'EOF'
  Your review content here
  EOF
  NO_COLOR=1 GIT_PAGER=cat glab mr note 280 -R https://gitlab.com/group/repo --message "$(cat /tmp/mr_review.md)"
  ```
- **Posting Comments (single-line)**: `NO_COLOR=1 GIT_PAGER=cat glab mr note 280 -R https://... --message "Sua mensagem aqui"`

## Command Reference

See the full command reference at [references/commands.md](references/commands.md).

## Specific MyProject Workflows

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
    "gitlab-internal": {
      "type": "stdio",
      "command": "glab",
      "args": ["mcp", "serve"],
      "env": {
        "GITLAB_TOKEN": "${input:GITLAB_TOKEN}",
        "GITLAB_HOST": "https://gitlab.com/"
      },
      "gallery": true
    }
  }
}
```
