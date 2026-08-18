# Catalog Benchmark

How this catalog compares to the largest public agent-skill repositories, what
was adopted from them, and what was deliberately not.

Measured 2026-08-18 with [`.agents/tools/benchmark-catalogs.mjs`](https://github.com/juninmd/skills/blob/master/.agents/tools/benchmark-catalogs.mjs).
Re-run it to reproduce every number here:

```bash
node .agents/tools/benchmark-catalogs.mjs
```

## Method

Sixteen catalogs were cloned and measured directly from their source, not from
their READMEs. Two details matter for reading the table:

- **`SKILL.md` files are deduplicated by content hash.** Several catalogs mirror
  the same skills into `.claude/`, `.gemini/`, `.codex-plugin/` and `.opencode/`.
  Counting those copies inflates a catalog by up to 3x — `sickn33` ships 4,081
  duplicate files, `alirezarezvani` 1,337. Advertised skill counts are usually
  the inflated number.
- **Tier 1 and tier 2 are billed differently.** Tier 1 is `name + description`,
  loaded for every skill on every turn. Tier 2 is the `SKILL.md` body, loaded
  only after the skill is selected. Tokens are estimated at 4 characters each.

## The landscape

| Catalog | Stars | Skills | Tier-1 total | Tier-1/skill | Tier-2/skill | Largest skill | Checklist | Eval files |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| sickn33/agentic-awesome-skills | 45.1k | 2277 | 102,625 | 45 | 2197 | 16,745 | 0% | 36 |
| affaan-m/ECC | 240.7k | 894 | 42,279 | 47 | 1796 | 7,518 | 0% | 0 |
| github/awesome-copilot | 38.0k | 427 | 35,376 | 83 | 2097 | 72,802 | 0% | 0 |
| alirezarezvani/claude-skills | 24.6k | 421 | 45,722 | 109 | 1990 | 7,683 | 0% | 2 |
| wshobson/agents | 38.9k | 180 | 12,592 | 70 | 1326 | 6,480 | 0% | 0 |
| K-Dense-AI/scientific-agent-skills | 33.8k | 163 | 17,067 | 105 | 2870 | 7,368 | 0% | 0 |
| deanpeters/Product-Manager-Skills | 6.5k | 77 | 3,648 | 47 | 3938 | 10,463 | 0% | 0 |
| Jeffallan/claude-skills | 11.1k | 67 | 7,657 | 114 | 1279 | 1,859 | 0% | 0 |
| **juninmd/skills** | — | **38** | **2,189** | **58** | **360** | **589** | **100%** | **39** |
| mattpocock/skills | 220.4k | 35 | 1,465 | 42 | 1032 | 2,920 | 0% | 0 |
| addyosmani/agent-skills | 88.1k | 24 | 1,785 | 74 | 3112 | 5,915 | 0% | 73 |
| NVIDIA/SkillSpector | 14.7k | 24 | 475 | 20 | 166 | 1,734 | 0% | 0 |
| anthropics/skills | 170.0k | 20 | 2,510 | 126 | 3056 | 18,133 | 0% | 0 |
| OthmanAdi/planning-with-files | 26.2k | 18 | 1,697 | 94 | 2556 | 7,210 | 0% | 0 |
| obra/superpowers | 273.2k | 14 | 553 | 40 | 2417 | 7,995 | 7% | 0 |
| microsoft/SkillOpt | 16.1k | 4 | 407 | 102 | 1940 | 2,271 | 0% | 0 |

Stars are a popularity signal, not a quality signal, and they correlate with
nothing else in this table. The two most-starred catalogs ship 14 and 894 skills
respectively.

## Finding 1 — the big catalogs cannot be loaded

The always-on cost of a catalog is its tier-1 total, and it grows linearly with
skill count while the context window does not.

- `sickn33/agentic-awesome-skills`: **102,625 tokens** of descriptions alone.
- `alirezarezvani/claude-skills`: **45,722**.
- `github/awesome-copilot`: **35,376**.

Loading `sickn33` in full spends roughly half of a 200k context window before
the agent has read a single line of the user's code — and it is a *directory*, so
the intent is that you install a subset. But nothing in these repos measures or
enforces that budget, which means the subset you install has an unknown price.

This catalog costs **2,189 tokens** for all 38 skills — about 1% of a 200k
window — and CI fails if that exceeds 2,600.

## Finding 2 — tier-2 discipline is where the gap is widest

Tier-1 cost is roughly comparable across catalogs (40–126 tokens per skill).
Tier-2 is not. On per-skill average this catalog is **2.9x leaner than the next
best** engineering catalog (360 vs 1032 tokens) and **8.6x leaner** than
`addyosmani/agent-skills` (360 vs 3112).

| Catalog | Tier-2 median | Tier-2 max |
|---|---:|---:|
| **juninmd/skills** | **377** | **589** |
| mattpocock/skills | 835 | 2,920 |
| obra/superpowers | 1,727 | 7,995 |
| anthropics/skills | 1,883 | 18,133 |
| addyosmani/agent-skills | 2,914 | 5,915 |
| github/awesome-copilot | 1,536 | **72,802** |

The maximum column is the interesting one. A 72,802-token `SKILL.md` is not a
skill; it is a document that happens to have frontmatter. Once a skill is
selected its whole body enters context, so an unbounded tier-2 turns one routing
decision into a third of a context window.

The 400-word rule and the 700-token ceiling are the reason this column stays
flat here. That is the practice most worth copying from this repo.

## Finding 3 — nobody tests routing, and the spec is widely violated

Checking every catalog against the [Agent Skills spec](https://agentskills.io/specification):

| Violation | Catalogs affected |
|---|---|
| `description` over 1,024 characters | `anthropics/skills` (2), `alirezarezvani` (1), `github/awesome-copilot` (1) |
| Angle brackets in `description` | `alirezarezvani` (58), `sickn33` (10), `github/awesome-copilot` (5) |
| No `## Checklist` in the body | every catalog except this one and `obra/superpowers` (7%) |

Angle brackets matter more than they look: descriptions are interpolated into a
tagged system-prompt block, and a stray `<` can terminate it. The official
validator rejects them; almost nobody runs it.

Only two catalogs ship eval files at all — `addyosmani/agent-skills` (73) and
`sickn33` (36). Everywhere else, the question "does the agent actually pick this
skill?" is answered by vibes.

## What was adopted

**Deterministic routing evals — from `addyosmani/agent-skills`.**
It is the one catalog that treats skill selection as testable: positive prompts
must rank the owning skill in the top *k*, negative prompts must not, and
descriptions are checked for cosine collisions. All of it is offline and CI-safe.
That design is now [`.agents/evals/`](https://github.com/juninmd/skills/tree/master/.agents/evals)
here, with four changes:

| Change | Why |
|---|---|
| BM25 instead of TF-IDF cosine for ranking | Length normalization stops the wordiest description from winning every prompt. Skill descriptions are short documents, which is exactly what BM25 is for. |
| Collisions scored on descriptions only | Their index weights the skill name 2x, which also flows into collision scoring — so two skills with *identical* descriptions score 0.68 and slip under a 0.75 threshold. Dropping the name weight makes it 1.00. |
| Reachability gate | A skill that never ranks first for even its own prompts is unselectable dead weight, paid for on every turn. Nothing in their harness catches it. |
| Routing margin | A rank-1 win by 0.11 is a coin flip once a real model is in the loop. Margin is now reported and warned on, so fragile wins are visible before they become failures. |

Their loader also reads `description` with `/^description:\s*(.+)$/m`, which
silently truncates YAML block scalars — the format every skill in this repo
uses. This implementation parses the frontmatter properly.

**Full spec frontmatter — from `anthropics/skills`.**
The official validator allows six keys: `name`, `description`, `license`,
`allowed-tools`, `metadata`, `compatibility`. This repo previously allowed two
and rejected the rest, which meant a valid skill imported from another catalog
failed validation. The field set now matches the spec, and the extra fields are
type-checked rather than merely tolerated. Along with it came two checks the
official validator has and this one lacked: no angle brackets in `description`,
and no leading, trailing, or doubled hyphens in `name`.

## What was not adopted

- **Breadth for its own sake.** Absorbing 2,000 skills would multiply tier-1 cost
  by 50x for coverage this catalog does not claim. The constraint stays: one
  skill per decision domain.
- **Long-form skill bodies** (`anthropics`, `addyosmani`, `mattpocock`). They read
  well as documents and cost 3–9x more at tier 2. Detail belongs in
  `references/`, loaded on demand.
- **Rich custom frontmatter** (`deanpeters` uses `intent`, `theme`,
  `estimated_time`; `sickn33` uses `risk`, `source`, `date_added`). Useful for a
  marketplace, off-spec for a portable catalog.
- **Agent-executed behavioral evals** (`addyosmani` tier 3). Real value, but they
  spend tokens and cannot run on every pull request. The deterministic tier is
  the part that belongs in CI.

## Gaps closed

Five domains were covered by competitors and absent here. Each was checked
against the existing catalog before being added, and none collides above 0.35
similarity with an existing description.

| Skill | Gap it closes | Prior art |
|---|---|---|
| `api-design` | Contract modeling, versioning, idempotency, error envelopes. Previously scattered across reference files with no owning skill. | `addyosmani/api-and-interface-design` |
| `migration-engineering` | Expand/contract, backfills, dual writes, codemods, cutover and rollback. | `addyosmani/deprecation-and-migration` |
| `accessibility` | WCAG, keyboard, ARIA, focus. Previously one bullet inside `frontend-engineering` and some mobile references. | none of the engineering catalogs owns this |
| `mcp-integration` | Building and consuming MCP servers. `agent-engineering` covered tool schemas generically, not the protocol. | `anthropics/mcp-builder` |
| `cost-engineering` | Cloud and LLM unit economics, budget guardrails. | **none** — no catalog surveyed has this |

## What the evals found on their first run

The harness was pointed at the existing 33 skills before any of them were
touched. It failed immediately, on two real defects:

```
ERROR: knowledge-freshness: 'Is this framework version approaching end of life'
       ranks 5 (needs top 3); winner was 'webapp-testing'
ERROR: project-lifecycle: must not win 'Draft the pull request body for this branch'
       (belongs to 'pr-delivery')
```

The first: the description said "EOL detection". No user types "EOL", so the
skill was unreachable for its own headline use case. The second:
`project-lifecycle` advertised "branches, and pull requests" and
"branch completion, and delivery documentation", which stole prompts belonging
to `pr-delivery`.

Both were fixed in the descriptions, not the prompts. Routing went from 95.6% to
**96.5% rank-1 across 114 prompts**, with a worst-case collision of 0.347 —
comfortably under the 0.45 warning threshold.

That is the argument for the harness in one paragraph: two skills in a
hand-curated, word-budgeted, spec-validated catalog were quietly broken, and no
existing check could see it.

## Where this catalog is not ahead

- `addyosmani/agent-skills` ships **behavioral** evals that execute a skill and
  grade the transcript. Only routing is tested here.
- `NVIDIA/SkillSpector` scans skills for prompt injection and supply-chain risk.
  Worth running against this catalog; not yet wired in.
- `microsoft/SkillOpt` optimizes skill text against measured task outcomes.
  Descriptions here are still tuned by hand.
- `mattpocock/skills` has a leaner tier-1 per skill (42 vs 58). Some descriptions
  here still carry more keywords than they need.
