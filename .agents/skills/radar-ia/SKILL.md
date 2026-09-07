---
name: radar-ia
description: |
  Sweep the AI/coding-agent ecosystem (GitHub trending, Reddit RSS, Hacker News, Hugging Face, Claude Code/Codex/Copilot/Antigravity changelogs) into a dated pt-BR digest plus raw dumps. Triggers: "me atualize sobre IA", "trending do github", "o que rolou de IA hoje/essa semana". Use for the daily AI radar and best-posts digests; not for one-paper research or debugging.
license: MIT
metadata:
  version: 1.1.0
compatibility: windows (PowerShell) primary; needs gh CLI, WebFetch, WebSearch
---

# radar-ia

Sweep sources and produce a dated state-of-the-ecosystem report for AI and coding agents.

## Preflight
```bash
gh auth status                                 # the search API needs auth to be reliable
ls <projeto>/radar-ia/RADAR_*.md | tail -1     # last run; the collection window starts there
```
Fix the collection window first: without it the digest cannot be compared to the previous one. If the user sets a deadline ("colete até as 19:30"), keep collecting extra rounds until then and only then consolidate.

## Output contract
```
<projeto>/radar-ia/
  RADAR_<YYYY-MM-DD>.md   # the deliverable
  raw/                    # one timestamped file per source
```
Default directory when none is given: `<cwd>/radar-ia/`. Never overwrite an old run; filenames carry date and time. Every numeric claim must point at a file in `raw/`.

Fixed structure of `RADAR_<data>.md` (keep sections and order):
1. Header with collection window and source list
2. `## TL;DR`: 6 to 8 numbered items, each a concrete change with a number
3. `## 1. Reddit`: subsections "Da semana" and "Do dia"
4. `## 2. GitHub trending`: tables daily / weekly / new repos that exploded / harness ecosystem
5. `## 3. Hacker News`: points/title table + deep dive of the 2 most relevant posts
6. `## 4. Ferramentas`: Claude Code, Codex, Copilot, Google/Antigravity
7. `## 5. Modelos e pesquisa`: HF trending, HF papers, Anthropic news
8. `## 6. Aplicação no seu stack`: finding → action table referencing the user's projects (memory)

Language: **pt-BR**. Caveman/dense style, no filler. Tables over paragraphs. Always link the source.

## Workflow
1. Start `collect-reddit.ps1 -Range day` in the background (slowest, rate-limited).
2. Collect GitHub (WebFetch trending + 4 `gh` queries) → `raw/github_*.md`.
3. Collect HN + full-text deep dive of the 2 top posts → `raw/hackernews_*.md`, `raw/deep_dives_*.md`.
4. Collect HF + changelogs + Anthropic news → `raw/hf_*.md`, `raw/ferramentas_*.md`, `raw/google_*.md`.
5. When the day dump lands, analyze it → `raw/reddit_analise_*.md`.
6. Start `-Range week` in the background; repeat the analysis.
7. Consolidate `RADAR_<data>.md` in the fixed structure; verify every number resolves to a raw file.

## Sources
```powershell
# GitHub: WebFetch https://github.com/trending?since=daily|weekly and /trending/{python,typescript,rust,go}?since=weekly
# plus gh api (authenticated beats scraping)
gh api "search/repositories?q=created:>{hoje-45d}+stars:>200&sort=stars&order=desc&per_page=20" --jq '.items[] | "\(.full_name) | \(.stargazers_count)* | \(.language) | \(.created_at[0:10]) | \(.description)"'
gh api "search/repositories?q=topic:claude-code+pushed:>{hoje-14d}&sort=stars&order=desc&per_page=15" --jq '.items[] | "\(.full_name) | \(.stargazers_count)* | \(.description)"'
gh api "search/repositories?q=topic:mcp+created:>{hoje-60d}+stars:>300&sort=stars&order=desc&per_page=12"
gh api "search/repositories?q=created:>{hoje-35d}+stars:>1000+topic:llm&sort=stars&order=desc&per_page=12"
# Reddit: RSS only, browser UA, backoff 15/30/45s and 8s between subs are built into the script
& "<skill>/scripts/collect-reddit.ps1" -Range day  -OutDir "<projeto>/radar-ia/raw"
& "<skill>/scripts/collect-reddit.ps1" -Range week -OutDir "<projeto>/radar-ia/raw"
# Hacker News (Algolia, no auth); queries: claude code, codex, copilot, LLM, agent
$since=[int][double]::Parse((Get-Date -Date (Get-Date).AddDays(-3).ToUniversalTime() -UFormat %s))
Invoke-RestMethod "https://hn.algolia.com/api/v1/search?query=<q>&tags=story&numericFilters=created_at_i>$since,points>40&hitsPerPage=8"
```
Reddit subs: ClaudeAI, ClaudeCode, LocalLLaMA, OpenAI, singularity, MachineLearning, ChatGPTCoding, GithubCopilot, cursor, LLMDevs, AI_Agents, ArtificialInteligence, codex, programming. A round takes 10-15 min: run it with `run_in_background: true` and collect the other sources meanwhile. The dump is ~90 KB per round: read in pages (`Read` with offset) or `Grep` for `^## r/`.

HF and changelogs: `https://huggingface.co/models?sort=trending`, `https://huggingface.co/papers`, `https://www.anthropic.com/news`; WebSearch `Claude Code changelog <mês> <ano>`, `OpenAI Codex GitHub Copilot update <mês> <ano>`, `Gemini CLI Antigravity update <mês> <ano>`.

| Source | Trap |
|---|---|
| GitHub | scraped HTML shifts; prefer `gh api`, which throttles and truncates when unauthenticated |
| Reddit | WebFetch and `reddit.com/r/X/top.json` return 403; RSS still hits 429 in bursts |
| Hacker News | title-only reading yields headlines, not findings; WebFetch the top 2 |
| Model hubs | trending is popularity, never quality |
| Vendor changelogs | undated entries are unusable; record the fetch date |

## Stop
- A source returns 429: back off and serialize. Never run the day and week rounds in parallel or fire ad-hoc Reddit requests during a run; they share one IP budget and everything ends in 429.
- A repo claims a token or performance win with no independent benchmark: report it as a claim. Precedent: caveman claimed 65%, measured 8.5%; rtk claimed 60-90% and cost more than using nothing.

## Rules
- Cross-source corroboration is the product: the same signal on Reddit + HN + trending is a platform movement (Cloudflare OS on HN + `cloudflare/computer` trending); one loud post is not.
- Separate signal from recurring complaint: usage-limit grumbling is weekly noise; a model regression with a reproducible case is signal.
- Concrete numbers beat adjectives: "8,5% medido contra 65% alegado" beats "resultados decepcionantes".
- Always close with action: section 6 maps findings to the user's projects (memory: digest agents, junin/GitOps cluster, megabrain, LiteLLM).
- Deep verification of a single claim belongs to `web-research`.

## Checklist
- [ ] window and source list in the header; nothing in `raw/` overwritten
- [ ] `RADAR_<data>.md` has TL;DR + the 6 sections in order, in pt-BR
- [ ] every numeric claim resolves to a `raw/` file
- [ ] performance and cost claims marked as claims unless independently benchmarked
