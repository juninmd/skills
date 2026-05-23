# VitePress Features and Theming

Detailed guidelines for code blocks, Vue integration, and theme customization.

## 1. Code and Content
- **Syntax Highlighting:** Shiki-powered blocks with line highlights and diffs.
- **Vue in Markdown:** Use `<script setup>` and Vue components directly in `.md` files.
- **Data Loading:** Use `createContentLoader` for build-time data injection.

## 2. Theming
- **Default Theme:** Optimized for documentation; configured via `themeConfig`.
- **Navigation:** Define `nav` links and hierarchical `sidebar`.
- **Customization:** Override CSS variables or use slots in `.vitepress/theme/index.ts`.
- **Search:** Local search enabled by default; supports Algolia DocSearch.

## 3. Advanced Features
- **I18n:** Multi-language support via `locales` configuration.
- **SSR Compatibility:** Use `<ClientOnly>` for components that need browser APIs.
