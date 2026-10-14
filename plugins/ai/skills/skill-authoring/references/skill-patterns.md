# Skill Patterns from the Field

Distilled from Anthropic's 2026 engineering posts on how the Claude Code team writes skills ([how we use skills](https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/)) and on context for Claude 5 generation models ([new rules of context engineering](https://claude.dev/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models/)). Open this when designing a new skill's shape, splitting one, or trimming one that got heavy.

## Preflight
```bash
rg -n -i "think (hard|carefully|step by step)|show (your|its) reasoning|ultrathink" .agents/ | head   # dead-weight phrases
rg -n -i "^## gotchas" .agents/skills/*/SKILL.md | wc -l                                           # skills that record traps
```

## A Skill Is a Folder, Not a File
- `SKILL.md` is the hub: goal, constraints, a symptom-to-file table, and the gotchas.
- `references/` holds API notes and long procedures, loaded by the one subtask that needs them.
- Scripts and small helper libraries let the model compose a solution instead of regenerating boilerplate; put the gotchas in their docstrings where the call happens.
- Templates and assets live beside the skill so output starts from the house shape.

## Where the Value Is

| Content | Value | Why |
|---|---|---|
| Gotchas: the non-obvious trap, stated concretely | highest | the model cannot derive it from the code |
| Decision table: symptom to action, option to tradeoff | high | turns judgment into a lookup |
| Real command with the flags that matter | high | the flags are the part models get wrong |
| Generic best practice | near zero | already in the model |
| Step list replaying commands | negative | over-constrains; breaks on the first unusual repo |

Good gotchas name the specific fact: "the table is append-only; the live row has the highest version, not the latest timestamp", "staging returns 200 even when the webhook did not process; check the events table". Most good skills began as a few lines and one gotcha, then grew from observed failures.

## Nine Categories; Pick One
Library/API reference · product verification · data fetching and analysis · business-process automation · scaffolding and templates · code quality and review · CI/CD and deployment · runbooks · infrastructure operations.

A skill that straddles two categories confuses selection. Split it along the category line, keep each half's description to its own triggers, and repoint every eval, caller, and link.

## State and Setup
- **Memory across runs:** an append-only log or JSON file in the plugin's persistent data directory (`${CLAUDE_PLUGIN_DATA}` in Claude Code), not inside the skill folder, which an update may replace. Lets a skill answer "what changed since the last run".
- **First-run setup:** check for `config.json`; when missing, ask a structured multiple-choice question, write the file, and continue. Never bake a person's channel, account, or path into the skill.
- **Usage measurement:** a `PreToolUse` hook that logs skill invocations shows which skills earn their catalog slot and which never fire.

## On-Demand Guards
Opinionated safety that should apply only while a skill is active, such as blocking `rm -rf`, `DROP TABLE`, force-push, or `kubectl delete`, or freezing edits outside one directory while debugging, belongs in a hook scoped to that skill or plugin with an explicit tool matcher. It must not be a global hook and must not rely on prompt wording.

## Claude 5 Context Rules for Skills

| Before | Now |
|---|---|
| Give the model rules | State the goal and constraints; let it use judgment outside critical areas |
| Give examples | Design a better interface: enums, required fields, one invariant |
| Put everything up front | Progressive disclosure: hub file plus references loaded on demand |
| Repeat the instruction in several places | Say it once, where it applies |
| Keep memory in CLAUDE.md | Let auto-memory hold learned facts; keep instruction files for gotchas |
| Thin specs | Rich references: point at code, tests, and HTML mockups rather than prose descriptions |

- Contradictions between layers (system prompt, CLAUDE.md, skills, memory) are the expensive failure: the model can usually recover intent, but it spends reasoning on it every turn. Audit for the opposite rule before adding one.
- Drop "think carefully" style instructions; current models already adapt reasoning depth.
- Verification rubrics belong in references loaded by the verifying step, not in the always-loaded body.

## Lightweight Skill Evals
Lexical routing evals (`run-evals.mjs`) prove the description wins its prompts, not that the body changes behavior. For behavior, run the same task with and without the skill in separate worktrees and have an independent agent grade both against a written rubric; iterate on the body until the with-skill run wins for the reason the rule states.

## Stop
- The new material is generic best practice. Cut it.
- A split leaves one half without a real workflow. Merge back or give it one before shipping.

## Checklist
- [ ] Skill sits in one category; a straddler was split along the category line.
- [ ] Gotchas section holds concrete, observed traps.
- [ ] No "think hard" or "show your reasoning" phrasing; no rule that contradicts another layer.
- [ ] Persistent state, if any, lives outside the skill folder; personal config is asked for, not hard-coded.
