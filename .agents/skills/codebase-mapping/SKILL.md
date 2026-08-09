---
name: codebase-mapping
description: |
  Map unfamiliar codebases before changing them: entry points, modules, data flow, and conventions. Use for onboarding to new repos, understanding architecture, finding where a change belongs, and dependency graphs.
---

# Codebase Mapping

## Workflow
1. Read manifests, entry points, and README; identify language, framework, and build commands.
2. Trace the primary flow: entry point, routing, domain, and data layer; note the data model.
3. Map module boundaries and dependency direction; look for cycles and layering violations.
4. Record conventions: naming, folder layout, error handling, testing style, and config sources.
5. Validate the map against behavior: run the app, read tests, and check exports.
6. Produce a compact map: entry points, modules, dependencies, conventions, and where the requested change belongs.

## Rules
- Prefer `rg` and `glob`, and reading exports, over reading whole files.
- Do not trust folder names; verify ownership by following imports and callers.
- Record evidence (`file:line`) for every mapping claim.
- Keep the map small; it is a working document, not documentation.

## Checklist
- [ ] Entry points, modules, and data flow mapped with evidence.
- [ ] Conventions recorded; change location identified.
- [ ] Map verified against runtime or tests.
