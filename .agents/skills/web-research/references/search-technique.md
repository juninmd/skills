# Search Technique and Source Weighing

## Query construction

- Quote exact phrases: an error message, a config key, a function signature. Unquoted, the engine stems and synonymizes them into noise.
- Scope with a site filter to reach a single origin (`site:` the vendor domain, the docs subdomain, the repo host). One well-scoped query beats three broad ones.
- Exclude a term with a leading minus when one popular product or tutorial farm floods the results.
- Restrict by file type when you want a spec or a paper rather than a blog.
- Include the version number, release tag, or exact error string verbatim — that is what appears in issue titles and changelogs.
- Search the vocabulary the maintainers use, not the vocabulary of the question. Find one primary page, take its terms, and re-query.

## Reformulating

Results repeating themselves means the query is exhausted, not that the answer is settled. Change the approach rather than paging deeper:

- Move from the symptom to the mechanism ("app crashes on upload" → the actual exception class).
- Search inside the source: the project's issue tracker (including closed and rejected issues), pull requests, changelog, release notes, migration guide, and the commit history for the file in question.
- Try the discussion venues where practitioners answer with detail, then trace whatever they claim back to the source.
- Ask the inverse question ("why was X removed") or search for the workaround name.

For anything behavioral — a bug, a default that changed, a deprecation — the issue tracker and release notes are authoritative and dated. Landing pages, marketing docs, and tutorials are neither.

## Dates

- Prefer a date you can verify: a commit, a tag, a release entry, an archive snapshot.
- Treat a "last updated" stamp as unreliable when the content shows no corresponding change; many sites re-stamp on every deploy.
- A page with no date at all is unusable as evidence of currency. Use it for concepts, never for "this is how it works today".
- Record the date you checked alongside the source's own date; the gap between them is part of the answer.

## Source independence

Modern search results are heavily contaminated by generated and syndicated content. Several pages saying the same thing is weak evidence, not strong: they frequently descend from one original — often itself a model's summary of documentation that has since changed.

Before counting agreement:

1. Look for the earliest version of the claim. Following the citation chain usually ends at one document or one issue comment.
2. Check whether the wording is near-identical across sources; paraphrase clusters indicate copying.
3. Count distinct origins, not distinct URLs. Two origins that actually disagree are more informative than ten that match.

## When the Search Itself Is Blocked or Rate-Limited
The search step can be throttled independently of any single page fetch — a search API, not just a target site, has its own limits.

| Symptom | Action |
|---|---|
| Search API returns 429 | Back off with jitter, same as any retryable HTTP status (see [resilient-scraping.md](resilient-scraping.md)); do not switch to a scraped version of the search results page to route around it |
| Search results page shows a CAPTCHA or "unusual traffic" interstitial | Stop querying that engine for this task; switch to a different engine or go straight to the likely primary sources (docs site, issue tracker, repo search) instead of trying to defeat the interstitial |
| Results silently truncated or empty for a query that should return hits | Suspect a soft block before concluding "no results exist" — rephrase once, and if the pattern holds, name the block in the report rather than reporting a false negative |
| One source domain consistently 403s across searches | Note it as inaccessible for this task and lean on the remaining independent sources; do not spend the whole budget retrying one blocked origin |

Treat a blocked search engine as a source failure to report, not an obstacle to engineer around — the goal is a verified answer with named gaps, not 100% coverage by any means available.

## Stopping and conflict

- Set the budget before starting: a number of distinct primary sources, or a time box. Stop when new sources stop changing the answer, and report what remains uncertain instead of continuing.
- When sources materially conflict: prefer primary over secondary, then more recent over older, then check whether they are describing different versions, platforms, or configurations — most conflicts dissolve there. If the conflict survives, present both positions with their dates and sources rather than silently picking one.
