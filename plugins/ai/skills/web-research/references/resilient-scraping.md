# Resilient Scraping

## JavaScript-rendered pages

The raw HTML often does not contain the data. Work down this list before starting a browser:

1. **Embedded JSON.** View the page source and search for the value you want. It is frequently already there inside a hydration payload — a `<script type="application/json">` block, a `__NEXT_DATA__`/`__NUXT__`-style global, or a `application/ld+json` block. Parse that JSON instead of the DOM: it is structured, complete, and far more stable than selectors.
2. **The underlying data request.** Open the network panel, filter to XHR/fetch, and reload. The page is calling an endpoint that returns exactly the records you want, usually with clean pagination parameters. Replay it directly with the headers it needs (often just an accept header and a token). This is 10-100x cheaper than rendering and usually more complete than the page shows.
3. **A server-rendered variant.** Mobile subdomains, print views, AMP-style pages, RSS feeds, and sitemap-linked pages are often plain HTML.
4. **Headless browser, last.** Only when content is generated client-side with no reachable endpoint, or the request is signed in a way you cannot reproduce. Budget for it: an order of magnitude more CPU, memory, and time per page. Block images, fonts, and analytics; reuse one browser with fresh contexts; wait on a specific element or response, never a fixed sleep.

## Block detection

Stop the run when any of these appear; continuing gets the IP or account banned and pollutes the dataset with garbage rows:

- A cluster of 403 or 429 responses, or a sudden change in status code distribution.
- A redirect to a challenge, captcha, consent wall, or login page.
- A 200 whose body is an error, captcha, or "unusual traffic" page — status codes lie; assert on content.
- A response body far smaller (or far more uniform) than a normal record; add a minimum-size and required-field assertion per page.
- Parse success rate collapsing across consecutive pages, which is also the signature of a layout change.

Reaction: halt, persist the checkpoint, log the last successful URL, and report. Do not rotate identities to get around it.

## Retry policy

```
retryable = {429, 502, 503, 504} ∪ {connect timeout, read timeout, connection reset}
permanent = {400, 401, 403, 404, 410, 422}
```

- Never retry a permanent status. It is an answer, not a hiccup — retrying produces a tight loop against a decision that will not change.
- Cap attempts (3-5) and cap total elapsed time per item.
- Honor `Retry-After` when present (both the seconds form and the HTTP-date form); it overrides your backoff.
- Otherwise back off exponentially with full jitter — `sleep = random(0, base * 2^attempt)`. Without jitter, parallel workers that fail together retry together and re-create the burst that got them throttled.
- Distinguish a retry budget per item from a global failure rate: if more than a few percent of requests are failing, the target is telling you something. Stop.

## Checkpointing and deduplication

- Persist progress after each page or batch: the last completed cursor or page number, and the set of record ids already written. A crash or a rate-limit halt then resumes instead of restarting from zero.
- Write output append-only (JSON Lines) with an atomic rename on rotation, so a kill mid-write does not corrupt the file.
- Deduplicate on a stable record identifier, not on position. Listings reorder between requests, so offset-based pagination silently repeats and skips records; prefer a cursor or a stable sort key, and expect overlap either way.
- Record the fetch timestamp and source URL per record; that is what makes a partial dataset auditable and re-runnable.

## Personal data

Names, emails, phone numbers, addresses, photos, and profile content are personal data. Public visibility is not consent, and a permissive robots.txt grants nothing legally:

- Have a specific, stated purpose before collecting it, and collect only the fields that purpose needs.
- Prefer aggregates or hashed identifiers over storing raw records.
- Know the retention period and deletion path before the first run.
- Confirm with the requester when a scrape will store personal data; treat special categories (health, biometrics, political or religious affiliation, sexual orientation) as out of scope without explicit legal sign-off.
