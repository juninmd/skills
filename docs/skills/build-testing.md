# Build & Testing Skills

Skills for build tooling, package management, and testing frameworks.

## `pnpm`

**Invoke:** `/pnpm`

pnpm package manager with strict dependency resolution and workspaces.

**Why pnpm over npm/yarn:**
- Content-addressable store (no duplication across projects)
- Strict mode prevents phantom dependencies
- Faster installs via hard links
- Native workspace support

**Covers:** workspace setup, `pnpm-workspace.yaml`, filters (`--filter`), `publishConfig`, `.npmrc` settings, migration from npm, Turborepo integration.

---

## `tsdown`

**Invoke:** `/tsdown`

Bundle TypeScript/JavaScript libraries with Rolldown.

**Use case:** publishing libraries to npm — not for application bundling (use Vite for that).

**Covers:** `tsdown.config.ts` setup, dual CJS/ESM output, type declaration generation, tree-shaking, external dependencies, source maps.

---

## `vitest`

**Invoke:** `/vitest`

Vitest unit testing with Jest-compatible API.

**Features:**
- Native TypeScript support (no transpilation config)
- ESM-first
- Browser mode for DOM tests
- Snapshot testing
- Coverage with `@vitest/coverage-v8`
- UI mode (`--ui`) for interactive test runner

**Covers:** test setup, mocking (`vi.mock`, `vi.spyOn`), fake timers, test isolation, `beforeEach`/`afterEach`, `describe` grouping, coverage thresholds in `vite.config.ts`.

---

## `developing-tooling`

**Invoke:** `/developing-tooling`

Building CLI tools, automation scripts, and internal utilities.

**Covers:** argument parsing (commander, yargs, citty), interactive prompts (clack, inquirer), terminal output (chalk, picocolors), spinners and progress bars, config file handling, cross-platform path handling, shebang lines, executable packaging.
