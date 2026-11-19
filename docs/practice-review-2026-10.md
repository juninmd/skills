# Practice review, October 2026

Changes come from a review of current primary sources (checked 2026-10-10) and a repo-fit check of each proposal. Claims that could not be confirmed are listed under Not executed here or Open follow-ups.

| Skill | Change | Why (source) |
|---|---|---|
| `git-workflow` | Signing checks read rulesets as well as classic branch protection | GitHub Docs: rulesets and classic rules apply together; a classic-only check misses signing rules |
| `performance-engineering` | CrUX covers only opted-in desktop and Android Chrome, so iPhone p75 needs RUM; RUM uses `web-vitals`; load tests distinguish closed and open models | CrUX methodology; `web-vitals` README; k6 docs. Closed loops hide tail latency (coordinated omission) |
| `data-engineering` | Batched backfill rewritten, since `UPDATE` takes no `LIMIT`; non-volatile defaults are metadata-only; `NOT NULL` through a `NOT VALID` check; a re-run of `CREATE INDEX CONCURRENTLY` fails loudly on an invalid index | PostgreSQL docs: `UPDATE`, `ALTER TABLE`, `CREATE INDEX` |
| `package-management` | `uv sync --locked` in CI; pnpm `allowBuilds` replaces the keys pnpm 11 removed; `minimumReleaseAge` as a release-age gate; Node 20 pins moved to 24 | Astral uv docs; pnpm settings and 11.0 notes; Node.js release schedule (Node 20 ended 2026-04-30) |
| `mobile-engineering`, `ios-engineering` | Android `targetSdk` 36 for new apps, with the device exceptions; edge-to-edge as its own section; a privacy-manifest checklist line | Google Play target API requirements; Android edge-to-edge docs; Apple privacy manifest notice |
| `code-review` | Design is the first review pass; one severity scale (Blocker, Major, Minor, Nit) across the skill, the reviewer agent, and its docs | Google engineering practices: review the design first |
| `test-engineering` | A flaky test is quarantined, never skipped, with an owner and a ticket; Vitest 4 uses `maxWorkers`, since `poolOptions` was removed | Apache KIP-1090 as an example policy; Vitest 4 migration guide |
| `security-ops` | Findings carry OWASP Top 10:2025 categories, Application Security Verification Standard 5.0 chapters, and API Top 10 tags; `gitleaks git` and `gitleaks dir` replace the deprecated `detect` | OWASP Top 10:2025; OWASP Application Security Verification Standard 5.0; gitleaks README |
| `cloud-devops` | CI template with read-only token permissions and pinned actions; a restricted Pod Security section; a rollback burn-rate threshold tied to a 30-day budget; native S3 state locking | GitHub secure-use reference; Kubernetes Pod Security Standards; Google SRE Workbook; Terraform S3 backend docs |
| `observability` | Tail sampling is the only way to keep every error trace; stable OpenTelemetry HTTP attribute names; an SLO budget policy with an owner and a review date | OpenTelemetry sampling and HTTP semantic conventions; Google SRE Workbook |
| `agent-engineering` | `PreToolUse` blocks only on exit code 2 or JSON `deny`, so guards fail closed on every error path; MCP tokens are audience-bound and never passed through; evals grade outcomes and report pass^k | Claude Code hooks reference; MCP security best practices (2026-07-28); Anthropic eval guide |
| `frontend-engineering` | Next.js 16 async request APIs and `cacheComponents`-dependent caching; `getServerSnapshot` for `useSyncExternalStore`; WCAG 2.2 criteria 2.5.7, 3.2.6, and 3.3.7 | Next.js 16 docs; React reference; W3C WCAG 2.2 |
| `starting-dev`, `skill-authoring` | `AGENTS.md` is skipped when a `CLAUDE.md` exists unless it is imported; the six-key frontmatter rule is stated as house policy, stricter than Claude Code | Claude Code memory and skills docs |
| `finishing-dev`, `starting-dev` | The default-branch return survives an unset `origin/HEAD`; `git branch -d` refuses a squash-merged branch unless its upstream still holds the tip; the branch is then removed only when a merged PR head equals the local tip | git-scm.com `git-remote` and `git-branch`; local reproduction with git 2.43 |
| `web-research` | `cargo search` results may be pre-releases; the version string shows it | Cargo book: specifying dependencies |
| `documentation`, `requirements-planning`, `software-architecture` | Diátaxis modes described as the framework defines them; Given/When/Then acceptance criteria; ADRs record how the decision is confirmed | diataxis.fr; Gherkin reference; MADR 4.0.0 template |

**Deliberately not changed**

- Conventional Comments labels: they would add a second severity vocabulary beside the one above.
- Trace on first retry: not wrong. Playwright recommends it for CI.
- pnpm 12 and a newer `pnpm/action-setup`: the lockfile-rewrite caveat is unverified, so the pin stays until it is.
- The hook `onFailure` setting, its Claude Code version, and the MCP claim that revision 2026-07-28 removed sessions: no source confirmed them.

**Not executed here**

The gitleaks commands (the binary is not installed), the PostgreSQL SQL, the `gh api` rules filter against a ruleset response, and the uv and pnpm commands. Run them once before relying on them.

**Open follow-ups**

- `package-management/references/pep723-scripts.md`: the "no lockfile" claim conflicts with `uv lock --script`.
- `backend-systems/references/backend-python.md` and `web-research/references/knowledge-freshness.md` still use `--frozen` in CI examples.
- Package-management pins: `pnpm/action-setup` v9 and `packageManager` `pnpm@9.0.0`.
- `web-performance.md` Rules and the RUM note; the ADR row in `documentation/SKILL.md`; the iOS privacy-manifest routing line in `ios-engineering/SKILL.md`.
- `performance-engineering/SKILL.md`: the preflight still runs the closed-loop `autocannon -c 50` baseline; label it or add a fixed-rate run.
- `test-engineering/SKILL.md` says never retry a flaky test, while `core-test-api.md` shows `retry: 3` and `ui-review.md` uses `on-first-retry`.
- `requirements-planning/references/AGENT-BRIEF.md` still uses bullet acceptance criteria.
