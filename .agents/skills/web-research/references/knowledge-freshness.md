
# Knowledge Freshness

## Preflight
```bash
npm outdated || uv pip list --outdated || go list -m -u all
node -v && cat package.json | jq '.engines'    # what the project can actually run
date -u +%F                                     # every finding gets this date
```

A version quoted from memory is already wrong. Verify against the registry, every time.

## Workflow
1. List the packages in scope with their pinned versions and their source of truth: npm, PyPI, crates.io, Maven, or GitHub releases.
2. List what is behind.
3. Query the registry per package — never assume a version is current.
4. Separate direct from transitive; they upgrade differently.
5. Classify each: current, outdated, EOL, or vulnerable.
6. Decide the upgrade path, then reinstall from the lockfile.
7. Record the checked date and the verified versions.

## What Is Behind

```bash
npm outdated            # or: pnpm outdated -r     (monorepo-wide)
uv pip list --outdated  # or: pip list --outdated
cargo outdated          # needs the cargo-outdated crate
go list -m -u all
mvn versions:display-dependency-updates
```

## Ask the Registry

```bash
npm view PKG versions --json | jq -r '.[-5:]'         # last five releases
npm view PKG time.modified dist-tags                  # is it maintained?
pip index versions PKG
gh release view --repo OWNER/REPO --json tagName,publishedAt,body
```

`time.modified` answers a question `latest` cannot: a package whose newest release is three years old is a decision, not a default.

## Direct vs Transitive

```bash
npm ls PKG        # who pulls it in
uv pip tree | rg -B2 PKG
```

| Situation | Action |
|---|---|
| Direct dependency | upgrade normally |
| Transitive, fix released upstream | upgrade the direct parent |
| Transitive, parent has not released | `overrides` (npm), `resolutions` (pnpm/yarn), or a constraints file |

Forced resolutions go stale silently — the parent ships a real fix and the pin keeps the old one forever. Record why each was added, with a removal condition.

## Latest Is Not Automatically a Candidate

| Check | Where |
|---|---|
| Runtime requirement | `engines` (npm), `requires-python` (PyPI), `rust-version` |
| Peer requirements | `peerDependencies` — a React 19 peer on a React 18 app is not a candidate |
| Framework major assumed | the release notes, not the version number |
| End of life | the project's support policy, `endoflife.date` |
| Known vulnerabilities | hand triage and severity calls to `security-ops` |

Take the newest version whose constraints the project **already** satisfies. Upgrading the runtime to reach a dependency is a separate, larger decision.

## Stale Prior, Current Shape
A dependency can be current while the code written against it is not: a recalled API pattern that compiles is the one that ships wrong. Before coding against any API whose shape moved after your training cutoff, write the row first.

| Recalled from training | Check instead |
|---|---|
| A parameter shape (`thinking.budget_tokens`, a beta header) | the SDK changelog at the installed version — `documentation` |
| A default model id or a dated tool type string (`*_2025xxxx`) | the provider's current model list and changelog |
| A `client.beta.*` namespace | whether it graduated to the stable namespace |
| A CLI flag or config key | `--help` on the installed binary, never the tutorial |

## "Latest" Tag vs. Latest Stable
A registry's `latest` label is a publisher convention, not a guarantee of stability — treat every dist-tag and pre-release marker as data to check, not a synonym for "safe to install."

```bash
npm view PKG dist-tags                 # {latest, next, beta, canary, rc, ...} — latest is a tag, not a promise
pip index versions PKG                 # PyPI hides pre-releases from the default resolver unless asked
gh release list --repo OWNER/REPO --limit 10   # marks "Latest", "Pre-release", or neither
cargo search PKG                       # crates.io has no pre-release concept; a 0.x or -alpha suffix signals it in the version string instead
```

