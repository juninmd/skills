# Source playbook

Open when step 3 starts: which source answers which question, and how it misleads.

| Source | Use for | Query or entry point | Trap |
|---|---|---|---|
| GitHub | layout, CI, release cadence, adoption | `gh api search/repositories`, then the tree and `.github/workflows` | stars lag quality; check pushes and open-issue age |
| Blogs | rationale behind a practice | WebSearch `"<practice>" postmortem OR "lessons learned"` | vendor posts sell; look for numbers and caveats |
| Reddit | field complaints and migrations | RSS only (`https://www.reddit.com/r/<sub>/search.rss?q=<q>&sort=top&t=year`) | JSON endpoints return 403; one loud thread is not a trend |
| Hacker News | critique and counterexamples | `https://hn.algolia.com/api/v1/search` | read the top comments, not the headline |
| Papers | measured effects | WebSearch `site:arxiv.org <topic>` | preprints are unreviewed; check sample size and baselines |

Per-source rate limits are separate budgets: serialize requests per host, and keep raw excerpts in the report appendix so every figure resolves to a source.
