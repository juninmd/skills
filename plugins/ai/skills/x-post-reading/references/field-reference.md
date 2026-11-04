# Field Reference

Open this when a field is unexpected, a post looks truncated, or a request fails and the reason is not obvious. It maps what the two public surfaces return and what each failure means.

## Contents

- [Endpoint response](#endpoint-response)
- [Quoted, parent, and reply fields](#quoted-parent-and-reply-fields)
- [Media](#media)
- [Status page fields](#status-page-fields)
- [Failure modes](#failure-modes)

## Endpoint response

`GET https://cdn.syndication.twimg.com/tweet-result?id=<id>&token=a`

`token` is not validated for public posts; any non-empty value works. The response is JSON with no envelope.

| Field | Type | Meaning |
|---|---|---|
| `id_str` | string | post id, identical to the id you requested |
| `text` | string | post text, truncated with a trailing ellipsis when the post exceeds the classic limit |
| `created_at` | ISO string | UTC timestamp, always with `Z` |
| `favorite_count` | number | likes at fetch time |
| `conversation_count` | number | replies at fetch time |
| `lang` | string | detected language of `text` |
| `user` | object | `name`, `screen_name`, `is_blue_verified`, `profile_image_url_https` |
| `entities` | object | `hashtags`, `urls`, `media`, `user_mentions` with indices into `text` |
| `photos` | array | images: `url`, `expandedUrl`, `width`, `height` |
| `video` | object | present only for video posts |
| `note_tweet` | object | present on long-form posts, but often only `{ "id": ... }` — do not rely on `note_tweet.text` |

Two optional blocks decide whether you need the status page:

- `text` ending in `…` — the note text lives only on the page.
- `note_tweet` without `text` — same conclusion, page only.

## Quoted, parent, and reply fields

| Field | Present when | Use |
|---|---|---|
| `quoted_tweet` | the post quotes another | the quoted author and text; attribute separately |
| `parent` | the post is a reply | the post it answers, with its own `user` and `text` |
| `in_reply_to_screen_name` | the post is a reply | handle being answered |
| `in_reply_to_status_id_str` | the post is a reply | id to walk for the thread |

Walking `parent.id_str` is the only public thread route: each hop returns the parent post in full, so a thread is reconstructed one request per post. Stop when `parent` is absent or after twenty hops — a long thread is not worth unbounded requests.

## Media

`photos[].url` and `video` variants point at `https://pbs.twimg.com/...`. Report the URL; do not download or re-host. An image the post references through `entities.media` without a `photos` entry is usually a quoted post's media.

## Status page fields

`https://x.com/<handle>/status/<id>` renders for crawlers without login and adds what the endpoint lacks:

| Rendered | Where |
|---|---|
| full long-form text | page title and body, in quotes |
| view count | beside the timestamp, formatted like `4.6M` |
| reply, repost, like, bookmark counts | under the post body, unseparated |
| top replies | below the post, each with its author handle |
| quoted post | below the body, prefixed by the quoted author handle |

`https://x.com/<handle>` renders the latest five posts in the same way, which is why a profile read is a sample even before the index enters.

## Failure modes

| Symptom | Cause | Action |
|---|---|---|
| `404` from the endpoint | deleted, protected, or never existed | report as the finding; do not retry |
| `400` from the endpoint | the id is malformed or too short to exist | fix the id; never retry |
| endpoint returns JSON without `text` | the post is a retweet stub or the id is a media variant | retry with the id from the status URL path |
| `429` | rate limit on the shared egress | back off once, then stop after three |
| `403` | the surface started requiring a session | stop; do not substitute a cookie |
| profile page shows only a login form | protected account or the render changed | report the wall; offer the paid API |
| engine index returns unrelated posts | `site:` matching is loose on short terms | quote the id and verify each one through the endpoint |
