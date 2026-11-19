---
name: peer-benchmark
description: |
  Compare the current repository with peer projects (GitHub repos, blogs, Reddit, papers) and rank improvement proposals backed by benchmarks. Use for gap reviews and prior-art sweeps. Trigger on 'compare this repo with the best ones', 'what are others doing better', 'benchmark us against peers'. Not a recurring digest (radar-ia) nor a single-fact lookup (web-research).
license: MIT
metadata:
  version: "1.0.0"
compatibility: needs gh CLI, WebFetch, WebSearch; works on any git repository
---

# peer-benchmark

Inventory the repo it runs in, find comparable projects, measure both sides the same way, and propose changes ranked by evidence.

**Not this skill:** a dated ecosystem digest with no target repo (`radar-ia`); verifying one claim, version, or changelog (`web-research`); implementing a chosen proposal (the owning domain skill).

## Preflight
```bash
git rev-parse --show-toplevel && git status --short | head   # the target repo and its state
date -u +%F                                                  # stamps every finding
gh auth status 2>&1 | head -3                                # unauthenticated search throttles and truncates
```
Write the goal in one sentence ("where does this repo lag peers on X") and a budget (peer count, time box). Detect the stack, size, and purpose from manifests and the README, not from the folder name.

## Workflow
1. **Inventory the target**: purpose, stack, size, test/CI setup, docs, install path, release cadence. Keep it to a table; it is the baseline every peer is compared to.
2. **Find peers** (5 to 10): GitHub search by topic and language, "alternatives to" and awesome lists, repos cited in blogs, Reddit and HN threads. Prefer maintained peers (push within 90 days) and drop forks and tutorial copies.
3. **Read primary material**: peer READMEs, layouts, CI files, releases; blog posts and papers for the claims behind a practice. See [source-playbook.md](references/source-playbook.md) for per-source queries and traps.
4. **Build a feature matrix**: rows are capabilities, columns are target and peers. Mark absent, partial, present; cite a link per cell.
5. **Benchmark** the dimensions that can be measured identically on the target and at least two peers (tokens, size, install time, test time, coverage, latency). Record command, version, and date for each number. Claims from a peer's own README stay "claimed" until reproduced.
6. **Propose**: one row per gap, ranked by impact over effort, with the benchmark that proves it and a way to check it after the change. Format in [proposal-template.md](references/proposal-template.md).
7. **Deliver** the report to `<tmpdir>/peer-benchmark/REPORT_<date>.md` (or a path the user names), never the working tree unprompted, and offer the top proposals as issues or PRs.

## Decision

| Situation | Action |
|---|---|
| Peer metric cannot be reproduced | report it as a claim with the source, exclude it from ranking |
| Gap is real but the target chose it deliberately (docs, ADR) | list under "Deliberate divergences", do not propose |
| Only one peer does X | note as an experiment, not a proposal |
| Star count is the only evidence of quality | discount it; look for releases, issues, and adoption |
| Source unreachable (403/429) | back off, use an official API or RSS, mark "no data" if still blocked |

## Sources
```bash
gh api -X GET search/repositories -f q='topic:<topic> language:<lang> pushed:>2026-01-01 stars:>100' -f sort=stars -f per_page=15 --jq '.items[] | "\(.full_name) | \(.stargazers_count) | \(.pushed_at[0:10]) | \(.description)"'
gh api repos/<owner>/<repo>/releases --jq '.[0:3][] | "\(.tag_name) \(.published_at[0:10])"'
gh api repos/<owner>/<repo>/git/trees/HEAD?recursive=1 --jq '.tree | length'   # size proxy
curl -fsS "https://hn.algolia.com/api/v1/search?query=<q>&tags=story&hitsPerPage=8"
```
Papers: WebSearch with `site:arxiv.org <topic>`; read the abstract and the results table, not the title.

## Stop
- No comparable peer exists after the budget: report that, do not stretch the definition of peer.
- A proposal has no measurable check: drop it or label it opinion.
- Never print tokens or private repo content found along the way; never push, comment, or open issues on peer repos.

## Rules
- Same method on both sides: a benchmark run only on peers is an anecdote.
- Every number carries source, command, version, and date; undated figures are unusable.
- Separate corroborated signal (several independent sources) from one loud post.
- Attribute copied ideas and respect licenses; propose adaptation, not verbatim import.
- Proposals say what to change, the expected gain, the cost, and how to verify.

## Checklist
- [ ] goal, budget, and date in the report header; target baseline table present
- [ ] 5+ peers with links, or the shortfall explained
- [ ] feature matrix cites a source per cell
- [ ] each benchmark lists command, version, date; peer-reported figures marked as claims
- [ ] proposals ranked, each with impact, effort, and a post-change check
- [ ] report written outside the working tree unless the user chose a path
