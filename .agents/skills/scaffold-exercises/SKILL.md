---
name: scaffold-exercises
description: |
  **TOOLING SKILL** - Create exercise directory structures for coding courses with section/exercise/variant layout.
  USE FOR: scaffolding training exercises, creating problem/solution/explainer stubs for course material.
  DO NOT USE FOR: production code scaffolding, general project setup.
  INVOKES: directory creation, readme stubs, lint validation.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "any"
allowed-tools: [read_file, write_file, run_shell_command]
---

# Scaffold Exercises

Create exercise directory structures for coding courses, then commit with `git commit`.

## Directory naming

- **Sections**: `XX-section-name/` inside `exercises/` (e.g., `01-retrieval-skill-building`)
- **Exercises**: `XX.YY-exercise-name/` inside a section (e.g., `01.03-retrieval-with-bm25`)
- Section number = `XX`, exercise number = `XX.YY`
- Names are dash-case (lowercase, hyphens)

## Exercise variants

Each exercise needs at least one subfolder:

- `problem/` — student workspace with TODOs
- `solution/` — reference implementation
- `explainer/` — conceptual material, no TODOs

When stubbing without a specific plan, default to `explainer/`.

## Required files

Each subfolder (`problem/`, `solution/`, `explainer/`) needs a `readme.md` that:
- Is **not empty** (must have real content, even a single title line)
- Has no broken links

Minimal stub readme:
```markdown
# [Exercise Title]

[Brief description]
```

If the subfolder has code, it also needs a `main.ts` (>1 line). For stubs, readme-only is fine.

## Workflow

1. **Parse the plan** — extract section names, exercise names, and variant types
2. **Create directories** — `mkdir -p` for each path
3. **Create stub readmes** — one `readme.md` per variant folder with a title
4. **Run lint** — validate the structure
5. **Fix any errors** — iterate until lint passes
6. **Commit** — `git add exercises/ && git commit -m "scaffold: [description]"`

## Moving/renaming exercises

Use `git mv` (not `mv`) to rename — preserves git history:
```bash
git mv exercises/01-section/01.03-name exercises/01-section/01.04-name
```

## Example: stubbing from a plan

Given:
```
Section 05: Memory Skill Building
- 05.01 Introduction to Memory (explainer)
- 05.02 Short-term Memory (explainer + problem + solution)
- 05.03 Long-term Memory (explainer)
```

Create:
```bash
mkdir -p exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer
mkdir -p exercises/05-memory-skill-building/05.02-short-term-memory/{explainer,problem,solution}
mkdir -p exercises/05-memory-skill-building/05.03-long-term-memory/explainer
```

Then create stub readmes with titles for each subfolder.

## Checklist

- [ ] Section and exercise numbers follow `XX` / `XX.YY` format.
- [ ] Names are dash-case (lowercase, hyphens).
- [ ] Each exercise has at least one variant subfolder.
- [ ] Each subfolder has a non-empty `readme.md`.
- [ ] No `.gitkeep` files.
- [ ] Lint passes.
- [ ] Changes committed with `git commit`.
