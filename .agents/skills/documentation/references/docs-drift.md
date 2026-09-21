
# Docs Drift: Doc Tests, Versioned Docs, OpenAPI

Three ways documentation and code fall out of sync silently: an example nobody executes, a reference page that still describes the version before the breaking change, and a spec that stopped matching the handlers it once described. Each needs its own trap in CI, not a review reminder.

## Preflight
```bash
rg -n '```(python|rust|ts|js)' README.md docs/**/*.md | wc -l   # runnable-looking examples
find . -name 'openapi.y*ml' -o -name 'openapi.json' 2>/dev/null
git log --oneline -- '**/openapi.*' | head -5                    # last time the spec itself changed
```

## Doc Tests: Executing Examples Instead of Trusting Them
A code example in prose is a claim exactly like a README command block ([Anti-Drift](../SKILL.md)); the fix is the same — make it fail when it lies.

| Language | Mechanism | Command |
|---|---|---|
| Python | `doctest` embedded in a docstring's `>>>` prompt | `python -m doctest module.py -v` |
| Rust | `rustdoc` compiles and runs fenced ```` ```rust ```` blocks in doc comments | `cargo test --doc` |
| TypeScript/JS | extract fenced blocks and execute them | `npx doctest-js` or a small extractor script feeding `node`/`ts-node` |
| Markdown books | mdBook runs its own fenced Rust blocks | `mdbook test` |
| Sphinx (Python docs site) | `.. doctest::` directives | `sphinx-build -b doctest docs build/doctest` |

Wire the command into CI next to the lint/test step; an example that only "looks runnable" is worse than a plain description, because the reader trusts the prompt.

## Versioned Docs for Breaking API Changes
A single "current" doc page cannot describe two incompatible contract shapes. Once a change is breaking, the old page is still true for the readers who have not migrated.

| Situation | Action |
|---|---|
| Breaking change ships behind a new major version | Fork the reference into `docs/v{N}/` and `docs/v{N+1}/`; the default page redirects to the latest, old versions stay reachable by URL |
| Deprecation window before removal | Add a visible banner on the old page stating the removal version and the migration guide link; do not delete until the window closes |
| Field renamed/removed in a contract | Document both names during the window, marked old/new, with the compatibility note from [PR evidence](../../finishing-dev/references/pr-evidence.md) carried into the reference page, not just the PR body |
| Only one version is realistically in use (internal service, no external consumers) | A single current page plus a CHANGELOG entry is enough; versioned doc trees are overhead nobody reads |

Never silently rewrite the reference for a breaking change without a migration note — a reader on the old version who hits the new page has no way to tell what moved.

## OpenAPI Spec Drift From Implementation
The spec is documentation with executable shape. Treat divergence between it and the handlers as a build failure, the same way a generated reference drifting from source is one in the Anti-Drift check.

```bash
# Generate the spec from code annotations/decorators and diff against the committed file
npm run openapi:generate && git diff --exit-code openapi.yaml

# Or validate the committed spec actually matches live responses
npx dredd openapi.yaml http://localhost:PORT
schemathesis run openapi.yaml --base-url http://localhost:PORT
```

| Symptom | Action |
|---|---|
| Spec hand-written, no generator | Highest drift risk; add a contract test (dredd/schemathesis) so a route change without a spec update fails CI |
| Spec generated from code annotations | Regenerate and diff in CI; a manual edit to the generated file is the bug, not the fix |
| Spec documents a field the handler no longer returns | The code is the fact; update the spec and check for a breaking-change note (above) |
| New endpoint has no spec entry | Block merge — an undocumented endpoint has zero discoverability and zero client-generation support |

## Stop
- An example in prose was never executed and CI has no step that runs it. Say so, or add the doctest step before publishing it as a working example.
- A breaking API change edited the current reference page with no migration note. Add the note or revert the edit.
- The OpenAPI spec and the live handler disagree and nothing in CI would have caught it. Add the contract test before calling the docs current.

## Rules
- An example is either executed by CI or labeled illustrative; there is no third state.
- Old contract versions stay documented until their deprecation window closes, not until someone remembers to delete the page.
- The implementation is the source of truth for a generated spec; a spec-first workflow reverses this only when the spec itself gates code generation and both are checked in CI.
- Doc-test failures block the same pipeline as unit-test failures — a separate "docs" job that nobody watches is not a gate.

## Checklist
- [ ] Every prose code example is executed in CI, or explicitly marked illustrative.
- [ ] A breaking change updated the reference with a migration note, or forked the version tree.
- [ ] OpenAPI spec is generated-and-diffed or contract-tested against the live implementation.
- [ ] No undocumented endpoint merged; no deleted contract version without its deprecation window served.
