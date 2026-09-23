---
name: skill-authoring
description: |
  Write, split, and tune agent skills and their routing evals. Use for a new SKILL.md, gotchas sections, progressive-disclosure references, skill scripts and persistent data, splitting a skill that straddles domains, and deciding whether a recurring task deserves a skill. Trigger on 'create a skill', 'my skill never triggers', 'split this skill'.
---

# Skill Authoring

**Not this skill:** repository-wide AGENTS.md or CLAUDE.md files (`starting-dev`), the agent runtime, tool schemas, or MCP servers (`agent-engineering`), or running many agents at once (`agent-orchestration`).

## Preflight
```bash
git status --short
node .agents/tools/run-evals.mjs .agents | head -5          # routing health before touching a description
node .agents/tools/tokens-report.mjs .agents | tail -4     # tier-1 total and the heaviest skills
ls .agents/skills | wc -l                                  # catalog size against the 35-skill ceiling
```

Name the decision an agent gets wrong today without this skill, and the prompt that shows it. No failing baseline, no skill.

## Workflow
1. Decide the form first: nothing, a CLAUDE.md line, a hook, a script, or a skill ([automation-candidates.md](references/automation-candidates.md)). Most recurring tasks need something lighter than a skill.
2. Deduplicate: name the two closest skills and why this is a separate decision domain. One category per skill; a skill that straddles two routes badly and should be split.
3. Write five prompts a real user would type, save them as evals, and run them with the skill absent. Record the exact rationalization the agent used.
4. Write the description last, from the vocabulary of those prompts: triggers, not topics, plus the sibling that wins the near misses.
5. Write the body as goals and constraints, not rote command lists. Put the value where the model cannot derive it: gotchas, decision tables, real commands with the flags that matter.
6. Move depth into `references/` behind a map that says when to open each file; ship helper scripts instead of asking the model to rebuild boilerplate.
7. Validate, then trial it on a real task. Grow the gotchas section from each observed failure.

## Choose the Mechanism

| Need | Mechanism | Why |
|---|---|---|
| A domain judgment the model gets wrong | skill body rule or gotcha | loads only when the domain is picked |
| A long procedure used by one subtask | `references/` file behind the map | costs nothing until that subtask |
| Boilerplate the model rewrites each time | script or helper library in the skill folder | the model composes instead of regenerating |
| A guarantee that must hold every time | hook or validator in code | prompts are advice; hooks are enforcement |
| Memory across runs (what changed since last time) | append-only log or JSON in the plugin data directory | the skill folder may be replaced on update |
| Per-user setup (channel, account, paths) | `config.json` created on first run from a structured question | never hard-code personal values in the skill |

## Authoring Is TDD for Instructions

```
NO RULE WITHOUT A BASELINE THAT FAILED WITHOUT IT
```

| TDD | Authoring |
|---|---|
| Write the test | A prompt a real user would type, saved to `.agents/evals/<name>.json` |
| Watch it fail | Run it with the skill absent; record the rationalization |
| Minimal code | Write only the rule that closes that rationalization |
| Watch it pass | Re-run the same prompt with the skill loaded |
| Refactor | Hunt the next loophole; keep routing evals green |

Explain why a step matters instead of stacking imperatives: a model that understands the cost complies under pressure; one that was only ordered rationalizes. State the goal and the constraint ("land it on a clean branch, preserve intent, explain if it cannot land") rather than six commands to replay.

## Gotchas
- A description that names a domain ("helps with databases") never wins against one that names triggers ("slow query, missing index, lock contention").
- Instructions that contradict another context layer (system prompt, CLAUDE.md, a sibling skill) cost reasoning on every turn and resolve unpredictably. Grep for the opposite rule before adding one.
- "Think hard", "think step by step", or "show your reasoning" lines are dead weight for models that already reason adaptively; delete them rather than adding more.
- Long example blocks anchor the model on the example. A well-shaped interface (an enum of states plus one rule) constrains better than three worked samples.
- Editing an eval prompt so it routes correctly deletes the signal and keeps the bug; fix the description instead.

More field lessons, the nine skill categories, and the Claude 5 context rules: [skill-patterns.md](references/skill-patterns.md). All references: [TOPIC_MAP.md](references/TOPIC_MAP.md).

## Validate
```bash
node .agents/tools/validate-agents.mjs .agents       # frontmatter, house sections, links, orphans
node .agents/tools/tokens-report.mjs .agents --check # 100-token description, 3000-token body
node .agents/tools/run-evals.mjs .agents --check --min-rank1 95
pnpm run catalog:generate && pnpm run catalog:check  # README and docs catalog, 35-skill ceiling
```

## Stop
- The closest existing skill could carry this as a section. Extend it instead.
- The catalog is at the 35-skill ceiling. Merge or retire a skill before adding one; do not raise the ceiling to fit.
- The body is all prose with no command, table, or gotcha. It is a blog post the model already knows.
- A new rule has no failing prompt behind it.

## Rules
- The description is the only text the router sees; spend its budget on distinctions and trigger words. Shape it as `<what>. Use for <scope>. Trigger on '<phrase a user types>', ...`: models skip a skill on small tasks unless its description names the ask, and the catalog row drops the trigger sentence.
- Every negative boundary names the sibling that wins, by exact folder name.
- Keep references lazy, grouped so one task needs one read, and one hop from SKILL.md or its TOPIC_MAP.md; a reference over 100 lines opens with `## Contents`.
- A split is done only when the new owner executes every advertised task and every caller, eval, and link points at it.
- Frontmatter here is limited to `name`, `description`, `license`, `allowed-tools`, `metadata`, and `compatibility`; client-specific features ship through plugin packaging, not extra fields.

## Checklist
- [ ] The wrong decision this skill prevents is named, with a prompt that showed it.
- [ ] Deduplicated against the two closest skills; one category only.
- [ ] Description built from real prompts; at least three positive and two negative evals, each negative naming its owner.
- [ ] Body carries gotchas, a decision table, and real commands.
- [ ] References mapped by when to open them; none orphaned.
- [ ] All validators clean; catalog regenerated; skill count at or under 35.
- [ ] Trialed on a real task.
