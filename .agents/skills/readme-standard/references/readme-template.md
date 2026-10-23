# README Template

## Contents
- [Section order](#section-order)
- [Template](#template)
- [Audit an existing README](#audit-an-existing-readme)

Open this file when writing a README from scratch or auditing one. Copy the template, delete the sections the project cannot fill truthfully, and keep the order.

## Section order

| # | Section | Required | Answers |
|---|---|---|---|
| 1 | Centered header | always | What is this, at a glance? |
| 2 | Highlights | always | Why should I care? Three to five bullets, each a capability, not an adjective |
| 3 | Screenshots or Demo | UI projects | What does it look like? |
| 4 | Quick Start | always | How do I run it in under five minutes? |
| 5 | Usage | always | What does a real task look like? |
| 6 | Configuration | when env vars or config files exist | What can I change? |
| 7 | Architecture | when more than one component | How do the parts connect? One diagram |
| 8 | Development | always | How do I build, test, and lint? |
| 9 | Roadmap | only when maintained | What is next? Link the tracker instead of a stale list |
| 10 | Contributing | always | How do I help? Link CONTRIBUTING.md when it exists |
| 11 | License | always | Under what terms? |
| 12 | Acknowledgments | when material is imported | Who else made this? |

## Template

````markdown
<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/readme-header-dark.svg" />
  <img src=".github/assets/readme-header.svg" alt="ProjectName: a browser window showing the dashboard with live charts" width="100%" />
</picture>

# ProjectName

**One sentence: what it does and for whom.**

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

[Highlights](#highlights) · [Screenshots](#screenshots) · [Quick Start](#quick-start) · [Usage](#usage) · [Contributing](#contributing)

</div>

---

## Highlights

- **Capability one**: the outcome it gives the reader, in one line.
- **Capability two**: one line.
- **Capability three**: one line.

## Screenshots

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/screenshots/home-dark.png" />
  <img src=".github/assets/screenshots/home-light.png" alt="Home screen listing three projects with status chips" width="90%" />
</picture>

| Feature A | Feature B |
|---|---|
| <img src=".github/assets/screenshots/feature-a.png" alt="Editor with a validation error highlighted" width="100%" /> | <img src=".github/assets/screenshots/feature-b.png" alt="Settings page with the theme toggle" width="100%" /> |

<img src=".github/assets/demo.gif" alt="Creating a project, editing it, and exporting the result" width="90%" />

</div>

## Quick Start

**Prerequisites:** Node.js 20+, pnpm 10+.

```bash
git clone https://github.com/OWNER/REPO.git
cd REPO
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Usage

```bash
pnpm cli export --format pdf ./examples/report.json
```

Expected output, shortened:

```text
Exported 1 file to ./out/report.pdf
```

## Configuration

| Variable | Purpose | Required / default | Example |
|---|---|---|---|
| `DATABASE_URL` | Postgres connection | required | `postgres://user:pass@localhost:5432/app` |
| `PORT` | HTTP port | `3000` | `8080` |

## Architecture

```mermaid
flowchart LR
  UI[Web UI] --> API[API] --> DB[(Postgres)]
```

## Development

```bash
pnpm test
pnpm lint
pnpm build
```

## Contributing

Read `CONTRIBUTING.md` at the repository root. Open an issue before large changes.

## License

MIT. See `LICENSE`.
````

The Screenshots section is deleted for projects without a UI. The Usage block shows a real command and its real output; an invented output is a false claim.

## Audit an existing README

Report one row per template section: present, weak (with the concrete gap), or missing. Then list header and image findings: no centered block, no hero image, generic hero image, missing alt text, absolute or external image URLs, oversized files, missing screenshots for a UI project. Fix in that priority: false claims, then broken commands and links, then missing screenshots and header, then order and style.
