# pnpm Core Features, Workspaces, and Configuration

Reference for the pnpm CLI, monorepo workspaces, configuration files, the content-addressable store, and the dependency features (catalogs, overrides, patches, aliases, peer rules, hooks).

## 1. CLI Commands

```bash
pnpm install                      # install all; --frozen-lockfile in CI
pnpm add <pkg>                    # -D dev, -O optional, -g global, <pkg>@<ver>
pnpm remove <pkg>
pnpm update                       # --latest ignores semver, --interactive to pick
pnpm run <script>                 # pnpm <script> shorthand; -- passes args
pnpm exec <cmd>                   # run a local binary
pnpm dlx <pkg>                    # run without installing (replaces npx)
pnpm list | pnpm why <pkg> | pnpm outdated | pnpm audit
pnpm rebuild                      # rebuild native modules
pnpm import                       # build pnpm-lock.yaml from package-lock/yarn.lock
pnpm pack | pnpm publish
```

Useful install flags: `--frozen-lockfile`, `--prefer-offline`, `--ignore-scripts`,
`--strict-peer-dependencies`, `--prod`, `--no-optional`, `--lockfile-only`.

## 2. Workspaces and Filtering

`pnpm-workspace.yaml` at the repository root defines the packages:

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'tools/*/packages/*'
  - '!**/test/**'
```

Reference internal packages with the workspace protocol. On publish it is rewritten
to the real version:

| Spec | Published as |
|---|---|
| `workspace:*` | `1.2.3` |
| `workspace:^` | `^1.2.3` |
| `workspace:~` | `~1.2.3` |
| `workspace:^1.0.0` | `^1.0.0` |

Filtering selects what a command runs on:

```bash
pnpm -r run build                       # every package, topological order
pnpm --filter @myorg/app build          # by name (-F is the short form)
pnpm --filter "./packages/core" test    # by directory
pnpm --filter "@myorg/*" lint           # glob
pnpm --filter "!@myorg/internal-*" publish
pnpm --filter "...@myorg/app" build     # package plus its dependencies
pnpm --filter "@myorg/core..." test     # package plus its dependents
pnpm --filter "...[origin/main]" build  # only what changed since a git ref
pnpm -r --parallel run test             # parallel; --stream to interleave output
pnpm -r --workspace-concurrency=1 build # force sequential
pnpm publish -r --no-git-checks         # publishing from CI
```

## 3. Configuration

Prefer `pnpm-workspace.yaml` for pnpm-specific settings; `.npmrc` still works and is
required for registry auth.

```yaml
# pnpm-workspace.yaml
packages: ['packages/*']
catalog:
  react: ^18.2.0
overrides:
  lodash: ^4.17.21
settings:
  auto-install-peers: true
  strict-peer-dependencies: false
  link-workspace-packages: true
  prefer-workspace-packages: true
  shared-workspace-lockfile: true
```

```ini
# .npmrc
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=false
public-hoist-pattern[]=*types*
store-dir=~/.pnpm-store
virtual-store-dir=node_modules/.pnpm
prefer-frozen-lockfile=true
side-effects-cache=true
use-node-version=20.10.0
registry=https://registry.npmjs.org/
@myorg:registry=https://npm.myorg.com/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
network-concurrency=16
fetch-retries=3
workspace-concurrency=4
```

Precedence, later wins: `/etc/npmrc` → `~/.npmrc` → project `.npmrc` →
`npm_config_<key>` env vars → the `settings` field of `pnpm-workspace.yaml`.

`package.json` also carries pnpm fields:

```json
{
  "packageManager": "pnpm@9.0.0",
  "pnpm": {
    "overrides": { "lodash": "^4.17.21" },
    "peerDependencyRules": {
      "ignoreMissing": ["@babel/*"],
      "allowedVersions": { "react": "17 || 18" },
      "allowAny": ["@types/*"]
    },
    "onlyBuiltDependencies": ["esbuild"],
    "neverBuiltDependencies": ["fsevents"],
    "patchedDependencies": { "express@4.18.2": "patches/express@4.18.2.patch" }
  }
}
```

## 4. Store and Node Linker

Packages are downloaded once into a content-addressable store and hard-linked into
`node_modules/.pnpm`, with symlinks at the top level. Identical files across versions
and projects are stored once.

```bash
pnpm store path | pnpm store status | pnpm store prune
```

`node-linker` controls the layout:

- `isolated` (default) — symlinked, strict, no phantom dependencies.
- `hoisted` — flat `node_modules` for tools that cannot follow symlinks; loses strictness.
- `pnp` — experimental Yarn-PnP style resolution.

On network drives or in Docker where hard links fail, set `package-import-method=copy`.

## 5. Catalogs

Declare a version once and reference it from every package.

```yaml
catalog:
  react: ^18.2.0
  typescript: ~5.3.0
