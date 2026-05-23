# tsdown Build Options and Dependencies

Detailed guidelines for configuring entries, formats, and external dependencies.

## 1. Entry and Output
- **Entries:** Support single file, glob patterns, or mapped objects.
- **Formats:** `esm`, `cjs`, `iife`, `umd`. ESM is the primary standard.
- **Type Declarations:** Set `dts: true` for all TypeScript libraries.
- **Minification:** Set `minify: true` for production to reduce bundle size.

## 2. Dependency Management
- **Never Bundle:** Externalize stable libraries: `deps: { neverBundle: ['react', 'lodash'] }`.
- **Skip node_modules:** Set `skipNodeModulesBundle: true` to externalize all third-party code.
- **Auto External:** tsdown automatically externalizes peer dependencies.

## 3. Advanced Output
- **Shims:** Use `shims: true` to add ESM/CJS compatibility helpers (`__dirname`).
- **Exports:** Use `exports: true` to auto-generate the `exports` field in `package.json`.
- **Unbundle:** Use `unbundle: true` to preserve the directory structure for utilities.
