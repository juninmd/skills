---
name: skill-creator
description: |
  Design and build high-quality agent skills. Use for SKILL.md authoring, frontmatter, workflow and checklist design, reference routing, token budgets, and validating skills against the spec.
---

# Skill Creator

## Preflight
```bash
node .agents/tools/run-evals.mjs .agents | head -3     # current routing health
rg -l 'description:' .agents/skills/*/SKILL.md | wc -l  # what already exists
```

Name the decision the agent gets wrong today without this skill. If you cannot name one, there is no skill here.

## Workflow
1. Name the decision the agent gets **wrong today** without this skill. If you cannot name one, there is no skill here.
2. Deduplicate before writing: search existing descriptions, name the closest two, and justify why this is a separate decision domain rather than a section inside one of them.
3. Write a description that names the **trigger**, not the topic.
4. State the negative boundary: what this is NOT for, and which sibling owns that instead, by exact folder name.
5. Write the body to the house structure: `## Preflight`, `## Workflow`, at least one decision table and one command block, `## Stop`, `## Rules`, `## Checklist`.
6. Keep it inside the budgets. Overflow moves to `references/` behind one routing line.
7. Validate, then trial it on a real task.

## Trigger, Not Topic
The description is the only thing the router sees. It must contain the words a user would actually type.

| Weak | Strong |
|---|---|
| "About databases" | "slow query, missing index, lock contention, migration rollback" |
| "Helps with testing" | "flaky test, fixture leak, coverage gap, failing test first" |
| "Frontend best practices" | "hydration mismatch, bundle size, server/client boundary" |

Write the description **after** you can list five prompts that should route here — then make sure their vocabulary is in it.

## Body Structure That Earns Its Tokens
A workflow alone is generic. What makes a skill non-generic is the material the agent cannot derive:

| Section | Contains | Required |
|---|---|---|
| `## Preflight` | the commands that establish state before acting | **yes** |
| `## Workflow` | numbered, execution order, one decision per step | **yes** |
| Decision table | symptom → action, or option → tradeoff | **yes**, at least one |
| Command block | the real invocation, with the flags that matter | **yes**, at least one |
| Trap table | the failure that looks like success | where the value usually is |
| `## Stop` | the conditions that halt the work and get reported | **yes** |
| `## Excuses` | excuse → why it is false | high-risk skills only |
| `## Rules` | judgment specific to this domain | **yes** |
| `## Checklist` | verifiable end state, not intentions | **yes** |

The six marked required are enforced by `validate-agents.mjs`. A skill without them is a blog post the model already knows.

Add `## Excuses` where the failure mode is **talking yourself out of a known step** — skipping the failing test, deleting on a clean grep, merging past an open comment. Another rule does not help; the rule was never missing. Phrase each excuse as it would be said, then the line that kills it. Opt in via `EXCUSES_REQUIRED`.

## Budgets

| Limit | Value | Enforced by |
|---|---|---|
| Body words | 1000 | `validate-agents.mjs` |
| Body tokens | 1650 | `tokens-report.mjs` |
| Description tokens | 100 (1024 chars is the spec limit) | `tokens-report.mjs` |
| Catalog tier-1 total | 5100 | `tokens-report.mjs` |

Tier 2 loads only on activation, so depth in the body costs nothing until the skill is picked. Tier 1 is re-sent every turn — that is the budget to defend.

## Validate

```bash
node .agents/tools/validate-agents.mjs .agents      # frontmatter, links, budgets, siblings
node .agents/tools/tokens-report.mjs .agents --check
node .agents/tools/run-evals.mjs .agents            # routing: does it win its own prompts?
```

Every skill needs `.agents/evals/<name>.json` with at least 3 positive and 2 negative prompts. When a prompt routes to the wrong skill, **fix the description** — editing the prompt to match deletes the signal and keeps the bug.

## Anti-patterns
- A description naming a domain instead of a trigger.
- A workflow that is a topic list with no execution order.
- Rules restating the shared operating contract instead of adding domain judgment.
- No negative boundary, so the skill absorbs work a sharper one owns.
- References split so finely that one flow needs four reads.
- All prose, no commands, no tables — indistinguishable from a blog post the model already knows.

## Stop
- The closest existing skill could carry this as a section. Extend that skill instead of adding one.
- The description names a topic rather than triggers. Rewrite it; the router only sees this text.
- The body is all prose, with no command, table, or trap. It is a blog post the model already knows.

## Rules
- One skill per decision domain. Overlapping skills waste context and split routing between them.
- Every skill names at least one sibling it hands work to, by exact folder name — a skill that names none cannot route away from itself.
- Keep references lazy: link, never inline. Group them so one task needs one read.
- Match the shells and tooling the repository actually uses.
- Repository-wide agent context belongs to `agents-md`, never to a skill.

## Checklist
- [ ] The wrong decision this skill prevents is named.
- [ ] Deduplicated against the two closest existing skills, with the reason stated.
- [ ] Description states triggers; five example prompts route here.
- [ ] Body carries commands, tables, or traps — not only prose.
- [ ] Negative boundary names the sibling that owns the excluded work.
- [ ] Within all four budgets; evals written; all three validators clean.
- [ ] Trialed on a real task before being called done.
