---
name: docs-verification
description: |
  Verify knowledge against current official documentation before acting. Use for checking if a library API, config, or best practice is outdated, reading docs before answering, and updating stale local knowledge. See knowledge-freshness.
---

# Docs Verification

Fire this for version-sensitive or unfamiliar APIs, explicit verification requests, and whenever a build error contradicts the expected API behavior.

## Preflight
```bash
npm ls PKG || pip show PKG || cargo tree -p PKG --depth 0
cat node_modules/PKG/package.json | jq .version    # the installed version, not the range
```

Everything is answered against the **installed** version. `^4.0.0` can be 4.0.1 or 4.9.7, and they differ.

## Workflow
1. Determine the **installed** version first. Everything else is answered against it.
2. Check the local copy that shipped with the code — it cannot be out of sync with itself.
3. For a CLI, ask the binary.
4. Only then fetch the official docs page **for that version**, not for the latest major.
5. Mark the claim outdated, unchanged, or conflicting, and record the correct behavior with its source.
6. Update the local reference material, or flag it for cleanup with a link to the current source.

## Find the Installed Version
The manifest range is not the installed version. `^4.0.0` can be 4.0.1 or 4.9.7, and they differ.

```bash
npm ls PKG                    # or: cat node_modules/PKG/package.json | jq .version
pip show PKG | head -2        # or: uv pip show PKG
cargo tree -p PKG --depth 0
go list -m all | rg PKG
```

## Source Hierarchy
Never cite a lower tier when a higher one covers the question.

| Tier | Source | Why |
|---|---|---|
| 1 | Official docs **for the installed version** | the contract as published |
| 2 | Changelog / release notes | says what changed and when |
| 3 | The package's own source and tests | what it actually does |
| 4 | Issue tracker | known divergences, open bugs |
| 5 | Blog posts, Stack Overflow, model memory | undated, unversioned, often wrong |

## Cheapest Checks First

```bash
cat node_modules/PKG/README.md | head -60        # ships with the code
cat node_modules/PKG/CHANGELOG.md | head -40     # what changed recently
rg -n 'export (declare )?(function|const|class)' node_modules/PKG/dist/*.d.ts | head
CMD --help && CMD SUBCOMMAND --help              # generated from the binary; cannot be stale
python -c 'import pkg; help(pkg.thing)'
```

Typings and `--help` are the fastest ground truth available, and both come from the installed artifact.

## When the Doc and the Code Disagree
**The installed code wins. The doc is the bug.** Record the discrepancy and cite the source line or the test that proves it — then check the issue tracker, because a documented-but-false behavior is usually a known issue with a workaround.

## Stop
- The installed version cannot be determined. Stop; a version-specific answer with no version is not an answer.
- Only undated third-party pages support the claim. Say the claim is unverified rather than dressing it as fact.
- The doc and the observed behavior disagree. The code wins — record the discrepancy instead of repeating the doc.

## Rules
- Record the doc version and the date for every verification. An undated verification is worthless in a week.
- The live doc outranks memory and outranks any stale local reference file.
- Never patch local reference material with unverified content. Link to the source instead — a wrong local note propagates further than a missing one.
- A version-specific answer with no version stated is not an answer.
- Dependency currency, upgrade planning, and EOL dates belong to `knowledge-freshness`; multi-source research and citation to `web-research`. This skill verifies behavior at the version installed right now.

## Checklist
- [ ] Installed version identified before anything was checked.
- [ ] Local copy (README, changelog, typings, `--help`) checked before fetching the web.
- [ ] Claim checked against the highest available source tier.
- [ ] Doc version and date recorded.
- [ ] Doc-versus-behavior conflicts resolved in favor of the code, with evidence.
- [ ] Outdated local knowledge flagged or updated by link, never by guess.
