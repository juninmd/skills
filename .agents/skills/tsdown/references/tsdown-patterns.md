# tsdown Framework Patterns and Recipes

Implementation examples for common library scenarios.

## 1. Basic Library Bundle
```ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
})
```

## 2. React Component Library
```ts
export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm'],
  deps: { neverBundle: ['react', 'react-dom'] },
  inputOptions: { jsx: { runtime: 'automatic' } },
})
```

## 3. Standalone Executable (exe)
Use `@tsdown/exe` for cross-platform binaries:
```ts
export default defineConfig({
  entry: ['src/cli.ts'],
  exe: { targets: [{ platform: 'win', arch: 'x64' }] }
})
```

## 4. Framework Support
- **Vue:** SFC support via `@tsdown/vue`.
- **Solid:** JSX transform support.
- **WASM:** Integration via `rolldown-plugin-wasm`.
