---
name: project-structure
description: |
  Choose and change a project's directory layout so it scales with the codebase, not ahead of it. Use for new repository layout, deciding where a new module should live, feature-first frontend splits, Go and Python packages, junk-drawer folders, and safe restructuring.
---

# Project Structure

## Preflight
```bash
git ls-files | sed 's|/[^/]*$||' | sort | uniq -c | sort -rn | head -20   # where the mass is
rg -F 'src/old/path' --glob '!**/{node_modules,dist}/**' | wc -l          # textual references
rg -n 'paths|alias' tsconfig.json vite.config.* jest.config.* 2>/dev/null
```

Read the import graph before proposing a move. A layout decision without it is a guess.

## Workflow
1. List the current tree and the import graph before proposing any move. A layout decision made without the import graph is a guess.
2. Name the owner of each top-level directory. An unowned directory is a defect, not a layout to extend.
3. Follow the stack's published convention where one exists (below). Framework conventions outrank taste — the toolchain's router, packaging, and test discovery all assume them.
4. Start flat and escalate only when content justifies it.
5. Separate business rules from transport code, and keep state beside the feature that owns it.
6. Grep every import path and build config the move touches; update aliases, path mappings, and manifests in the same change.
7. Move with version-control-aware operations so history survives, then run build and tests.
8. Re-check: no directory holding one orphan file, no new generic bucket.

## Stack Conventions

| Stack | Layout |
|---|---|
| Go | `cmd/<binary>/`, `internal/` (private, enforced by the compiler), `pkg/` (only if genuinely importable), `api/` |
| Python | `src/<package>/` with `tests/` mirroring it one-for-one; `src/` prevents accidental local imports |
| Node library | `src/` → `dist/`, with the `exports` map naming the public surface |
| Frontend | no canonical layout — flat first, then `features/<name>/` with per-feature UI, state, and integration |
| Monorepo | `apps/` for deployables, `packages/` for shared code; never a shared `common/` |

## Escalate by Need
Nesting added before content justifies it costs more than the duplication it prevents.

```
src/components/  src/hooks/  src/services/        # start here
        ↓ one domain now owns UI + state + integration
src/features/checkout/{components,hooks,api}/      # split that domain only
        ↓ a second app needs it, for real
packages/checkout/                                 # extract, on the second consumer
```

Go back down a level when a directory holds one file that nothing else joins.

## Moving Without Breaking

```bash
git mv src/old/path src/new/path        # history follows the file
rg -F 'src/old/path' --glob '!**/{node_modules,dist}/**'   # every textual reference
rg -F 'old/path' tsconfig.json vite.config.* jest.config.* pyproject.toml
```

Aliases, path mappings, test-discovery globs, Docker `COPY` lines, and CI paths all reference directories textually and none of them are type-checked. Grep for the string, not just the symbol.

## Junk Drawers

| Name | Why it fails | Instead |
|---|---|---|
| `utils/` | grows without bound, owned by nobody | name the capability: `formatting/`, `retry/` |
| `helpers/` | same, one synonym away | as above |
| `common/` | becomes a dependency of everything, so nothing can move | put it where it is used; promote on the **second** consumer |
| `misc/` | an admission | delete or classify |
| `shared/` in a monorepo | every package depends on it, nothing can version | one package per real concept |

## Stop
- A move would land in the same commit as a behavior change. Split it — the diff is otherwise unreviewable.
- A file would be deleted without explicit confirmation or a verified backup. Stop.
- The move introduces a `utils/`, `helpers/`, `common/`, or `misc/` with no named owner. Name the capability instead.

## Rules
- Co-locate by ownership. Promote to shared on the second real consumer, never on anticipated reuse.
- One naming convention per repository. Mixed casing is a structural bug, and it breaks on case-insensitive filesystems in ways CI will not reproduce.
- Never delete a file during a restructure without explicit confirmation or a verified backup.
- Restructures land alone, never folded into a feature commit. A diff that both moves and changes code is unreviewable, and `git log --follow` stops working through it.
- Map the tree with `codebase-mapping` before moving it; whether something becomes a separate service belongs to `software-architecture`.

## Checklist
- [ ] Import graph read before the move was proposed.
- [ ] Layout matches the stack convention; every top-level directory has a named owner.
- [ ] Imports, aliases, build config, Docker paths, and test discovery updated and green.
- [ ] No junk-drawer directory introduced or left behind; no directory left holding one orphan file.
- [ ] Moves used version-control-aware operations; no file deleted without confirmation.
- [ ] Structural change isolated from behavioral change in its own commit.