catalogs:
  react17: { react: ^17.0.2 }
  testing: { vitest: ^1.0.0 }
```

```json
{ "dependencies": { "react": "catalog:" }, "devDependencies": { "vitest": "catalog:testing" } }
```

`catalog:` is resolved to the real range on publish. Catalogs cover direct
dependencies only and are opt-in per `package.json`; overrides cover transitive
dependencies and apply workspace-wide. Use catalogs for shared versions, overrides
for forcing a fix.

## 6. Overrides

```yaml
overrides:
  lodash: ^4.17.21                       # every instance
  "foo@^1.0.0": ^1.2.3                   # only when the request matches
  "express>cookie": ^0.6.0               # only under a given parent
  "underscore": "npm:lodash@^4.17.21"    # swap for another package
  "unwanted-pkg": "-"                    # remove entirely
```

Main uses: patching a CVE in a transitive dependency, deduplicating a package that
resolved to several versions, and replacing a deprecated package. Verify with
`pnpm why <pkg>` and `pnpm list <pkg> --depth=Infinity`.

## 7. Patches

```bash
pnpm patch express@4.18.2        # prints a temp dir; edit the files there
pnpm patch-commit <temp-dir>     # writes patches/express@4.18.2.patch + package.json entry
pnpm patch-remove express@4.18.2
```

A patch is pinned to an exact version and must be recreated after an upgrade
(`ERR_PNPM_PATCH_FAILED` means the version moved). Keep patches small, record the
upstream issue or PR next to them, and delete them once the fix ships.

## 8. Aliases

`"<alias>": "npm:<pkg>@<version>"` installs a package under another name — for two
majors side by side (`"lodash3": "npm:lodash@3"`), for a fork, or for a maintained
replacement (`"request": "npm:@cypress/request@^3.0.0"`). TypeScript needs matching
`paths` or aliased `@types` packages. To replace a package everywhere including
transitively, use an override instead.

## 9. Peer Dependencies

`auto-install-peers=true` is the default since v8; `strict-peer-dependencies=true`
turns missing or mismatched peers into install failures. Narrow the noise with
`peerDependencyRules` (`ignoreMissing`, `allowedVersions`, `allowAny`) rather than
disabling the check, and document why each suppression is safe. Libraries should
declare wide peer ranges (`"react": "^17.0.0 || ^18.0.0"`); a workspace app that
depends on a package satisfies that package's peer requirement.

## 10. Hooks

`.pnpmfile.cjs` at the workspace root runs JavaScript during resolution:

```js
function readPackage(pkg, context) {
  if (pkg.name === 'broken-pkg') {
    pkg.peerDependencies = { ...pkg.peerDependencies, react: '*' }
  }
  delete pkg.optionalDependencies?.fsevents
  return pkg
}
function afterAllResolved(lockfile, context) { return lockfile }
module.exports = { hooks: { readPackage, afterAllResolved } }
```

Prefer declarative overrides for version pins. Reach for hooks only when the fix
needs conditional logic or touches non-version metadata such as `exports` or peer
declarations. The file must be `.cjs`, at the workspace root, and takes effect on the
next `pnpm install`.
