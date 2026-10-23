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
| 1 | Centered header | always | What is this, at a glance? Icon or banner, name, tagline, value line, primary call-to-action badge, status badges, language switcher, hero image or signature GIF |
| 1a | Pitch | always | One blockquote paragraph right below the header: what it does, the one shortcut or command to start, the key promise |
| 2 | Why ProjectName | always | Why should I care? Scope sentence, then three to five bold benefits; beside a tour GIF for UI apps |
| 3 | Tour | UI projects | What does it look like? Two-column screenshot grid with captions |
| 4 | Install or Quick Start | always | How do I get it running in under five minutes? Per-OS artifact table for desktop apps, caveats in an alert |
| 5 | Usage | always | What does a real task look like, with real output? |
| 6 | Features | when the Highlights do not cover it | What exactly can it do? Zigzag table (screenshot and an H3 per feature, sides alternating), a two-column table (emoji + bold name, description), or one bullet per feature; extra screens in `<details>` |
| 6a | Compared to alternatives | when the project competes with known tools | Why this over X? Feature matrix with a legend, a link to the sourced benchmark, and what was borrowed |
| 7 | Shortcuts | apps with keyboard or mouse input | Which keys do what? Table |
| 8 | How it works | always, at least one Mermaid diagram | How do the parts connect, and why is it fast or safe? Nodes named after real modules |
| 9 | Configuration | when env vars or config files exist | What can I change? Table |
| 10 | Develop | always | Annotated command block: install, test, run, build, regenerate screenshots; release flow (commit-to-version table, pipeline diagram, required secrets) when releases are automated |
| 11 | Contributing | always | Commit convention and where the rules live |
| 11a | Documentation | when `docs/` exists | Where is the depth? Table of emoji + linked document + what is in it |
| 12 | Security | when it handles files, network, credentials, or updates | Which boundaries protect the user? |
| 13 | Known limitations | always | What does it approximate, skip, or not do? |
| 14 | Inspirations | when prior art shaped the design | Which projects informed it, and what was learned from each? Dated table |
| 15 | License | always | Under what terms, and whose copyright? Optionally a centered `<sub>` footer line |

## Template

````markdown
<div align="center">

<img src=".github/assets/icon.svg" alt="" width="96" height="96" />

# ProjectName

**One sentence: what it is and for whom.**<br/>
One concrete line on the experience: what happens, how fast, what it handles.

