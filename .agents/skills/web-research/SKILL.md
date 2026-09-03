---
name: web-research
description: |
  Research questions with live web sources and cited evidence. Use for multi-source web search, search operators, fetching pages, verifying claims, resolving conflicting sources, synthesizing findings, and citing them with dates.
---

# Web Research

## Preflight
Set the budget before the first query — a source count or a time box — and write down the question in one sentence.

```bash
date -u +%F      # every finding is stamped with this
```

Decide up front what would change your answer. Research with no stopping condition does not stop.

## Workflow
1. Turn the question into concrete search terms and a source list: official docs, release notes, issue trackers, repositories, vendor pages.
2. Search with operators, not sentences.
3. When results start repeating, **reformulate** instead of paging.
4. Fetch multiple **independent** sources — for a defect or a behavior change, the issue tracker and changelog beat any landing page.
5. Verify every claim against the fetched page. Record URL, publication date, and title.
6. Synthesize with citations, separating confirmed from uncertain, and state the as-of date and the gaps.

## Operators, Not Sentences

| Move | Query |
|---|---|
| Exact phrase, including an error string | `"TypeError: cannot read properties of undefined"` |
| Scope to the authority | `site:github.com/OWNER/REPO is:issue "timeout"` |
| Scope to docs | `site:docs.python.org asyncio.to_thread` |
| Exclude the noise | `nextjs hydration -medium.com -w3schools` |
| Pin the version | `"react 19" useOptimistic breaking` |
| Find the change, not the tutorial | `"BREAKING" OR "migration" site:github.com/OWNER/REPO/releases` |

## Reformulate, Do Not Page
Page two is rarely better than a different question. Move along this ladder:

1. **Symptom** — "app crashes on startup"
2. **Literal error** — the exact string, in quotes
3. **Mechanism** — "module resolution ESM CJS interop"
4. **Source vocabulary** — the term the maintainers use in their own issues

Each step narrows to a smaller, more expert corpus. Adopting the primary source's vocabulary is what unlocks the real results.

## Agreement Is Not Confirmation
Generated and SEO-farmed pages paraphrase one another. Five matching results are frequently one source, replicated.

| Check | How |
|---|---|
| Trace to origin | who first published this? does everyone cite the same post? |
| Count **distinct** origins | two independent origins beats ten copies |
| Prefer primary | the maintainer's issue over an article about the issue |
| Date it | a commit, tag, or archive date — not a "last updated" stamp with no content change |

An undated page cannot support a claim about what is current. Treat it as unusable for that purpose.

## Budget and Stop
Set the budget **before** starting — a source count or a time box — and stop when new sources stop changing the answer. Then report what is still uncertain; an answer that hides its gaps is worse than one that names them.

## When Sources Conflict
1. Prefer the primary and the more recent.
2. Check whether they describe **different versions or contexts** — most conflicts dissolve here.
3. If the conflict survives, present both, with dates, and say which you would act on and why.

## Reference Routing
- Operators, reformulation moves, date verification, source-independence checks, stopping and conflict rules: [search-technique.md](references/search-technique.md)

## Stop
- Every supporting page is undated. It cannot support a currency claim — say so rather than dressing it as fact.
- Sources agree but trace to one origin. That is replication, not confirmation; keep looking or report the uncertainty.
- New sources have stopped changing the answer. Stop and report the remaining uncertainty.

## Rules
- Answer versioned, dated, or changing facts only from fetched sources. Stable conceptual questions can be answered directly — fetching for those is theatre.
- Cite every factual claim with a source URL and its date. A synthesis without citations cannot be checked, and will be repeated as fact.
- Never present a summary of search snippets as a verified answer. Fetch the page.
- Respect robots and terms; no scraping of paywalled or blocked content — bulk extraction belongs to `web-scraping`.
- Library API, config, and version specifics go to `docs-verification`; judging whether local knowledge is stale to `knowledge-freshness`; a recurring digest of the AI tooling ecosystem to `ai-ecosystem-radar`.

## Checklist
- [ ] Question turned into operator-shaped queries, not a sentence.
- [ ] Reformulated up the ladder rather than paging through results.
- [ ] Distinct primary origins fetched and counted — not repeated copies.
- [ ] Every claim carries a URL and a verified date.
- [ ] Budget respected; remaining uncertainty and conflicts stated with the as-of date.
