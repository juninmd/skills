# VitePress Core and CLI Reference

Guidelines for configuring and operating VitePress sites.

## 1. Core Configuration
- **File:** `.vitepress/config.ts`.
- **Metadata:** Define `title`, `description`, and `base` URL.
- **Routing:** Uses file-based routing. Supports `rewrites` for custom URL mapping.

## 2. CLI Commands
- `vitepress dev`: Start development server with instant HMR.
- `vitepress build`: Generate production-ready static assets.
- `vitepress preview`: Serve the built site locally.
- `vitepress init`: Scaffold a new project interactively.

## 3. Markdown Extensions
- **Frontmatter:** YAML block at the top for page-specific config.
- **Containers:** `::: info`, `::: warning`, `::: danger`.
- **Includes:** Reuse snippets with `<!-- @include: ./file.md -->`.
