---
name: readme-standard
description: |
  Create or audit a project README.md to one standard: centered header with a hero image representing the repository, badges, navigation, mandatory UI screenshots or demo GIF, fixed section order, verified commands. Trigger on 'create the README', 'padronizar o README', 'README banner', 'add screenshots to the README'.
---

# README Standard

**Not this skill:** runbooks, ADRs, guides in `docs/`, diagrams, or PDF output (`documentation`); agent instruction files such as AGENTS.md (`starting-dev`); changelogs (`git-workflow`).

The README is the repository's front page. A reader decides in ten seconds whether the project is for them and in five minutes whether it runs. Every rule below serves one of those two deadlines.

## Preflight

```bash
git status --short
ls README* LICENSE* CONTRIBUTING* .github/ docs/ 2>/dev/null
rg --files -g 'package.json' -g 'pyproject.toml' -g 'Cargo.toml' -g 'go.mod' -g '*.csproj' -g 'pubspec.yaml' -g '!node_modules' | head
rg -l --hidden -g '!node_modules' -e 'react|vue|svelte|angular|next|vite|flutter|SwiftUI|electron|tauri' package.json pubspec.yaml Package.swift 2>/dev/null
ls .github/assets docs/assets assets 2>/dev/null
```

Record: stack, real run and test commands from scripts, license, whether the project renders a UI, and which images already exist. A UI project is anything a person looks at: web app, mobile app, desktop app, TUI, CLI with formatted output, game, or rendered document.

## Workflow

1. **Establish facts.** Read the manifest scripts, entry points, CI workflow, and license. Every command in the README comes from a script that exists and was run, or carries its prerequisite.
2. **Choose the variant** from the table below. An existing README is audited first: report missing or weak sections against [the template](references/readme-template.md) and preserve hand-written content.
3. **Build the header.** One `<div align="center">` holds, in order: the project icon (96 px) or a hero banner per [hero-image.md](references/hero-image.md), the name, a bold one-sentence tagline, one concrete value line, an optional primary call-to-action badge (Download, Install) on its own line, at most six status and stack badges in one consistent shields style (`for-the-badge` or `flat-square`, shared `labelColor`, `logo=` where one exists), a `<sub>` language switcher when translations exist, and the hero image. For a UI project the hero image is the real main screen, or a short GIF of its signature interaction when motion is the point; otherwise it is the banner that shows what the project does, never a stock logo.
4. **Capture the UI.** If the project has a UI, screenshots are mandatory. Capture the real app per [screenshots.md](references/screenshots.md), ideally from a committed `screenshots` script that renders the real frontend against a mocked backend and generated data, so anyone can regenerate them. Lay out every primary feature in a two-column **Tour** table (image, bold name, `<kbd>` shortcut, one-line caption) or a zigzag Features table with alternating sides; secondary screens go in a `<details>` gallery so the page stays scannable.
5. **Draw how it works.** At least one fenced `mermaid` diagram for the main flow (request path, architecture, release or update pipeline), followed by the decisions that make it fast or safe.
6. **Write useful commands.** One annotated Develop block with every command a contributor needs (install, test, run, build, regenerate screenshots), each traced to a real script and ending with a `# comment` saying what it does. User-facing commands go in Install or Usage with their real output.
7. **Fill the remaining sections** in the template's fixed order. Delete a section that has nothing true to say rather than leaving a placeholder.
8. **Verify.** Run every Quick Start command on a clean checkout when the prerequisites allow, run the checks below, and audit prose for AI writing tells with the `documentation` skill's writing-tells reference.
9. **Report** what changed, which commands were executed, which images were captured, and what remains unverified.

## Variant by Project

| Project | Header image shows | Screenshots | Must add |
|---|---|---|---|
| Web, mobile, or desktop app | the main screen inside a device or browser frame | mandatory: hero + one per primary feature, light and dark | live demo link if one exists |
| CLI or TUI | a terminal window running the real command | mandatory: terminal capture or recorded GIF of the main command | install one-liner, `--help` summary |
| Library or SDK | the shortest real usage snippet next to its output | only if output is visual (charts, UI components) | usage example that compiles, API reference link |
| Service or API | a request and response or the architecture in one figure | not required; a dashboard screenshot if one ships | endpoints table or OpenAPI link, configuration table |
| Monorepo | the packages and how they connect | per app package, in that package's README | packages table with path, purpose, and status |
| Skill, plugin, or agent tooling | the request-to-result flow | client screenshot or terminal capture of one invocation | install per client, compatibility list |

