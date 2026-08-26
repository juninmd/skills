# Playwright Capture Recipes

Exact commands for ephemeral screenshot capture. Nothing here is committed to the repository.

## Temp directory (portable)

```sh
OUT="$(node -p "require('os').tmpdir()")/shots-$(date +%s)"; mkdir -p "$OUT"
```

```powershell
$Out = Join-Path $env:TEMP "shots-$(Get-Date -Format yyyyMMdd-HHmmss)"
New-Item -ItemType Directory -Force $Out | Out-Null
```

`node -p "require('os').tmpdir()"` works on both and respects `TMPDIR`/`TEMP`.

## Start the server and record its process id

```sh
npm run dev > "$OUT/server.log" 2>&1 &
PID=$!
until curl -fsS http://localhost:5173 > /dev/null; do sleep 1; done
```

```powershell
$Server = Start-Process npm -ArgumentList 'run','dev' -PassThru -RedirectStandardOutput "$Out\server.log" -RedirectStandardError "$Out\server.err"
while (-not (Test-NetConnection localhost -Port 5173 -InformationLevel Quiet)) { Start-Sleep 1 }
```

Read the real base URL out of `server.log`; do not assume the port.

## Teardown

```sh
kill "$PID" 2>/dev/null || true
```

```powershell
Stop-Process -Id $Server.Id -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force $TempScripts -ErrorAction SilentlyContinue
```

Run teardown on failure paths too (`trap 'kill "$PID"' EXIT` / `try { … } finally { … }`).

## Capture, CLI form

```
npx -y playwright screenshot \
  --viewport-size "1440,900" \
  --full-page \
  --wait-for-selector "[data-testid=app-ready]" \
  "http://localhost:5173/route" "$OUT/route.png"
```

Prefer a selector that only appears after hydration and data load. `--wait-for-timeout` is a fallback for pages with no such marker, and it will flake.

## Determinism for before/after pairs

Both captures must use the same viewport, the same device scale factor, and no animation. Script form:

```js
// requires: npm install --no-save playwright
import { chromium } from 'playwright';
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,          // pin it; do not inherit the host display
  reducedMotion: 'reduce',
  colorScheme: 'light',
  locale: 'en-US',
  timezoneId: 'UTC',
});
const page = await context.newPage();
await page.addStyleTag({ content: `*, *::before, *::after {
  animation: none !important; transition: none !important;
  caret-color: transparent !important; }` });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForSelector('[data-testid=app-ready]');
await page.screenshot({ path: out, fullPage: true });
await browser.close();
```

Also mask or freeze anything non-deterministic: clocks, relative timestamps, random avatars, carousels. `page.screenshot({ mask: [page.locator('.timestamp')] })`.

## Authenticated routes

Log in once, persist the session, reuse it. Credentials come from the environment, never from the script.

```js
const context = await browser.newContext();
const page = await context.newPage();
await page.goto(`${base}/login`);
await page.fill('#email', process.env.APP_USER);
await page.fill('#password', process.env.APP_PASS);
await page.click('button[type=submit]');
await page.waitForURL('**/dashboard');
await context.storageState({ path: `${out}/state.json` });   // temp dir only
```

Then every later capture: `browser.newContext({ storageState: `${out}/state.json` })`.

If the app uses a bearer token instead of cookies, set it with
`context.setExtraHTTPHeaders({ Authorization: `Bearer ${process.env.APP_TOKEN}` })`.

The storage-state file holds live session material. It stays in the temp directory and is deleted at teardown.

## Element-only capture

`npx -y playwright` does not make `playwright` importable by `node`. Run `npm install --no-save playwright` first — it leaves `package.json` and the lockfile untouched — then use `page.locator(sel).screenshot({ path })`.

## Repository cleanliness

End every run with `git status --porcelain`. Any output means something leaked into the source tree: remove it before reporting.
