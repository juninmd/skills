---
name: vite
description: "Vite + Tailwind CSS for Configuring dev, Implementing zero-config, Managing environment via vite."
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Browser, Node.js"
allowed-tools: [run_shell_command, read_file, write_file, replace]
---

# Vite + Tailwind CSS

Expert guide for building web apps using Vite 8 (Rolldown/Oxc) and Tailwind CSS v4.

**USE FOR:**
- Configuring dev servers with sub-ms HMR.
- Implementing zero-config CSS with `@tailwindcss/vite`.
- Managing environment variables and API proxies.
- Optimizing builds with Rolldown options.
- Integrating React, Vue, or Svelte plugins.

**INVOKES:**
- `vite`, `vite build`, `vite preview`.

## Methodology
Implementation details are in:
1. [Core & CLI](references/vite-core.md) | [Tailwind v4](references/vite-tailwind-v4.md)
2. [Framework Patterns](references/vite-patterns.md)

## Core Principles
1. **Speed:** Use Rust-native tools to minimize feedback loops.
2. **CSS-First:** Use `@theme` blocks; no `tailwind.config.js`.
3. **Explicit:** Keep plugin orders and targets clear.

## Checklist
- [ ] Confirm framework plugin before editing `vite.config.ts`.
- [ ] Verify Tailwind v4 imports in the CSS entry.
- [ ] Test HMR after changing bundler options.
- [ ] Validate env variable access via `import.meta.env`.
