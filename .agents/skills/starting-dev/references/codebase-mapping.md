



# Codebase Mapping

## Preflight
Use the probes below selectively; choose the smallest set that answers the mapping question.

```bash
# 1. What is this, and how is it run?
cat README* package.json pyproject.toml go.mod Cargo.toml 2>/dev/null | head -60

# 2. Where does execution start?
rg -l 'if __name__|func main\(|createServer|app\.listen|ReactDOM|export default' --glob '!**/{node_modules,dist,build,target,vendor}/**'

# 3. What is the real build/test/run command? (CI never lies)
cat .github/workflows/*.yml Makefile justfile 2>/dev/null | rg -n 'run:|^\t' | head -30

# 4. Shape and size â€” where is the mass?
tokei . 2>/dev/null || find . -name '*.ts' -o -name '*.py' | grep -v node_modules | wc -l

# 5. Which files change together? (churn names the hot modules)
git log --format= --name-only --since='6 months ago' | sort | uniq -c | sort -rn | head -20

# 6. Who owns what, historically?
git log --format='%an' --since='1 year ago' | sort | uniq -c | sort -rn | head
```

## Workflow â€” Trace One Real Request
A map built from folder names is fiction. Follow one flow end to end and record it as `file:line`:

**entry point â†’ routing â†’ handler â†’ domain â†’ persistence â†’ response.**

At each hop, ask what the next hop is *called* and grep for that, not for what you expected it to be called.

## Artifact Budget
This is a working document, not documentation. One screen, roughly 40 lines.

| Section | Cap | Content |
|---|---|---|
| Entry points | 3 | `file:line`, what triggers it |
| Modules | 7 | name, responsibility, one-line boundary |
| Data flow | 1 trace | the hops above, with evidence |
| Conventions | 5 | naming, errors, tests, config, layout |
| Where the change belongs | 1 | the module, with the reason |

Past the cap, cut the least load-bearing entry rather than adding a section.
Committed per-directory architecture guides for a large repository are a separate, opt-in deliverable: [directory-guides.md](directory-guides.md).

## When You Cannot Run It
No credentials, no environment, no seed data â€” do not guess. The test suite and CI config are the next-best oracle:

- Test setup names the real entry points and the services actually required.
- The CI job names the real build and run commands, in the real order.
- Integration fixtures name the real external dependencies.

Record explicitly that the map is **unverified at runtime**.

## No Tests, No Docs
When neither exists, reading source top to bottom is the slow way in. Ask the system to show itself before asking the code to explain itself.

1. Run it first, using whatever the manifest names. Confirm what actually happens before forming a theory from the source — the running system is data; the source is one interpretation of it.
2. Recover intent from history, not comments: `git log -p --follow <file>` and `git blame` on the function in question surface the commit message and the discussion that explain *why*, which the code itself never states.
3. Find a seam — Feathers, *Working Effectively with Legacy Code*: the nearest point where a value can be substituted or an effect observed without changing the code under it — a constructor argument, an exported function, a boundary already called through.
4. Pin current behavior with a characterization test at that seam before changing anything: assert what the code **actually does** today, not what it should do. A failing characterization test at the start of a change means the mapping was wrong, not that the test is.

| Signal missing | Compensate with |
|---|---|
| No tests | Characterization tests at the seam nearest the change, asserting today's actual behavior |
| No docs | `git log` / `git blame` on the touched file for the *why*; the commit message is the only documentation that was ever written |
| No way to run it | Fall back to CI as the oracle (below); if CI is also silent, say so and stop guessing |

## Stop
- The build or run command cannot be found in CI or the manifests. Ask; do not invent one and map against a fiction.
- A mapping claim has no `file:line` behind it. Drop the claim or go get the evidence.
- The app cannot be run and the tests do not cover the path. Record the map as unverified at runtime, explicitly.

## Rules
- Hand off code simplification to `code-review`, architecture planning to `software-architecture`, and dev loop tasks to `starting-dev`.
- Prefer `rg`, glob, and reading exports over reading whole files. Reading a large file end to end is almost always the wrong first move.
- Do not trust folder names. `utils/` holds domain logic in most repositories; verify ownership by following imports and callers.
- Record `file:line` evidence for every mapping claim. An unattributed claim is a guess that will be repeated as fact.
- Skip generated, vendored, and build-output paths (`node_modules`, `dist`, `build`, `target`, `vendor`, `.next`, generated clients). They inflate the graph and own no logic.
- In a monorepo, map one workspace at a time from its own manifest, and record cross-workspace edges only as package names.
- Where new code should live belongs to the owning domain skill; a full documentation reconstruction to `code-review`; whether a boundary should move to `software-architecture`.

## Checklist
- [ ] Build, test, and run commands taken from CI, not assumed.
- [ ] At least one real flow traced end to end with `file:line` evidence.
- [ ] Module boundaries verified by imports and callers, not by directory names.
- [ ] Conventions recorded: naming, errors, tests, config sources.
- [ ] The module that owns the behavior in question is named, with its reason.
- [ ] Map fits one screen, and says whether it was verified at runtime.
