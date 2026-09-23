# Node.js Operations and Troubleshooting

Common tasks and resolution steps for Node.js projects.

## 1. Common Tasks
- **Install:** `pnpm install` or `npm ci`.
- **Add Package:** `pnpm add <pkg>` or `npm install <pkg>`.
- **Test:** `pnpm test` or `npm test`.
- **Migration (npm → pnpm):**
  1. `pnpm import`
  2. `rm package-lock.json`
  3. `rm -rf node_modules`
  4. `pnpm install`

## 2. Troubleshooting
- **EACCES:** Use `nvm` or `volta` instead of `sudo`.
- **Phantom Dependencies:** `pnpm` prevents dependency hoisting; verify all imports are explicitly listed in `package.json`.
- **Certs:** Configure `cafile` in `.npmrc` if working behind corporate proxies.

## 3. Dependency Checklist
Refer to `assets/FORMS.md` for evaluating new dependencies (Security and Licensing).