| Signal | Meaning |
|---|---|
| npm `dist-tags.latest` points at a version with a prerelease identifier (`-beta.1`, `-rc.2`) | The maintainer pushed a prerelease to `latest` by mistake or by design (common right after a major bump); do not treat it as stable without checking the changelog |
| npm `dist-tags.next`/`beta`/`canary` | Explicitly not the stable channel; only take it when the task asked for bleeding-edge |
| PyPI version string ends in `a`, `b`, `rc`, `.dev` (PEP 440) | Pre-release; `pip install pkg` skips it by default, `pip install pkg --pre` does not |
| GitHub release marked "Pre-release" | The maintainer flagged it explicitly; a release with no such flag but a `-rc`/`-beta` tag name is still worth checking |
| Highest semver tag has a 0.x major | Semver's own spec treats 0.x as inherently unstable — no minor-version compatibility guarantee applies |

## Yanked and Deprecated Releases
A version that resolves and installs today can have been pulled after the fact — the lockfile from three weeks ago may already reference a version its own registry no longer recommends.

| Registry | Mechanism | Check |
|---|---|---|
| PyPI | "Yanked" flag — the file stays downloadable for reproducibility but is hidden from resolution | `pip index versions PKG` shows `(yanked)`; the project page shows a strikethrough version |
| npm | `npm deprecate` sets a warning message; the version is not removed | `npm view PKG deprecated`; installing prints the deprecation message to stderr — do not suppress or ignore it |
| crates.io | `cargo yank` prevents new projects from selecting it via range, existing `Cargo.lock` entries still resolve | `cargo search`/the crates.io page marks it yanked |
| GitHub releases | Deleted or marked pre-release/draft after publication | Compare the tag list against release notes that reference a tag no longer listed |

A yanked or deprecated version already in a lockfile is not an emergency by itself, but recommending it *forward* for a new install is a finding to report, with the reason the registry gives.

## Staleness Windows for Research Results
Not every fact decays at the same rate; re-verifying everything on every task wastes the budget from [search-technique.md](search-technique.md), and never re-verifying anything ships stale advice as current.

| Fact type | Re-check before reuse if older than |
|---|---|
| Security advisory / CVE status | Hours — a fix, a revised severity, or a new advisory can land the same day |
| "Latest stable version" of a library | Days — check again before quoting it in a new task, even one from this week |
| Deprecation timeline, EOL date | Weeks, or immediately if the task is a go/no-go decision |
| Framework migration guide, breaking-change list | Weeks to a month, unless a new major shipped since |
| Stable API shape, architectural concept, protocol spec | Effectively unchanged; re-verify only if the task depends on a recent revision |

Record the checked date with the finding either way (per [SKILL.md](../SKILL.md) Rules); the window decides whether to trust an existing note or spend the budget on a fresh fetch, not whether to record the date at all.

## Stop
- The candidate version demands a newer runtime or peer than the project satisfies. It is not a candidate; say so.
- A major jump has not had its breaking-change notes read. Do not recommend it yet.
- A CVE is involved. Hand triage and the severity call to `security-ops` rather than deciding it here.

## Rules
- Never assume a version is current, and never quote one from memory. Verify against the registry, every time.
- Do not upgrade across a major without reviewing the breaking-change notes and running a compatibility test.
- Reinstall from the lockfile after any dependency change: `npm ci`, `pnpm install --frozen-lockfile`, `uv sync --frozen` — never a bare install that can drift.
- Prefer stable over bleeding-edge unless explicitly requested. A release candidate in production is an unpaid support contract.
- Record the checked date with every finding. "Latest is 4.2.1" with no date is false within weeks.
- API behavior at the installed version belongs to `documentation`; CVE triage to `security-ops`; the upgrade rollout to `data-engineering`.

## Checklist
- [ ] Every version verified against a live registry, not from memory.
- [ ] A dist-tag or pre-release marker was checked before calling any version "stable."
- [ ] The candidate version confirmed not yanked or deprecated by its registry.
- [ ] Direct and transitive dependencies separated; forced resolutions justified with a removal condition.
- [ ] Engine, peer, and framework constraints satisfied by the chosen versions.
- [ ] Breaking changes and EOL reviewed for every major jump.
- [ ] Lockfile reinstalled with a frozen flag after the change.
- [ ] Report carries the checked date and the verified versions, weighed against the staleness window for that fact type.
