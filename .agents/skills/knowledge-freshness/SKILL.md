---
name: knowledge-freshness
description: |
  Keep stack knowledge and dependencies current: verify latest stable versions, release dates, and breaking changes. Use for dependency and framework version checks before adding, upgrade planning, changelog tracking, and end-of-life dates.
---

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
| A parameter shape (`thinking.budget_tokens`, a beta header) | the SDK changelog at the installed version — `docs-verification` |
| A default model id or a dated tool type string (`*_2025xxxx`) | the provider's current model list and changelog |
| A `client.beta.*` namespace | whether it graduated to the stable namespace |
| A CLI flag or config key | `--help` on the installed binary, never the tutorial |

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
- API behavior at the installed version belongs to `docs-verification`; CVE triage to `security-ops`; the upgrade rollout to `migration-engineering`.

## Checklist
- [ ] Every version verified against a live registry, not from memory.
- [ ] Direct and transitive dependencies separated; forced resolutions justified with a removal condition.
- [ ] Engine, peer, and framework constraints satisfied by the chosen versions.
- [ ] Breaking changes and EOL reviewed for every major jump.
- [ ] Lockfile reinstalled with a frozen flag after the change.
- [ ] Report carries the checked date and the verified versions.
