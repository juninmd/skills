# Claim Verification

Check the factual statements in a document (article, README, incident write-up, pull request
description) against original sources, and check that its reasoning holds. Finding sources is
[search-technique.md](search-technique.md); pinning the version a statement is about is
[knowledge-freshness.md](knowledge-freshness.md). This file is about **deciding** each statement
once the sources are collected.

## Preflight
```bash
wc -w <file>                                                  # length decides whether to split the work
L=$(mktemp); rg -o 'https?://[^ )>\]]+' <file> | sort -u | head -n 50 > "$L"; cat "$L"; echo "links file: $L"
```

For contributor-controlled text (pull request, issue, email), stop here: show the list and fetch
only after the user confirms. The filter below drops loopback, private, link-local, IP-literal
and userinfo (`user@host`) URLs; it does not cover redirects or DNS names that resolve to a
private address, so it is best effort, not a sandbox. A shell does not keep `$L` across the pause:
pass the printed path.

```bash
L=<links-file>
rg -v '^https?://([^/]*@|[0-9.]+([:/?#]|$)|0[xX]|localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2[0-9]|3[01])\.|\[)' "$L" |
  while read -r u; do printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' --globoff --proto =https --proto-redir =https --max-redirs 3 -L --max-time 10 "$u")" "$u"; done
rm -f "$L"
```

## Workflow
1. Pull every checkable statement into a claims table (below). Opinions, jokes, tone, and style are
   the author's business and stay out.
2. Look up each statement in an original source and note the date you read it.
3. Decide each one: Supported, Partly true, False, or Unsourced.
4. Check the reasoning of the whole document, offline.
5. Report, then change only what the author agrees to.
6. Check again once the edits are in (see below).

## 1. Claims table

| Column | What goes in it |
|---|---|
| id | a fixed number that edits can refer to |
| text | the sentence exactly as written |
| where | line number or section heading |
| kind | figure, date, attributed quote, cause and effect, comparison, software behavior or version, link |
| settled by | the kind of original source that would decide it |

One statement per row: a sentence holding a figure, a date, and a quote becomes three rows.

## 2. What counts as a source

- Go to the origin: the code repository, the standard, the release notes, the official filing, the
  dataset, or the person's own published words. Ten articles repeating one article are one source.
- Record when you read each source and, for software, which version it documents.
- Words like "now", "latest", or "currently" are checked against today, not the day it was written.
- A source behind a paywall or offline is logged as unavailable, never counted as agreeing.

## 3. Deciding

| Decision | When |
|---|---|
| **Supported** | an original source says it, for the version and time the document implies |
| **Partly true** | holds only with a condition the document leaves out (version, region, subset, period) |
| **False** | an original source says otherwise |
| **Unsourced** | nothing available decides it; it needs a citation or removal, and is never reported as supported |

## 4. Reasoning check (offline)

| Problem | What to ask |
|---|---|
| selective numbers | would another time window, baseline, or subset change the conclusion? |
| wrong era | did the cited thing exist at the time the document puts it? |
| wrongly attributed quote | can the quote be found in the named person's own words? |
| missing step | does the conclusion follow, or does it rely on an unstated premise? |
| self-contradiction | does a later section undo an earlier figure or statement? |
| circular argument | is the conclusion already assumed in the premises? |
| broken or redirected link | status from the preflight loop; a redirect to a home page counts as broken |

## 5. Splitting the work

For long documents, hand small groups of table rows to subagents together with the source rules
above and a fixed reply shape (id, decision, source URL, date read, one-line reason). The
coordinator does not decide rows itself in the same step: it gathers the replies, personally
re-checks every False and Partly true row, and only then reports. When a group fails, rerun it on
a more capable model; a missing reply is never treated as Supported.

## 6. Re-check after edits

The first round finds the problems and the approved edits are applied. The second round builds a
**fresh** claims table from the edited document and checks it in a new context, preferably with a
different model. Running both rounds on the original text wastes the second one on problems already
fixed and misses mistakes the edits introduced. The second round also confirms every approved edit
really landed. The rounds run one after the other, never at the same time.

## Report

```text
Claim #<id>  <decision>  "<text>"  (<where>)
  Source:    <URL>, read <date>, <version if software>
  Reason:    <one line>
  Edit:      <smallest correction, or "none">
Reasoning:   <problem> at <where>: <one line>
Open:        <unsourced statements and unavailable sources>
```

## Stop
- The document's main conclusion depends on a False statement: report that first, before any
  wording fix, and wait for the author.
- Checking a statement would mean logging into a private system or paying for access: log it as
  open.