[![Download](https://img.shields.io/badge/Download-Windows%20%C2%B7%20macOS%20%C2%B7%20Linux-4ade80?style=for-the-badge&labelColor=0f172a)](https://github.com/OWNER/REPO/releases/latest)

[![Build](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/ci.yml?branch=main&style=for-the-badge&label=build)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/OWNER/REPO?style=for-the-badge)](#license)
![Stack](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge)

<sub>**English** · <a href="README.pt-BR.md">Português</a> · <a href="README.es.md">Español</a></sub>

<br/>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/screenshots/home-dark.png" />
  <img src=".github/assets/screenshots/home-light.png" alt="ProjectName main screen with three projects and their status" width="860" />
</picture>

</div>

> **What it does, in one sentence a user would say.** Opens with `Ctrl+Alt+Space`, the promise that matters most
> (no account, works offline, encrypted), in at most three lines.

## Why ProjectName

<table>
<tr>
<td width="44%" align="center"><img src=".github/assets/tour.gif" alt="Tour through the main tabs and the alert" width="300" /></td>
<td>

Scope is deliberately small: **the one job**. No X, no Y.

🔒 **Private.** The measured or verifiable claim behind it, in one or two lines.

🪶 **Light.** A number: installer size, memory, startup time. <a href="docs/benchmark.md">Measured numbers</a>.

</td>
</tr>
</table>

## Tour

<table>
<tr>
<td width="50%"><img src=".github/assets/screenshots/editor.png" alt="Editor with a validation error highlighted" /><br/><b>Editor</b> (<kbd>E</kbd>) &ndash; what the reader sees and why it matters.</td>
<td width="50%"><img src=".github/assets/screenshots/settings.png" alt="Settings panel with the theme toggle" /><br/><b>Settings</b> &ndash; one line.</td>
</tr>
</table>

## Features

<table>
<tr>
<td width="36%"><img src=".github/assets/screenshots/tasks.png" alt="Today's tasks with time and recurrence" /></td>
<td>

### ✅ Feature as a benefit

Two to four lines on what it does for the reader, with the shortcut.

</td>
</tr>
<tr>
<td>

### 📅 Next feature, image on the other side

Two to four lines.

</td>
<td width="36%"><img src=".github/assets/screenshots/agenda.png" alt="Agenda with the next meeting and its countdown" /></td>
</tr>
</table>

<details>
<summary>🖥️ More screens: onboarding, search, settings</summary>

| Onboarding | Search (`Ctrl+K`) |
|---|---|
| <img src=".github/assets/screenshots/onboarding.png" alt="First-run welcome with the essential shortcuts" /> | <img src=".github/assets/screenshots/search.png" alt="Search across every tab at once" /> |

</details>

<sub>All screenshots use fictitious data.</sub>

## Compared to alternatives

| | Feature A | Feature B | Local-first |
|---|:-:|:-:|:-:|
| **ProjectName** | ✅ | ✅ | ✅ |
| OtherTool | ✅ | ➖ | — |

<sub>✅ native · ➖ partial or via extension · — none. Sources in <a href="docs/benchmark.md">docs/benchmark.md</a>.</sub>

## Install

Download the installer from the [latest release](https://github.com/OWNER/REPO/releases/latest):

| System | File |
|---|---|
| Windows 10/11 | `ProjectName_x.y.z_x64-setup.exe` |
| macOS Apple Silicon | `ProjectName_x.y.z_aarch64.dmg` |
| Linux | `.AppImage` or `.deb` |

> [!NOTE]
> Binaries are not code-signed yet. On Windows choose **More info → Run anyway**; on macOS right-click → **Open** the first time.

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

## Documentation

| Document | What's in it |
|---|---|
| 📖 <a href="docs/usage.md">User guide</a> | every screen, shortcut, and setting |
| 🛡️ <a href="docs/security.md">Security</a> | threat model, files on disk, backup |

## Security

| Layer | Protection |
|---|---|
| Storage | the real algorithm and parameters |
| Network | which process talks to the network and what the UI can reach |

Full model in `docs/security.md`; report flaws via `SECURITY.md`.

## Known limitations

- One bullet per real limit: what is approximated, skipped, or out of scope, and why.

## Inspirations

| Project | What we learned |
|---|---|
| ExampleTool | the idea taken from it, in one line |

## License

MIT © OWNER. See `LICENSE`.

<div align="center"><sub>Made with the stack and for whom, in one line.</sub></div>
````

## Writing each section

| Section | Do | Avoid |
|---|---|---|
| Header value line | a measured, specific claim ("about 100 ms to first pixels") | adjectives with no number ("blazing fast") |
| Badges | one shields style throughout, dynamic ones first (release, build, downloads), then platforms and stack | mixed styles, more than six, or badges for workflows that do not exist |
| Why | a scope sentence that says what the project refuses to do | a feature list repeated from Features |
| Tour | real screenshots, bold feature name, `<kbd>` shortcut, one-line caption | screenshots without captions, mockups |
| How it works | one Mermaid `flowchart` or `sequenceDiagram` for the main flow; bullets for the decisions behind it | a diagram of every class |
| Develop | every command from a real script, each with a trailing comment | commands nobody ran |
| Tour captions | a `<sub>` line saying how the screenshots were made (demo fixture, mocked backend) | real user data, unexplained sample content |
| Known limitations | concrete limits with the reason ("sizes are apparent, not allocated") | an empty section or a promise to fix later |
| Inspirations | linked projects, the date of the survey, one learned idea each | a bare list of names |
| Comparison | a matrix with a legend, linked sources, and honest partial marks | unsourced wins, or rows only where the project wins |
| Translations | one README per language, native names in the switcher, machine translations disclosed | a translated README that drifts from the original without a note |
| Length | each section about one screen; overflow galleries in `<details>`, depth in `docs/` behind the Documentation table | a README that only scrolls |

GitHub renders fenced `mermaid` natively; keep each diagram under about 15 nodes so it stays legible on a phone. A pipeline that has a single path (release, update, deploy) also reads well as a numbered list after the diagram.

## Audit an existing README

Report one row per template section: present, weak (with the concrete gap), or missing. Then list header and image findings: no centered block, no icon or hero image, generic hero image, missing alt text, absolute or external image URLs, oversized files, missing screenshots or Tour for a UI project, no Mermaid diagram. Fix in that priority: false claims, then broken commands and links, then missing screenshots and header, then diagrams, order, and style.
