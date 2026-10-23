# Benchmark

Two measurements, both offline after the clone and both reproducible:

```bash
node .agents/tools/benchmark-catalogs.mjs   # whole catalogs
node .agents/tools/benchmark-skills.mjs     # most-installed skills, head to head
```

Snapshot: 2026-10-23. Tokens are estimated as characters / 4. Tier 1 is `name + description`, paid on every turn; tier 2 is the `SKILL.md` body, paid once the skill is selected.

## Most-installed skills against their owner here

Installs come from the [skills.sh](https://skills.sh/) all-time leaderboard. Rows marked `n/a` are widely used skills outside its top 30, kept because they cover the same jobs. Each pair is `theirs/ours`.

| Skill | Installs | Owner here | Tier 1 | Tier 2 | Files | Contract | Route |
|---|---:|---|---:|---:|---:|---:|---:|
| mattpocock/improve-codebase-architecture | 1.2M | software-architecture | 39/95 | 1446/1435 | 2/17 | 0/7 | 33 |
| heygen-com/hyperframes | 1.2M | motion-video | 76/95 | 1710/1492 | 76/34 | 1/7 | 1 |
| mattpocock/tdd | 1.1M | test-engineering | 39/85 | 860/1774 | 3/31 | 1/7 | 1 |
| mattpocock/handoff | 1.0M | starting-dev | 24/99 | 183/2073 | 1/20 | 0/7 | 1 |
| anthropics/frontend-design | 1.0M | frontend-engineering | 56/97 | 2269/1465 | 1/30 | 0/7 | 1 |
| mattpocock/triage | 988K | requirements-planning | 36/85 | 1589/2184 | 3/11 | 0/7 | 1 |
| mattpocock/prototype | 985K | starting-dev | 48/99 | 677/2073 | 3/20 | 1/7 | 2 |
| mattpocock/domain-modeling | 875K | software-architecture | 42/95 | 757/1435 | 3/17 | 0/7 | 1 |
| mattpocock/codebase-design | 848K | software-architecture | 71/95 | 1440/1435 | 3/17 | 0/7 | 1 |
| mattpocock/diagnosing-bugs | 833K | observability | 44/98 | 2116/2212 | 2/17 | 0/7 | 1 |
| vercel-labs/vercel-react-best-practices | 833K | frontend-engineering | 90/97 | 1702/1465 | 75/30 | 1/7 | 1 |
| mattpocock/code-review | n/a | code-review | 109/91 | 1545/2489 | 1/14 | 0/7 | 2 |
| anthropics/skill-creator | n/a | skill-authoring | 84/91 | 8157/1720 | 17/5 | 1/7 | 1 |
| obra/test-driven-development | n/a | test-engineering | 26/85 | 2357/1774 | 1/31 | 2/7 | 12 |
| obra/systematic-debugging | n/a | observability | 29/98 | 2342/2212 | 10/17 | 1/7 | 1 |
| obra/writing-plans | n/a | requirements-planning | 25/85 | 2548/2184 | 0/11 | 1/7 | 1 |
| obra/finishing-a-development-branch | n/a | finishing-dev | 34/98 | 1893/2452 | 0/10 | 2/7 | 10 |

- **Contract** counts the seven house-contract parts from `AGENTS.md` (preflight, numbered workflow, decision table, command block, stop, rules, checklist). It is this repository's standard, so other catalogs are not expected to score on it.
- **Route** sends the competitor's own description to this catalog's offline router and reports the rank of the owner. Rank 1 means a request for that job reaches the owner here. It is a lexical signal, not proof of model behavior.

### Reading it

- **Cost.** Our tier 1 runs about 2x theirs: one owner covers what they split into several single-purpose skills, so its description carries more triggers. The bodies land in the same range (1.4k–2.5k tokens); `anthropics/skill-creator` is the outlier at 8.2k.
- **Depth.** Our owners ship more reference files (median 17 against 3), loaded only on demand. Two catalogs go further on breadth: `hyperframes` and `vercel-react-best-practices` each ship 75+ files.
- **Routing.** 12 of 17 rank 1. The misses:
  - `improve-codebase-architecture` (rank 33): its description uses the author's own vocabulary ("deepening opportunities", "grill"), with no term our router knows. The job still belongs to `software-architecture`.
  - `obra/test-driven-development` (12) and `obra/finishing-a-development-branch` (10): their descriptions state only when to trigger ("before writing implementation code"), not what the skill does, so they carry no domain term.
  - `prototype` (2, `frontend-engineering` first) and `mattpocock/code-review` (2, `finishing-dev` first): near misses between neighbors that both legitimately mention the topic.

## Catalogs

Skills are deduplicated by content hash; `mirror` counts the copies dropped.

| Catalog | Skills | Tier 1 total | Tier 1 / skill | Tier 2 / skill | Tier 2 max | Checklist % | Eval files | Mirror |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| sickn33/agentic-awesome-skills | 4331 | 180212 | 42 | 2042 | 12151 | 0 | 36 | 4135 |
| affaan-m/ECC | 926 | 46814 | 51 | 1868 | 10452 | 0 | 0 | 136 |
| github/awesome-copilot | 460 | 39419 | 86 | 2133 | 72802 | 1 | 0 | 0 |
| alirezarezvani/claude-skills | 450 | 50781 | 113 | 1994 | 8250 | 0 | 59 | 1586 |
| wshobson/agents | 185 | 13078 | 71 | 1258 | 6480 | 0 | 2 | 0 |
| K-Dense-AI/scientific-agent-skills | 177 | 17899 | 101 | 3268 | 7570 | 0 | 0 | 0 |
| deanpeters/Product-Manager-Skills | 77 | 3648 | 47 | 3938 | 10463 | 0 | 0 | 0 |
| Jeffallan/claude-skills | 67 | 7657 | 114 | 1313 | 1893 | 0 | 0 | 0 |
| mattpocock/skills | 38 | 1505 | 40 | 1060 | 3108 | 0 | 0 | 0 |
| **juninmd/skills** | 36 | 3328 | 92 | 1666 | 2489 | 100 | 68 | 36 |
| NVIDIA/SkillSpector | 33 | 727 | 22 | 140 | 1821 | 0 | 0 | 0 |
| addyosmani/agent-skills | 25 | 2381 | 95 | 3285 | 5131 | 0 | 90 | 25 |
| anthropics/skills | 20 | 2461 | 123 | 3463 | 25991 | 0 | 7 | 0 |
| OthmanAdi/planning-with-files | 17 | 2596 | 153 | 2922 | 9167 | 0 | 1 | 1 |
| obra/superpowers | 15 | 673 | 45 | 2291 | 4813 | 0 | 0 | 0 |
| microsoft/SkillOpt | 5 | 554 | 111 | 1830 | 2323 | 0 | 0 | 0 |

Our 36 mirrored copies are the generated `plugins/` packaging of `.agents/skills`, not duplicated content.
