<div align="center">

<img src="./docs/public/images/hero-banner.svg" alt="Engineering skills for AI coding assistants" width="100%" />

# Engineering skills. Evidence first.

**23 skills · 4 agents · shared operating instructions**

Practical workflows for assistants that inspect the system, make focused changes, and verify the result.

[Explore the catalog](#skill-catalog) · [Get started](#get-started) · [Quality checks](#quality-checks) · [Contribute](#contributing)

</div>

---

## From request to evidence

| Discover | Execute | Verify |
|---|---|---|
| Short descriptions select the domain. | Workflows and references guide the task. | Commands, failure cases, and stop conditions define the evidence. |

The catalog consolidates 83 skills into 22 domains. Detailed procedures live beside each skill in `references/`, ready to load when the task needs them.

## Get started

### Symlink install (Claude Code, Codex, Antigravity)

One canonical checkout, linked into every client. Edits in the repo are live everywhere; nothing is copied.

```bash
git clone https://github.com/juninmd/skills && cd skills
node .agents/tools/install.mjs --dry-run   # show the plan
node .agents/tools/install.mjs all         # or: claude | codex | agy
```

| Client | Skills | Instructions | Config |
|---|---|---|---|
| Claude Code | `~/.claude/skills/<name>` | `~/.claude/CLAUDE.md` | `~/.claude/settings.json` |
| Codex | `~/.codex/skills/<name>` | `~/.codex/AGENTS.md` | `~/.codex/config.toml` |
| Antigravity (agy) | `~/.gemini/config/skills/<name>` | `~/.gemini/GEMINI.md` | — |

Instruction files link to [`.agents/AGENTS.md`](.agents/AGENTS.md); configs link to [`.agents/clients/`](.agents/clients/), tuned for low token use (collapsed skill listings, bounded tool output, 1h prompt cache, auto-compact). Existing real files are renamed to `*.bak-<timestamp>` first; links to retired skills are pruned. Pass `--no-config` to link skills and instructions only. On Windows, skill directories become junctions (no privilege needed); file links need Developer Mode or an elevated shell. Without it, `CLAUDE.md` and `GEMINI.md` get a one-line `@path` import stub that tracks the repo the same way, and the config files are left untouched until you rerun elevated.

### Claude Code plugin

Installs all skills and the 4 agents as one plugin (`juninmd:<name>`). The marketplace is [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json); the plugin root is `.agents/`.

```bash
claude plugin marketplace add juninmd/skills            # or a local checkout path
claude plugin install juninmd@skills                    # --scope user | project | local
claude plugin details juninmd@skills                    # inventory and always-on token cost
```

Claude Code copies plugins into `~/.claude/plugins/cache`, so run `claude plugin marketplace update skills` and reinstall to pick up repo edits. Updates follow the default branch unpinned: read the diff before updating. Plugin skills are namespaced and coexist with symlinked personal skills; use one install method per client to avoid loading every skill description twice.

### Skills CLI

```bash
npx skills add juninmd/skills --list                    # inspect the catalog
npx skills add juninmd/skills --skill backend-systems   # copy one domain
```

The CLI copies files; it does not track the repo or install the agents and operating instructions.

## Pick a starting point

| Your task | Start with |
|---|---|
| Understand an unfamiliar repository or clarify a request | [starting-dev](.agents/skills/starting-dev/SKILL.md) |
| Build a service or endpoint | [backend-systems](.agents/skills/backend-systems/SKILL.md) |
| Build an accessible web interface | [frontend-engineering](.agents/skills/frontend-engineering/SKILL.md) |
| Investigate failures and incidents | [observability](.agents/skills/observability/SKILL.md) |
| Review a change or simplify code | [code-review](.agents/skills/code-review/SKILL.md) |
| Audit credentials and trust boundaries | [security-ops](.agents/skills/security-ops/SKILL.md) |
| Ship a finished branch as a PR | [finishing-dev](.agents/skills/finishing-dev/SKILL.md) |

## Skill catalog

<!-- skill-catalog:start -->
| Skill | Use it for |
|---|---|
| `3d-models` | Blender cleanup, VRM 0.x/1.0 conversion, VRoid exports, MToon materials, shape keys, ARKit blendshapes, humanoid rigs, and VRM SpringBone hair physics |
| `agent-engineering` | agent loops, MCP tools, context window pruning, parallel subagents, concurrent workspaces, headless resilience, and authoring new skills with eval benchmarks |
| `agy-image-babysitter` | Keep an agy (Antigravity CLI) conversation generating images unattended: relaunch the headless loop 90s after a 401 token expiry and sleep until quotaResetTimeStamp after a 429 |
| `backend-systems` | NestJS modules, dependency injection, DTO validation, FastAPI, REST/GraphQL OpenAPI contracts, endpoints, controllers, pnpm, uv, async concurrency, cache invalidation, and backend builds; maintain existing Go and .NET services too |
| `cloud-devops` | GitHub Actions, Dockerfiles, Terraform, Helm, manual GHCR rollout, deployment sync drift, and safe bash/PowerShell |
| `code-review` | adversarial code review, legacy undocumented code recovery, characterization tests before refactoring, simplifying working code, collapsing unnecessary abstractions, and deleting proven dead code |
| `data-engineering` | PostgreSQL, MySQL, Redis, schema migrations, zero-downtime DDL, pandas profiling, query plans, indexes, and aggregation |
| `documentation` | README, docs verification, Mermaid diagrams as code, ASCII figures, terminal figures, code snippet images, PDF/DOCX generation, and OpenAPI reference |
| `finishing-dev` | finishing a feature branch, review-before-PR delivery, PR descriptions, shipping a completed change, and final acceptance evidence |
| `frontend-engineering` | React, Next.js, Vite, Tailwind, WCAG accessibility, visual hierarchy, color palettes, anti-slop styling, UI states, and masonry |
| `git-workflow` | branches, worktrees, rebase conflicts, reflog recovery, stash, bisect, conventional commits, semantic version bumps, changelogs, and release tags. PR review and delivery use finishing-dev |
| `goldsrc-modding` | Valve 220 .map geometry, ZHLT/VHLT compile pipelines, BSP30 lump editing, and CS 1.6 entity logic |
| `mobile-engineering` | mobile UI, lifecycle, navigation, permissions, offline behavior, accessibility, device integration, tests, and builds |
| `observability` | structured logging, metrics, distributed tracing, alerting, root-cause troubleshooting, postmortems, network failures, timeouts, and on-call response |
| `performance-engineering` | endpoint profiling, latency bottlenecks, N+1 query bottlenecks, memory leaks, LCP/INP web vitals, autonomous metric loops, and rightsizing costs |
| `radar-ia` | the daily AI radar and best-posts digests; not for one-paper research or debugging |
| `security-ops` | end-to-end vulnerability audits, pen tests, CVE scans, Gitleaks remediation, zero-trust reviews, plugin vetting, least privilege, threat modeling, and third-party extension safety |
| `software-architecture` | module boundaries, domain glossaries, repository layout, Electron multi-process security, ADRs, and circular dependency resolution |
| `starting-dev` | repository onboarding, backlog issues, task stages, and session handoffs |
| `test-engineering` | unit/integration tests, Vitest, pytest, flaky test elimination, Playwright E2E, LLM gateway conformance, and test coverage |
| `threejs` | canvas 3D graphics, scene performance, and asset loading |
| `tooling-dev` | CLI arguments, exit codes, non-interactive execution, config discovery, signals, structured output, packaging, and integration tests |
| `web-research` | multi-source search, HTML table/listing scraping, verifying latest library stable versions, changelog tracking, and citations |
<!-- skill-catalog:end -->

## Beyond skills

| Resource | Purpose |
|---|---|
| [Specialist agents](.agents/agents/) | Code review, planning, principal engineering, and DevOps roles |
| [Shared operating instructions](.agents/AGENTS.md) | Precedence, hats, confirmation table, rules, and definition of done |
| [Client configs](.agents/clients/) | Token-optimized `settings.json` (Claude Code) and `config.toml` (Codex) |
| [Repository contract](./AGENTS.md) | How to maintain and validate this catalog |

## Quality checks

From a checkout with Node.js and pnpm available:

```bash
pnpm install --frozen-lockfile
pnpm run validate
pnpm run docs:build
```

| Check | Evidence it provides |
|---|---|
| Structure | Valid frontmatter, skill names, required sections, and local references |
| Catalog | README and docs tables match the skill descriptions |
| Budgets | Descriptions and skill bodies stay within the configured limits |
| Routing | Offline lexical ranking of positive and negative prompts |
| Retired names | No skill or instruction still hands off to a merged skill by its old name |
| Documentation | Spelling, relative links, and a buildable documentation site |
| Validator tests | Regression checks for the validation tools |

**Passing checks are necessary, but do not prove assistant behavior.** Routing uses a deterministic lexical scorer; it does not run the target assistants. Exercise representative tasks in each client before claiming compatibility.

Inspect detailed reports with `pnpm run evals` and `pnpm run tokens:report`. Budget limits live in the validation tools rather than a duplicated table here.

## Contributing

1. Edit the owning domain under `.agents/skills/<name>/`.
2. Keep the main workflow actionable; link specialist procedures from `references/`. Naming a sibling skill is optional; naming a retired skill is an error.
3. When merging or renaming, add the old name to `.agents/retired-skills.json`, then update callers, reference maps, eval owners, agents, and installation examples.
4. Add realistic positive prompts and negative prompts with their correct owner. Preserve failing cases when fixing descriptions.
5. Regenerate the catalog with `pnpm run catalog:generate`, then run the quality checks above.

Keep one canonical skill tree. Client adapters link or package that source without creating independently maintained copies.

## License

[MIT](./LICENSE). Preserve source attribution and third-party license notices when redistributing references.
