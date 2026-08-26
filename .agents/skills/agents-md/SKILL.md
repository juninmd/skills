---
name: agents-md
description: |
  Author an AGENTS.md context file that onboards a coding agent in one read: detected commands, a directory map, boundaries, and short examples. Use for writing or trimming AGENTS.md, per-package context in a monorepo, and pointer files keeping one source of truth.
---

# Agents Md

## Preflight
```bash
cat package.json | jq '.scripts'                  # the real script names
rg -n 'run:' .github/workflows/*.yml | head -20   # what CI actually executes
ls AGENTS.md CLAUDE.md .cursorrules .github/copilot-instructions.md 2>/dev/null
ls pnpm-workspace.yaml turbo.json nx.json 2>/dev/null
```

If several context files already exist, reconcile before writing — never write a fourth.

## Workflow
1. Analyze the repository before writing a word: languages, package manager, lockfile, workspace tooling, submodules, CI config, and any context file that already exists.
2. Extract the **real** commands from package scripts, task runners, and CI. Record setup, build, test, lint, and format verbatim.
3. Ask about the gotchas files cannot reveal — the service that must run first, the env var with no default, the test that only passes on a VPN.
4. Write the root file to the six sections below.
5. Replace every style paragraph with a 5–10 line snippet taken from real code in this repository.
6. Convert soft guidance into negative constraints naming exact paths, types, or commands.
7. Monorepo: keep the root a map; push package detail into nested files that add or override.
8. Reconcile before overwriting when `CLAUDE.md`, `.cursorrules`, or `.github/copilot-instructions.md` diverge.

## Detect, Never Invent

```bash
cat package.json | jq '.scripts'                  # the real script names
rg -n 'run:|^\t[a-z]' Makefile justfile 2>/dev/null
rg -n 'run:' .github/workflows/*.yml | head -30   # what CI actually executes
ls pnpm-lock.yaml package-lock.json yarn.lock uv.lock poetry.lock 2>/dev/null
```

A command not in scripts, task runner, or CI stays out. An invented command is worse than a missing one: the agent runs it, it fails, and everything after that is recovery.

## The Six Sections

| Section | Contains | Failure mode if vague |
|---|---|---|
| Persona / priorities | How to weigh security vs speed here | Agent optimizes for the wrong axis |
| Tech stack | Languages, frameworks, versions, package manager | Agent installs the wrong thing |
| Critical commands | setup, build, test, lint, format — verbatim, in backticks | Agent guesses and fails |
| Project structure | Where things live, and what each area owns | Code lands in the junk drawer |
| Rules and boundaries | What must never happen, by path | Agent edits generated code |
| Code style | Snippets from this repo, not adjectives | Style drifts every session |

## Negative Constraints Beat Advice

| Weak | Strong |
|---|---|
| "Be careful with generated code" | "NEVER edit `src/api/generated/**` — regenerate with `pnpm codegen`" |
| "Follow our error conventions" | "Throw `AppError` subclasses only; never a bare `Error`" |
| "Keep tests fast" | "No test may hit the network; use the fixtures in `test/fixtures/`" |
| "Use the right package manager" | "pnpm only. `npm install` corrupts the workspace links" |

## Reconciling Existing Context Files
When several exist and disagree, say which rule wins and which is discarded, confirm, then point the other tools at the reconciled file — never duplicate content. A Windows symlink needs developer mode or elevation; when it fails, write a one-line pointer file instead.

## Stop
- A command you want to document is not in scripts, the task runner, or CI. It stays out; an invented command is worse than a missing one.
- Existing context files disagree and the user has not said which wins. Stop and ask before overwriting either.

## Rules
- Cap each file near 150–200 lines. Past that agents skim and drop rules; cut common knowledge first.
- Commands appear early and in backticks, ready to copy-paste and verify.
- Skip what a competent engineer already knows about the framework. Keep the decisions that are specific to *this* repository.
- One source of truth: pointer files reference it, nested files inherit the root. Restating either wastes budget and breeds drift.
- Re-verify documented commands whenever package scripts or CI change. A stale command is worse than a missing one.
- Recurring lessons reach this file through `session-learnings`; hold its promoted rules to the same budget as the rest. Human-facing documentation belongs to `documentation`.

## Checklist
- [ ] Every listed command extracted from scripts, task runner, or CI — and executed once to confirm.
- [ ] Root file under 200 lines, covering all six sections.
- [ ] Style expressed as snippets from this repository, not adjectives.
- [ ] At least one negative constraint naming a concrete path or API.
- [ ] Each workspace package or submodule covered by the root map or its own nested file.
- [ ] Other tool configs are pointers, not copies; divergences reconciled explicitly.
