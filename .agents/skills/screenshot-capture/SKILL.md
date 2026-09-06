---
name: screenshot-capture
description: |
  Capture screenshots of a running frontend with Playwright without polluting the repository. Use for visual evidence of a UI change, before and after layout comparisons, proving a page renders, or full-page capture of a route. E2E suites: webapp-testing.
---

# Screenshot Capture

## Preflight

```bash
cat package.json | jq -r '.scripts | keys[]' | rg 'dev|start|preview|serve'
node -p "require('os').tmpdir()"       # portable temp root — never hardcode /tmp
git status --porcelain                 # must be clean before, and after
```

No frontend in `package.json` means there is nothing to capture. Stop and report rather than inventing a server.

## Workflow
1. Detect the frontend (vite, next, vue, react, angular, svelte, static docs).
2. Start the dev or preview server in the background, **capture its process id**, read the base URL from its output, and poll the port until it answers.
3. Install the browser ephemerally — never as a project dependency.
4. Write every output under the temp directory, never into the source tree.
5. Wait on a post-hydration selector, never a fixed timeout.
6. For before/after pairs, pin determinism.
7. For an authenticated route, log in once and reuse the storage state.
8. Stop the server and delete temp scripts, **including on the failure path**.
9. Verify the repository is untouched and report absolute image paths.

## The Two npx Traps

```bash
npx -y playwright install chromium     # downloads the browser binary
npm install --no-save playwright       # makes it importable by node
```

`npx -y playwright` does **not** make the package importable by a script — `require('playwright')` still fails. `--no-save` installs it without touching `package.json` or the lockfile, which is what keeps the repository clean.

## Determinism for Before/After
Any difference between the two runs shows up as a false diff.

| Pin | Why |
|---|---|
| Same viewport and `deviceScaleFactor` | different pixel dimensions are not comparable |
| Animations and transitions disabled | a mid-flight animation captures differently every run |
| Same wait selector | a race means one side captured earlier |
| Same locale and timezone | dates and number formats shift the layout |
| Identical command both sides | it must be literally the same invocation |

```bash
npx playwright screenshot \
  --viewport-size=1280,800 \
  --wait-for-selector='[data-hydrated]' \
  --full-page \
  "$URL" "$TMP/after.png"
```

## Waiting
A fixed timeout is guaranteed flake in both directions: too short captures a skeleton, too long wastes every run. Wait on something the page only shows once it is ready — a hydration marker, the heading, the first row of real data.

## Teardown Always Runs

```bash
cleanup() { [ -n "$PID" ] && kill "$PID" 2>/dev/null; rm -f "$TMP"/*.mjs; }
trap cleanup EXIT INT TERM
```

```powershell
try { ... } finally { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue }
```

A dev server left running holds the port and confuses the next run.

## Reference Routing
- Exact commands for capture, hydration waits, determinism flags, auth storage state, and teardown on both shells: [playwright-recipes.md](references/playwright-recipes.md)

## Stop
- No frontend exists in `package.json`. Report it; do not invent a server to point a browser at.
- `git status --porcelain` is non-empty after the run. Something landed in the tree — remove it before reporting paths.
- A capture would wait on a fixed timeout. Wait on a selector; a fixed wait is flake in both directions.

## Rules
- Never write images into the source tree and never `git add` an image file. Share them out of band — pull request comment, chat, issue attachment.
- Credentials come from the environment. A storage-state file holds live session cookies: keep it in the temp directory and never commit it.
- Never screenshot code. A code image is unreadable to search, screen readers, and diffs — `code-snippet-images` exists for the deliberate cases.
- This skill produces **ephemeral evidence** only. Committed visual-regression suites, `@playwright/test` as a real dependency, and snapshot baselines belong to `webapp-testing`.
- Attaching the result to a pull request belongs to `finishing-dev`.

## Checklist
- [ ] Frontend detected from `package.json`; server reachable at a known base URL with its pid recorded.
- [ ] Playwright installed ephemerally; `package.json` and lockfile untouched.
- [ ] Every capture waited on a selector, never a timeout.
- [ ] Before/after used identical viewport, scale, locale, and command, with animations disabled.
- [ ] Images only under the temp directory; `git status --porcelain` empty afterwards.
- [ ] Server stopped and temp scripts deleted, including on failure.
