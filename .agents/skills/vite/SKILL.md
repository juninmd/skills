---
name: vite
description: "Rspack, SWC plugin, environment utils. Triggers: rspack."
argument-hint: "[context] [options]"
---

# Vite + Tailwind CSS

> Vite 8 (Rolldown) + Tailwind CSS v4
>
> Verified against Vite 8.0.10 official docs and npm registry on 2026-05-01.

## Tailwind CSS v4

v4 uses **CSS-first configuration** — no `tailwind.config.js`.

### Quick Setup with Vite

```bash
npm install tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

### CSS Config

```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
}

:root {
  --color-brand: oklch(70% 0.2 250);
}
```

### Theme via CSS Variables

```css
/* Define custom values */
@theme {
  --spacing-128: 32rem;
  --font-display: 'Geist', sans-serif;
}
```

### Color Functions

```css
/* OKLCH for perceptual color harmony */
bg-primary: oklch(70% 0.15 250 / 80%);
text-accent: oklch(65% 0.25 30);
```

### Arbitrary Values

```css
/* v4 uses [] for arbitrary */
class="h-[calc(100vh-4rem)]"
class="bg-[#1a1a2e]"
class="grid-cols-[1fr,2fr,1fr]"
```

### Dark Mode

```css
@media (dark) {
  :root { --bg: #0a0a0a; }
}
```

## Vite CLI

| Command | Purpose |
|---------|---------|
| `vite` | Dev server (native ESM) |
| `vite build` | Production build (Rolldown) |
| `vite preview` | Preview production build |
| `vite build --ssr` | SSR build |

## Vite 8 Changes

| Vite 7 | Vite 8 |
|--------|--------|
| `rollupOptions` | `rolldownOptions` |
| `esbuild` | `oxc` |

```ts
export default defineConfig({
  build: {
    rolldownOptions: { external: ['vue'] }
  },
  oxc: {
    jsx: { runtime: 'automatic' }
  }
})
```

## Framework Setup

### React + SWC

```ts
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
})
```

### Vue

```ts
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

### Svelte

```ts
import svelte from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
})
```

## Common Patterns

### Environment Variables

```bash
VITE_API_URL=https://api.example.com
```

```ts
const apiUrl = import.meta.env.VITE_API_URL
```

### Asset Imports

```ts
import raw from './data?raw'
import url from './icon?url'
```

### Proxy (Dev)

```ts
export default defineConfig({
  server: {
    proxy: { '/api': 'http://localhost:3000' }
  }
})
```

## Performance

- **Dev**: Sub-ms HMR, native ESM
- **Build**: Rolldown (Rust) 10-30x faster than Rollup
- **CSS**: Tailwind v4 with `@tailwindcss/vite` (zero config)

## UnoCSS

For custom atomic CSS, UnoCSS is a superset of Tailwind. Use `presetWind4()` for Tailwind v4 compatibility.

## References

- [Tailwind v4 Docs](https://tailwindcss.com/docs/upgrade-guide)
- [Vite 8 Rolldown](https://vite.dev/guide/migration.html)
- [UnoCSS Preset Wind4](https://unocss.dev/presets/wind4)


## Checklist

- [ ] Confirm whether the project uses plain Vite, a framework plugin, or a monorepo wrapper before editing config.
- [ ] Keep build target, plugin order, and CSS pipeline changes explicit and minimal.
- [ ] Re-run the narrowest dev, build, or preview command that exercises the touched config.