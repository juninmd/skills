# web-research Reference Map

Read only the files needed for the current task.

| Reference | Topic / Description |
|---|---|
| `claim-verification.md` | Decide the factual statements in a document: claims table, original sources, Supported/Partly true/False/Unsourced, offline reasoning check, a fresh re-check after edits, changelog claims against commit history, paywalled/JS-rendered sources: [claim-verification](claim-verification.md) |
| `knowledge-freshness.md` | Check whether a quoted package version, API, or finding is still current: registry lookups per ecosystem, latest-tag vs. latest-stable, yanked/deprecated releases, and staleness windows: [knowledge-freshness](knowledge-freshness.md) |
| `resilient-scraping.md` | Escalate past raw HTML for JS-rendered pages (embedded JSON, the page's own network request, headless browser last), detect blocks before an IP/account ban, apply retry-vs-permanent status handling, and checkpoint/dedupe a resumable crawl: [resilient-scraping](resilient-scraping.md) |
| `search-technique.md` | Sharpen query construction and source weighing when results are noisy, exhausted, or stale — quoting, site scoping, reformulating from symptom to mechanism, handling a rate-limited or blocked search engine: [search-technique](search-technique.md) |
| `web-scraping.md` | Check for an official API or sitemap before scraping, follow the escalation ladder from embedded JSON to a headless browser, and set bounded retries/backoff and rate limits for HTML table or listing scraping: [web-scraping](web-scraping.md) |
