---
name: package-management
description: |
  Manage JS and Python package managers and project toolchains: pnpm workspaces, catalogs, overrides, patches, peer deps, aliases, hooks, CLI, config, and store; uv, pyproject.toml, PEP 723 scripts, Ruff config, prek/pre-commit, and Dependabot. Operate an already-chosen toolchain: lockfile hygiene, toolchain migrations, and CI install caching.
---

# Package Management

**Not this skill:** choosing which package manager to adopt in the first place (`stack-selection`), implementing the service or endpoint that consumes the dependencies (`backend-systems`), and framework-specific test authoring (`backend-systems`, `test-engineering`).

## Preflight

```bash
rg --files -g package.json -g pnpm-lock.yaml -g pnpm-workspace.yaml -g .npmrc -g package-lock.json -g yarn.lock -g .pnpmfile.cjs -g uv.lock -g pyproject.toml -g .pre-commit-config.yaml -g .github/dependabot.yml
cat package.json 2>/dev/null | grep -E '"packageManager"|"engines"'
cat pyproject.toml 2>/dev/null | grep -E '^\[tool\.(ruff|uv)|requires-python'
```

Identify the package manager already pinned (lockfile + `packageManager`/`uv.lock`) before running any install or migration command. A lockfile without a matching `packageManager` field is a drift signal, not permission to switch tools.

## Workflow

1. Detect the current toolchain from lockfiles and manifests (preflight above). Never mix lockfiles (e.g. `package-lock.json` alongside `pnpm-lock.yaml`) — pick one and remove the others in the same commit.
2. For JS/TS work, route by need: CLI/flags -> [core-cli.md](references/core-cli.md); `.npmrc`/`pnpm-workspace.yaml` -> [core-config.md](references/core-config.md); monorepo/`workspace:` protocol -> [core-workspaces.md](references/core-workspaces.md); shared dependency versions -> [features-catalogs.md](references/features-catalogs.md); forcing a transitive version -> [features-overrides.md](references/features-overrides.md); patching a third-party package -> [features-patches.md](references/features-patches.md); peer-dependency resolution -> [features-peer-deps.md](references/features-peer-deps.md); aliasing/dual versions -> [features-aliases.md](references/features-aliases.md); `.pnpmfile.cjs` -> [features-hooks.md](references/features-hooks.md); store/hard-link internals -> [core-store.md](references/core-store.md). Consolidated view: [pnpm-features.md](references/pnpm-features.md).
3. For governance, CI wiring and migrations: lockfile policy and strict mode -> [pnpm-standards.md](references/pnpm-standards.md); GitHub Actions caching -> [best-practices-ci.md](references/best-practices-ci.md); npm/Yarn to pnpm -> [best-practices-migration.md](references/best-practices-migration.md) or [node-operations.md](references/node-operations.md); slow installs -> [best-practices-performance.md](references/best-practices-performance.md); new Node project setup -> [node-setup.md](references/node-setup.md).
4. For Python work: project init/uv commands -> [uv-commands.md](references/uv-commands.md), [python-setup.md](references/python-setup.md); `pyproject.toml` fields -> [pyproject.md](references/pyproject.md); one-off scripts -> [pep723-scripts.md](references/pep723-scripts.md); linter/formatter config -> [ruff-config.md](references/ruff-config.md); pip/setup.py to uv -> [migration-checklist.md](references/migration-checklist.md); legacy-pattern check -> [modern-python-patterns.md](references/modern-python-patterns.md).
5. For repo-wide hygiene: pre-commit hook runner -> [prek.md](references/prek.md); automated dependency PRs -> [dependabot.md](references/dependabot.md); scanning/CI security tooling -> [security-setup.md](references/security-setup.md); vendored pnpm docs' source commit/date -> [GENERATION.md](references/GENERATION.md).
6. After any change to a lockfile or manifest, run the package manager's install in frozen/locked mode to prove the lockfile still resolves, and report that command's real output.
7. Full routing table, including topics not covered above: [Reference Map](references/TOPIC_MAP.md).

## Decisions

| Situation | Action |
|---|---|
| Lockfile and `packageManager` field disagree | Trust the lockfile that CI actually installs from; fix the field, do not silently switch tools |
| Asked to "speed up installs" in CI | Frozen/locked install + store caching first, not a broader dependency prune |
| A transitive dependency has a CVE | `features-overrides.md` (pnpm) or `uv add` a direct pin, not a manual `node_modules` edit |
| A third-party package needs a local fix | `pnpm patch`, never a hand-edited `node_modules` |
| Choosing pnpm vs npm vs uv for a brand-new repo | Out of scope — hand off to `stack-selection` |

## Stop

- The lockfile does not match the manifest (`pnpm-lock.yaml` out of sync with `package.json`, or `uv.lock` stale against `pyproject.toml`) — regenerate it before any other change, never hand-edit it.
- About to run an install without `--frozen-lockfile` (pnpm) or `uv sync` in CI — that silently rewrites the lockfile.
- Asked to pick a package manager for a new project rather than operate an existing one — hand off to `stack-selection`.

## Rules

- Never hand-edit `pnpm-lock.yaml`, `uv.lock`, or `package-lock.json`; regenerate them from the manifest.
- A lockfile change lands in the same commit as the manifest change that caused it, never on its own.
- Keep `shamefully-hoist`/`node-linker=hoisted` as a last resort; they re-enable phantom dependencies.
- Commit `uv.lock` for applications, gitignore it for libraries.
- Prefer `uv run`/`pnpm dlx` over manual venv activation or global installs.

## Gotchas

- pnpm auto-installs peer dependencies by default since v8 (`auto-install-peers=true`) — a peer-dep error usually means strict mode or an explicit override, not a missing auto-install step.
- `uv pip install` bypasses `pyproject.toml`/`uv.lock` tracking; always use `uv add`/`uv sync` so the lockfile stays authoritative.
- Nonempty `gofmt`/`ruff format --check` output fails acceptance even when the command's own exit code is 0 — check output, not just exit status.
- `.pnpmfile.cjs` hooks run during resolution and can silently rewrite the lockfile if `afterAllResolved` is mis-implemented; test hook changes with `pnpm install --frozen-lockfile` before trusting them in CI.
- PEP 723 inline scripts and a full `pyproject.toml` project are mutually exclusive for the same file — do not add a `pyproject.toml` next to a script that already carries inline metadata.

## Checklist

- [ ] Detected package manager matches the committed lockfile and manifest field; no mixed lockfiles.
- [ ] Lockfile regenerated (never hand-edited) and committed alongside the manifest change that caused it.
- [ ] Frozen/locked install run and its real output recorded.
- [ ] CI install step uses the same package manager and caching strategy as local dev.
- [ ] Governance follow-ups (audit, Dependabot, pre-commit) left in place, not silently disabled.
