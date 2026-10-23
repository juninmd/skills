# README Template

## Contents
- [Section order](#section-order)
- [Template](#template)
- [Writing each section](#writing-each-section)
- [Audit an existing README](#audit-an-existing-readme)

Open this file when writing a README from scratch or auditing one. Copy the template, delete the sections the project cannot fill truthfully, and keep the order.

## Section order

| # | Section | Required | Answers |
|---|---|---|---|
| 1 | Centered header | always | What is this, at a glance? Icon or banner, name, tagline, value line, badges, hero image |
| 2 | Why ProjectName | always | Why should I care? Scope sentence, then three to five bold one-word benefits |
| 3 | Tour | UI projects | What does it look like? Two-column screenshot grid with captions |
| 4 | Install or Quick Start | always | How do I get it running in under five minutes? |
| 5 | Usage | always | What does a real task look like, with real output? |
| 6 | Features | when the Highlights do not cover it | What exactly can it do? One bullet per feature, bold name first |
| 7 | Shortcuts | apps with keyboard or mouse input | Which keys do what? Table |
| 8 | How it works | always, at least one Mermaid diagram | How do the parts connect, and why is it fast or safe? |
| 9 | Configuration | when env vars or config files exist | What can I change? Table |
| 10 | Develop | always | Annotated command block: install, test, run, build, regenerate screenshots |
| 11 | Contributing | always | Commit convention and where the rules live |
| 12 | Security | when it handles files, network, credentials, or updates | Which boundaries protect the user? |
| 13 | License | always | Under what terms? |

## Template

````markdown
<div align="center">

<img src=".github/assets/icon.svg" alt="" width="96" height="96" />

# ProjectName

**One sentence: what it is and for whom.**<br/>
One concrete line on the experience: what happens, how fast, what it handles.

[![Release](https://img.shields.io/github/v/release/OWNER/REPO?style=for-the-badge&color=4da3ff)](https://github.com/OWNER/REPO/releases/latest)
[![Build](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/ci.yml?branch=main&style=for-the-badge&label=build)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/OWNER/REPO?style=for-the-badge)](#license)
![Stack](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge)

<br/>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/screenshots/home-dark.png" />
  <img src=".github/assets/screenshots/home-light.png" alt="ProjectName main screen with three projects and their status" width="860" />
</picture>

</div>

---

## Why ProjectName

Scope is deliberately small: **the one job**. No X, no Y.

* **Instant.** The measured claim and how it is achieved, in one or two lines.
* **Smooth.** One line.
* **Everything opens.** One line naming the real formats or integrations.

## Tour

<table>
<tr>
<td width="50%"><img src=".github/assets/screenshots/editor.png" alt="Editor with a validation error highlighted" /><br/><b>Editor</b> (<kbd>E</kbd>) &ndash; what the reader sees and why it matters.</td>
<td width="50%"><img src=".github/assets/screenshots/settings.png" alt="Settings panel with the theme toggle" /><br/><b>Settings</b> &ndash; one line.</td>
</tr>
</table>

## Install

1. Download **`ProjectName_<version>_setup.exe`** from the [latest release](https://github.com/OWNER/REPO/releases/latest) and run it.
2. One line on first-run setup.

## Usage

```bash
app export --format pdf ./examples/report.json
```

```text
Exported 1 file to ./out/report.pdf
```

## Shortcuts

| Input | Action |
|---|---|
| `Ctrl+O` | open a file |
| `Esc` | close panels, then the window |

## How it works

```mermaid
flowchart LR
  UI[Web UI] -->|REST| API[API]
  API --> DB[(Postgres)]
  API -.->|events| Q[[Queue]] --> W[Worker]
```

* One bullet per design decision that makes it fast, safe, or reliable.

## Configuration

| Variable | Purpose | Required / default | Example |
|---|---|---|---|
| `DATABASE_URL` | Postgres connection | required | `postgres://user:pass@localhost:5432/app` |
| `PORT` | HTTP port | `3000` | `8080` |

## Develop

Requires Node 20+ and pnpm 10+.

```sh
pnpm install          # dependencies and git hooks
pnpm test             # unit tests
pnpm dev              # hot-reload dev server on http://localhost:3000
pnpm build            # production bundle in dist/
pnpm screenshots      # regenerate .github/assets/screenshots from the real UI
```

## Contributing

Commit messages follow Conventional Commits. The rules live in `AGENTS.md` or `CONTRIBUTING.md`.

## Security

* One bullet per real boundary: input validation, file scope, update verification, permissions.

## License

MIT. See `LICENSE`.
````

## Writing each section

| Section | Do | Avoid |
|---|---|---|
| Header value line | a measured, specific claim ("about 100 ms to first pixels") | adjectives with no number ("blazing fast") |
| Badges | `style=for-the-badge`, dynamic ones first (release, build, downloads), then stack | more than six, or badges for workflows that do not exist |
| Why | a scope sentence that says what the project refuses to do | a feature list repeated from Features |
| Tour | real screenshots, bold feature name, `<kbd>` shortcut, one-line caption | screenshots without captions, mockups |
| How it works | one Mermaid `flowchart` or `sequenceDiagram` for the main flow; bullets for the decisions behind it | a diagram of every class |
| Develop | every command from a real script, each with a trailing comment | commands nobody ran |

GitHub renders fenced `mermaid` natively; keep each diagram under about 15 nodes so it stays legible on a phone. A pipeline that has a single path (release, update, deploy) also reads well as a numbered list after the diagram.

## Audit an existing README

Report one row per template section: present, weak (with the concrete gap), or missing. Then list header and image findings: no centered block, no icon or hero image, generic hero image, missing alt text, absolute or external image URLs, oversized files, missing screenshots or Tour for a UI project, no Mermaid diagram. Fix in that priority: false claims, then broken commands and links, then missing screenshots and header, then diagrams, order, and style.