## Header Contract

```html
<div align="center">

<img src=".github/assets/icon.svg" alt="" width="96" height="96" />

# ProjectName

**One sentence: what it is and for whom.**<br/>
One concrete line on the experience, with a measured number when one exists.

[![Release](https://img.shields.io/github/v/release/OWNER/REPO?style=for-the-badge)](https://github.com/OWNER/REPO/releases/latest)
[![Build](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/ci.yml?branch=main&style=for-the-badge&label=build)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)

<br/>

<img src=".github/assets/screenshots/home.png" alt="Main screen showing the task list with three items" width="860" />

</div>
```

Replace `OWNER/REPO` and the workflow file with real values; a badge pointing to a missing workflow is worse than no badge.

## Stop

- The project has a UI and it cannot be started here to capture it. Do not substitute mockups, generated images, or another project's screenshots. Report the blocker and leave a tracked `TODO(screenshot)` naming the screen.
- A command cannot be traced to a script, Makefile target, or documented tool. Ask or mark it unverified.
- The README would claim a feature, platform, or benchmark the code does not support.
- The hero image would need a brand asset, logo, or likeness the project does not own.

## Rules

- One README, one job: what it is, why it matters, how to run it in under five minutes. Material longer than a screen moves to `docs/` behind one link.
- The header is always centered and always has an image that represents this repository. A generic banner with only the project name does not count.
- Images live in the repository (`.github/assets/`), use relative paths, have descriptive `alt` text that states what the image shows, and stay under 1 MB each; GIFs under 5 MB.
- Screenshots come from the real running app with realistic, non-personal data. Never a real email, token, customer name, or internal URL.
- Use `<picture>` with `prefers-color-scheme` sources when the header or app has light and dark variants, so the image matches the reader's GitHub theme.
- Badges: at most six, each linked to its source, only for facts a reader uses (build status, version, license, coverage, downloads).
- Fixed section order from the template. Headings are short nouns; when one H2 carries an emoji, every H2 carries exactly one.
- Write in the language of the project's audience (a pt-BR app gets a pt-BR README); code, commands, and identifiers stay as they are. Translations live in `README.<lang>.md`, listed by native name in the header switcher; machine translations say so.
- A comparison with other tools is a sourced matrix with a legend, including the rows where the project loses.
- The README is a hub: when `docs/` exists, a Documentation table links each guide with what it contains.
- State the limits: a Known limitations section says what the project measures approximately, skips, or cannot do. Caveats a reader must act on (unsigned binaries, required secrets) go in a GitHub alert (`> [!NOTE]`, `> [!WARNING]`).
- Code blocks are copy-paste runnable and tagged with a language. Environment variables go in a table of name, purpose, required or default, and example.
- Preserve existing attribution, license notices, and hand-made corrections when restructuring.
- Do not invent a demo URL, a version number, or a metric. Omit the line instead.

## Checks

```bash
test -f .github/assets/readme-header.svg -o -f .github/assets/readme-header.png && echo header-ok
head -15 README.md | rg -q '<div align="center">' && echo centered-ok
rg -o '!\[[^\]]*\]\(([^)]+)\)|<img[^>]+src="([^"]+)"' README.md
rg -n '<img(?![^>]*alt="[^"]+")' --pcre2 README.md && echo 'missing alt text'
find .github/assets -type f -size +1M 2>/dev/null
npx --yes markdown-link-check --quiet README.md
```

## Checklist

- [ ] Header is inside `<div align="center">` with a hero image specific to this repository, title, tagline, badges, and navigation.
- [ ] Project with a UI: hero screenshot in the header and a Tour table with one captioned screenshot per primary feature, captured from the real app by a committed script when practical.
- [ ] At least one Mermaid diagram of the main flow renders on GitHub, with nodes named after real modules or files.
- [ ] Known limitations stated; install caveats in a GitHub alert.
- [ ] Develop block lists every contributor command, each traced to a script and commented.
- [ ] Sections follow the template order; empty sections deleted, not stubbed.
- [ ] Every command traced to a script and executed, or its prerequisite and limitation stated.
- [ ] Every image has descriptive alt text, a relative path, and fits the size limits.
- [ ] Link check passes; badges point to workflows and files that exist.
- [ ] No secrets, personal data, invented metrics, or claims the code does not support.
