# Vite Framework Patterns and Configuration

Common implementation recipes for various frameworks and environments.

## 1. Framework Setup
- **React:** `@vitejs/plugin-react-swc`.
- **Vue:** `@vitejs/plugin-vue`.
- **Svelte:** `@vitejs/vite-plugin-svelte`.

## 2. Environment Variables
- **File:** `.env`, `.env.local`.
- **Prefix:** `VITE_` (e.g., `VITE_API_URL`).
- **Access:** `import.meta.env.VITE_API_URL`.

## 3. Dev Server Optimization
- **Proxy:** Configure `server.proxy` to avoid CORS in development.
- **Alias:** Use `resolve.alias` for clean imports (e.g., `@/` -> `src/`).

## 4. Asset Handling
- **Raw:** `import data from './data?raw'`.
- **URL:** `import url from './icon?url'`.
