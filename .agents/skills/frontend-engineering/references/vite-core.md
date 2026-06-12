# Vite 8 Core and CLI Reference

Guidelines for leveraging Vite 8 (Rolldown) features and commands.

## 1. CLI Commands
- `vite`: Dev server (native ESM).
- `vite build`: Production build (powered by Rolldown).
- `vite preview`: Preview the production build locally.
- `vite build --ssr`: Generate a Server-Side Rendering build.

## 2. Vite 8 Migration (Vite 7 vs 8)
- **Bundler:** Replaces Rollup with **Rolldown** (Rust-based).
- **Compiler:** Replaces esbuild with **Oxc** for faster transformations.
- **Config:** Use `rolldownOptions` instead of `rollupOptions`.

## 3. Performance
- **HMR:** Native ESM ensures sub-millisecond Hot Module Replacement.
- **Build Speed:** Rolldown is 10-30x faster than traditional Rollup builds.
- **Transpilation:** Oxc provides near-instant TypeScript/JSX processing.
