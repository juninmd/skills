# UI Review

## Contents

- The Gate
- Platform Reality
- A Screenshot Is Only Evidence If It Is Deterministic
- Artifacts the Review Actually Reads
- What the Vision Pass May Conclude
- Accessibility as a Gate, Not an Opinion
- Desktop Specifics
- Stop

Applies to any diff that changes rendered behavior — web, Electron, or Tauri. A UI change reviewed only
as source text is not reviewed: the defects live in the rendered state, and the rendered state is
evidence the author must produce.

## The Gate

**A diff that changes UI and carries no Playwright test is blocked.** Playwright is the mandated
end-to-end tool for every frontend in this house; a UI change that ships without one is incomplete, not
merely untested. Unit tests on a component's props satisfy nothing here — the claim under review is
that the interface works, and only driving it proves that.

One exception, and it has a bar: a refactor that provably produces **no** rendered difference — an
extracted hook, a renamed prop, reordered classes with identical computed style — does not owe a new
spec. It owes proof instead: the existing suite green plus an unchanged visual baseline. "It should not
change anything" is a claim, not proof; if no baseline covers the touched surface, the change is in
scope for the gate.

**When screenshots or traces exist and the reviewing model can read images, looking at them is
mandatory.** A vision-capable reviewer that approves a UI change without opening the captures has
skipped the only step that inspects the actual output.

## Platform Reality

The mandate is real, but the platforms are not equal. Record which row applies.

