---
name: web-scraping
description: |
  Collect data from websites with robust scraping. Use for extracting listings and tables into CSV or JSON, HTML parsing, JavaScript-rendered pages, pagination, rate limiting, retries, block detection, selectors that keep breaking, and structured output.
---

# Web Scraping

## Preflight
```bash
curl -sS https://site/robots.txt | head -20
curl -sS -A 'Bot (contact@example.com)' https://site/page | rg -o '__NEXT_DATA__|application/ld\+json' | head
```

Check for an API, a sitemap, embedded JSON, and the page's own endpoint before reaching for a browser. Most "we need Playwright" conclusions skip these.

## Workflow
1. Look for an official API or a sitemap **before** scraping. The documented interface is faster, stabler, and allowed.
2. Read robots.txt and the terms; set a polite rate limit and identify the client with a real User-Agent and contact.
3. Data missing from the raw HTML? Escalate deliberately (below) — a headless browser is the last resort, not the first.
4. Fetch with bounded retries and backoff; cache responses so a re-run costs nothing.
5. Extract with a structured parser, selectors kept in one place.
6. Handle pagination, empty results, and layout change; assert on invariants.
7. Save structured output and validate counts against a known total.

## Escalation Ladder
Each rung costs an order of magnitude more than the one above it.

| Rung | Try | How to check |
|---|---|---|
| 1 | Official API | docs, `/api`, developer portal |
| 2 | Sitemap or feed | `/sitemap.xml`, `/rss`, `/feed` |
| 3 | Embedded JSON in the HTML | `__NEXT_DATA__`, `application/ld+json`, a `window.__STATE__` blob |
| 4 | The JSON endpoint the page itself calls | DevTools → Network → XHR/Fetch |
| 5 | Headless browser | only when rendering is genuinely required |

```bash
curl -sS -A 'ResearchBot (contact@example.com)' "$URL" | rg -o '__NEXT_DATA__.*?</script>' | head -c 400
curl -sS "$URL" | rg -o '<script type="application/ld\+json">.*?</script>'
```

Rungs 3 and 4 return clean structured data and skip selectors entirely — most "we need Playwright" conclusions are reached without checking them.

## Retry Only What Is Retryable

| Status | Action |
|---|---|
| 429 | honor `Retry-After`; otherwise exponential backoff **with jitter** |
| 502, 503, 504 | retry, bounded |
| Connection / read timeout | retry, bounded |
| 401, 403 | **stop** — a decision, not a hiccup |
| 404 | **stop** — record and move on |
| 200 with an error body | **stop** — detect it, do not count it as success |

Without jitter, parallel workers resynchronize into bursts and recreate the 429 they were backing off from.

## Detect Being Blocked, Then Halt

| Signature | Meaning |
|---|---|
| Clustered 403 or 429 across workers | rate-limited or IP-flagged |
| Redirect to a challenge or login page | bot detection triggered |
| Body far smaller than a normal record | a stub or a soft block |
| 200 whose content is an error page | soft block — the worst kind, it looks like data |

Halt and report. Continuing produces a dataset full of error pages that looks complete.

## Resumability
Long runs get interrupted; assume it.

```python
# checkpoint after each page, dedupe on a stable record id
state = {"cursor": last_cursor, "seen_ids": set(...)}
```

Listings shift between requests — an item moves to page 2 while you read page 3 — so pagination alone loses and duplicates rows. Deduplicate on a stable id, not on position.

## Reference Routing
- Rendered-page tactics, block signatures, retry policy, checkpointing, personal-data duties: [resilient-scraping.md](references/resilient-scraping.md)

## Stop
- Block signatures appear — clustered 403/429, a challenge redirect, or a 200 whose body is an error page. Halt and report.
- The task requires bypassing a rate limit, an auth wall, or anti-bot measures. Stop; "technically possible" is not the standard.
- Personal data would be stored without a stated purpose. Confirm first — robots.txt does not grant that.

## Rules
- Never bypass rate limits, auth walls, or anti-bot measures. "Technically possible" is not the standard.
- Names, emails, addresses, and profile content are personal data. Collecting it carries obligations **regardless of robots.txt**: have a stated purpose, keep the minimum, and confirm before storing it.
- Cache before refetching, and log every request and failure. A scrape you cannot audit is one you cannot defend.
- Prefer the data contract over selector magic: document what each field means and where it comes from, so a layout change is a small fix instead of an archaeology project.
- Do not run heavy scrapes against production systems without approval.
- Answering a question from sources belongs to `web-research`; profiling the extracted rows to `data-analysis`.

## Checklist
- [ ] API, sitemap, embedded JSON, and the page's own endpoint all checked before rendering.
- [ ] robots.txt and terms read; client identified; rate limit polite.
- [ ] Retries scoped to retryable statuses, with jitter; block detection halts the run.
- [ ] Run is resumable from a checkpoint and deduplicated on a stable id.
- [ ] Output structured and validated against a known total.
- [ ] Personal data justified, minimized, and confirmed before storage.
