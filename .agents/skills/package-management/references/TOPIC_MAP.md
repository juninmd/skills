# package-management Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `GENERATION.md` | Verifying the vendored pnpm docs' source commit and generation date before trusting or re-vendoring them |
| `core-cli.md` | Looking up a pnpm CLI command or flag (install, add, run, dlx, why, audit) |
| `core-config.md` | Configuring pnpm-workspace.yaml or .npmrc settings |
| `core-store.md` | Understanding or debugging pnpm's content-addressable store and hard-link layout |
| `core-workspaces.md` | Setting up a pnpm monorepo or referencing local packages with the workspace: protocol |
| `features-aliases.md` | Installing a package under an alias or running two versions of the same package via pnpm's npm: protocol |
| `features-catalogs.md` | Centralizing shared dependency versions across a pnpm workspace with catalogs |
| `features-hooks.md` | Customizing pnpm's package resolution or lockfile via a .pnpmfile.cjs hook |
| `features-overrides.md` | Forcing a specific transitive dependency version in pnpm to fix a vulnerability or conflict |
| `features-patches.md` | Patching a third-party npm package's source directly with pnpm patch |
| `features-peer-deps.md` | Debugging pnpm peer-dependency auto-install or strict-mode resolution errors |
| `pnpm-features.md` | Need the consolidated pnpm CLI, workspace, config, store, and dependency-features reference in one place |
| `pnpm-standards.md` | Enforcing pnpm governance — lockfile commit policy, frozen-lockfile CI, audits, or strict mode |
| `best-practices-ci.md` | Wiring or speeding up pnpm in GitHub Actions CI (store caching, install steps) |
| `best-practices-migration.md` | Migrating an existing npm or Yarn project to pnpm |
| `best-practices-performance.md` | Slow pnpm installs — tuning frozen-lockfile, offline mode, or optional-dependency skipping |
| `node-setup.md` | Choosing or preserving the Node runtime, package manager, and monorepo tooling for a new project |
| `node-operations.md` | Troubleshooting Node installs (EACCES, phantom deps, proxy certs) or migrating npm to pnpm |
| `uv-commands.md` | Looking up a uv CLI command (init, add, sync, run, build) or installation method |
| `python-setup.md` | Initializing a new Python project or configuring pyproject.toml/uv environment settings |
| `pyproject.md` | Looking up pyproject.toml field syntax — project metadata, dependencies, or tool configuration |
| `pep723-scripts.md` | Deciding between a PEP 723 inline-metadata script and a full pyproject.toml project for a one-off script |
| `ruff-config.md` | Configuring Ruff's lint select/ignore rules, line length, or formatter settings in pyproject.toml |
| `modern-python-patterns.md` | Checking whether a Python pattern is legacy (pip, manual venv, requirements.txt) versus the current uv/ruff stack |
| `migration-checklist.md` | Migrating a Python project off pip/requirements.txt or setup.py onto uv |
| `prek.md` | Choosing or migrating to prek instead of Python pre-commit for faster hook execution |
| `dependabot.md` | Adding or tuning automated dependency-update PRs — schedule, cooldown, grouping |
| `security-setup.md` | Installing or wiring security tooling (prek, secret scanners, actionlint, shellcheck) into a repo's pre-commit/CI |
