# pnpm Standards: Governance, CI/CD, Migration, Performance

Policy and operational guidance. Feature and configuration syntax lives in
[pnpm-features.md](pnpm-features.md).

## 1. Dependency Governance

- Commit `pnpm-lock.yaml`; a lockfile change belongs in the same commit as the
  `package.json` change that caused it, and never lands on its own.
- Remove unused dependencies in the commit that makes them unused.
- Install only from official or trusted sources; prefer the standard library over a
  package for trivial logic.
- Run `pnpm audit` before merging and patch critical findings; automate upgrades with
  Renovate or Dependabot.
- Keep strict mode on. `shamefully-hoist` and `node-linker=hoisted` re-enable phantom
  dependencies and are a last resort for a tool that cannot follow symlinks.
- Pin the package manager with `"packageManager": "pnpm@<version>"` so local and CI
  runs agree.

## 2. CI/CD

Always `pnpm install --frozen-lockfile` in CI: it fails instead of silently rewriting
the lockfile, and it skips resolution entirely.

```yaml
# GitHub Actions
- uses: actions/checkout@v4
- uses: pnpm/action-setup@v4
  with: { version: 9 }
- uses: actions/setup-node@v4
  with: { node-version: 20, cache: 'pnpm' }
- run: pnpm install --frozen-lockfile
- run: pnpm test
```

For large repos cache the store explicitly:

```yaml
- name: Get pnpm store directory
  shell: bash
  run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV
- uses: actions/cache@v4
  with:
    path: ${{ env.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: ${{ runner.os }}-pnpm-store-
```

On other CI systems, enable Corepack (`corepack enable`) and point the store at a
cached directory (`pnpm config set store-dir .pnpm-store`).

In a monorepo, scope the work to what changed:

```bash
pnpm --filter "...[origin/main]" build
pnpm --filter "...[origin/main]" test
```

## 3. Docker

Copy the manifests before the source so the install layer stays cached, and install
with a frozen lockfile in a builder stage:

```dockerfile
FROM node:20-slim AS builder
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-slim AS runner
RUN corepack enable
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
CMD ["node", "dist/index.js"]
```

Use a BuildKit cache mount for the store to avoid re-downloading between builds. In a
monorepo, build a single package with `pnpm --filter @myorg/api build`.

## 4. Migration from npm or Yarn

1. `pnpm import` converts `package-lock.json`, `yarn.lock`, or `npm-shrinkwrap.json`
   into `pnpm-lock.yaml`; then delete the old lockfile and `node_modules`.
2. For a monorepo, write `pnpm-workspace.yaml` mirroring the old `workspaces` field and
   rewrite internal ranges (`"@myorg/utils": "*"`) to `workspace:^`.
3. Replace Lerna commands: `lerna run build` → `pnpm -r run build`,
   `lerna run build --scope=X` → `pnpm --filter X run build`, `lerna publish` →
   Changesets plus `pnpm publish -r`.
4. Update scripts: `npm run build --workspaces` → `pnpm -r run build`;
   `npm run dev -w packages/app` → `pnpm --filter @myorg/app run dev`.
5. Update CI: `npm ci` → `pnpm/action-setup` plus `pnpm install --frozen-lockfile`.

Expected breakage, in order of likelihood:

- **Phantom dependencies.** Code imports a package that only resolved through npm's
  hoisting. The fix is to declare it, not to hoist.
- **Peer dependency warnings.** Keep `auto-install-peers`, or scope the noise with
  `peerDependencyRules` — do not silence everything.
- **Tools that cannot follow symlinks.** Prefer `public-hoist-pattern[]` for the
  specific offender before falling back to `node-linker=hoisted`.
- **Native modules.** `pnpm rebuild`, or a clean reinstall.

For a large team, migrate gradually: adopt pnpm in CI first, commit the imported
lockfile, verify builds, update the docs, and remove the old lockfile last. Rollback is
deleting `pnpm-lock.yaml` and `node_modules` and reinstalling with the previous manager.

## 5. Performance

- `--frozen-lockfile` skips resolution; `--prefer-offline` reuses the local cache.
- `side-effects-cache=true` caches native build output across installs.
- Limit build scripts with `onlyBuiltDependencies` / `neverBuiltDependencies` instead of
  a blanket `--ignore-scripts`, which breaks packages that need a postinstall.
- Share one store across projects (the default) and run `pnpm store prune` periodically;
  `pnpm store status` checks integrity.
- Tune `network-concurrency`, `fetch-retries`, and `workspace-concurrency` for the runner.
- Keep `shared-workspace-lockfile=true` in monorepos: one source of truth, faster resolution.
- Measure before claiming a win — time a clean install, a lockfile install, and a warm
  cached install separately, and debug slow ones with `DEBUG=pnpm:* pnpm install`.

| Scenario | Command or setting |
|---|---|
| CI install | `pnpm install --frozen-lockfile` |
| Offline work | `--prefer-offline` |
| Skip native builds | `neverBuiltDependencies` |
| Parallel workspace run | `pnpm -r --parallel run build` |
| Build only what changed | `pnpm --filter "...[origin/main]" build` |
| Reclaim disk | `pnpm store prune` |
