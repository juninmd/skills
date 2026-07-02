---
name: setup-diagnose
description: "Consolidated skill for stack setup and governance: diagnose, update, install, add, remove, and replace tools with validation."
argument-hint: "[action] [profile/tool] [options]"
---

# Environment Setup

Self-sufficient skill for environment setup, focusing on CLI diagnosis, installation, and updating.

## Supported Actions

- `diagnose`: see what we have, current version, expected version, and if it is installed.
- `install`: install what is missing.
- `update`: update what already exists.

## CLI Diagnosis Matrix

Use the commands below literally to detect installation and version. Do not use generic placeholders.

| CLI | Diagnosis Command | Reference Version | Installation |
|---|---|---|---|
| `git` | `git --version` | `>= 2.39` | https://git-scm.com/downloads |
| `node` | `node --version` | `>= 20` | https://nodejs.org/en/download |
| `npm` | `npm --version` | `>= 10` | https://docs.npmjs.com/downloading-and-installing-node-js-and-npm |
| `pnpm` | `pnpm --version` | `>= 10` | https://pnpm.io/installation |
| `python3` | `python3 --version` | `>= 3.11` | https://www.python.org/downloads/ |
| `pip3` | `pip3 --version` | compatible with active Python | https://pip.pypa.io/en/stable/installation/ |
| `uv` | `uv --version` | latest stable | https://docs.astral.sh/uv/getting-started/installation/ |
| `docker` | `docker --version` | `>= 24` | https://docs.docker.com/engine/install/ |
| `kubectl` | `kubectl version --client --output=yaml` | `>= 1.30` | https://kubernetes.io/docs/tasks/tools/ |
| `helm` | `helm version` | `>= 3.15` | https://helm.sh/docs/intro/install/ |
| `glab` | `glab --version` | `>= 1.86` | https://gitlab.com/gitlab-org/cli/-/releases |
| `code` | `code --version` | latest stable | https://code.visualstudio.com/download |
| `copilot` | `copilot --version` | latest stable | https://docs.github.com/en/copilot/how-tos/use-copilot-cli |
| `claude` | `claude --version` | latest stable | https://docs.anthropic.com/en/docs/claude-code/quickstart |
| `gemini` | `gemini --version` | latest stable | https://github.com/google-gemini/gemini-cli |
| `mise` | `mise --version` | latest stable | https://mise.jdx.dev/getting-started.html |

## Input

- Action (`diagnose`, `install`, `update`).
- Developer profile (`frontend`, `backend`, `fullstack`, `qa`, `po`) when applicable.
- Operating system detected with `uname -s`.

## General Flow

1. **Mandatory diagnosis**

   Always run `diagnose` before `update` or `install`.

2. **Load correct context**

   Use `profiles/<profile>.md` to decide which CLIs are mandatory, recommended, and optional.

3. **Execute one action at a time**

   Complete and validate an action before starting the next.

4. **Final validation**

   After any change to files, run lint/build on the repository.

## Action `diagnose`

1. Load the profile.
2. Detect OS with `uname -s`.
3. Execute the commands from the CLI Diagnosis Matrix for each tool applicable to the profile.
4. Generate status table with installed version and reference version.

### Expected table

| Tool | Level | Status | Installed version | Expected min version |
|------------|-------|--------|------------------|----------------------|
| git | mandatory | ✅ ok | 2.44.0 | 2.39.0 |
| node | mandatory | ⚠️ outdated | v18.20.0 | v20 |
| docker | mandatory | ❌ missing | — | 24.0.0 |

Possible statuses:
- `✅ ok`
- `⚠️ outdated`
- `❌ missing`

## Action `update`

1. Filter `⚠️ outdated` items.
2. For each tool, use the official installation link from the matrix to apply the update on the current OS.
3. Re-run the tool's diagnosis command and confirm the target version.
4. On failure, show full command and error, without omitting output.

## Action `install`

1. Create queue of `❌ missing` (mandatory/recommended).
2. Install missing using the official link from the matrix and validate each CLI with its diagnosis command.
3. Do not install optionals without request.

## Failure Handling

- Show exactly the command and returned error.
- Suggest consulting the official tool link in the CLI Diagnosis Matrix.
- Do not repeat silent attempt.
- On destructive action, always ask for explicit confirmation.

## Output

- For `diagnose`: table report without system changes.
- For `update`/`install`: summary of what was updated/installed/skipped/failed.

