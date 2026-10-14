# Routing Evals

Every skill in this catalog owns one file here, named after it. The file declares
the prompts the skill **must** win and the prompts it **must** lose to a named
sibling. `pnpm run evals` scores those prompts against the tier-1 catalog and
fails the build when routing regresses.

## Why this exists

A skill catalog has one failure mode that no linter catches: the agent picks the
wrong skill, or picks nothing. At tier 1 the agent sees only `name` and
`description` for every skill, so those two fields are the entire routing
surface. Word-budget and frontmatter checks say nothing about whether they work.

These evals turn that into a gate. They are deterministic and offline — plain
BM25 retrieval, no model, no network, no API key — so they run in CI on every
pull request instead of in a nightly job someone has to pay for.

## What it checks

| Gate | Failure it catches |
|---|---|
| Coverage | A skill was added without evals, so nobody checked whether it routes. |
| Positive rank | A real user phrasing does not reach the skill that owns it. |
| Negative rank | A skill steals prompts that belong to a sibling. |
| Reachability | A skill never ranks first for even its own prompts — it is unselectable dead weight in every context window. |
| Collision | Two descriptions cover the same ground, so one of them always loses. |
| Rank-1 ratchet | Overall routing quality drops below the checked-in baseline (`--min-rank1`). |
| Margin | A skill wins, but by so little that the ranking is effectively a coin flip. Reported as a warning. |

## File format

```json
{
  "skill_name": "migration-engineering",
  "trigger": {
    "positive": [
      { "prompt": "Rename this column with zero downtime", "top_k": 3 }
    ],
    "negative": [
      { "prompt": "Tune this slow PostgreSQL query plan", "owner": "data-engineering" }
    ]
  }
}
```

- `skill_name` must equal the file name and name a real skill.
- At least **3 positive** and **2 negative** prompts.
- `top_k` defaults to 3: the owning skill must rank that high.
- `owner` on a negative prompt names the skill that *should* win it. It must
  exist, which keeps the negatives honest as the catalog changes.

## Running

```bash
pnpm run evals                 # report, with warnings
pnpm run evals:check           # CI gate, ratcheted at 95% rank-1
node .agents/tools/run-evals.mjs .agents --json
```

## Reading a failure

```
ERROR: knowledge-freshness: 'Is this framework version approaching end of life'
       ranks 5 (needs top 3); winner was 'webapp-testing'
```

Fix the **description**, not the prompt. That failure was real: the description
said "EOL detection", and no user types "EOL". Rewriting it to "end-of-life
dates" fixed the routing. Editing the prompt to match the description instead
would have deleted the signal and kept the bug.

## Honest limits

This is a lexical proxy for a model's choice, not a simulation of it. A real
agent reads conversation history, file context, and tool state that this scorer
never sees, so a passing eval is not proof the agent will route correctly.

What it does prove is the necessary condition: the description contains the
vocabulary a user would actually type, and no two descriptions compete for it.
Every failure it has reported so far has been a genuine defect in a description.