| Target | Playwright support | Consequence for review |
|---|---|---|
| Web (any framework) | full, first-class | no exception exists; demand the spec |
| Electron | **official but experimental** — "Playwright has experimental support for Electron automation", versions v12.2.0+, v13.4.0+, v14+ ([docs](https://playwright.dev/docs/api/class-electron)) | required; expect rougher edges than browser contexts and pin the Playwright version |
| Tauri | **not natively drivable** | mandate cannot be met as written; see below |

Electron entry points: `_electron.launch({ args: ['main.js'] })`, `electronApp.firstWindow()` for the
first window, `electronApp.windows()` for multi-window flows, and `electronApp.evaluate()` to reach
main-process APIs the renderer `Page` cannot touch
([ElectronApplication](https://playwright.dev/docs/api/class-electronapplication)).

Tauri's webview is native per platform — WebView2 on Windows, WKWebView on macOS, WebKitGTK on Linux —
so there is no single CDP target and Playwright has nothing to attach to. Tauri's documented path is
WebDriver ([Tauri WebDriver](https://v2.tauri.app/develop/tests/webdriver/)): `@wdio/tauri-service`
runs an **embedded WebDriver server inside the app on every platform, macOS included**, while the
external `tauri-driver` binary drives the platform's native WebDriver on Windows and Linux only —
macOS has no WKWebView driver tool. So Tauri is testable everywhere; it is simply not testable with
Playwright. On Windows the Chromium-based WebView2 could in principle expose CDP, but no official
Playwright or Tauri documentation endorses attaching to it — unverified community practice. A
third-party `tauri-plugin-playwright` offers a Playwright-*compatible* API; it is not Playwright.

**Rule:** on Tauri, the exception is documented in the PR — which driver, which platforms are covered,
which are not. Never label a WebDriver suite "Playwright"; the point of a mandated tool is that its
name means one thing.

## A Screenshot Is Only Evidence If It Is Deterministic

Before any capture counts, the test must remove the sources of drift:

- Freeze time: `page.clock.setFixedTime()` is the documented default; `install()` when the test needs
  to pause, `fastForward`, or `runFor` ([Clock API](https://playwright.dev/docs/clock)).
- Stub the network with `page.route()` and seed fixed data; a screenshot of live data proves nothing
  twice.
- Disable animation with the `animations: 'disabled'` option, and inject `stylePath` to kill remaining
  transitions.
- Pin viewport and device scale factor explicitly; wait for web fonts before capture.
- Prefer web-first assertions (`toBeVisible`, `toHaveText`), which retry until timeout.
  `waitForTimeout` in a diff is a finding, not a style preference.
- **Generate baselines in the same image that runs CI** — the official Playwright container. Font
  hinting and anti-aliasing differ across operating systems, so a baseline produced on a developer's
  machine will diff forever against CI.

Tolerance and capture options belong to `toHaveScreenshot()` on
[PageAssertions](https://playwright.dev/docs/api/class-pageassertions) and
[LocatorAssertions](https://playwright.dev/docs/api/class-locatorassertions) — `mask`, `stylePath`, and
`animations` exist only there. The generic
[SnapshotAssertions](https://playwright.dev/docs/api/class-snapshotassertions) (`toMatchSnapshot`)
carries only `threshold`, `maxDiffPixels`, `maxDiffPixelRatio`, and `name`:

| Option | Meaning | Use for |
|---|---|---|
| `threshold` (default 0.2) | per-pixel color distance in YIQ before a pixel counts as different | anti-aliasing noise |
| `maxDiffPixels` | absolute count of differing pixels allowed | fixed-size element screenshots |
| `maxDiffPixelRatio` | differing pixels as a fraction of total | full-page shots across viewports |
| `mask` | paints listed locators over before diffing | timestamps, avatars, live counters |

A raised tolerance in a diff is a finding: ask which flake it is hiding.

## Artifacts the Review Actually Reads

Configure `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, and video retention on failure.
The trace zip is the strongest artifact available — it ties each action to the DOM snapshot, network
log, console output, and frame that produced it, so a reviewer reconstructs the failure without
re-running the app (`npx playwright show-trace trace.zip`). Use `test.step()` so that record reads as
the user's journey rather than a list of clicks.

## What the Vision Pass May Conclude

A multimodal reviewer reads the captures; it does not thereby acquire the DOM. Keep the two apart.

| Claim from a screenshot | Allowed? |
|---|---|
| Overlapping or misaligned elements, broken grid, content overflowing its container | yes |
| Truncated or ellipsized text, clipped labels, i18n overflow, RTL breakage | yes |
| Missing image, empty state rendered where content was expected, wrong theme | yes |
| Obvious unreadable contrast, as a flag to verify | as a flag only |
| Exact WCAG contrast ratio | no — needs computed colors; use `@axe-core/playwright` |
| Correct ARIA role, accessible name, or label | no — invisible in pixels; use `toMatchAriaSnapshot()` |
| Element is focusable, not merely styled to look focused | no — assert `:focus` after `keyboard.press('Tab')` |
| Disabled vs. enabled, loading vs. loaded, and other states that look alike | no — assert the locator state |
| Subpixel alignment | no — that is what the pixel diff is for |

The vision pass is triage that finds the obvious break fast. The merge gate stays on the deterministic
checks: ARIA snapshot, axe-core violations, pixel diff within tolerance. A contrast or accessibility
finding sourced only to "it looks wrong in the screenshot" is not a finding yet.

## Accessibility as a Gate, Not an Opinion

`AxeBuilder` from `@axe-core/playwright` asserts rule-based WCAG violations with `include`/`exclude`
scoping; `expect(locator).toMatchAriaSnapshot()` catches structural regressions — a lost role, a
dropped label — that pixel diffing cannot see and that styling changes will not trip falsely. Keyboard
mechanics script as `page.keyboard.press('Tab')` plus assertions on the focused locator.

What stays manual and must not be claimed as automated: real screen-reader announcement quality, focus
behavior under assistive technology, and whether the flow is actually usable.

## Desktop Specifics

Native dialogs (`showOpenDialog`, `showSaveDialog`, `showMessageBox`) and OS file pickers run in the
main process and Playwright cannot click them. Stub the `dialog` module through
`electronApp.evaluate()` before the test and assert on the value the application receives — a test that
waits for a real OS dialog hangs in CI. Application menus are reachable only through the main-process
`Menu`; per-window menus on Windows and Linux are not addressable from `Page`.

`viewport` sets the content area, not window chrome or OS DPI scaling, so scaling defects must be
verified per platform. Multi-window flows work through `windows()`/`firstWindow()`, but window
creation and single-instance-lock races are known trouble spots — test them explicitly instead of
assuming.

## Stop

- The diff renders something, contains no Playwright coverage, and no unchanged baseline covers the
  touched surface. Blocked, with the missing spec named.
- Captures exist, the model reads images, and no one opened them. Not reviewed yet.
- A snapshot tolerance was raised, or a baseline replaced, with no explanation of the flake behind it.
- A contrast or ARIA claim rests on a screenshot alone. Convert it to an axe or ARIA assertion first.
- The target is Tauri and the PR calls a WebDriver suite "Playwright". Correct the record before
  approving.
