---
name: x-post-reading
description: |
  Read public posts, profiles, threads, and keyword hits on X without an account or API key. Use for a post URL or id, a profile's latest posts, engagement counts, quoted posts, long-form notes, and reply context. Trigger on 'read this tweet', 'ler os tweets desse perfil', 'scrape x.com without login', 'how many likes did that post get'.
---

# X Post Reading

**Not this skill:** multi-source research and citation discipline (`web-research`), the daily AI-ecosystem digest (`radar-ia`), or a licensed archive export — that is the paid API.

Two surfaces carry every public read, and neither needs a login:

| Surface | Gives | Missing |
|---|---|---|
| `https://cdn.syndication.twimg.com/tweet-result?id=<id>&token=a` | text, UTC timestamp, likes, reply count, quoted post, parent post, media, language | long text (truncated), replies, profile history |
| `https://x.com/<handle>` and `https://x.com/<handle>/status/<id>` | crawler render: latest five posts, full long-form text, view count, top replies | machine fields, anything past five posts |

## Preflight
Decide which of the three asks this is, because the surface differs: one post (an id), a profile's recent posts, or a keyword inside one account.

```bash
node --version   # 18+ for built-in fetch; the helper script has no dependencies
```

Load the profile page once to confirm the account is public: a protected account returns a login wall, not content.

## Workflow
1. Normalize the input to a post id. A status URL carries it in the last path segment; the handle in that URL is decoration, and the id alone resolves the post.
2. Fetch the id through the syndication endpoint and read the structured fields before any prose: `created_at`, `favorite_count`, `conversation_count`, `lang`, `quoted_tweet`, `parent`, `in_reply_to_screen_name`, `photos`, `video`.
3. If `text` ends in an ellipsis, or `note_tweet` appears, open `https://x.com/<handle>/status/<id>`: the page renders the full note text, the endpoint truncates.
4. For a thread, walk `parent.id_str` upward until it is absent; that chain is the conversation, newest first.
5. For replies, read the status page — the endpoint reports only `conversation_count`. Attribute each reply to its author.
6. For more than five profile posts, query a search engine for `site:x.com/<handle>/status <term>`, collect distinct ids, and fetch each through the endpoint. Change the term to widen the sample.
7. Report per post: id, UTC date, text, likes, replies, quoted author, media, and whether the text came from the page (long form) or the endpoint. Mark anything seen only in an index snippet as unverified.

```bash
node .agents/skills/x-post-reading/scripts/x-read.mjs post 2110445577184133456
node .agents/skills/x-post-reading/scripts/x-read.mjs thread 2110445577184133456
node .agents/skills/x-post-reading/scripts/x-read.mjs batch 2118016906590666789 2108177695271948445 --json
```

The script prints one normalized record per post and exits non-zero when a post cannot be read — deleted, protected, or a malformed id — instead of printing an empty result.

## Attribution and Counting

A crawler-rendered profile interleaves the account's own post with the post it quotes, with no separator. Read the handle prefix that follows the quote to attribute it; report quoted text as the quoted author's words, never as the profile's.

Page metrics arrive as unseparated digits — replies, reposts, likes, and views concatenated. Take counts from the endpoint; use the page only for views and long text.

## Stop
- The ask needs the search UI, a protected account, follower-only posts, or DMs: report the wall and offer the index route or the paid API. Never use a session cookie — a personal `auth_token` is a credential and out of scope.
- Three consecutive 429 or 403 responses: stop and report which surface failed.
- The ask is a full archive or a bulk mirror: state that the index samples and the API is the licensed route, then stop.

## Rules
- The engine index is a sample, not a timeline. Say "N posts found between these dates", never "the account's posts".
- Nitter is retired: X Corp legal action took the instances and the repository down in 2026. Any instance still answering is stale, blocked, or a trap; do not spend budget there.
- Public read only: no login-wall bypass, no protected content, no scraping behind a session.
- Verify before quoting: a snippet on a result page is a claim about a post, not the post.
- Deleted and protected posts return 404 from both surfaces; report that as the finding.
- Field map, endpoint parameters, and failure modes: [references/field-reference.md](references/field-reference.md).

## Checklist
- [ ] Post id resolved and fetched through the endpoint, not only quoted from a snippet.
- [ ] Long text confirmed on the status page when the endpoint truncated it.
- [ ] Quoted and parent posts attributed to their authors.
- [ ] Counts taken from the endpoint; views marked as page-sourced.
- [ ] Coverage stated as a sample with dates, not as the full history.
- [ ] No credential, cookie, or protected content involved.
