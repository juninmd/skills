# Repository working contract

This repository maintains engineering skills, agent roles, and validation tools. Optimize for useful instructions, correct routing, and reproducible evidence.

## Before changing anything

1. Read the request and applicable instructions. Explicit user direction takes precedence over repository preferences.
2. Run `git status --short`; preserve work outside your task.
3. Read the owning skill, reference map, evals, and callers before editing.
4. For non-trivial work, state the intended outcome and checks that establish it.

Use the host shell and bounded searches. Keep secrets and private logs out of output.

## Scope and authority

- Complete authorized inspection, edits, and local verification without repeated permission requests.
- Ask when a missing decision materially changes scope, authority, or acceptance. Continue independent work while waiting.
- Obtain explicit authorization for commits, pushes, history rewrites, publication, deployment, destructive operations, and external messages. Existing authorization remains valid within its scope.
- Prefer focused changes. Avoid unrelated formatting, speculative abstractions, and dependency changes.
- Use independent review for substantial changes when available; delegate bounded work with clear file ownership.
- Persist information outside the workspace only when the user explicitly requests it.

## Canonical layout

| Path | Owns |
|---|---|
| `.agents/skills/<name>/SKILL.md` | Discovery and the domain workflow |
| `.agents/skills/<name>/references/` | Procedures loaded for a specific subtask |
| `.agents/evals/<name>.json` | Positive prompts and negative ownership cases |
| `.agents/agents/` | Roles |
| `.agents/clients/` | Token-optimized Claude Code and Codex configs, symlinked by `.agents/tools/install.mjs` |
| `.agents/tools/` | Validators, reports, and catalog generation |
| `README.md`, `docs/` | Installation, navigation, and user documentation |

Keep client packaging derived from this source. Do not fork skill content per assistant.

## Skill acceptance

- Frontmatter uses only supported fields: `name`, `description`, `license`, `allowed-tools`, `metadata`, and `compatibility`. The name equals its folder.
- The description identifies what the skill does and when to select it. Spend the discovery budget on distinctions, not promotional language.
- Include `## Preflight`, a numbered `## Workflow`, a decision table, a real command block, `## Stop`, `## Rules`, and a verifiable `## Checklist`.
- Make preflight establish actual state. Select commands for the detected stack and shell; do not require unrelated toolchains.
- A handoff targets an installed skill; a procedure stored in references is linked as a file and executed by its owning skill.
- Reference maps explain when to open each file. Repeating filenames as descriptions is insufficient.
- Keep the main workflow within the enforced budget. Load references selectively.
- Preserve attribution and license notices in imported material.

## Consolidation and routing

A merge is complete only when the new owner can execute all advertised tasks.

1. Map each retired skill to its new owner or reference.
2. Update active instructions, callers, agents, documentation, and installation examples.
3. Check discovery and execution: a correct description cannot repair an obsolete workflow.
4. Keep at least three positive and two negative prompts per skill; every negative names the owner that should win.
5. Fix incorrect descriptions rather than rewriting failing prompts to match them.
6. Treat lexical evals as regression signals. They do not prove model behavior, multilingual routing, or client installation.

Do not increase budgets or lower thresholds merely to make a change pass. Explain deliberate changes to the quality contract.

## Verification

```bash
pnpm run catalog:generate
pnpm run validate
pnpm run docs:build
```

Regenerate the catalog when descriptions change. Run validator unit tests when modifying `.agents/tools/`; `pnpm run validate` includes them.

- Reproduce defects before fixing them; add regression tests for meaningful validator behavior.
- Inspect the final diff for unrelated changes and stale names.
- Distinguish structure checks, content review, and actual client smoke tests.
- A failed check blocks a completion claim. Diagnose and fix within scope; otherwise report the exact blocker.
- Do not claim plugin compatibility until discovery and a representative invocation have been tested in that client.

## Reporting

Lead with the result. State what changed, what checks passed, and what remains unverified. For reviews, prioritize concrete findings with file locations and operational impact. Keep routine logs out of the response.
