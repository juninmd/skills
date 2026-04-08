---
name: configuring-vscode-copilot
description: Configure GitHub Copilot and VS Code for AI-assisted development optimization. Creates .copilotignore files, adjusts settings.json (disables Copilot by language, subagents, etc.), and applies workspace-level optimizations.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[config/tool] [options]"
---

# Configuring VS Code + GitHub Copilot

## Description
This skill automates the configuration of GitHub Copilot and VS Code to maximize developer productivity and minimize unnecessary processing. It covers:

- Creating and maintaining `.copilotignore` to exclude files/directories from Copilot's context.
- Configuring `github.copilot.enable` per language to disable Copilot where it adds no value.
- Setting up `chat.promptFilesLocations` so custom agents and skills are discovered globally.
- Leveraging the **Subagents** feature (VS Code 1.97+) via `user-invocable` and `disable-model-invocation` frontmatter.
- Wiring `github.copilot.chat.codeGeneration.instructions` to a shared instructions file.

## Instructions

### 1. Create `.copilotignore`

`.copilotignore` follows the `.gitignore` syntax. Copilot will not read any file matched by these patterns.

**Recommended Baseline:**
```
# Secrets & credentials
.env
.env.*
**/*.pem
**/*.key
**/*.p12
**/*.pfx
secrets/
credentials/

# Build artifacts
dist/
build/
out/
.next/
.nuxt/
coverage/

# Package managers
node_modules/
.venv/
__pycache__/
*.pyc

# Large generated files
pnpm-lock.yaml
package-lock.json
yarn.lock
poetry.lock

# Binaries & media
**/*.jpg
**/*.png
**/*.gif
**/*.mp4
**/*.zip
**/*.tar.gz

# OS / IDE
.DS_Store
Thumbs.db
.idea/
```

**Placement Rules:**
- **Global (user level):** `~/.copilotignore` — applies to all projects on the machine.
- **Project level:** `./.copilotignore` in the repo root — committed along with `.gitignore`.
- Both files are merged at runtime; project rules take precedence.

### 2. Configure `github.copilot.enable` per language

Add to `~/.config/Code/User/settings.json` (Linux/macOS) or `%APPDATA%\Code\User\settings.json` (Windows):

```json
"github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": false,
    "scminput": false,
    "yaml": false,
    "json": false,
    "jsonc": false,
    "dotenv": false,
    "ignore": false,
    "properties": false
}
```

> **Why disable markdown/plaintext?** Copilot consumes tokens with every keystroke in text files. In commit messages (`scminput`), it can autocomplete with the wrong intent.

### 3. Configure global instructions

```json
"github.copilot.chat.codeGeneration.instructions": [
    { "file": "~/.agents/copilot-instructions.md" }
]
```

### 4. Discover skills and agents as prompt files

```json
"chat.promptFilesLocations": {
    "~/.agents/skills": true,
    "~/.agents/agents": true
}
```

### 5. Subagents Configuration (VS Code 1.97+)

Custom agents (`.prompt.md` / `.chatparticipant`) support two new properties in the frontmatter:

| Property | Default | Purpose |
|---|---|---|
| `user-invocable` | `true` | Show in chat agents dropdown |
| `disable-model-invocation` | `false` | Prevent other agents from using this as a subagent |

**Exclusive agent for workers (invisible in dropdown):**
```yaml
---
name: internal-researcher
user-invocable: false
tools: ['read', 'search']
---
```

**Coordinator restricting which subagents it can call:**
```yaml
---
name: Feature Builder
tools: ['agent', 'edit', 'search', 'read']
agents: ['Planner', 'Implementer', 'Reviewer']
---
```

**Multi-perspective parallel review pattern:**
```yaml
---
name: Thorough Reviewer
tools: ['agent', 'read', 'search']
---
Execute these subagents in parallel: fix, security, and architecture.
Synthesize into a prioritized report.
```

### 6. Full recommended snippet for settings.json

```json
{
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": false,
    "scminput": false,
    "yaml": false,
    "json": false,
    "jsonc": false,
    "dotenv": false,
    "properties": false
  },
  "github.copilot.chat.codeGeneration.instructions": [
    { "file": "~/.agents/copilot-instructions.md" }
  ],
  "chat.promptFilesLocations": {
    "~/.agents/skills": true,
    "~/.agents/agents": true
  }
}
```

## Best Practices

- **Commit `.copilotignore` to version control** — ensures everyone on the team shares the same exclusions.
- **Never put secrets in files Copilot can read** — even if not committed, Copilot reads from disk.
- **Keep `user-invocable: false` for internal helper agents** — keeps the chat dropdown clean.
- **Use `agents: []` to prevent any subagent delegation** for security or cost-critical agents.
- **Run `padrao-labs install --tool copilot`** after changes to automatically regenerate global settings.
- **Re-run after VS Code updates** — new versions may add new settings keys that need opt-in.

## Validation

```bash
# Check that .copilotignore is being loaded
code --list-extensions | grep copilot

# Validate settings.json syntax
cat ~/.config/Code/User/settings.json | python3 -m json.tool > /dev/null && echo "✅ Valid JSON"

# Verify copilotignore exists and has content
cat ~/.copilotignore 2>/dev/null || cat .copilotignore 2>/dev/null
```
