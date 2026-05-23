---
name: vitepress
description: |
  **SSG SKILL** - Build documentation and marketing sites with VitePress.
  USE FOR: static site generation (SSG), Markdown documentation, Vue in Markdown, theming, i18n, VitePress builds.
  DO NOT USE FOR: dynamic web apps (use nextjs-dev), non-Vue frameworks.
  INVOKES: vitepress cli, vue 3, markdown.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Vite, Vue 3, Node.js"
allowed-tools: [run_shell_command, read_file, write_file, replace]
---

# VitePress Documentation Guide

Expert guide for building static sites and documentation using VitePress.

**USE FOR:**
- Generating fast documentation from Markdown.
- Customizing site navigation and sidebars.
- Integrating Vue components in Markdown.
- Managing multi-language (i18n) sites.
- Implementing build-time data loaders.

**INVOKES:**
- `vitepress dev`, `vitepress build`.

## Methodology
Implementation details are in:
1. [Core & Features](references/vitepress-core.md) | [Theming](references/vitepress-features.md)
2. [Complete Topic Map](references/TOPIC_MAP.md)

## Core Principles
1. **Markdown First:** Keep Markdown clean and semantic.
2. **Performance:** Utilize Vite HMR and pre-rendering.
3. **Consistency:** Uniform navigation across locales.

## Checklist
- [ ] Inspect `.vitepress/config.ts` before changes.
- [ ] Ensure custom Vue components handle SSR.
- [ ] Validate search and navigation after theme edits.
- [ ] Verify build stability with `vitepress build`.
