---
name: web-scraping
description: |
  Collect data from websites with respectful, robust scraping. Use for HTML parsing, pagination, rate limiting, retries, selector stability, API fallbacks, and saving structured results.
---

# Web Scraping

## Workflow
1. Check for an official API or sitemap before scraping; prefer the documented interface.
2. Inspect robots.txt and terms; set a polite rate limit and identify the client.
3. Fetch with retries and backoff; cache responses to avoid repeat requests.
4. Extract with a structured parser (CSS or XPath selectors); keep selectors in one place.
5. Handle pagination, empty results, and layout changes; assert on invariants.
6. Save structured output (JSON or CSV) and validate counts against known totals.

## Rules
- Never bypass rate limits, auth walls, or anti-bot measures.
- Cache before refetching; log requests and failures.
- Prefer the data contract over selector magic; document both.
- Do not run heavy scrapes against production systems without approval.

## Checklist
- [ ] API or sitemap checked first; terms respected.
- [ ] Retries, rate limits, and caching in place.
- [ ] Structured output validated against invariants.
