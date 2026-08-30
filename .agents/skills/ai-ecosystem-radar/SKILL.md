---
name: ai-ecosystem-radar
description: |
  Produce a recurring digest of the AI, LLM and coding-agent tooling ecosystem from trending repositories, community threads, Hacker News, model hubs and vendor changelogs. Use for a daily or weekly radar backed by raw per-source dumps.
license: MIT
---

# AI ecosystem radar

## Preflight
```bash
gh auth status                              # the GitHub search API needs auth to be reliable
ls radar/RADAR_*.md 2>/dev/null | tail -1   # when was the last run? the window starts there
```

Fix the collection window before collecting anything. A digest without a stated window cannot be compared to the previous one, and every claim in it becomes unfalsifiable.

## Output contract
```
radar/
  RADAR_<YYYY-MM-DD>.md    # the deliverable
  raw/                     # one timestamped file per source
```

Never overwrite an old run; the filename carries the date. Every numeric claim in the report must point at a file in `raw/`.

Fixed section order, so a returning reader finds the same thing in the same place: header with window and sources, `TL;DR` of six to eight numbered concrete changes, community threads, GitHub trending, Hacker News, tooling changelogs, models and research, then findings mapped to actions.

## Workflow
1. Start the slowest collector in the background — community feeds are rate-limited and dominate wall-clock.
2. Collect GitHub trending and the search queries while that runs.
3. Collect Hacker News, then fetch the two highest-engagement stories in full. Titles are not evidence.
4. Collect model-hub trending and vendor changelogs.
5. Analyze each raw dump into a per-source summary as it lands.
6. Consolidate into the fixed structure and verify every number resolves to a raw file.

```bash
# repos that appeared recently and actually took off
gh api "search/repositories?q=created:>$SINCE+stars:>200&sort=stars&order=desc&per_page=20" \
  --jq '.items[] | "\(.full_name) | \(.stargazers_count) | \(.language) | \(.created_at[0:10])"'

# harness ecosystem movement by topic
gh api "search/repositories?q=topic:$TOPIC+pushed:>$RECENT&sort=stars&order=desc&per_page=15" \
  --jq '.items[] | "\(.full_name) | \(.stargazers_count) | \(.description)"'

# Hacker News, no auth required
curl -s "https://hn.algolia.com/api/v1/search?query=$Q&tags=story&numericFilters=created_at_i>$SINCE,points>40&hitsPerPage=8"
```

## Source table

| Source | Access path | Trap |
|---|---|---|
| GitHub trending | fetch the trending pages | scraped HTML shifts; prefer the search API where it answers the question |
| GitHub search | `gh api search/repositories` | unauthenticated calls throttle hard and silently truncate |
| Reddit | RSS with a browser user-agent | the JSON endpoints return 403; RSS still throttles to 429 in bursts |
| Hacker News | Algolia search API | title-only reading produces a digest of headlines, not findings |
| Model hubs | trending and papers pages | trending is popularity, never quality |
| Vendor changelogs | fetch plus dated search | undated entries are unusable; record the fetch date |

## Stop
- A source returns 429. Back off and serialize; never run two collection rounds against one host at once, and never fire ad-hoc requests during a batch — they share the same IP budget and take everything down with them.
- A raw dump is large. Read it in pages or grep for section headers rather than pulling the whole file into context.
- A repo claims a performance or cost win with no independent benchmark. Report the claim as a claim. Star counts are not a benchmark, and measured numbers have repeatedly come in far below announced ones.

## Rules
- Cross-source corroboration is the product. The same signal in threads, Hacker News and trending is a movement; one loud post is not.
- Separate signal from recurring complaint. Usage-limit grumbling is weekly noise; a reproducible regression is a finding.
- Concrete numbers beat adjectives. "8.5% measured against 65% claimed" beats "disappointing".
- Close with actions mapped to the reader's own stack, not a list of links.
- Deep verification of a single claim is `web-research`; version and end-of-life checks are `knowledge-freshness`.

## Checklist
- [ ] collection window and source list stated in the header
- [ ] one raw file per source, timestamped, nothing overwritten
- [ ] all sections present in the fixed order
- [ ] every numeric claim traceable to a raw file
- [ ] performance and cost claims marked as claims unless independently benchmarked
