---
name: codebase-mapping
description: |
  Map an unfamiliar codebase before changing it: entry points, modules, data flow, and conventions. Use for onboarding to a new repository, getting a quick map of an unfamiliar repo before touching it, understanding how it is organized, locating the code that owns a behavior, and dependency graphs.
---

# Codebase Mapping

## Preflight
Ten commands, in order. Each one narrows the next.

```bash
# 1. What is this, and how is it run?
cat README* package.json pyproject.toml go.mod Cargo.toml 2>/dev/null | head -60

# 2. Where does execution start?
rg -l 'if __name__|func main\(|createServer|app\.listen|ReactDOM|export default' --glob '!**/{node_modules,dist,build,target,vendor}/**'

# 3. What is the real build/test/run command? (CI never lies)
cat .github/workflows/*.yml Makefile justfile 2>/dev/null | rg -n 'run:|^\t' | head -30

# 4. Shape and size — where is the mass?
tokei . 2>/dev/null || find . -name '*.ts' -o -name '*.py' | grep -v node_modules | wc -l

# 5. Which files change together? (churn names the hot modules)
git log --format= --name-only --since='6 months ago' | sort | uniq -c | sort -rn | head -20

# 6. Who owns what, historically?
git log --format='%an' --since='1 year ago' | sort | uniq -c | sort -rn | head
```

## Workflow — Trace One Real Request
A map built from folder names is fiction. Follow one flow end to end and record it as `file:line`:

**entry point → routing → handler → domain → persistence → response.**

At each hop, ask what the next hop is *called* and grep for that, not for what you expected it to be called.

## Artifact Budget
This is a working document, not documentation. One screen, roughly 40 lines.

| Section | Cap | Content |
|---|---|---|
| Entry points | 3 | `file:line`, what triggers it |
| Modules | 7 | name, responsibility, one-line boundary |
| Data flow | 1 trace | the hops above, with evidence |
| Conventions | 5 | naming, errors, tests, config, layout |
| Where the change belongs | 1 | the module, with the reason |

Past the cap, cut the least load-bearing entry rather than adding a section.

## When You Cannot Run It
No credentials, no environment, no seed data — do not guess. The test suite and CI config are the next-best oracle:

- Test setup names the real entry points and the services actually required.
- The CI job names the real build and run commands, in the real order.
- Integration fixtures name the real external dependencies.

Record explicitly that the map is **unverified at runtime**.

## Stop
- The build or run command cannot be found in CI or the manifests. Ask; do not invent one and map against a fiction.
- A mapping claim has no `file:line` behind it. Drop the claim or go get the evidence.
- The app cannot be run and the tests do not cover the path. Record the map as unverified at runtime, explicitly.

## Rules
- Prefer `rg`, glob, and reading exports over reading whole files. Reading a large file end to end is almost always the wrong first move.
- Do not trust folder names. `utils/` holds domain logic in most repositories; verify ownership by following imports and callers.
- Record `file:line` evidence for every mapping claim. An unattributed claim is a guess that will be repeated as fact.
- Skip generated, vendored, and build-output paths (`node_modules`, `dist`, `build`, `target`, `vendor`, `.next`, generated clients). They inflate the graph and own no logic.
- In a monorepo, map one workspace at a time from its own manifest, and record cross-workspace edges only as package names.
- Where new code should live belongs to `project-structure`; a full documentation reconstruction to `legacy-discovery`; whether a boundary should move to `software-architecture`.

## Checklist
- [ ] Build, test, and run commands taken from CI, not assumed.
- [ ] At least one real flow traced end to end with `file:line` evidence.
- [ ] Module boundaries verified by imports and callers, not by directory names.
- [ ] Conventions recorded: naming, errors, tests, config sources.
- [ ] The module that owns the behavior in question is named, with its reason.
- [ ] Map fits one screen, and says whether it was verified at runtime.
